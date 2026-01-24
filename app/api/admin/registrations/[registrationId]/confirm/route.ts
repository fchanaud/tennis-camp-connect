import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/registrations/[registrationId]/confirm
 * Confirms a registration that was paid via Revolut (status
 * awaiting_manual_verification). Call this once payment has been received.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  try {
    const { registrationId } = await params;
    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Fetch current registration
    const { data: reg, error: fetchError } = await supabase
      .from('registrations')
      .select('id, status')
      .eq('id', registrationId)
      .single();

    if (fetchError || !reg) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    if (reg.status !== 'awaiting_manual_verification') {
      return NextResponse.json(
        {
          error: `Registration cannot be confirmed from status "${reg.status}". Only registrations awaiting manual verification (Revolut) can be confirmed here.`,
        },
        { status: 400 }
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from('registrations')
      .update({ status: 'confirmed' })
      .eq('id', registrationId)
      .select()
      .single();

    if (updateError) {
      console.error('Error confirming registration:', updateError);
      return NextResponse.json(
        { error: 'Failed to confirm registration' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, registration: updated });
  } catch (err) {
    console.error('Error in POST /api/admin/registrations/[id]/confirm:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
