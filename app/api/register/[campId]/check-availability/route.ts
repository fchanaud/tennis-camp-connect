import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campId: string }> }
) {
  try {
    const { campId } = await params;
    const supabase = createServiceRoleClient();

    // Get camp details
    const { data: camp, error: campError } = await supabase
      .from('camps')
      .select('id, max_players, capacity')
      .eq('id', campId)
      .single();

    if (campError || !camp) {
      return NextResponse.json(
        { error: 'Camp not found' },
        { status: 404 }
      );
    }

    // Count confirmed registrations (status = 'confirmed')
    const { count, error: countError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('camp_id', campId)
      .eq('status', 'confirmed');

    if (countError) {
      return NextResponse.json(
        { error: 'Error checking availability' },
        { status: 500 }
      );
    }

    const maxPlayers = camp.max_players || 7;
    const confirmedCount = count || 0;
    const isFull = confirmedCount >= maxPlayers;
    const availableSpots = Math.max(0, maxPlayers - confirmedCount);

    return NextResponse.json({
      isFull,
      availableSpots,
      confirmedCount,
      maxPlayers,
    });
  } catch (error) {
    console.error('Error checking camp availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
