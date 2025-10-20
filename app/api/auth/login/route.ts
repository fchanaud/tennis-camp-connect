import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Use service role client to query users table
    const supabase = createServiceRoleClient();
    
    // Query the users table for the username
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.toLowerCase())
      .single();

    if (error || !userData) {
      console.log('Login attempt failed - user not found:', username);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // For now, accept any password for all users (since we're not storing passwords in DB)
    // In a real app, you'd hash and compare passwords
    if (!password || password.length < 3) {
      return NextResponse.json(
        { error: 'Password must be at least 3 characters' },
        { status: 400 }
      );
    }

    console.log('Login successful for user:', username);
    
    // Return user data without sensitive information
    const { created_at, ...userWithoutSensitive } = userData;
    return NextResponse.json({ user: userWithoutSensitive });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

