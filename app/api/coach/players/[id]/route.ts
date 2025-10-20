import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const playerId = params.id;
    const supabase = createServiceRoleClient();

    // Get player details
    const { data: playerData, error: playerError } = await supabase
      .from('users')
      .select('*')
      .eq('id', playerId)
      .eq('role', 'player')
      .single();

    if (playerError || !playerData) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Get all camps this player is enrolled in
    const { data: campPlayersData } = await supabase
      .from('camp_players')
      .select(`
        camp_id,
        camps (
          id,
          start_date,
          end_date,
          package,
          total_tennis_hours,
          coach_id,
          accommodation_details
        )
      `)
      .eq('player_id', playerId);

    const camps = campPlayersData?.map((cp: any) => cp.camps).filter(Boolean) || [];
    const campIds = camps.map((c: any) => c.id);

    // Get all assessments for this player
    const { data: assessmentsData } = await supabase
      .from('pre_camp_assessments')
      .select('*')
      .eq('player_id', playerId);

    // Get all reports for this player
    const { data: reportsData } = await supabase
      .from('post_camp_reports')
      .select('*')
      .eq('player_id', playerId);

    return NextResponse.json({
      player: playerData,
      camps: camps,
      assessments: assessmentsData || [],
      reports: reportsData || [],
    });
  } catch (error) {
    console.error('Error in GET /api/coach/players/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

