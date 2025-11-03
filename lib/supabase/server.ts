import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { getSupabaseConfig } from './config';

export async function createClient() {
  const cookieStore = await cookies();
  const config = getSupabaseConfig();

  return createServerClient(
    config.url,
    config.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// Service role client for admin operations
export function createServiceRoleClient() {
  let config;
  try {
    config = getSupabaseConfig();
  } catch (configError) {
    // Re-throw config errors with more context
    const errorMessage = configError instanceof Error ? configError.message : String(configError);
    throw new Error(`Supabase configuration error: ${errorMessage}`);
  }
  
  // Service role key is required for admin operations
  if (!config.serviceRoleKey) {
    const isTestEnv = process.env.VERCEL_ENV === 'preview' || 
                      process.env.NODE_ENV === 'test' || 
                      process.env.NEXT_PUBLIC_ENV === 'test';
    const missingKey = isTestEnv ? 'SUPABASE_SERVICE_ROLE_KEY_TEST' : 'SUPABASE_SERVICE_ROLE_KEY';
    throw new Error(`Missing ${missingKey} - Service role key is required for database operations`);
  }
  
  return createSupabaseClient(
    config.url,
    config.serviceRoleKey
  );
}

