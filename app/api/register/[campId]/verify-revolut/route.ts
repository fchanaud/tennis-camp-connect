import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campId: string }> }
) {
  try {
    const { campId } = await params;
    const body = await request.json();
    const supabase = createServiceRoleClient();

    const { payment_id } = body;

    if (!payment_id) {
      return NextResponse.json(
        { error: 'Missing payment_id' },
        { status: 400 }
      );
    }

    // Get payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, registrations!inner(*)')
      .eq('id', payment_id)
      .eq('payment_method', 'revolut')
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status to completed (admin will manually verify)
    await supabase
      .from('payments')
      .update({ status: 'completed' })
      .eq('id', payment_id);

    // Update registration status to awaiting_manual_verification
    await supabase
      .from('registrations')
      .update({ status: 'awaiting_manual_verification' })
      .eq('id', payment.registration_id);

    return NextResponse.json({
      success: true,
      message: 'Payment verification submitted. Admin will confirm shortly.',
    });
  } catch (error) {
    console.error('Error verifying Revolut payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
