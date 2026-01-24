import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Webhook: Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      console.error('Webhook: STRIPE_WEBHOOK_SECRET is not set in environment variables');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      console.error('Make sure STRIPE_WEBHOOK_SECRET matches the secret from "stripe listen" (local) or Dashboard (production)');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`Webhook received: ${event.type} (${event.id})`);

    const supabase = createServiceRoleClient();

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const registrationId = session.metadata?.registration_id;

      console.log(`Processing checkout.session.completed for registration: ${registrationId}`);

      if (!registrationId) {
        console.error('No registration_id in session metadata. Session ID:', session.id);
        return NextResponse.json({ received: true });
      }

      // Find payment by Stripe session ID
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*, registrations!inner(*)')
        .eq('stripe_session_id', session.id)
        .single();

      if (paymentError || !payment) {
        console.error('Payment not found for session:', session.id, paymentError);
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

      console.log(`Successfully updated payment ${payment.id} and registration ${registrationId} to confirmed`);
    } else {
      // Log unhandled event types for debugging (but return 200 to acknowledge receipt)
      console.log(`Webhook event type "${event.type}" received but not handled. This is normal for events we don't need to process.`);
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
