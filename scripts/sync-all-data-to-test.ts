/**
 * Sync All Data from Production to Test Database
 * 
 * This script copies all data from production to test database:
 * - Users
 * - Camps
 * - Camp Players (enrollments)
 * - Camp Schedules
 * - Pre-camp Assessments
 * - Post-camp Reports
 * 
 * Run with: npm run sync-all-data
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

interface SyncStats {
  users: { total: number; inserted: number; skipped: number };
  camps: { total: number; inserted: number; skipped: number };
  campPlayers: { total: number; inserted: number; skipped: number };
  campSchedules: { total: number; inserted: number; skipped: number };
  assessments: { total: number; inserted: number; skipped: number };
  reports: { total: number; inserted: number; skipped: number };
  errors: number;
}

async function syncUsers(): Promise<{ inserted: number; skipped: number; total: number }> {
  console.log('\n📥 Syncing Users...');
  
  const { data: prodUsers, error } = await prodClient
    .from('users')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!prodUsers || prodUsers.length === 0) {
    console.log('   ⚠️  No users found in production');
    return { total: 0, inserted: 0, skipped: 0 };
  }

  const { data: testUsers } = await testClient
    .from('users')
    .select('username');

  const existingUsernames = new Set((testUsers || []).map(u => u.username));
  const usersToInsert = prodUsers.filter(user => !existingUsernames.has(user.username));

  if (usersToInsert.length === 0) {
    console.log(`   ✅ All ${prodUsers.length} users already exist`);
    return { total: prodUsers.length, inserted: 0, skipped: prodUsers.length };
  }

  const { error: insertError } = await testClient
    .from('users')
    .insert(usersToInsert.map(user => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      role: user.role,
      created_at: user.created_at,
    })));

  if (insertError) throw insertError;

  console.log(`   ✅ Inserted ${usersToInsert.length} users (${existingUsernames.size} already existed)`);
  return { total: prodUsers.length, inserted: usersToInsert.length, skipped: existingUsernames.size };
}

async function syncCamps(): Promise<{ inserted: number; skipped: number; total: number }> {
  console.log('\n📥 Syncing Camps...');
  
  const { data: prodCamps, error } = await prodClient
    .from('camps')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!prodCamps || prodCamps.length === 0) {
    console.log('   ⚠️  No camps found in production');
    return { total: 0, inserted: 0, skipped: 0 };
  }

  const { data: testCamps } = await testClient
    .from('camps')
    .select('id');

  const existingCampIds = new Set((testCamps || []).map(c => c.id));
  const campsToInsert = prodCamps.filter(camp => !existingCampIds.has(camp.id));

  if (campsToInsert.length === 0) {
    console.log(`   ✅ All ${prodCamps.length} camps already exist`);
    return { total: prodCamps.length, inserted: 0, skipped: prodCamps.length };
  }

  const { error: insertError } = await testClient
    .from('camps')
    .insert(campsToInsert.map(camp => ({
      id: camp.id,
      start_date: camp.start_date,
      end_date: camp.end_date,
      package: camp.package,
      total_tennis_hours: camp.total_tennis_hours,
      accommodation_details: camp.accommodation_details,
      accommodation_name: camp.accommodation_name,
      accommodation_phone: camp.accommodation_phone,
      accommodation_map_link: camp.accommodation_map_link,
      accommodation_photo_url: camp.accommodation_photo_url,
      capacity: camp.capacity,
      coach_id: camp.coach_id,
      created_at: camp.created_at,
    })));

  if (insertError) throw insertError;

  console.log(`   ✅ Inserted ${campsToInsert.length} camps (${existingCampIds.size} already existed)`);
  return { total: prodCamps.length, inserted: campsToInsert.length, skipped: existingCampIds.size };
}

async function syncCampPlayers(): Promise<{ inserted: number; skipped: number; total: number }> {
  console.log('\n📥 Syncing Camp Players (enrollments)...');
  
  const { data: prodCampPlayers, error } = await prodClient
    .from('camp_players')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!prodCampPlayers || prodCampPlayers.length === 0) {
    console.log('   ⚠️  No camp enrollments found in production');
    return { total: 0, inserted: 0, skipped: 0 };
  }

  const { data: testCampPlayers } = await testClient
    .from('camp_players')
    .select('camp_id, player_id');

  const existingPairs = new Set(
    (testCampPlayers || []).map(cp => `${cp.camp_id}-${cp.player_id}`)
  );
  
  const toInsert = prodCampPlayers.filter(cp => 
    !existingPairs.has(`${cp.camp_id}-${cp.player_id}`)
  );

  if (toInsert.length === 0) {
    console.log(`   ✅ All ${prodCampPlayers.length} enrollments already exist`);
    return { total: prodCampPlayers.length, inserted: 0, skipped: prodCampPlayers.length };
  }

  const { error: insertError } = await testClient
    .from('camp_players')
    .insert(toInsert.map(cp => ({
      id: cp.id,
      camp_id: cp.camp_id,
      player_id: cp.player_id,
      created_at: cp.created_at,
    })));

  if (insertError) throw insertError;

  console.log(`   ✅ Inserted ${toInsert.length} enrollments (${existingPairs.size} already existed)`);
  return { total: prodCampPlayers.length, inserted: toInsert.length, skipped: existingPairs.size };
}

async function syncCampSchedules(): Promise<{ inserted: number; skipped: number; total: number }> {
  console.log('\n📥 Syncing Camp Schedules...');
  
  const { data: prodSchedules, error } = await prodClient
    .from('camp_schedules')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!prodSchedules || prodSchedules.length === 0) {
    console.log('   ⚠️  No schedules found in production');
    return { total: 0, inserted: 0, skipped: 0 };
  }

  const { data: testSchedules } = await testClient
    .from('camp_schedules')
    .select('camp_id, schedule_date');

  const existingPairs = new Set(
    (testSchedules || []).map(s => `${s.camp_id}-${s.schedule_date}`)
  );
  
  const toInsert = prodSchedules.filter(s => 
    !existingPairs.has(`${s.camp_id}-${s.schedule_date}`)
  );

  if (toInsert.length === 0) {
    console.log(`   ✅ All ${prodSchedules.length} schedules already exist`);
    return { total: prodSchedules.length, inserted: 0, skipped: prodSchedules.length };
  }

  const { error: insertError } = await testClient
    .from('camp_schedules')
    .insert(toInsert.map(s => ({
      id: s.id,
      camp_id: s.camp_id,
      schedule_date: s.schedule_date,
      schedule_content: s.schedule_content,
      created_at: s.created_at,
      updated_at: s.updated_at,
    })));

  if (insertError) throw insertError;

  console.log(`   ✅ Inserted ${toInsert.length} schedules (${existingPairs.size} already existed)`);
  return { total: prodSchedules.length, inserted: toInsert.length, skipped: existingPairs.size };
}

async function syncAssessments(): Promise<{ inserted: number; skipped: number; total: number }> {
  console.log('\n📥 Syncing Pre-camp Assessments...');
  
  const { data: prodAssessments, error } = await prodClient
    .from('pre_camp_assessments')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!prodAssessments || prodAssessments.length === 0) {
    console.log('   ⚠️  No assessments found in production');
    return { total: 0, inserted: 0, skipped: 0 };
  }

  const { data: testAssessments } = await testClient
    .from('pre_camp_assessments')
    .select('player_id, camp_id');

  const existingPairs = new Set(
    (testAssessments || []).map(a => `${a.player_id}-${a.camp_id}`)
  );
  
  const toInsert = prodAssessments.filter(a => 
    !existingPairs.has(`${a.player_id}-${a.camp_id}`)
  );

  if (toInsert.length === 0) {
    console.log(`   ✅ All ${prodAssessments.length} assessments already exist`);
    return { total: prodAssessments.length, inserted: 0, skipped: prodAssessments.length };
  }

  const { error: insertError } = await testClient
    .from('pre_camp_assessments')
    .insert(toInsert.map(a => ({
      id: a.id,
      player_id: a.player_id,
      camp_id: a.camp_id,
      answers: a.answers,
      completed_at: a.completed_at,
      updated_at: a.updated_at,
    })));

  if (insertError) throw insertError;

  console.log(`   ✅ Inserted ${toInsert.length} assessments (${existingPairs.size} already existed)`);
  return { total: prodAssessments.length, inserted: toInsert.length, skipped: existingPairs.size };
}

async function syncReports(): Promise<{ inserted: number; skipped: number; total: number }> {
  console.log('\n📥 Syncing Post-camp Reports...');
  
  const { data: prodReports, error } = await prodClient
    .from('post_camp_reports')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!prodReports || prodReports.length === 0) {
    console.log('   ⚠️  No reports found in production');
    return { total: 0, inserted: 0, skipped: 0 };
  }

  const { data: testReports } = await testClient
    .from('post_camp_reports')
    .select('player_id, camp_id');

  const existingPairs = new Set(
    (testReports || []).map(r => `${r.player_id}-${r.camp_id}`)
  );
  
  const toInsert = prodReports.filter(r => 
    !existingPairs.has(`${r.player_id}-${r.camp_id}`)
  );

  if (toInsert.length === 0) {
    console.log(`   ✅ All ${prodReports.length} reports already exist`);
    return { total: prodReports.length, inserted: 0, skipped: prodReports.length };
  }

  const { error: insertError } = await testClient
    .from('post_camp_reports')
    .insert(toInsert.map(r => ({
      id: r.id,
      player_id: r.player_id,
      camp_id: r.camp_id,
      coach_id: r.coach_id,
      report_content: r.report_content,
      created_at: r.created_at,
      updated_at: r.updated_at,
    })));

  if (insertError) throw insertError;

  console.log(`   ✅ Inserted ${toInsert.length} reports (${existingPairs.size} already existed)`);
  return { total: prodReports.length, inserted: toInsert.length, skipped: existingPairs.size };
}

async function syncAllData() {
  console.log('🔄 Starting full data sync from production to test...\n');
  console.log('⚠️  This will sync: Users, Camps, Enrollments, Schedules, Assessments, Reports\n');

  const stats: SyncStats = {
    users: { total: 0, inserted: 0, skipped: 0 },
    camps: { total: 0, inserted: 0, skipped: 0 },
    campPlayers: { total: 0, inserted: 0, skipped: 0 },
    campSchedules: { total: 0, inserted: 0, skipped: 0 },
    assessments: { total: 0, inserted: 0, skipped: 0 },
    reports: { total: 0, inserted: 0, skipped: 0 },
    errors: 0,
  };

  try {
    // Sync in order: Users first (required for foreign keys), then camps, then relationships
    stats.users = await syncUsers();
    stats.camps = await syncCamps();
    stats.campPlayers = await syncCampPlayers();
    stats.campSchedules = await syncCampSchedules();
    stats.assessments = await syncAssessments();
    stats.reports = await syncReports();

    console.log('\n' + '='.repeat(60));
    console.log('📊 Sync Summary:');
    console.log('='.repeat(60));
    console.log(`Users:        ${stats.users.inserted} inserted, ${stats.users.skipped} skipped (${stats.users.total} total)`);
    console.log(`Camps:        ${stats.camps.inserted} inserted, ${stats.camps.skipped} skipped (${stats.camps.total} total)`);
    console.log(`Enrollments:  ${stats.campPlayers.inserted} inserted, ${stats.campPlayers.skipped} skipped (${stats.campPlayers.total} total)`);
    console.log(`Schedules:    ${stats.campSchedules.inserted} inserted, ${stats.campSchedules.skipped} skipped (${stats.campSchedules.total} total)`);
    console.log(`Assessments:  ${stats.assessments.inserted} inserted, ${stats.assessments.skipped} skipped (${stats.assessments.total} total)`);
    console.log(`Reports:      ${stats.reports.inserted} inserted, ${stats.reports.skipped} skipped (${stats.reports.total} total)`);
    console.log('='.repeat(60));

    if (stats.errors === 0) {
      console.log('\n✅ Full data sync completed successfully!');
    } else {
      console.log(`\n⚠️  Sync completed with ${stats.errors} errors`);
    }
  } catch (error) {
    console.error('\n❌ Error during sync:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error details:', errorMessage);
    process.exit(1);
  }
}

// Run the sync
syncAllData();

