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
        )
      `)
      .eq('coach_id', coachId)
      .order('start_date', { ascending: true });

    const camps = campsData || [];

    // Find the next upcoming camp
    const now = new Date();
    const upcomingCamps = camps.filter(camp => new Date(camp.start_date) >= now);
    const nextUpcomingCamp = upcomingCamps.length > 0 ? upcomingCamps[0] : null;

    // Count total camps
    const totalCamps = camps.length;

    return NextResponse.json({ 
      camps,
      nextUpcomingCamp,
      totalCamps
    });
  } catch (error) {
    console.error('Error in GET /api/coach/camps:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
