import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    // Get all players
    const { data: playersData, error: playersError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'player')
      .order('first_name', { ascending: true });

    if (playersError) {
      console.error('Error fetching players:', playersError);
      return NextResponse.json(
        { error: 'Failed to fetch players' },
        { status: 500 }
      );
    }

    // For each player, get their camps, assessments, and reports
    const playersWithDetails = await Promise.all(
      (playersData || []).map(async (player) => {
        // Get camps this player is assigned to
        const { data: campPlayers } = await supabase
          .from('camp_players')
          .select(`
            camp_id,
            camps (
              id,
              start_date,
              end_date,
              package,
              coach_id
            )
          `)
          .eq('player_id', player.id);

        const camps = campPlayers?.map(cp => cp.camps).filter(Boolean) || [];

        // Count assessments
        const { count: assessmentCount } = await supabase
          .from('pre_camp_assessments')
          .select('*', { count: 'exact', head: true })
          .eq('player_id', player.id);

        // Count reports
        const { count: reportCount } = await supabase
          .from('post_camp_reports')
          .select('*', { count: 'exact', head: true })
          .eq('player_id', player.id);

        return {
          ...player,
          camps: camps,
          assessment_count: assessmentCount || 0,
          report_count: reportCount || 0,
        };
      })
    );

    return NextResponse.json({ players: playersWithDetails });
  } catch (error) {
    console.error('Error in GET /api/coach/players:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

