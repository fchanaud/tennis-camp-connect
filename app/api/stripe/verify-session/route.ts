import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

/**
 * Verifies a Stripe Checkout Session and updates our DB if payment succeeded.
 * Used as a fallback when the user reaches the confirmation page (e.g. in dev
 * without the webhook). The webhook remains the primary, reliable method.
 */
export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json();

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['payment_intent'],
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { paid: false, message: 'Payment not completed' },
        { status: 200 }
      );
    }

    const registrationId = session.metadata?.registration_id;
    if (!registrationId) {
      return NextResponse.json(
        { error: 'No registration_id in session metadata' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    const { data: payment } = await supabase
      .from('payments')
      .select('id')
      .eq('stripe_session_id', session.id)
      .single();

    if (payment) {
      await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', payment.id);

      await supabase
        .from('registrations')
        .update({ status: 'confirmed' })
        .eq('id', registrationId);
    }

    return NextResponse.json({ paid: true, updated: !!payment });
  } catch (error) {
    console.error('Stripe verify-session error:', error);
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    );
  }
}
