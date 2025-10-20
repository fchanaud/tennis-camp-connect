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
    
    console.log('POST /api/admin/users - Request data:', { firstName, lastName, role });
    
    if (!firstName?.trim() || !lastName?.trim()) {
      console.log('POST /api/admin/users - Validation failed: missing names');
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }
    
    // Use service role for admin operations
    const supabase = createServiceRoleClient();
    console.log('POST /api/admin/users - Service role client created');
    
    // Generate username and password
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/\s+/g, '');
    const password = Math.random().toString(36).slice(-8) + '123';
    
    console.log('POST /api/admin/users - Generated credentials:', { username, password: '***' });
    
    // Check if service role key is available
    const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    console.log('POST /api/admin/users - Service role key available:', hasServiceRoleKey);
    
    // Create auth user
    let authUserId: string | null = null;
    if (hasServiceRoleKey) {
      console.log('POST /api/admin/users - Attempting to create auth user...');
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: `${username}@tenniscamp.local`,
        password: password,
        email_confirm: true,
      });
      
      console.log('POST /api/admin/users - Auth creation result:', { 
        hasData: !!authData, 
        hasUser: !!authData?.user, 
        userId: authData?.user?.id,
        error: authError 
      });
      
      if (authError) {
        console.error('POST /api/admin/users - Auth creation error:', authError);
        return NextResponse.json(
          { error: `Failed to create user authentication: ${authError.message}` },
          { status: 500 }
        );
      }
      
      if (!authData.user) {
        console.error('POST /api/admin/users - No user returned from auth creation');
        return NextResponse.json(
          { error: 'Failed to create user - no user data returned' },
          { status: 500 }
        );
      }
      
      authUserId = authData.user.id;
      console.log('POST /api/admin/users - Auth user created successfully:', authUserId);
    } else {
      console.log('POST /api/admin/users - No service role key, generating UUID instead');
      authUserId = globalThis.crypto?.randomUUID() || `${Date.now()}-${Math.random()}`;
    }
    
    // Create user record
    console.log('POST /api/admin/users - Creating user record with ID:', authUserId);
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authUserId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        username: username,
        role: role,
      });
    
    if (userError) {
      console.error('POST /api/admin/users - User record creation error:', userError);
      return NextResponse.json(
        { error: `Failed to create user record: ${userError.message}` },
        { status: 500 }
      );
    }
    
    console.log('POST /api/admin/users - User created successfully');
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
    console.error('POST /api/admin/users - Unexpected error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
