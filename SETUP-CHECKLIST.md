# Setup Checklist - Tennis Camp Connect

Complete these steps in order to get your application running.

## ✅ Step 1: Supabase Setup

### 1.1 Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Create a new project
- [ ] Note your project URL and anon key

### 1.2 Run Database Schema
- [ ] Open Supabase SQL Editor
- [ ] Copy entire contents of `supabase-schema.sql`
- [ ] Run the SQL to create tables, RLS policies, and indexes
- [ ] Verify all 6 tables were created:
  - users
  - camps
  - camp_players
  - pre_camp_assessments
  - post_camp_reports
  - camp_schedules

### 1.3 Run Seed Data
- [ ] In Supabase SQL Editor
- [ ] Copy entire contents of `seed-data.sql`
- [ ] Run the SQL to create initial users
- [ ] Run the verification query to see created users
- [ ] Note the generated passwords for admin, coach, and test player

### 1.4 Configure Authentication
- [ ] In Supabase Dashboard, go to Authentication > Settings
- [ ] Disable "Enable email confirmations" (for easier testing)
- [ ] Set "Site URL" to your local or production URL

---

## ✅ Step 2: Local Development Setup

### 2.1 Install Dependencies
```bash
cd tennis-camp-connect
npm install
```

### 2.2 Configure Environment Variables
- [ ] Open `.env.local`
- [ ] Replace `your_supabase_url_here` with your actual Supabase project URL
- [ ] Replace `your_supabase_anon_key_here` with your actual Supabase anon key

Example:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 Test Local Build
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors

### 2.4 Start Development Server
```bash
npm run dev
```
- [ ] Server starts at http://localhost:3000
- [ ] No Supabase connection errors

---

## ✅ Step 3: Test Authentication

### 3.1 Test Admin Login
- [ ] Navigate to http://localhost:3000
- [ ] Should redirect to /login
- [ ] Enter credentials:
  - Username: `admin`
  - Password: (from seed-data output)
- [ ] Should redirect to /home
- [ ] Should see admin dashboard with statistics

### 3.2 Test Coach Login
- [ ] Logout
- [ ] Login with:
  - Username: `coach`
  - Password: (from seed-data output)
- [ ] Should see coach home page
- [ ] Navigate to Players section

### 3.3 Test Player Login
- [ ] Logout
- [ ] Login with:
  - Username: `jdoe`
  - Password: (from seed-data output)
- [ ] Should see player home page
- [ ] May show "No camps yet" (expected)

---

## ✅ Step 4: Test Admin Functions

### 4.1 Create a New Player
- [ ] Login as admin
- [ ] Go to User Management
- [ ] Click "Create New Player"
- [ ] Enter:
  - First Name: Test
  - Last Name: Player
- [ ] Verify username preview shows `tplayer`
- [ ] Click "Create Player"
- [ ] **IMPORTANT:** Copy and save the generated password
- [ ] Verify player appears in users list

### 4.2 Create a New Coach
- [ ] Click "Create New Coach"
- [ ] Enter first and last name
- [ ] Verify username preview
- [ ] Create coach
- [ ] Save generated password

### 4.3 Create a Camp
- [ ] Go to Camp Management
- [ ] Click "Create New Camp"
- [ ] Fill in camp details:
  - Start Date: (future date)
  - End Date: (after start date)
  - Package: Choose any
  - Tennis Hours: 10 (if not "No Tennis")
  - Accommodation Details: Enter hotel info (if not "Tennis Only")
  - Capacity: 4
  - Assign Coach: Select a coach
  - Select Players: Check 1-4 players
  - Daily Schedules: Add schedule for at least one day
- [ ] Click "Create Camp"
- [ ] Verify camp appears in camps list

---

## ✅ Step 5: Test Player Functions

### 5.1 View Camp
- [ ] Login as a player assigned to a camp
- [ ] Should see camp card on home page
- [ ] Should see countdown (D-X or Day X of Y)
- [ ] Click "Tennis Program"

### 5.2 Complete Pre-Camp Assessment
- [ ] On Tennis page, click "Complete Assessment"
- [ ] Fill out all required fields:
  - Playing Experience
  - Skill Level
  - Dominant Hand
  - Goals
  - Strengths
  - Areas to Improve
  - Previous Injuries
  - Additional Notes
- [ ] Submit assessment
- [ ] Verify assessment is saved and displayed

### 5.3 View Schedule
- [ ] Navigate to Schedule page
- [ ] Verify daily schedule collapsibles appear
- [ ] Click to expand days with schedules
- [ ] Verify recommendations section shows
- [ ] Click on a recommendation to view map link

