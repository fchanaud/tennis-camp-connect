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
        ),
        camp_players (
          player_id,
          player:users!camp_players_player_id_fkey (
            id,
            first_name,
            last_name
          )
        ),
        camp_schedules (
          schedule_date,
          schedule_content
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

    console.log('POST /api/admin/camps - Request data:', {
      startDate,
      endDate,
      packageType,
      tennisHours,
      capacity,
      selectedCoach,
      selectedPlayersCount: selectedPlayers?.length || 0
    });

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
    console.log('POST /api/admin/camps - Service role client created');

    // Create camp
    console.log('POST /api/admin/camps - Creating camp...');
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

    console.log('POST /api/admin/camps - Camp creation result:', {
      hasData: !!campData,
      hasError: !!campError,
      error: campError
    });

    if (campError) {
      console.error('POST /api/admin/camps - Camp creation error:', campError);
      throw campError;
    }

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

export async function PUT(request: NextRequest) {
  try {
    const {
      campId,
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

    console.log('PUT /api/admin/camps - Request data:', {
      campId,
      startDate,
      endDate,
      packageType,
      tennisHours,
      capacity,
      selectedCoach,
      selectedPlayersCount: selectedPlayers?.length || 0
    });

    if (!campId) {
      return NextResponse.json(
        { error: 'Camp ID is required' },
        { status: 400 }
      );
    }

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
    console.log('PUT /api/admin/camps - Service role client created');

    // Update camp
    console.log('PUT /api/admin/camps - Updating camp...');
    const { data: campData, error: campError } = await supabase
      .from('camps')
      .update({
        start_date: startDate,
        end_date: endDate,
        package: packageType,
        total_tennis_hours: packageType === 'no_tennis' ? null : parseInt(tennisHours),
        accommodation_details: (packageType !== 'tennis_only') ? accommodationDetails : null,
        capacity: parseInt(capacity),
        coach_id: selectedCoach || null,
      })
      .eq('id', campId)
      .select()
      .single();

    console.log('PUT /api/admin/camps - Camp update result:', {
      hasData: !!campData,
      hasError: !!campError,
      error: campError
    });

    if (campError) {
      console.error('PUT /api/admin/camps - Camp update error:', campError);
      throw campError;
    }

    // Update player assignments
    console.log('PUT /api/admin/camps - Updating player assignments...');
    
    // First, remove all existing player assignments
    const { error: deletePlayersError } = await supabase
      .from('camp_players')
      .delete()
      .eq('camp_id', campId);

    if (deletePlayersError) {
      console.error('PUT /api/admin/camps - Error removing existing players:', deletePlayersError);
      throw deletePlayersError;
    }

    // Then add new player assignments
    if (selectedPlayers.length > 0) {
      const playerAssignments = selectedPlayers.map((playerId: string) => ({
        camp_id: campId,
        player_id: playerId,
      }));

      const { error: playersError } = await supabase
        .from('camp_players')
        .insert(playerAssignments);

      if (playersError) {
        console.error('PUT /api/admin/camps - Error assigning players to camp:', playersError);
        throw playersError;
      }
    }

    // Update schedules
    console.log('PUT /api/admin/camps - Updating schedules...');
    
    // First, remove all existing schedules
    const { error: deleteSchedulesError } = await supabase
      .from('camp_schedules')
      .delete()
      .eq('camp_id', campId);

    if (deleteSchedulesError) {
      console.error('PUT /api/admin/camps - Error removing existing schedules:', deleteSchedulesError);
      throw deleteSchedulesError;
    }

    // Then add new schedules
    const dates = getDatesInRange(startDate, endDate);
    const scheduleInserts = dates
      .filter(date => schedules[date]?.trim())
      .map(date => ({
        camp_id: campId,
        schedule_date: date,
        schedule_content: schedules[date],
      }));

    if (scheduleInserts.length > 0) {
      const { error: scheduleError } = await supabase
        .from('camp_schedules')
        .insert(scheduleInserts);

      if (scheduleError) {
        console.error('PUT /api/admin/camps - Error creating camp schedules:', scheduleError);
        throw scheduleError;
      }
    }

    console.log('PUT /api/admin/camps - Camp updated successfully');
    return NextResponse.json({ success: true, camp: campData });
  } catch (error) {
    console.error('Error in PUT /api/admin/camps:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update camp' },
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
