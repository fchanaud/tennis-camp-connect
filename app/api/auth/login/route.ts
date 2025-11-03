import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Use service role client to query users table
    let supabase;
    try {
      supabase = createServiceRoleClient();
    } catch (clientError) {
      const errorMessage = clientError instanceof Error ? clientError.message : String(clientError);
      console.error('Failed to create service role client:', errorMessage);
      
      // Check if it's a configuration error (missing keys, URL, etc.)
      if (errorMessage.includes('Missing') || errorMessage.includes('configuration')) {
        return NextResponse.json(
          { 
            error: 'Server configuration error. Please contact administrator.',
            details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
          },
          { status: 500 }
        );
      }
      
      // Re-throw to be caught by outer catch
      throw clientError;
    }
    
    // Debug: Log which database we're connecting to
    const isTestEnv = process.env.VERCEL_ENV === 'preview' || 
                      process.env.NODE_ENV === 'test' || 
                      process.env.NEXT_PUBLIC_ENV === 'test';
    console.log('Login attempt - Environment:', {
      isTestEnv,
      hasTestUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL_TEST,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasTestServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY_TEST,
    });
    
    // Query the users table for the username
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.toLowerCase())
      .single();

    if (error) {
      // Log database errors for debugging but don't expose details to client
      console.error('Database query error:', error);
      
      // Check for specific error types
      if (error.code === 'PGRST116') {
        // No rows returned - user not found
        console.log('Login attempt failed - user not found:', username);
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        );
      }
      
      // Other database errors
      return NextResponse.json(
        { 
          error: 'An error occurred during authentication. Please try again.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    if (!userData) {
      console.log('Login attempt failed - user not found:', username);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const usernameLower = username.toLowerCase();
    
    // Handle specific passwords for known users
    if (userData.role === 'admin') {
      if (password !== 'Gardelapeche78&&') {
        console.log('Admin login attempt failed - wrong password:', username);
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        );
      }
    } else if (usernameLower === 'patrickn') {
      // Specific password for coach patrickn
      if (password !== 'marrakech') {
        console.log('Coach patrickn login attempt failed - wrong password');
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        );
      }
    } else if (usernameLower === 'agirault') {
      // Specific password for agirault
      if (password !== 'agirault60024') {
        console.log('User agirault login attempt failed - wrong password');
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        );
      }
    } else if (usernameLower === 'cbedikian') {
      // Specific password for cbedikian
      if (password !== 'cbedikian40738') {
        console.log('User cbedikian login attempt failed - wrong password');
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { errorMessage, errorStack });
    
    // Return more detailed error in development
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          error: 'An error occurred. Please try again.',
          details: errorMessage,
          stack: errorStack
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

