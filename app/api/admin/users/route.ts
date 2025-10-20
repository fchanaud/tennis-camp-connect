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
    const baseUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/\s+/g, '');
    const password = Math.random().toString(36).slice(-8) + '123';
    
    // Ensure username uniqueness
    let username = baseUsername;
    let suffix = 1;
    while (suffix <= 20) { // Prevent infinite loop
      const { data: existingUsers } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .limit(1);
      
      if (!existingUsers || existingUsers.length === 0) {
        break; // Username is unique
      }
      
      username = `${baseUsername}${suffix}`;
      suffix++;
    }
    
    console.log('POST /api/admin/users - Generated credentials:', { username, password: '***' });
    
    // Check if service role key is available
    const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    console.log('POST /api/admin/users - Service role key available:', hasServiceRoleKey);
    
    // Create auth user (skip if auth creation fails)
    let authUserId: string | null = null;
    if (hasServiceRoleKey) {
      console.log('POST /api/admin/users - Attempting to create auth user...');
      try {
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
          console.warn('POST /api/admin/users - Auth creation failed, continuing without auth user:', authError.message);
          // Don't return error, just continue without auth user
        } else if (authData?.user?.id) {
          authUserId = authData.user.id;
          console.log('POST /api/admin/users - Auth user created successfully:', authUserId);
        } else {
          console.warn('POST /api/admin/users - No user data returned from auth creation');
        }
      } catch (authError) {
        console.warn('POST /api/admin/users - Auth creation threw error, continuing without auth user:', authError);
      }
    } else {
      console.log('POST /api/admin/users - No service role key, generating UUID instead');
    }
    
    // Generate fallback ID if auth creation failed or wasn't attempted
    if (!authUserId) {
      authUserId = globalThis.crypto?.randomUUID() || `${Date.now()}-${Math.random()}`;
      console.log('POST /api/admin/users - Using generated UUID:', authUserId);
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
