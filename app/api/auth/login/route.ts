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

    // Handle specific admin password
    if (userData.role === 'admin') {
      if (password !== 'Gardelapeche78&&') {
        console.log('Admin login attempt failed - wrong password:', username);
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        );
      }
    } else if (username.toLowerCase() === 'patrickn') {
      // Specific password for coach patrickn
      if (password !== 'marrakech') {
        console.log('Coach patrickn login attempt failed - wrong password');
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        );
      }
    } else {
      // For other non-admin users, accept any password (since we're not storing passwords in DB)
      if (!password || password.length < 3) {
        return NextResponse.json(
          { error: 'Password must be at least 3 characters' },
          { status: 400 }
        );
      }
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

