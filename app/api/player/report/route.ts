import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    
    // Get parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const campId = url.searchParams.get('campId');
    
    if (!userId || !campId) {
      return NextResponse.json(
        { error: 'User ID and Camp ID are required' },
        { status: 400 }
      );
    }

    // Get post-camp report if exists
    const { data: report, error } = await supabase
      .from('post_camp_reports')
      .select('*')
      .eq('player_id', userId)
      .eq('camp_id', campId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching report:', error);
      return NextResponse.json({ report: null });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error in player report API:', error);
    return NextResponse.json({ report: null });
  }
}