### 5.4 View Stay (if applicable)
- [ ] If camp has stay package, navigate to Stay
- [ ] Verify accommodation details display
- [ ] Verify map is shown

### 5.5 View Essentials
- [ ] Navigate to Essentials
- [ ] Expand each collapsible section
- [ ] Verify all information is readable

---

## ✅ Step 6: Test Coach Functions

### 6.1 View Players
- [ ] Login as coach
- [ ] Go to Players section
- [ ] Verify assigned players appear
- [ ] Verify assessment/report status badges

### 6.2 View Player Details
- [ ] Click on a player
- [ ] Verify player information displays
- [ ] Expand pre-camp assessment
- [ ] Verify assessment details show

### 6.3 Create Post-Camp Report
- [ ] Scroll to Post-Camp Report section
- [ ] Click "Create Report"
- [ ] Write comprehensive report including:
  - Performance summary
  - Technical skills
  - Areas improved
  - Strengths
  - Recommendations
- [ ] Click "Publish Report"
- [ ] Verify report is saved

### 6.4 Edit Report
- [ ] Click "Edit Report"
- [ ] Modify report content
- [ ] Click "Update Report"
- [ ] Verify changes saved

---

## ✅ Step 7: Test Mobile Responsiveness

### 7.1 Mobile Navigation
- [ ] Open in mobile view (or resize browser)
- [ ] Verify hamburger menu appears
- [ ] Click hamburger menu
- [ ] Verify all navigation links work
- [ ] Test dropdown for camp navigation (player)

### 7.2 Mobile Pages
- [ ] Test all pages in mobile view:
  - [ ] Home
  - [ ] Tennis
  - [ ] Schedule
  - [ ] Stay
  - [ ] Essentials
  - [ ] Admin pages
  - [ ] Coach pages
- [ ] Verify forms are usable
- [ ] Verify buttons are tappable
- [ ] Verify cards stack properly

---

## ✅ Step 8: Deploy to Vercel

### 8.1 Prepare for Deployment
- [ ] Ensure all changes are committed to git
- [ ] Push to GitHub
- [ ] Verify build passes locally: `npm run build`

### 8.2 Deploy on Vercel
- [ ] Follow instructions in `DEPLOYMENT.md`
- [ ] Import project from GitHub
- [ ] Add environment variables
- [ ] Deploy

### 8.3 Verify Production
- [ ] Visit production URL
- [ ] Test admin login
- [ ] Test coach login
- [ ] Test player login
- [ ] Create a test camp in production
- [ ] Verify all features work

---

## ✅ Step 9: Security Verification

### 9.1 RLS Policies
- [ ] In Supabase, verify RLS is enabled on all tables
- [ ] Test that players can't access other players' data
- [ ] Test that coaches can view but not edit user profiles
- [ ] Test that admins have full access

### 9.2 Authentication
- [ ] Verify protected routes redirect to login
- [ ] Verify authenticated users can't access login page
- [ ] Test logout functionality

---

## ✅ Step 10: Final Checks

### 10.1 Data Integrity
- [ ] Create multiple users and camps
- [ ] Assign players to camps
- [ ] Verify all relationships work correctly
- [ ] Test edge cases (max capacity, date validation)

### 10.2 User Experience
- [ ] Test complete user journey for each role
- [ ] Verify all error messages are user-friendly
- [ ] Verify loading states work
- [ ] Verify success messages appear

### 10.3 Performance
- [ ] Check page load times
- [ ] Verify images load properly
- [ ] Test on different browsers
- [ ] Test on different devices

---

## 🎉 Completion

Once all items are checked:
- [ ] Application is fully functional
- [ ] All user roles work correctly
- [ ] Database is properly configured
- [ ] Application is deployed
- [ ] Documentation is complete

---

## 📝 Notes

**Default Credentials (from seed-data.sql):**
- Admin: username `admin` / password `admin7k4m1` (example)
- Coach: username `coach` / password `coach3x9p2` (example)
- Player: username `jdoe` / password `jdoe5m1n9` (example)

**Important:** Passwords follow the pattern: `{username}{1 digit}{4 alphanumeric}`

**Supabase Configuration:**
- Project URL: https://[project-ref].supabase.co
- Anon Key: Found in Settings > API

**Support:**
- README.md - General documentation
- DEPLOYMENT.md - Deployment guide
- This checklist - Setup verification

---

Good luck with your Tennis Camp Connect application! 🎾

