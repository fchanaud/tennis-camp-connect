import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const registrationId = session.metadata?.registration_id;

      if (!registrationId) {
        console.error('No registration_id in session metadata');
        return NextResponse.json({ received: true });
      }

      // Find payment by Stripe session ID
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*, registrations!inner(*)')
        .eq('stripe_session_id', session.id)
        .single();

      if (paymentError || !payment) {
        console.error('Payment not found:', paymentError);
        return NextResponse.json({ received: true });
      }

      // Update payment status to completed
      await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', payment.id);

      // Update registration status to confirmed
      await supabase
        .from('registrations')
        .update({ status: 'confirmed' })
        .eq('id', registrationId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
