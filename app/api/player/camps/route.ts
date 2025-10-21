import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    
    // Get user ID from the request (this should be passed from the frontend)
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
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
          accommodation_details,
          capacity,
          coach_id,
          created_at
        )
      `)
      .eq('player_id', userId);

    const camps = campPlayersData?.map((cp: any) => cp.camps).filter(Boolean) || [];

    return NextResponse.json({ camps });
  } catch (error) {
    console.error('Error in GET /api/player/camps:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
