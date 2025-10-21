import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campId } = await params;
    const supabase = createServiceRoleClient();

    // Get camp details with coach info
    const { data: camp, error } = await supabase
      .from('camps')
      .select(`
        *,
        coach:users!camps_coach_id_fkey (
          id,
          first_name,
          last_name
        )
      `)
      .eq('id', campId)
      .single();

    if (error || !camp) {
      return NextResponse.json(
        { error: 'Camp not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(camp);
  } catch (error) {
    console.error('Error fetching camp:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

