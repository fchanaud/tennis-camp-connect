# Default Credentials

These credentials are created when you run the `seed-data.sql` file in your Supabase database.

## 🔐 Default User Accounts

### Admin Account
- **Username:** `admin`
- **Password:** `admin37492` (example - will vary based on seed data)
- **Role:** Administrator
- **Full Name:** System Administrator
- **Email (internal):** admin@tenniscamp.local

**Permissions:**
- Create and manage users (players, coaches)
- Create and manage camps
- Assign players and coaches
- Manage schedules
- Full system access

---

### Coach Account
- **Username:** `coach`
- **Password:** `coach58291` (example - will vary based on seed data)
- **Role:** Coach
- **Full Name:** Rafael Nadal
- **Email (internal):** coach@tenniscamp.local

**Permissions:**
- View all players
- View all camps
- Review player assessments
- Create and edit post-camp reports
- Track player progress

---

### Test Player Account
- **Username:** `jdoe`
- **Password:** `jdoe73945` (example - will vary based on seed data)
- **Role:** Player
- **Full Name:** John Doe
- **Email (internal):** jdoe@tenniscamp.local

**Permissions:**
- View own camps
- Complete pre-camp assessments
- View daily schedules
- View accommodation details
- View post-camp reports
- Access travel essentials

---

## 📝 Important Notes

### Password Generation Pattern
All passwords follow this pattern:
```
{username}{5 random digits}
```

Examples:
- `admin` → `admin37492`
- `coach` → `coach58291`
- `jdoe` → `jdoe73945`
- `jsmith` → `jsmith28476`

### Username Generation Pattern
```
{first_letter_of_firstname}{lastname}
```

Examples:
- John Smith → `jsmith`
- Maria Garcia → `mgarcia`
- Alex Johnson → `ajohnson`

### Security Recommendations

**For Production:**
1. ⚠️ **Change all default passwords immediately**
2. Use the admin interface to create new users with auto-generated secure passwords
3. Disable or remove the test player account
4. Keep the generated passwords secure
5. Passwords are shown only once during user creation

**Password Storage:**
- Never commit actual passwords to version control
- Store passwords in a secure password manager
- Share credentials securely with users (encrypted email, password manager, etc.)

---

## 🔄 Creating New Users

### Via Admin Interface (Recommended)

1. Login as admin
2. Go to User Management
3. Click "Create New Player" or "Create New Coach"
4. Enter first name and last name
5. Username is auto-generated and previewed
6. Click create
7. **IMPORTANT:** Copy the generated password immediately
8. Share credentials securely with the user

### Example User Creation

**Creating Player "Sarah Wilson":**
1. First Name: Sarah
2. Last Name: Wilson
3. Auto-generated username: `swilson`
4. Auto-generated password: `swilson28476` (example)
5. Save password and share with Sarah

**Creating Coach "Andre Agassi":**
1. First Name: Andre
2. Last Name: Agassi
3. Auto-generated username: `aagassi`
4. Auto-generated password: `aagassi73945` (example)
5. Save password and share with Andre

---

## 🔍 Verifying Seed Data

After running `seed-data.sql`, verify users were created:

```sql
SELECT 
  username,
  first_name,
  last_name,
  role,
  created_at
FROM users
ORDER BY created_at;
```

Expected output:
```
username | first_name | last_name     | role   | created_at
---------|------------|---------------|--------|-------------------
admin    | System     | Administrator | admin  | 2024-01-15 10:00:00
coach    | Rafael     | Nadal         | coach  | 2024-01-15 10:00:00
jdoe     | John       | Doe           | player | 2024-01-15 10:00:00
```

---

## 🚨 Troubleshooting Login Issues

### "Invalid username or password"
- Verify you're using the correct username (lowercase)
- Check password is exactly as generated
- Ensure seed data was run successfully
- Verify Supabase environment variables are correct

### "User not found"
- Run the verification query above
- Re-run seed-data.sql if users don't exist
- Check Supabase connection

### Can't access certain features
- Verify user role is correct
- Check RLS policies are enabled
- Ensure you're logged in with the right account

---

## 📱 Test User Journey

### 1. Admin Test
```
Login: admin / admin37492
→ Should see admin dashboard with user/camp stats
→ Navigate to User Management
→ Create a test player
→ Navigate to Camp Management
→ Create a test camp
```

### 2. Coach Test
```
Login: coach / coach58291
→ Should see coach dashboard
→ Navigate to Players
→ View player details
→ Create a post-camp report
```

### 3. Player Test
```
Login: jdoe / jdoe73945
→ Should see player dashboard
→ If assigned to camp, see countdown
→ Navigate to Tennis
→ Complete pre-camp assessment
→ Navigate to Schedule
→ View recommendations
```

---

## 💡 Tips

1. **First Login:** Always use admin account first to set up the system
2. **Create Camps:** Create camps before assigning players
3. **Test Flow:** Use test player to verify player experience
4. **Password Security:** Store all generated passwords in a secure location
5. **User Communication:** Have a process for securely sharing credentials with new users

---

## 📞 Need Help?

- Check `SETUP-CHECKLIST.md` for step-by-step verification
- Review `README.md` for complete documentation
- See `DEPLOYMENT.md` for deployment issues
- Check Supabase logs for authentication errors

---

**Remember:** These are default credentials for testing. In production, create new users with secure auto-generated passwords through the admin interface.

