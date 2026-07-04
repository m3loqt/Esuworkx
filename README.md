# ESUWORX

Storefront + admin panel for ESUWORX, an independent art toy studio. Public site
displays works and shop items; checkout is manual (QR payment + proof-of-payment
upload); a password-protected admin panel manages products and orders.

See `project-spec.md` for the full product spec.

## Stack

- Next.js (App Router, TypeScript)
- Neon (serverless Postgres) + Drizzle ORM
- Netlify Blobs (product images, payment-proof screenshots)
- Resend (admin email notifications)
- Netlify Hosting

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

   - `DATABASE_URL` — Neon connection string.
   - `RESEND_API_KEY`, `ADMIN_EMAIL` — used for new-order notification emails.
   - `ADMIN_PASSWORD_HASH` — base64-encoded bcrypt hash of the admin password. Generate one with:
     ```bash
     node -e "console.log(Buffer.from(require('bcryptjs').hashSync('your-password', 10)).toString('base64'))"
     ```
     (Base64-encoded because Netlify's env var system expands `$VAR`-style references
     inside values, which silently mangles a raw bcrypt hash — it's made of `$`-delimited
     segments like `$2b$10$...` that look like variable references.)
   - `SESSION_SECRET` — any long random string, used to sign the admin session cookie.
   - `NETLIFY_BLOBS_SITE_ID` — only needed if running outside the Netlify build/runtime.

3. Push the Drizzle schema to your database:

   ```bash
   npm run db:push
   ```

4. (Optional) Seed some starter products:

   ```bash
   npm run db:seed
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

   Visit http://localhost:3000.

   Any feature touching Netlify Blobs (checkout's proof-of-payment upload,
   admin product images) needs real Blobs credentials, which plain `next dev`
   doesn't have. Use the Netlify CLI instead so those work locally:

   ```bash
   npm install -g netlify-cli
   netlify login          # one-time
   netlify sites:create   # one-time, links this folder to a Netlify site
   netlify dev            # serves the app at http://localhost:8888 with Blobs working
   ```

   Note: env var changes to `.env`/`.env.local` require restarting the dev
   server (`next dev` or `netlify dev`) — it's only read once at startup.

## Other scripts

- `npm run build` / `npm run start` — production build and run.
- `npm run lint` — ESLint.
- `npm run db:studio` — Drizzle Studio (browse/edit DB data in the browser).
- `npm run db:seed` — inserts a handful of starter works/shop products (skips slugs that already exist).

## Netlify deploy notes

- Connect the repo in Netlify and use the Next.js Runtime (auto-detected) — no
  custom build settings needed beyond `npm run build`.
- Set all variables from `.env.example` in Site settings → Environment variables.
- Netlify Blobs are auto-provisioned per-site at deploy time; `NETLIFY_BLOBS_SITE_ID`
  only needs to be set manually for local development against a real store.
