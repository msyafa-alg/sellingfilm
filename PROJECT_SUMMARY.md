# Lordarky Course Platform - Complete Documentation

## Project Overview

A complete membership video course platform for programmers built with Next.js, featuring tiered access control and automated payment processing via the "Saya Bayar" QRIS payment gateway API.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database & Auth**: Supabase
- **Payment Gateway**: Saya Bayar API (QRIS)

## Project Structure

```
h/
├── app/                              # Next.js App Router
│   ├── api/
│   │   ├── payment/
│   │   │   └── create-qris/         # QRIS payment generation API
│   │   │       └── route.ts
│   │   └── webhooks/
│   │       └── sayabayar/           # Payment webhook handler
│   │           └── route.ts
│   ├── checkout/
│   │   └── [tierId]/                # Checkout page with QRIS
│   │       └── page.tsx
│   ├── course/
│   │   └── [tierId]/                # Video course room
│   │       └── page.tsx
│   ├── dashboard/                   # User dashboard
│   │   └── page.tsx
│   ├── login/                       # Login page
│   │   └── page.tsx
│   ├── logout/                      # Logout handler
│   │   ├── page.tsx
│   │   └── route.ts
│   ├── payment/
│   │   └── success/                 # Payment success page
│   │       └── page.tsx
│   ├── signup/                      # Signup page
│   │   └── page.tsx
│   ├── layout.tsx                   # Root layout with Navbar
│   ├── page.tsx                     # Landing page
│   └── globals.css                  # Global styles
├── components/
│   ├── Navbar.tsx                   # Navigation header
│   ├── HeroSection.tsx              # Hero banner
│   ├── FeaturesSection.tsx          # Features grid
│   └── PricingSection.tsx           # Pricing cards
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser client
│   │   ├── server.ts                # Server client
│   │   ├── hooks.ts                 # React hooks
│   │   ├── auth.ts                  # Auth guards
│   │   ├── actions.ts               # Auth actions
│   │   ├── db-actions.ts            # Database operations
│   │   └── profile-actions.ts       # Profile management
│   └── saya-bayar/
│       └── client.ts                # Payment gateway client
├── sql/
│   ├── schema.sql                   # Database schema + RLS
│   └── seed.sql                     # Initial data
├── types/
│   ├── supabase.ts                  # Database types
│   └── models.ts                    # Model types
├── middleware.ts                    # Auth protection
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── README.md
└── .env.local.example
```

## Database Schema

### Tables

**profiles**
- id (uuid, PK, FK → auth.users.id)
- full_name (text)
- email (text)
- created_at (timestamptz)

**tiers**
- id (uuid, PK)
- name (text)
- price (integer)
- description (text)
- telegram_group_url (text)
- created_at (timestamptz)

**subscriptions**
- id (uuid, PK)
- user_id (uuid, FK → profiles.id)
- tier_id (uuid, FK → tiers.id)
- status (text: 'active', 'expired')
- expires_at (timestamptz)
- created_at (timestamptz)

**invoices**
- id (uuid, PK)
- saya_bayar_id (text, unique)
- invoice_number (text)
- user_id (uuid, FK → profiles.id)
- tier_id (uuid, FK → tiers.id)
- amount (integer)
- status (text: 'pending', 'paid', 'expired', 'cancelled')
- qris_string (text)
- payment_url (text)
- created_at (timestamptz)

### Row Level Security (RLS)

- Users can read own profiles, invoices, and subscriptions
- Users can update own profiles
- Tiers are publicly readable
- Service role has full access for webhook operations

## Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

SAYA_BAYAR_API_KEY=sk_live_xxxx
SAYA_BAYAR_WEBHOOK_SECRET=whsec_xxxx

NEXT_PUBLIC_BASE_URL=https://lordarky.syafapnl.biz.id
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase database:**
   - Run `sql/schema.sql` in Supabase SQL editor
   - Run `sql/seed.sql` to create initial tiers

3. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Configure Saya Bayar Webhook:**
   - Set webhook URL to: `https://lordarky.syafapnl.biz.id/api/webhooks/sayabayar`
   - Ensure webhook secret matches `.env.local`

5. **Run development server:**
   ```bash
   npm run dev
   ```

## Key Features

### Authentication
- Email/password login/signup via Supabase Auth
- Protected routes via middleware
- Session management

### Payment Flow
1. User clicks "Beli Sekarang" on pricing page
2. Redirects to `/checkout/[tierId]`
3. Checkout page calls `/api/payment/create-qris`
4. Saya Bayar API creates invoice and returns QRIS
5. User scans QR code to pay
6. Webhook receives `invoice.paid` event
7. Subscription activated automatically

### RLS Policies
- Users only see their own data
- Tier access controlled by active subscription
- Automatic subscription provisioning on payment

## API Endpoints

### `/api/payment/create-qris` (POST)
Creates a new invoice and returns QRIS data.

**Request:**
```json
{
  "tierId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoice_id": "...",
    "invoice_number": "...",
    "amount": 150000,
    "qris_string": "...",
    "payment_url": "...",
    "expires_at": "2026-08-11T..."
  }
}
```

### `/api/webhooks/sayabayar` (POST)
Handles payment notifications from Saya Bayar.

**Headers:**
- `X-Webhook-Signature`: HMAC-SHA256 signature

**Body:**
```json
{
  "event": "invoice.paid",
  "data": { ... }
}
```

**Response:**
```json
{
  "success": true
}
```

## Payment Flow Details

### Saya Bayar API Request
```json
{
  "customer_name": "User Full Name",
  "customer_email": "user@example.com",
  "amount": 150000,
  "description": "Pembelian Tier Basic Tier - lordarky.syafapnl.biz.id",
  "channel_preference": "client",
  "payment_method": "qris",
  "redirect_url": "https://lordarky.syafapnl.biz.id/payment/success?invoice_id={invoice_id}"
}
```

### Webhook Payload Format
```json
{
  "event": "invoice.paid",
  "data": {
    "id": "invoice_uuid",
    "invoice_number": "INV-001",
    "amount": 150000,
    "status": "paid",
    ...
  }
}
```

## Subscription Management

- **Active Status**: User has access to course content and Telegram group
- **Expiration**: 1 year from payment date
- **Auto-renewal**: Not implemented (users must repurchase)

## Security Features

- RLS policies protect all user data
- HMAC-SHA256 webhook signature verification
- Server-side session management
- Protected API routes

## Future Enhancements

- Stripe/PayPal payment gateway
- Subscription auto-renewal
- Promo codes/discounts
- Certificate of completion
- Course progress tracking
- Discussion forums
