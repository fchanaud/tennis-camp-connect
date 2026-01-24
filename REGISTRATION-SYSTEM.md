# Tennis Camp Registration System

This document describes the registration system for tennis camps, which allows unauthenticated users to register for camps.

## Overview

The registration system consists of:
1. **Registration Form** - Collects player information and preferences
2. **Payment Page** - Handles Stripe and Revolut payments
3. **Confirmation Page** - Shows registration status
4. **Waitlist Page** - Shown when camp is full

## Database Setup

### 1. Run the Migration Script

Execute the SQL migration script to create the necessary tables:

```bash
# In Supabase SQL Editor, run:
scripts/create-registration-tables.sql
```

This will create:
- `registrations` table - Stores registration information
- `registration_options` table - Stores optional activities selected
- `payments` table - Tracks payment transactions
- Adds `max_players` field to `camps` table (defaults to 7)

### 2. Update Existing Camps

After running the migration, update existing camps to set `max_players`:

```sql
UPDATE camps SET max_players = 7 WHERE max_players IS NULL;
```

## Stripe Setup

### 1. Install Stripe SDK

```bash
npm install stripe @stripe/stripe-js
```

### 2. Environment Variables

Add the following to your `.env.local`:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL (for Stripe redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

### 3. Stripe Webhook Configuration

See **[docs/STRIPE-WEBHOOK-SETUP.md](docs/STRIPE-WEBHOOK-SETUP.md)** for:

- Whether you need the webhook (yes in production)
- How to add the endpoint in Stripe Dashboard
- How to use **Stripe CLI** for local dev (`stripe listen --forward-to localhost:3000/api/stripe/webhook`)
- Fallback: the confirmation page calls `/api/stripe/verify-session` when it has a `session_id`, so you can test without the webhook in dev

## Required Files

### Public Folder Assets

Place the following file in the `public/` folder:

1. **Flight Recommendation** (`/public/flight-recommendation.png`)
   - Image showing recommended flights
   - Displayed on confirmation page

**Note:** Revolut payments use the Revolut.me link: `https://revolut.me/frankydch` (no QR code needed)

## Registration Flow

### 1. Registration Form (`/register/[campId]`)

- Checks if camp is full (7 confirmed registrations)
- If full, redirects to waitlist page
- Collects:
  - Name, email, WhatsApp number
  - Tennis experience (years)
  - Play frequency per month
  - Bedroom type (shared/private)
  - Optional activities (checkboxes)
  - Cancellation policy acceptance (mandatory)

- **Level Check**: If player has 1-2 years experience OR plays 1 time/month:
  - Shows warning message
  - Still allows registration but recommends contacting Ace Away Travel

### 2. Payment Page (`/register/[campId]/payment`)

- Shows price breakdown:
  - Base camp (shared bedroom): £600
  - Private double bedroom: £690 (£600 + £90 upgrade, if selected)
  - Optional activities: £25–45 each (itemized)
  - Total (camp + options)

- Payment options:
  - **Stripe**: Credit/debit card (redirects to Stripe Checkout)
  - **Revolut**: Shows QR code, manual verification button

- Payment type:
  - Deposit only: £250
  - Full payment: Total amount

### 3. Confirmation Page (`/register/[campId]/confirmation`)

- **Stripe**: Shows "Registration Confirmed" (payment successful)
- **Revolut**: Shows "Registration Pending Confirmation" (awaiting manual verification)
- Displays flight recommendation image
- Instructions to send flight confirmation

### 4. Waitlist Page (`/register/[campId]/waitlist`)

- Shown when camp is full (7 confirmed registrations)
- Mentions upcoming camps in May and June
- Contact information for Ace Away Travel

## API Routes

### `GET /api/register/[campId]/check-availability`
Checks if camp has available spots.

**Response:**
```json
{
  "isFull": false,
  "availableSpots": 5,
  "confirmedCount": 2,
  "maxPlayers": 7
}
```

### `POST /api/register/[campId]`
Creates a new registration.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "whatsapp_number": "+44 123 456 7890",
  "tennis_experience_years": "3-5 years",
  "play_frequency_per_month": "2-3 times",
  "bedroom_type": "shared",
  "accepted_cancellation_policy": true,
  "optional_activities": ["hammam_massage", "medina_tour"]
}
```

### `POST /api/register/[campId]/payment`
Creates payment intent/session.

**Request Body:**
```json
{
  "registration_id": "uuid",
  "payment_method": "stripe" | "revolut",
  "payment_type": "deposit" | "full"
}
```

**Response (Stripe):**
```json
{
  "session_id": "cs_...",
  "url": "https://checkout.stripe.com/...",
  "payment_id": "uuid"
}
```

**Response (Revolut):**
```json
{
  "payment_id": "uuid",
  "requires_manual_verification": true
}
```

### `POST /api/register/[campId]/verify-revolut`
Marks Revolut payment as submitted (awaiting admin verification).

**Request Body:**
```json
{
  "payment_id": "uuid"
}
```

### `GET /api/register/[campId]/[registrationId]`
Gets registration details with options and payments.

### `POST /api/stripe/webhook`
Stripe webhook handler (updates payment and registration status on successful payment).

## Registration Statuses

- `pending` - Registration created, no payment yet
- `awaiting_manual_verification` - Revolut payment submitted, waiting for admin confirmation
- `confirmed` - Payment completed, registration confirmed
- `cancelled` - Registration cancelled

## Payment Statuses

- `pending` - Payment initiated
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

## Optional Activities

Available options with prices:
- `hammam_massage` - £45
- `massage` - £40
- `hammam` - £25
- `medina_tour` - £30
- `friday_dinner` - £30

## Camp Capacity

- Default `max_players`: 7
- Camp is considered full when 7 registrations have `status = 'confirmed'`
- When full, registration form redirects to waitlist page

## Admin Actions

Admins can manually verify Revolut payments by:
1. Checking `payments` table for `payment_method = 'revolut'` and `status = 'completed'`
2. Verifying payment in Revolut account
3. Updating registration `status` from `awaiting_manual_verification` to `confirmed`

## Testing

### Test Registration Flow

1. Navigate to `/register/[campId]` (replace with actual camp ID)
2. Fill out registration form
3. Submit form
4. On payment page, select payment method
5. For Stripe: Use test card `4242 4242 4242 4242`
6. For Revolut: Click "I've paid via Revolut" button
7. Check confirmation page

### Test Waitlist

1. Create 7 confirmed registrations for a camp
2. Try to register again
3. Should redirect to waitlist page

## Notes

- Registration links should be shared publicly (no authentication required)
- All registration data is stored in database
- Payments are tracked separately
- Stripe webhook must be configured for automatic confirmation
- Revolut payments require manual admin verification
