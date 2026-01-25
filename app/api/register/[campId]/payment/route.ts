import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

// Note: Stripe SDK needs to be installed: npm install stripe
// For now, we'll handle Stripe via API calls
let Stripe: any;
try {
  Stripe = require('stripe');
} catch (e) {
  console.warn('Stripe SDK not installed. Please run: npm install stripe');
}

const stripe = Stripe ? new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
}) : null;

const BASE_CAMP_PRICE = 600; // shared bedroom; 600 + 90 = £690 for private double
const DEPOSIT_AMOUNT = 250;
const PRIVATE_BEDROOM_UPGRADE = 90;

const OPTION_PRICES: Record<string, number> = {
  hammam_massage: 45,
  massage: 40,
  hammam: 25,
  medina_tour: 30,
  friday_dinner: 30,
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campId: string }> }
) {
  try {
    const { campId } = await params;
    const body = await request.json();
    const supabase = createServiceRoleClient();

    const {
      registration_id,
      payment_method,
      payment_type, // 'deposit' or 'full'
    } = body;

    if (!registration_id || !payment_method || !payment_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get camp details for date formatting
    const { data: camp, error: campError } = await supabase
      .from('camps')
      .select('start_date, end_date')
      .eq('id', campId)
      .single();

    if (campError || !camp) {
      return NextResponse.json(
        { error: 'Camp not found' },
        { status: 404 }
      );
    }

    // Format camp dates for description
    const formatDateRange = (start: string, end: string): string => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const startStr = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const endStr = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      return `${startStr} - ${endStr}`;
    };
    const campDates = formatDateRange(camp.start_date, camp.end_date);

    // Get registration with options
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .select(`
        *,
        registration_options (*)
      `)
      .eq('id', registration_id)
      .single();

    if (regError || !registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Calculate prices
    const bedroomUpgrade = registration.bedroom_type === 'private_double' ? PRIVATE_BEDROOM_UPGRADE : 0;
    const optionsTotal = (registration.registration_options || []).reduce(
      (sum: number, opt: any) => sum + opt.price_pounds,
      0
    );
    const basePrice = BASE_CAMP_PRICE + bedroomUpgrade + optionsTotal;
    const amount = payment_type === 'deposit' ? DEPOSIT_AMOUNT : basePrice;

    if (payment_method === 'stripe') {
      if (!stripe) {
        return NextResponse.json(
          { error: 'Stripe is not configured. Please install stripe package and set STRIPE_SECRET_KEY.' },
          { status: 500 }
        );
      }

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `Tennis Camp Marrakech - ${payment_type === 'deposit' ? 'Deposit' : 'Full Payment'}`,
                description: `Registration for tennis camp in Marrakech from ${campDates}`,
              },
              unit_amount: Math.round(amount * 100), // Convert to pence
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register/${campId}/confirmation?payment_method=stripe&session_id={CHECKOUT_SESSION_ID}&registration_id=${registration_id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register/${campId}/payment?registration_id=${registration_id}`,
        metadata: {
          registration_id,
          camp_id: campId,
          payment_type,
          base_camp_price: BASE_CAMP_PRICE.toString(),
          bedroom_upgrade_price: bedroomUpgrade.toString(),
          options_total_price: optionsTotal.toString(),
        },
      });

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          registration_id,
          payment_method: 'stripe',
          payment_type,
          amount_pounds: amount,
          stripe_session_id: session.id,
          status: 'pending',
          base_camp_price: BASE_CAMP_PRICE,
          bedroom_upgrade_price: bedroomUpgrade,
          options_total_price: optionsTotal,
        })
        .select()
        .single();

      if (paymentError) {
        console.error('Payment creation error:', paymentError);
        return NextResponse.json(
          { error: 'Failed to create payment record' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        session_id: session.id,
        url: session.url,
        payment_id: payment.id,
      });
    } else if (payment_method === 'revolut') {
      // Create payment record for Revolut (manual verification)
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          registration_id,
          payment_method: 'revolut',
          payment_type,
          amount_pounds: amount,
          status: 'pending',
          base_camp_price: BASE_CAMP_PRICE,
          bedroom_upgrade_price: bedroomUpgrade,
          options_total_price: optionsTotal,
        })
        .select()
        .single();

      if (paymentError) {
        console.error('Payment creation error:', paymentError);
        return NextResponse.json(
          { error: 'Failed to create payment record' },
          { status: 500 }
        );
      }

      // Update registration status
      await supabase
        .from('registrations')
        .update({ status: 'awaiting_manual_verification' })
        .eq('id', registration_id);

      return NextResponse.json({
        payment_id: payment.id,
        requires_manual_verification: true,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Webhook handler for Stripe
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ campId: string }> }
) {
  try {
    const body = await request.json();
    const supabase = createServiceRoleClient();

    const { payment_intent_id, status: paymentStatus } = body;

    if (!payment_intent_id) {
      return NextResponse.json(
        { error: 'Missing payment_intent_id' },
        { status: 400 }
      );
    }

    // Find payment by Stripe payment intent ID
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, registrations!inner(*)')
      .eq('stripe_payment_intent_id', payment_intent_id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status
    const newPaymentStatus = paymentStatus === 'succeeded' ? 'completed' : 'failed';
    await supabase
      .from('payments')
      .update({ status: newPaymentStatus })
      .eq('id', payment.id);

    // If payment succeeded, update registration status
    if (paymentStatus === 'succeeded') {
      await supabase
        .from('registrations')
        .update({ status: 'confirmed' })
        .eq('id', payment.registration_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
