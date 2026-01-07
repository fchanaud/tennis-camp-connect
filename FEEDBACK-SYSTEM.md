# Feedback System Documentation

## Overview
A comprehensive feedback system that allows players to submit feedback for each tennis camp they attend, with the ability to edit their feedback afterward.

## Database Setup

### 1. Create the Feedbacks Table
Run the SQL script in your Supabase SQL Editor:

```bash
scripts/create-feedbacks-table.sql
```

Or manually run:
```sql
-- Feedbacks table for player feedback on tennis camps
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  overall_trip_text TEXT NOT NULL,
  tennis_rating INTEGER NOT NULL CHECK (tennis_rating >= 1 AND tennis_rating <= 5),
  excursions_text TEXT,
  app_experience_text TEXT NOT NULL,
  photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  consent_given BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, camp_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_feedbacks_player_id ON feedbacks(player_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_camp_id ON feedbacks(camp_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_feedbacks_updated_at
  BEFORE UPDATE ON feedbacks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. Storage Bucket Setup
Ensure you have a storage bucket named `uploads` in Supabase Storage. Photos will be stored under `feedbacks/` folder.

## Features Implemented

### Player Features
- **Feedback Form** (`/camp/[id]/feedback`)
  - Overall trip and stay feedback (required, text)
  - Tennis coaching rating (required, 1-5 stars)
  - Excursions feedback (optional, text)
  - App experience feedback (required, text)
  - Photo upload (optional, max 5 photos, ideally showing you on court or with Coach Patrick)
  - Consent checkbox (required)
  - Edit existing feedback
  - Success confirmation

### Admin Features
- **Admin Feedback View** (`/admin/feedback`)
  - View all player feedbacks
  - Filter by player ID or camp ID
  - See all feedback details including photos
  - View consent status

## API Routes

### Player Routes
- `GET /api/feedback/[campId]?userId=[userId]` - Get feedback for a camp
- `POST /api/feedback` - Create new feedback
- `PUT /api/feedback/[id]` - Update existing feedback

### Admin Routes
- `GET /api/admin/feedback?playerId=[id]&campId=[id]` - Get all feedbacks (with filters)

## Navigation
- **Players**: Feedback link added to navigation menu (between Schedule and Essentials)
- **Admins**: Feedback link added to admin navigation menu

## Photo Upload
- Photos are uploaded to Supabase Storage under `uploads/feedbacks/`
- Maximum 3 photos per feedback
- Photos can be previewed and deleted before submission
- Existing photos are preserved when editing feedback

## Form Fields

1. **Overall Trip & Stay** (Required)
   - Text area for detailed feedback about the Marrakech experience

2. **Tennis Coaching Rating** (Required)
   - Interactive 5-star rating system
   - Visual feedback with filled/unfilled stars

3. **Excursions** (Optional)
   - Text area for feedback on organized excursions

4. **App Experience** (Required)
   - Text area for feedback on the Tennis Camp Connect app

5. **Photos** (Optional)
   - Upload up to 5 photos (especially ones of you on the tennis court or with Coach Patrick)
   - Preview before submission
   - Easy delete functionality
   - Click to view full size

6. **Consent** (Required)
   - Checkbox for consent to use feedback and photos on website

## Design Features
- Fully responsive and mobile-first
- Clean, intuitive UI
- Clear validation messages
- Success confirmation after submission
- Smooth photo upload experience
- Star rating component with visual feedback

## Security
- One feedback per player per camp (enforced by UNIQUE constraint)
- Players can only edit their own feedback
- Admin can view all feedbacks
- Photo uploads validated (image files only, max 5MB)

## Next Steps

1. **Run the SQL script** to create the feedbacks table
2. **Test the feedback form** by navigating to `/camp/[campId]/feedback`
3. **Test admin view** by navigating to `/admin/feedback`
4. **Verify photo uploads** work correctly with Supabase Storage

## Notes
- The feedback form automatically loads existing feedback if the player has already submitted one
- The form switches between "Submit" and "Update" modes based on whether feedback exists
- All photos are stored in Supabase Storage and referenced by URL in the database

