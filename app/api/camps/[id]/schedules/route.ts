import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campId } = await params;
    const supabase = createServiceRoleClient();

    // Get all schedules for this camp
    const { data: schedules, error } = await supabase
      .from('camp_schedules')
      .select('*')
      .eq('camp_id', campId)
      .order('schedule_date', { ascending: true });

    if (error) {
      console.error('Error fetching schedules:', error);
      return NextResponse.json([], { status: 200 }); // Return empty array if error
    }

    return NextResponse.json(schedules || []);
  } catch (error) {
    console.error('Error fetching camp schedules:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array if error
  }
}

