/**
 * Supabase configuration utility
 * Automatically selects test or production credentials based on environment
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

/**
 * Determines if the current environment is a test/preview environment
 * IMPORTANT: Production deployments always use production credentials
 */
export function isTestEnvironment(): boolean {
  // Explicitly check for production - never use test in production
  if (process.env.VERCEL_ENV === 'production') {
    return false;
  }
  
  // Test environments
  // In development/localhost, use test credentials if they're available
  const hasTestCredentials = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL_TEST && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_TEST
  );
  
  return (
    process.env.VERCEL_ENV === 'preview' ||
    process.env.NODE_ENV === 'test' ||
    process.env.NEXT_PUBLIC_ENV === 'test' ||
    (process.env.NODE_ENV === 'development' && hasTestCredentials)
  );
}

/**
 * Gets the appropriate Supabase configuration based on the current environment
 * Production deployments ALWAYS use production credentials regardless of other settings
 */
export function getSupabaseConfig(): SupabaseConfig {
  // Production check - ALWAYS use production credentials in production
  if (process.env.VERCEL_ENV === 'production') {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !anonKey) {
      throw new Error('Missing required Supabase configuration: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set');
    }
    
    return {
      url,
      anonKey,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    };
  }
  
  const isTestEnv = isTestEnvironment();
  
  // Use test credentials if available and in test/preview environment
  if (isTestEnv) {
    const testUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_TEST;
    const testAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_TEST;
    
    if (testUrl && testAnonKey) {
      return {
        url: testUrl,
        anonKey: testAnonKey,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY_TEST,
      };
    }
    
    // If in test mode but test credentials are missing, provide helpful error
    if (!testUrl || !testAnonKey) {
      throw new Error('Missing required Supabase test configuration: NEXT_PUBLIC_SUPABASE_URL_TEST and NEXT_PUBLIC_SUPABASE_ANON_KEY_TEST must be set when NEXT_PUBLIC_ENV=test');
    }
  }
  
  // Fall back to production credentials (default/development)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !anonKey) {
    const envInfo = {
      VERCEL_ENV: process.env.VERCEL_ENV,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
      hasTestUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL_TEST,
      hasTestAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_TEST,
      hasProdUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasProdAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
    
    throw new Error(
      `Missing required Supabase configuration: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set. ` +
      `Environment info: ${JSON.stringify(envInfo)}`
    );
  }
  
  return {
    url,
    anonKey,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

