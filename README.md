# Tennis Camp Connect

A comprehensive tennis camp management application for managing players, coaches, and camp administration with role-based access control.

## 🎾 Features

### For Players
- View camp details with dynamic countdown
- Complete pre-camp assessments
- Access daily schedules with recommendations
- View accommodation details (for stay packages)
- Access travel essentials and local information
- View post-camp reports from coaches

### For Coaches
- View all assigned players
- Access player assessments
- Create and edit post-camp reports
- Track player progress

### For Admins
- Create and manage users (players, coaches)
- Create and manage camps
- Assign players and coaches to camps
- Manage daily camp schedules
- Auto-generate secure credentials

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (App Router), React, TypeScript
- **Styling:** Tailwind CSS + Custom Bootstrap-like Components
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Deployment:** Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd tennis-camp-connect
npm install
```

### 2. Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Run the seed data from `seed-data.sql` to create initial admin and coach users
4. Get your project URL and anon key from Settings > API

### 3. Configure Environment Variables

Update `.env.local` with your Supabase credentials:

**Production/Development:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Test/Preview Environment (Optional):**
To use a separate test database for preview/test environments, add these variables:
```env
NEXT_PUBLIC_SUPABASE_URL_TEST=your_test_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY_TEST=your_test_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY_TEST=your_test_service_role_key
```

The application will automatically use test credentials when:
- `VERCEL_ENV=preview` (Vercel preview deployments)
- `NODE_ENV=test` (local test runs)
- `NEXT_PUBLIC_ENV=test` (manually set)

If test credentials are not provided, it falls back to production credentials.

**📖 For detailed test database setup instructions, see [TEST-DATABASE-SETUP.md](./TEST-DATABASE-SETUP.md)**

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👤 Default User Credentials

After running the seed data SQL, you'll have these default users:

**Admin Account:**
- Username: `admin`
- Password: `admin7k4m1` (example - will vary based on random generation)

**Coach Account:**
- Username: `coach`
- Password: `coach3x9p2` (example - will vary based on random generation)

**Note:** Actual passwords are generated with the pattern: `{username}{1 digit}{4 alphanumeric}`

## 🔐 Authentication System

### Username Generation
- Pattern: `{first_letter_of_firstname}{lastname}`
- Example: John Smith → `jsmith`

### Password Generation
- Pattern: `{username}{1 random digit}{4 random alphanumeric}`
- Example: `jsmith3a7k2`
- Passwords are shown only once during user creation

## 📁 Project Structure

```
tennis-camp-connect/
├── app/
│   ├── (auth)/
│   │   └── login/              # Login page
│   ├── home/                   # Home dashboard (all roles)
│   ├── camp/
│   │   └── [id]/              # Camp-specific routes (players)
│   │       ├── tennis/
│   │       ├── schedule/
│   │       ├── stay/
│   │       └── essentials/
│   ├── coach/
│   │   └── players/           # Coach player management
│   ├── admin/
│   │   ├── users/             # User management
│   │   └── camps/             # Camp management
│   └── api/
│       └── auth/
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── layout/                # Layout components (Navbar)
│   ├── schedule/              # Schedule-specific components
│   └── features/              # Feature components
├── lib/
│   ├── supabase/             # Supabase client configuration
│   ├── utils/                # Utility functions
│   └── constants/            # Constants and static data
└── types/                    # TypeScript type definitions
```

## 🎨 Design System

### Color Palette
- Primary (Grapefruit Red): `#FF4C4C`
- Accent (Citrus Yellow): `#FFD633`
- Secondary (Lime Green): `#66B032`
- Orange: `#FF7F2A`
- Royal Blue: `#2563EB`

### Typography
- Headings: Montserrat (700)
- Body: Inter (400, 500, 600)

## 🗃️ Database Schema

### Tables
1. **users** - User profiles with roles
2. **camps** - Camp details
3. **camp_players** - Junction table for camp enrollments
4. **pre_camp_assessments** - Player self-assessments
5. **post_camp_reports** - Coach reports
6. **camp_schedules** - Daily camp schedules

### Row Level Security (RLS)
- Players: Can only view their own data
- Coaches: Can view all players and camps
- Admins: Full access to all tables

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

## 📝 Usage Guide

### Creating a Camp (Admin)

1. Go to Admin > Camp Management
2. Click "Create New Camp"
3. Fill in:
   - Start and end dates
   - Package type
   - Tennis hours (if applicable)
   - Accommodation details (if not tennis-only)
   - Capacity (1-4 players)
   - Assign coach
   - Select players
   - Add daily schedules (optional)
4. Click "Create Camp"

### Player Assessment Flow

1. Player logs in and navigates to Tennis page
2. Clicks "Complete Assessment"
3. Fills out comprehensive questionnaire
4. Submits (can edit later)
5. Coach reviews assessment
6. Coach creates post-camp report after camp

### Coach Workflow

1. View all assigned players
2. Click on a player to see details
3. Review pre-camp assessment
4. After camp, create post-camp report
5. Report is visible to player

## 🔧 Development

### Key Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting
```

### Adding New Features

1. Create types in `/types/index.ts`
2. Add database schema changes in Supabase
3. Update RLS policies as needed
4. Create UI components in `/components`
5. Add pages in `/app` following the routing structure

## 📱 Mobile Responsiveness

The application is fully responsive with:
- Mobile-first design approach
- Hamburger menu for mobile navigation
- Responsive grid system (Bootstrap-like)
- Touch-friendly UI elements
- Optimized for all screen sizes (576px, 768px, 992px, 1200px, 1400px)

## 🔒 Security Features

- Row Level Security (RLS) on all tables
- Role-based access control
- Secure password generation
- Protected API routes
- Session management with Supabase Auth
- Input sanitization and validation

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify Supabase credentials in `.env.local`
   - Check RLS policies are properly set up
   - Ensure users table has matching auth.users entries

2. **Database Connection Issues**
   - Confirm Supabase project is active
   - Check API keys are correct
   - Verify network connectivity

3. **Styling Issues**
   - Clear browser cache
   - Rebuild with `npm run build`
   - Check Tailwind configuration

## 📄 License

This project is for the Tennis Camp Marrakech management system.

## 👥 Support

For support and questions, contact your system administrator.
