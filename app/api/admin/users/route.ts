import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Use service role for admin operations
    const supabase = createServiceRoleClient();
    
    // Temporarily disable RLS for this query by using raw SQL
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ users: users || [] });
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, role } = await request.json();
    
    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }
    
    // Use service role for admin operations
    const supabase = createServiceRoleClient();
    
    // Generate username and password
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/\s+/g, '');
    const password = Math.random().toString(36).slice(-8) + '123';
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: `${username}@tenniscamp.local`,
      password: password,
      email_confirm: true,
    });
    
    if (authError) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json(
        { error: 'Failed to create user authentication' },
        { status: 500 }
      );
    }
    
    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
    
    // Create user record
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        username: username,
        role: role,
      });
    
    if (userError) {
      console.error('Error creating user record:', userError);
      return NextResponse.json(
        { error: 'Failed to create user record' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      user: {
        username,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role
      }
    });
  } catch (error) {
    console.error('Error in POST /api/admin/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
