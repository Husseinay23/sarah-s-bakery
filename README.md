# Sarah's Bakery

Cinnamon roll ordering site for Sarah's Bakery (Lebanon). Customers build orders on the site and send them via WhatsApp. Sarah manages menu, images, and reviews logged orders from `/admin`.

## Stack

- Next.js 15 (App Router)
- Tailwind CSS
- Firebase (Firestore, Auth, Storage)
- Framer Motion

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Environment variables

Copy `.env.example` to `.env` and fill in your Firebase config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_WHATSAPP_NUMBER=96178904118
NEXT_PUBLIC_ADMIN_EMAILS=you@example.com,owner@example.com
```

## Firebase setup (one-time)

### 1. Create admin users

In [Firebase Console → Authentication](https://console.firebase.google.com/project/sarah-s-bakery/authentication/users), create email/password accounts for:

- `husseinay032@gmail.com`
- `sarahosseili@outlook.com`

### 2. Deploy security rules

```bash
npx -y firebase-tools@latest login
npx -y firebase-tools@latest use sarah-s-bakery
npx -y firebase-tools@latest deploy --only firestore:rules,storage
```

### 3. Seed menu data

1. Sign in at `/admin`
2. Click **Seed menu data (first-time setup)** on the dashboard

This populates flavors, package tiers, mini box config, and site settings from Sarah's price list.

## Admin panel (`/admin`)

Hidden from the public nav and blocked in `robots.txt`. Sarah can:

- Edit flavors (name, price, photo, active, reorder)
- Edit package tier prices
- Edit mini box price and eligible flavors
- Upload logo, hero banner, flavor photos
- Update WhatsApp number, delivery charge, copy, social links
- Review orders logged when customers tap "Send Order on WhatsApp"

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all `NEXT_PUBLIC_*` env vars from `.env`
4. Deploy
5. Add your custom domain in Vercel settings
6. Add the Vercel domain to Firebase Auth → Authorized domains

## Menu data (seeded)

**Flavors:** Classic Cinnamon ($4), Tiramisu, Caramel Pecan, Lotus, Oreo, Hot Chocolate, Apple Pie ($5 each)

**Mini Box eligible:** Classic, Lotus, Oreo, Caramel Pecan, Apple Pie, Tiramisu (not Hot Chocolate)

**Packages:** 1/4/6/9/12/24 pieces with classic vs other-flavor pricing per Sarah's price list
