# Deployment Guide - Tennis Camp Connect

## 🚀 Quick Deployment to Vercel

### Prerequisites
1. GitHub account
2. Vercel account (free tier works)
3. Supabase project set up with schema and seed data

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Tennis Camp Connect application"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/tennis-camp-connect.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables

In Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD=your_secure_admin_password
COACH_PASSWORD=your_secure_coach_password
```

**Important:**
- Use your actual Supabase credentials from your Supabase project settings
- Service role key is needed for server-side operations (user creation, etc.)
- Set secure passwords for admin and coach users
- These passwords and keys are stored securely in environment variables and never exposed in the code

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete (usually 1-2 minutes)
3. Your app will be live at `https://your-project.vercel.app`

---

## 🗄️ Database Setup Checklist

Before deploying, ensure your Supabase database is properly configured:

### 1. Run Schema
```sql
-- Run the entire supabase-schema.sql file in Supabase SQL Editor
```

### 2. Run Seed Data
```sql
-- Run the seed-data.sql file to create initial users
```

### 3. Verify Tables Created
- [ ] users
- [ ] camps
- [ ] camp_players
- [ ] pre_camp_assessments
- [ ] post_camp_reports
- [ ] camp_schedules

### 4. Verify RLS Policies
- [ ] All tables have RLS enabled
- [ ] Policies are created for player, coach, and admin roles

### 5. Test Authentication
- [ ] Admin user can log in (username: admin)
- [ ] Coach user can log in (username: coach)
- [ ] Test player can log in (username: jdoe)

---

## 🔧 Environment Configuration

### Local Development (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD=your_secure_admin_password
COACH_PASSWORD=your_secure_coach_password
```

### Production (Vercel)
Same variables, but set in Vercel dashboard:
- Settings > Environment Variables
- Add for Production, Preview, and Development

---

## 📋 Post-Deployment Checklist

### 1. Test Authentication
- [ ] Can log in as admin
- [ ] Can log in as coach
- [ ] Can log in as player

### 2. Test Admin Functions
- [ ] Can create new players
- [ ] Can create new coaches
- [ ] Can create new camps
- [ ] Can assign players to camps
- [ ] Can add daily schedules

### 3. Test Player Functions
- [ ] Can view camp details
- [ ] Can complete pre-camp assessment
- [ ] Can view daily schedule
- [ ] Can view recommendations
- [ ] Can view accommodation (if applicable)
- [ ] Can view essentials

### 4. Test Coach Functions
- [ ] Can view assigned players
- [ ] Can view player assessments
- [ ] Can create post-camp reports
- [ ] Can edit existing reports

### 5. Test Mobile Responsiveness
- [ ] Navigation works on mobile
- [ ] Forms are usable on mobile
- [ ] All pages display correctly on mobile

---

## 🔐 Security Configuration

### Supabase RLS Policies
Verify these policies are active:

**Users Table:**
- Players can view their own data
- Coaches can view all users
- Admins have full access

**Camps Table:**
- Players can view their enrolled camps
- Coaches can view all camps
- Admins have full access

**Camp Players Table:**
- Players can view their enrollments
- Coaches can view all enrollments
- Admins have full access

**Assessments & Reports:**
- Players can view/edit their own assessments
- Coaches can view all assessments
- Coaches can create/edit reports
- Players can view their reports

### API Security
- [ ] Supabase anon key is used (not service key)
- [ ] RLS policies are enabled on all tables
- [ ] Environment variables are set correctly
- [ ] Middleware is protecting routes

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain in Vercel

1. Go to Project Settings > Domains
2. Add your domain (e.g., tenniscamp.example.com)
3. Configure DNS with your domain provider:
   - Type: CNAME
   - Name: www (or subdomain)
   - Value: cname.vercel-dns.com
4. Wait for DNS propagation (can take up to 48 hours)

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Optional)
1. Enable in Vercel dashboard
2. Track page views, performance
3. Monitor errors

### Supabase Monitoring
1. Check database usage in Supabase dashboard
2. Monitor API requests
3. Review logs for errors

---

## 🐛 Troubleshooting

### Common Issues

**Issue: White screen after deployment**
- Check browser console for errors
- Verify environment variables are set
- Check Vercel deployment logs

**Issue: Authentication not working**
- Verify Supabase URL and key
- Check RLS policies are enabled
- Verify seed data was run

**Issue: Database errors**
- Check Supabase connection
- Verify schema is up to date
- Check RLS policies

**Issue: 404 on routes**
- Verify build completed successfully
- Check middleware configuration
- Clear browser cache

---

## 📱 Testing Credentials

After deployment, test with these users:

**Admin:**
- Username: admin
- Password: (from seed-data.sql output)

**Coach:**
- Username: coach  
- Password: (from seed-data.sql output)

**Player:**
- Username: jdoe
- Password: (from seed-data.sql output)

---

## 🔄 Updating the Application

### Deploy Updates
```bash
# Make changes
git add .
git commit -m "Your update message"
git push origin main

# Vercel will automatically deploy the update
```

### Database Migrations
```sql
-- For schema changes, run SQL in Supabase SQL Editor
-- Always test in development first
-- Backup data before major changes
```

---

## 📞 Support Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Project Issues:** Create an issue on GitHub

---

## ✅ Deployment Complete!

Your Tennis Camp Connect application is now live! 🎾

Visit your deployment URL and start managing your tennis camps.

