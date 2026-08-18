# Липко — Next.js + Stripe

The Липко storefront rebuilt as a real e-commerce app: **Next.js (App Router, TypeScript)** with **Stripe Checkout** for payments. This replaces the static `toybox-store/` prototype.

## What's here

```
app/
  layout.tsx                 Global shell: Nav, Footer, cart provider, toaster
  page.tsx                   Home + shop (hero, collection, craft, newsletter)
  product/[id]/page.tsx      Product detail (statically generated per product)
  cart/page.tsx              Cart / basket
  checkout/success/page.tsx  Post-payment thank-you (clears the cart)
  checkout/cancel/page.tsx   Payment cancelled
  api/checkout/route.ts      Creates the Stripe Checkout Session (server-side)
  globals.css                The design system (ported 1:1 from the prototype)
components/                  Nav, Footer, Shop, ProductCard, ProductActions, CartView, Newsletter, Toaster
lib/
  products.ts                Product catalog + helpers (type-safe)
  cart.tsx                   Cart context, persisted to localStorage
  money.ts                   Formatting helpers
```

## Run it locally

```bash
npm install
cp .env.local.example .env.local   # then paste your Stripe test keys
npm run dev
```

Open http://localhost:3000.

## Stripe setup

1. Create a free account at [stripe.com](https://stripe.com) and stay in **Test mode**.
2. Copy your **Secret key** (`sk_test_…`) from the [API keys page](https://dashboard.stripe.com/test/apikeys).
3. Put it in `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```
4. Restart `npm run dev`.

Now "Checkout" on the cart page redirects to Stripe's hosted checkout. Use test card **4242 4242 4242 4242**, any future expiry, any CVC, any postcode. On success you land back on `/checkout/success` and the cart empties.

Prices are always read from `lib/products.ts` **on the server** when building the Checkout Session — the browser never dictates the amount charged, so totals can't be tampered with.

## Database

Orders are stored in a real database via **Prisma**. Local dev uses **SQLite** (zero
setup — a `prisma/dev.db` file). Schema is in [`prisma/schema.prisma`](prisma/schema.prisma)
(`Order` + `OrderItem`).

```bash
npx prisma generate     # create the typed client (runs on install too)
npx prisma db push      # create/update the database from the schema
npx prisma studio       # optional: browse the data in a GUI
```

To move to **Postgres** for production, change the datasource `provider` to
`"postgresql"` in `schema.prisma`, set `DATABASE_URL` to your hosted connection string
(Supabase, Neon, RDS…), and run `npx prisma migrate deploy`. No app code changes.

## Orders & webhook

When a payment completes, Stripe calls `POST /api/webhook`. The handler verifies the
request signature, pulls the line items, and saves the order to the database
(`lib/orders.ts`).

### Where orders show up

- **Customers** land on `/order/{stripe_session_id}` right after paying (linked from the
  success page). The session id is a long, unguessable token, so it works like a private
  link only the buyer has.
- **Returning customers** can look one up at `/orders` with their **order number + email**
  (both required — the email confirms ownership).
- **You** manage everything in the admin panel (see below).

## Admin panel

The full back office lives at **`/admin`** (log in at `/admin/login`).

Set a password in `.env.local`:

```
ADMIN_PASSWORD=your-strong-password
ADMIN_SESSION_SECRET=any-long-random-string
```

Then open `/admin` and log in. Sections:

- **Табло (Dashboard)** — revenue, this-month revenue, average order, orders awaiting
  fulfillment, recent orders, low-stock alerts, best sellers.
- **Поръчки (Orders)** — every order; open one to update its **fulfillment status**
  (Обработва се → Изпратена → Доставена …) and add a tracking number.
- **Продукти (Products)** — full CRUD: create, edit, delete; set price, **stock**,
  category, tag, description, active/hidden. Stock is decremented automatically on each
  paid order, and the storefront reflects changes immediately.
- **Клиенти (Customers)** — everyone who's ordered, with order count and total spent.
- **Настройки (Settings)** — store name, free-shipping threshold, shipping rate (these
  drive both the storefront and Stripe checkout).

Auth is a signed, httpOnly session cookie. All `/admin/*` pages redirect to the login
when not authenticated.

### Test the webhook locally

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and `stripe login`.
2. In a second terminal, forward events to your dev server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
3. Copy the `whsec_…` secret it prints into `.env.local` as `STRIPE_WEBHOOK_SECRET`.
   Restart `npm run dev`.
4. Buy something with test card `4242 4242 4242 4242`. The order appears in
   **Поръчки** and stock is decremented.

The `/api/webhook` route verifies the Stripe signature, so it rejects any request that
isn't genuinely from Stripe. The order write is **idempotent** — Stripe may deliver an
event more than once, and a duplicate id is ignored.

## Notes / next steps

- **Production database**: SQLite is a local file — switch the datasource to Postgres
  before deploying to a serverless host (see the Database section above).
- **Customer accounts**: `/orders` is a guest lookup (order number + email). A real
  "my account / order history" page needs auth (NextAuth, Clerk) — a natural next step.
- **Admin auth**: a single shared password. For multiple staff / audit logs, upgrade to
  a real auth provider (NextAuth, Clerk) later — the `requireAdmin()` gate stays.
- **Catalog** lives in the database and is managed from **Admin → Продукти**.
- **Going live**: switch to live Stripe keys, register the webhook endpoint in the Stripe
  Dashboard, set `NEXT_PUBLIC_BASE_URL` to your real domain, point `DATABASE_URL` at your
  Postgres, and deploy (Vercel is the one-click path for Next.js).
