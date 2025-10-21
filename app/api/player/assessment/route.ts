import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    
    // Get user ID from the request
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if assessment exists for this player
    const { data: assessmentData, error } = await supabase
      .from('pre_camp_assessments')
      .select('*')
      .eq('player_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching assessment:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({
      hasAssessment: !!assessmentData,
      assessment: assessmentData
    });

  } catch (error) {
    console.error('Error fetching player assessment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();
    const { userId, assessmentData } = body;
    
    if (!userId || !assessmentData) {
      return NextResponse.json(
        { error: 'User ID and assessment data are required' },
        { status: 400 }
      );
    }

    // Get the player's camp
    const { data: campPlayer } = await supabase
      .from('camp_players')
      .select('camp_id')
      .eq('player_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!campPlayer) {
      return NextResponse.json(
        { error: 'No camp found for this player' },
        { status: 404 }
      );
    }

    // Check if assessment already exists for this camp
    const { data: existing } = await supabase
      .from('pre_camp_assessments')
      .select('id')
      .eq('player_id', userId)
      .eq('camp_id', campPlayer.camp_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'Assessment already exists. Use PUT to update.' },
        { status: 409 }
      );
    }

    // Create new assessment with data stored in answers JSONB field
    const { data, error } = await supabase
      .from('pre_camp_assessments')
      .insert({
        player_id: userId,
        camp_id: campPlayer.camp_id,
        answers: assessmentData,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating assessment:', error);
      return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
    }

    return NextResponse.json({ success: true, assessment: data });

  } catch (error) {
    console.error('Error in POST assessment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();
    const { userId, assessmentData } = body;
    
    if (!userId || !assessmentData) {
      return NextResponse.json(
        { error: 'User ID and assessment data are required' },
        { status: 400 }
      );
    }

    // Get the player's camp
    const { data: campPlayer } = await supabase
      .from('camp_players')
      .select('camp_id')
      .eq('player_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!campPlayer) {
      return NextResponse.json(
        { error: 'No camp found for this player' },
        { status: 404 }
      );
    }

    // Update existing assessment with data in answers JSONB field
    const { data, error } = await supabase
      .from('pre_camp_assessments')
      .update({
        answers: assessmentData,
        updated_at: new Date().toISOString()
      })
      .eq('player_id', userId)
      .eq('camp_id', campPlayer.camp_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating assessment:', error);
      return NextResponse.json({ error: 'Failed to update assessment' }, { status: 500 });
    }

    return NextResponse.json({ success: true, assessment: data });

  } catch (error) {
    console.error('Error in PUT assessment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
