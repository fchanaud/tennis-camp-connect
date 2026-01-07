import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);
    const campId = searchParams.get('campId');
    const userId = searchParams.get('userId');
    
    if (!campId || !userId) {
      return NextResponse.json({ error: 'Camp ID and User ID are required' }, { status: 400 });
    }

    // Get feedback for this player and camp
    const { data: feedback, error } = await supabase
      .from('feedbacks')
      .select('*')
      .eq('player_id', userId)
      .eq('camp_id', campId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching feedback:', error);
      return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
    }

    return NextResponse.json({ feedback: feedback || null });
  } catch (error) {
    console.error('Error in GET /api/feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();

    const {
      campId,
      playerId,
      accommodationRating,
      accommodationText,
      tennisRating,
      tennisText,
      excursionsRating,
      excursionsText,
      overallText,
      photoUrls,
      consentGiven,
    } = body;

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 401 });
    }

    // Validate required fields
    if (!campId || !tennisRating || !overallText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (tennisRating < 1 || tennisRating > 5) {
      return NextResponse.json(
        { error: 'Tennis rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (accommodationRating && (accommodationRating < 1 || accommodationRating > 5)) {
      return NextResponse.json(
        { error: 'Accommodation rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (excursionsRating && (excursionsRating < 1 || excursionsRating > 5)) {
      return NextResponse.json(
        { error: 'Excursions rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!consentGiven) {
      return NextResponse.json(
        { error: 'Consent is required to submit feedback' },
        { status: 400 }
      );
    }

    // Check if feedback already exists
    const { data: existingFeedback } = await supabase
      .from('feedbacks')
      .select('id')
      .eq('player_id', playerId)
      .eq('camp_id', campId)
      .single();

    if (existingFeedback) {
      return NextResponse.json(
        { error: 'Feedback already exists for this camp. Use PUT to update it.' },
        { status: 400 }
      );
    }

    // Create feedback (also populate legacy NOT NULL columns for compatibility)
    const { data: feedback, error } = await supabase
      .from('feedbacks')
      .insert({
        player_id: playerId,
        camp_id: campId,
        accommodation_rating: accommodationRating || null,
        accommodation_text: accommodationText || null,
        tennis_rating: tennisRating,
        tennis_text: tennisText || null,
        excursions_rating: excursionsRating || null,
        excursions_text: excursionsText || null,
        overall_text: overallText,
        // Legacy columns (still NOT NULL in schema)
        overall_trip_text: overallText,
        app_experience_text: overallText,
        photo_urls: photoUrls || [],
        consent_given: consentGiven,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating feedback:', error);
      return NextResponse.json(
        { error: 'Failed to create feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ feedback }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

