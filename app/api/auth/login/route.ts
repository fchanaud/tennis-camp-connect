import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // User configuration with passwords from environment variables
    const users = {
      'admin': {
        id: '11111111-1111-1111-1111-111111111111',
        first_name: 'System',
        last_name: 'Administrator',
        username: 'admin',
        role: 'admin',
        password: process.env.ADMIN_PASSWORD
      },
      'patrickn': {
        id: '22222222-2222-2222-2222-222222222222',
        first_name: 'Patrick',
        last_name: 'Nadal',
        username: 'patrickn',
        role: 'coach',
        password: process.env.COACH_PASSWORD
      },
      'jdoe': {
        id: '33333333-3333-3333-3333-333333333333',
        first_name: 'John',
        last_name: 'Doe',
        username: 'jdoe',
        role: 'player',
        password: null // Accept any password for player
      }
    };

    const user = users[username.toLowerCase() as keyof typeof users];

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Validate password
    if (user.password) {
      // Specific password required for admin and coach
      if (password !== user.password) {
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        );
      }
    } else {
      // For player, accept any password with 3+ characters
      if (password.length < 3) {
        return NextResponse.json(
          { error: 'Password must be at least 3 characters' },
          { status: 400 }
        );
      }
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });

  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

