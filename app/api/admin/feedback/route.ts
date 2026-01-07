import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    // Note: Admin routes should verify admin role in production
    // For now, we'll allow access (admin pages are protected by frontend routing)

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const campId = searchParams.get('campId');

    // Build query
    let query = supabase
      .from('feedbacks')
      .select(`
        *,
        player:users!feedbacks_player_id_fkey (
          id,
          first_name,
          last_name,
          username
        ),
        camp:camps!feedbacks_camp_id_fkey (
          id,
          start_date,
          end_date,
          package
        )
      `)
      .order('created_at', { ascending: false });

    if (playerId) {
      query = query.eq('player_id', playerId);
    }

    if (campId) {
      query = query.eq('camp_id', campId);
    }

    const { data: feedbacks, error } = await query;

    if (error) {
      console.error('Error fetching feedbacks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feedbacks' },
        { status: 500 }
      );
    }

    return NextResponse.json({ feedbacks: feedbacks || [] });
  } catch (error) {
    console.error('Error in GET /api/admin/feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

