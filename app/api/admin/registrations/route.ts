import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/registrations
 * Lists registrations with status awaiting_manual_verification (Revolut payments
 * waiting for admin to confirm once payment is received).
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || 'awaiting_manual_verification';

    const { data: registrations, error } = await supabase
      .from('registrations')
      .select(
        `
        id,
        camp_id,
        name,
        email,
        status,
        created_at,
        updated_at,
        camp:camps (
          id,
          start_date,
          end_date,
          package
        ),
        payments (
          id,
          payment_method,
          payment_type,
          amount_pounds,
          status
        )
      `
      )
      .eq('status', statusFilter)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin registrations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch registrations' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      registrations: registrations || [],
    });
  } catch (err) {
    console.error('Error in GET /api/admin/registrations:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
