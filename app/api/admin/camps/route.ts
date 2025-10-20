import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    
    const { data: campsData } = await supabase
      .from('camps')
      .select(`
        *,
        coach:users!camps_coach_id_fkey (
          id,
          first_name,
          last_name
        )
      `)
      .order('start_date', { ascending: false });
    
    const { data: coachesData } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'coach');
    
    const { data: playersData } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'player');
    
    return NextResponse.json({
      camps: campsData || [],
      coaches: coachesData || [],
      players: playersData || []
    });
  } catch (error) {
    console.error('Error in GET /api/admin/camps:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      startDate,
      endDate,
      packageType,
      tennisHours,
      accommodationDetails,
      capacity,
      selectedCoach,
      selectedPlayers,
      schedules
    } = await request.json();

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Please select start and end dates' },
        { status: 400 }
      );
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (selectedPlayers.length > parseInt(capacity)) {
      return NextResponse.json(
        { error: `Cannot assign more than ${capacity} players` },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Create camp
    const { data: campData, error: campError } = await supabase
      .from('camps')
      .insert({
        start_date: startDate,
        end_date: endDate,
        package: packageType,
        total_tennis_hours: packageType === 'no_tennis' ? null : parseInt(tennisHours),
        accommodation_details: (packageType !== 'tennis_only') ? accommodationDetails : null,
        capacity: parseInt(capacity),
        coach_id: selectedCoach || null,
      })
      .select()
      .single();

    if (campError) throw campError;

    // Assign players
    if (selectedPlayers.length > 0) {
      const playerAssignments = selectedPlayers.map(playerId => ({
        camp_id: campData.id,
        player_id: playerId,
      }));

      const { error: playersError } = await supabase
        .from('camp_players')
        .insert(playerAssignments);

      if (playersError) throw playersError;
    }

    // Create schedules
    const dates = getDatesInRange(startDate, endDate);
    const scheduleInserts = dates
      .filter(date => schedules[date]?.trim())
      .map(date => ({
        camp_id: campData.id,
        schedule_date: date,
        schedule_content: schedules[date],
      }));

    if (scheduleInserts.length > 0) {
      const { error: scheduleError } = await supabase
        .from('camp_schedules')
        .insert(scheduleInserts);

      if (scheduleError) throw scheduleError;
    }

    return NextResponse.json({ success: true, camp: campData });

  } catch (error) {
    console.error('Error in POST /api/admin/camps:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create camp' },
      { status: 500 }
    );
  }
}

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }
  
  return dates;
}
