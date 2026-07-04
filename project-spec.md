# ESUWORX — Project Spec

A simple storefront + admin panel for an independent art toy studio (ESUWORX). Public site displays works and shop items; checkout is manual (QR payment + proof-of-payment upload); a password-protected admin panel manages products and orders.

## Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Hosting:** Netlify (free tier, commercial use allowed)
- **Database:** Neon (serverless Postgres, free tier, no auto-pause)
- **ORM:** Drizzle ORM
- **File storage:** Netlify Blobs (product images, payment-proof screenshots)
- **Email:** Resend (free tier) — admin notification on new order
- **Auth:** Single-admin password + signed HTTP-only cookie session (no third-party auth provider needed — only one admin user)
- **Styling:** Plain CSS / CSS Modules, matching the existing brutalist-minimal design (see reference HTML below)

## Reference design

A working HTML/CSS/JS mockup exists (attached separately as `gemini-code-*.html`) with the full visual language already defined: color variables, nav, tabs, work cards, shop layout, overlays, buttons, FAQ accordion, footer. **Reuse this design 1:1** — same CSS variables, layout, spacing, interactions — just rebuilt as React components with real data instead of hardcoded placeholder text/images.

Brand colors:
```
--brand_yellow: #FFEA00
--brand_red: #FF1A1A
--bg: #FCFCFA
--ink: #111111
--border: #e8e8e5
--muted: #666666
```

## Data model (Drizzle schema)

```
products
  id            serial primary key
  name          text not null
  slug          text unique not null
  description   text
  price         numeric not null
  images        text[]        -- array of Netlify Blob URLs
  status        text not null default 'available'  -- available | limited | sold_out
  stock_count   integer not null default 1
  category      text not null default 'shop'        -- 'works' | 'shop' (works = portfolio only, no price/purchase)
  created_at    timestamp not null default now()

orders
  id                  serial primary key
  product_id          integer references products(id)
  buyer_name          text not null
  buyer_email         text not null
  buyer_address       text not null
  proof_of_payment_url text not null
  status              text not null default 'pending'  -- pending | confirmed | rejected
  created_at          timestamp not null default now()
```

## Pages / routes

### Public
- `/` — nav (Works / Shop / FAQ / About tabs, same single-page-tab UX as the mockup) OR simple multi-route if easier in Next.js — **use App Router routes** (`/`, `/shop`, `/faq`) instead of JS tab-switching, but preserve the exact visual style
- `/shop/[slug]` — product detail: gallery, price, stock/status badge, "Purchase" → opens checkout
- `/works` — portfolio grid (category = works), each opens a preview overlay/page with inquiry CTA (no purchase — these are inquiry-only per original mockup)
- Checkout flow (can be a modal or a `/shop/[slug]/checkout` page):
  1. Show QR code image + payment instructions
  2. Buyer form: name, email, address
  3. Upload payment proof screenshot (image file → Netlify Blobs)
  4. Submit → creates `orders` row with status `pending`, sends Resend email to admin
  5. Confirmation message to buyer ("We'll verify and confirm your order shortly")

### Admin (all behind auth)
- `/admin/login` — password form → sets signed session cookie
- `/admin` — dashboard: pending orders count, quick links
- `/admin/products` — list, add, edit, delete products (name, price, description, images upload, status, stock)
- `/admin/orders` — list orders, filter by status; each row shows buyer info + payment proof image + Confirm/Reject buttons
  - On **Confirm**: order status → confirmed, linked product `stock_count` decrements by 1 (and status flips to `sold_out` if it hits 0)
  - On **Reject**: order status → rejected, no stock change

## Environment variables

```
DATABASE_URL=            # Neon connection string
RESEND_API_KEY=
ADMIN_EMAIL=              # where order notifications go
ADMIN_PASSWORD=           # plaintext compared server-side, or better: bcrypt hash
SESSION_SECRET=           # random string for signing the admin cookie
NETLIFY_BLOBS_SITE_ID=    # if needed explicitly, else auto-detected on Netlify
```

## Non-goals (explicitly out of scope for MVP)

- No real payment gateway integration (manual QR + proof upload only)
- No multi-admin accounts / roles
- No customer accounts or order history for buyers
- No inventory beyond simple stock_count per product
- No automated buyer-facing "order confirmed" email (can be added later — MVP just needs admin notification)

## Build order (do NOT skip steps or merge them)

1. Scaffold Next.js + TypeScript + folder structure + Drizzle + Neon connection, confirm `db push` works
2. Public pages: Works, Shop listing, Shop detail, FAQ, About — styled per the reference mockup, using seed/mock data first
3. Wire public pages to real DB data (replace mock data)
4. Checkout flow: form + file upload to Netlify Blobs + order creation + Resend email trigger
5. Admin auth (login page + session cookie + middleware protecting `/admin/*`)
6. Admin products CRUD
7. Admin orders view + confirm/reject logic + stock decrement
8. Final pass: responsive check, error states, loading states, empty states