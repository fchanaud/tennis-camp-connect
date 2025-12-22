import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    
    // Get coach ID from the request (this should be passed from the frontend)
    const url = new URL(request.url);
    const coachId = url.searchParams.get('coachId');
    
    if (!coachId) {
      return NextResponse.json(
        { error: 'Coach ID is required' },
        { status: 400 }
      );
    }

    // Get all camps assigned to this coach
    const { data: campsData } = await supabase
      .from('camps')
      .select(`
        id,
        start_date,
        end_date,
        package,
        total_tennis_hours,
        accommodation_details,
        accommodation_name,
        accommodation_phone,
        accommodation_map_link,
        capacity,
        coach_id,
        created_at,
        camp_players (
          player_id,
          player:users!camp_players_player_id_fkey (
            id,
            first_name,
            last_name
          )
        ),
        camp_schedules (
          id,
          schedule_date,
          schedule_content,
          created_at,
          updated_at
        )
      `)
      .eq('coach_id', coachId)
      .order('start_date', { ascending: true });

    const camps = campsData || [];
    
    // Sort schedules within each camp by date
    camps.forEach((camp: any) => {
      if (camp.camp_schedules) {
        camp.camp_schedules.sort((a: any, b: any) => 
          new Date(a.schedule_date).getTime() - new Date(b.schedule_date).getTime()
        );
      }
    });

    // Find the next upcoming camp and count upcoming camps
    const now = new Date();
    const upcomingCamps = camps.filter(camp => new Date(camp.start_date) > now);
    const nextUpcomingCamp = upcomingCamps.length > 0 ? upcomingCamps[0] : null;

    // Count total camps and upcoming camps
    const totalCamps = camps.length;
    const upcomingCampsCount = upcomingCamps.length;

    return NextResponse.json({ 
      camps,
      nextUpcomingCamp,
      totalCamps,
      upcomingCampsCount
    });
  } catch (error) {
    console.error('Error in GET /api/coach/camps:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
