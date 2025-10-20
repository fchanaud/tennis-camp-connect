import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    
    // Query for admin users
    const { data: adminUsers, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, username, role, created_at')
      .eq('role', 'admin')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching admin users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch admin users' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      adminUsers: adminUsers || [],
      count: adminUsers?.length || 0,
      message: adminUsers?.length === 0 ? 'No admin users found' : 'Admin users found'
    });
  } catch (error) {
    console.error('Error in GET /api/admin/check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, username } = await request.json();
    
    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }
    
    const supabase = createServiceRoleClient();
    
    // Create admin user
    const { data: userData, error } = await supabase
      .from('users')
      .insert({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        username: username || 'admin',
        role: 'admin',
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating admin user:', error);
      return NextResponse.json(
        { error: `Failed to create admin user: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: userData,
      message: 'Admin user created successfully',
      password: 'Gardelapeche78&&'
    });
  } catch (error) {
    console.error('Error in POST /api/admin/check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
