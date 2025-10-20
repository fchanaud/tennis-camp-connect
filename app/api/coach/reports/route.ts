import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

// Create a new report
export async function POST(request: NextRequest) {
  try {
    const { playerId, campId, reportContent, coachId } = await request.json();

    if (!playerId || !campId || !reportContent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('post_camp_reports')
      .insert({
        player_id: playerId,
        camp_id: campId,
        coach_id: coachId || null,
        report_content: reportContent,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating report:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, report: data });
  } catch (error) {
    console.error('Error in POST /api/coach/reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update an existing report
export async function PUT(request: NextRequest) {
  try {
    const { reportId, reportContent } = await request.json();

    if (!reportId || !reportContent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('post_camp_reports')
      .update({
        report_content: reportContent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reportId)
      .select()
      .single();

    if (error) {
      console.error('Error updating report:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, report: data });
  } catch (error) {
    console.error('Error in PUT /api/coach/reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

