import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campId: string; registrationId: string }> }
) {
  try {
    const { registrationId } = await params;
    const supabase = createServiceRoleClient();

    // Get registration with options
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .select(`
        *,
        registration_options (*),
        payments (*)
      `)
      .eq('id', registrationId)
      .single();

    if (regError || !registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(registration);
  } catch (error) {
    console.error('Error fetching registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
