/**
 * Sync Users from Production to Test Database
 * 
 * This script copies all users from production to test database.
 * Run with: npm run sync-users
 * 
 * Requires environment variables in .env.local:
 * - NEXT_PUBLIC_SUPABASE_URL (production)
 * - SUPABASE_SERVICE_ROLE_KEY (production)
 * - NEXT_PUBLIC_SUPABASE_URL_TEST (test)
 * - SUPABASE_SERVICE_ROLE_KEY_TEST (test)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Production database credentials
const PROD_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PROD_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Test database credentials
const TEST_URL = process.env.NEXT_PUBLIC_SUPABASE_URL_TEST;
const TEST_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY_TEST;

if (!PROD_URL || !PROD_KEY) {
  console.error('❌ Missing production database credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!TEST_URL || !TEST_KEY) {
  console.error('❌ Missing test database credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL_TEST and SUPABASE_SERVICE_ROLE_KEY_TEST');
  process.exit(1);
}

const prodClient = createClient(PROD_URL, PROD_KEY);
const testClient = createClient(TEST_URL, TEST_KEY);

async function syncUsers() {
  console.log('🔄 Starting user sync from production to test...\n');

  try {
    // Fetch all users from production
    console.log('📥 Fetching users from production database...');
    const { data: prodUsers, error: fetchError } = await prodClient
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching users from production:', fetchError);
      process.exit(1);
    }

    if (!prodUsers || prodUsers.length === 0) {
      console.log('⚠️  No users found in production database');
      return;
    }

    console.log(`✅ Found ${prodUsers.length} users in production\n`);

    // Check existing users in test database
    console.log('📋 Checking existing users in test database...');
    const { data: testUsers } = await testClient
      .from('users')
      .select('username');

    const existingUsernames = new Set((testUsers || []).map(u => u.username));
    console.log(`📊 Found ${existingUsernames.size} existing users in test database\n`);

    // Filter out users that already exist
    const usersToInsert = prodUsers.filter(user => !existingUsernames.has(user.username));

    if (usersToInsert.length === 0) {
      console.log('✅ All users already exist in test database. No sync needed.');
      return;
    }

    console.log(`📝 Inserting ${usersToInsert.length} new users...\n`);

    // Insert users in batches to avoid overwhelming the database
    const batchSize = 10;
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < usersToInsert.length; i += batchSize) {
      const batch = usersToInsert.slice(i, i + batchSize);
      
      // Prepare data for insertion (ensuring proper format)
      // Note: Preserving original ID format (could be UUID or string)
      const insertData = batch.map(user => ({
        id: user.id, // Preserve original ID format from production
        first_name: user.first_name?.trim() || '',
        last_name: user.last_name?.trim() || '',
        username: user.username?.toLowerCase() || '',
        role: user.role || 'player',
        created_at: user.created_at || new Date().toISOString(),
      }));

      const { error: insertError } = await testClient
        .from('users')
        .insert(insertData);

      if (insertError) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, insertError.message);
        errors += batch.length;
      } else {
        inserted += batch.length;
        console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} users`);
        batch.forEach(user => {
          console.log(`   - ${user.username} (${user.role})`);
        });
      }
    }

    console.log('\n📊 Sync Summary:');
    console.log(`   Total users in production: ${prodUsers.length}`);
    console.log(`   Users already in test: ${existingUsernames.size}`);
    console.log(`   Users inserted: ${inserted}`);
    console.log(`   Errors: ${errors}`);

    if (errors === 0) {
      console.log('\n✅ User sync completed successfully!');
    } else {
      console.log(`\n⚠️  Sync completed with ${errors} errors`);
    }
  } catch (error) {
    console.error('❌ Unexpected error during sync:', error);
    process.exit(1);
  }
}

// Run the sync
syncUsers();

