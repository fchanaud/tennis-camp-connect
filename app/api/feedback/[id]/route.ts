import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();
    const body = await request.json();

    const {
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
    if (!tennisRating || !overallText) {
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

    // Check if feedback exists and belongs to user
    const { data: existingFeedback, error: fetchError } = await supabase
      .from('feedbacks')
      .select('player_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingFeedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    if (existingFeedback.player_id !== playerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update feedback (also keep legacy columns in sync)
    const { data: feedback, error } = await supabase
      .from('feedbacks')
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating feedback:', error);
      return NextResponse.json(
        { error: 'Failed to update feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error in PUT /api/feedback/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

