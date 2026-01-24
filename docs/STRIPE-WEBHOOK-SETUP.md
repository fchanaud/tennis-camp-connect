# Stripe Webhook Setup

## Do You Need the Webhook?

**Yes, for production.** Here's why:

| What happens | Without webhook | With webhook |
|--------------|-----------------|--------------|
| User pays via Stripe | Redirected to confirmation page ✓ | Same ✓ |
| Payment status in DB | Stays `pending` ✗ | Updated to `completed` ✓ |
| Registration status in DB | Stays `pending` ✗ | Updated to `confirmed` ✓ |
| User closes browser before confirmation loads | DB never updated ✗ | Stripe still notifies you → DB updated ✓ |

The webhook is Stripe calling **your server** when a payment succeeds. That’s what updates `payments.status` and `registrations.status` in your database. The redirect to the confirmation page alone does not run your backend.

**Summary:** Use the webhook so payments are always reflected correctly in your DB, even if the user never reaches the confirmation page.

---

## 1. Stripe Dashboard (Production)

### Create the webhook endpoint

1. Open [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks).
2. **Add endpoint**
3. **Endpoint URL:**
   - Production: `https://your-domain.com/api/stripe/webhook`
   - Example: `https://tennis-camp-connect.vercel.app/api/stripe/webhook`
4. **Events to send:** choose **“Select events”** and add:
   - `checkout.session.completed`
5. **Add endpoint**

### Get the signing secret

1. Open your new webhook.
2. **Reveal** “Signing secret” (starts with `whsec_`).
3. Put it in your env:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

Use the **live** secret for production (`whsec_...`) and the **test** one for test mode.

---

## 2. Local Development: Stripe CLI

Stripe can’t call `http://localhost` directly. Use the Stripe CLI to forward webhooks to your app.

### Install Stripe CLI (project-local, no Homebrew)

From the project root:

```bash
npm run stripe:install
```

This downloads the Stripe CLI into `./bin/stripe` (arm64 and x86_64 supported).

**Other options:** [Stripe CLI install guide](https://stripe.com/docs/stripe-cli#install) (Homebrew, Scoop, etc.)

### Login (one-time)

```bash
npm run stripe:login
```

### Forward webhooks to your app

1. Start your app: `npm run dev`
2. In another terminal:

```bash
npm run stripe:listen
```

Example output:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxx
```

### Use that secret locally

In `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
```

(Use the `whsec_...` from `stripe listen`, **not** the one from the Dashboard.)

### Test a payment

1. `stripe listen` running
2. App running with `STRIPE_WEBHOOK_SECRET` from `stripe listen`
3. Go through checkout with a [Stripe test card](https://stripe.com/docs/testing#cards), e.g. `4242 4242 4242 4242`
4. The CLI will show the `checkout.session.completed` event and your endpoint’s response.

---

## 3. Env checklist

```env
# Required for Stripe
STRIPE_SECRET_KEY=sk_test_...          # or sk_live_... in production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...        # from Dashboard (prod) or `stripe listen` (local)

# For redirect URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000   # or your production URL
```

---

## 4. Vercel (or similar) and production

1. In your host’s env (e.g. Vercel):
   - `STRIPE_WEBHOOK_SECRET` = the **production** `whsec_...` from the Dashboard (test or live, depending on which Stripe mode you use).
2. In Stripe, the webhook URL must be your **real** domain, e.g.  
   `https://your-app.vercel.app/api/stripe/webhook`.

---

## 5. Fallback: verify-session (dev without webhook)

When the confirmation page loads with a `session_id`, it calls `POST /api/stripe/verify-session` with `{ session_id }`. That route:

- Fetches the Checkout Session from Stripe
- If `payment_status === 'paid'`, updates `payments` and `registrations` in the DB

So you can **test Stripe without the webhook** (no `stripe listen`):

1. Run the app and complete a test payment
2. After redirect to the confirmation page, the verify-session call runs and updates the DB

Caveats:

- If the user never reaches the confirmation page (closes the tab, network error, etc.), the DB is not updated. The webhook avoids that.
- In production, **rely on the webhook** as the main source of truth. The confirmation-page call is only a fallback.

---

## 6. Troubleshooting

| Symptom | What to check |
|--------|----------------|
| `Invalid signature` | `STRIPE_WEBHOOK_SECRET` matches the environment (Dashboard vs `stripe listen`). |
| `Payment not found` | `stripe_session_id` in `payments` matches `session.id` from the event. |
| Webhook not called locally | `stripe listen --forward-to localhost:3000/api/stripe/webhook` is running and URL is correct. |
| 404 on `/api/stripe/webhook` | Route file exists at `app/api/stripe/webhook/route.ts` and the app was rebuilt. |

---

## References

- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Checkout Session `checkout.session.completed`](https://stripe.com/docs/api/events/types#event_types-checkout.session.completed)
