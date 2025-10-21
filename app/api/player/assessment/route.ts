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

    // All assessments have been cleared from the database
    // Return that no assessment exists
    return NextResponse.json({
      hasAssessment: false,
      assessment: null
    });

  } catch (error) {
    console.error('Error fetching player assessment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
