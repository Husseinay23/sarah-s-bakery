# Sarah's Bakery — Site Feature Inventory

*What exists today, what doesn't, and how key systems work. Last updated after the cleanup pass.*

---

## Quick summary

Sarah's Bakery is a single-page ordering site. Customers build a Mini Box and/or packages, add everything to a cart, fill in delivery details, and send the order to Sarah on WhatsApp. Sarah manages the menu, images, and settings from `/admin`.

**Stack:** Next.js 15 · Tailwind CSS · Firebase (Firestore, Auth, Storage) · Framer Motion

---

## Public site — implemented

### Navigation & layout

| Feature | Status | Details |
|---------|--------|---------|
| Sticky site nav | ✅ | Links to Mini Box, Flavors, Order, Contact |
| Scroll progress indicator | ✅ | Spiral icon tracks scroll position |
| Mobile nav menu | ✅ | Collapsible menu on small screens |
| Announcement bar | ✅ | Toggle + text from Firestore `settings/general` |

### Homepage sections (top to bottom)

| Section | Status | Details |
|---------|--------|---------|
| **Hero** | ✅ | Headline, tagline, CTAs, logo (or emoji fallback), hero image, mini box price badge (from Firestore) |
| **How it works** | ✅ | 3-step explainer |
| **Featured flavor spotlight** | ✅ | Admin picks featured flavor; image, description, Mini Box / Package CTAs |
| **Flavor grid** | ✅ | All active flavors (except featured); price, description, Mini Box / Package buttons |
| **Mini Box builder** (`#mini-box`) | ✅ | 12-slot grid, tap flavor to add, tap slot to remove, flying roll animation, "Surprise me" auto-fill, add to cart |
| **Package builder** (`#order`) | ✅ | Tier picker (1, 4, 6, 9, 12, 24 pieces), slot grid, live pricing, add to cart |
| **Contact section** | ✅ | Delivery info, pre-order note, WhatsApp CTA |
| **Footer** | ✅ | Nav links + social URLs from settings |

### Ordering flow

| Feature | Status | Details |
|---------|--------|---------|
| **Cart** | ✅ | Persists in `localStorage`; supports multiple mini boxes and packages |
| **Cart drawer** | ✅ | Two-step checkout: review items → customer details |
| **Customer form** | ✅ | Name, phone, address, preferred delivery date, optional notes |
| **Gift orders** | ✅ | Toggle for gift; recipient name + message fields |
| **WhatsApp send** | ✅ | Opens WhatsApp with formatted order message |
| **Order logging** | ✅ | Writes to Firestore `orders` collection on send |
| **Reorder last order** | ✅ | Restores previous order by phone number (`localStorage`) |
| **Mobile order bar** | ✅ | Sticky bar showing cart count on mobile |
| **Floating WhatsApp button** | ✅ | Quick access on mobile |

### Builder interactions

| Feature | Status | Details |
|---------|--------|---------|
| Navigate from flavor grid → builder | ✅ | Scrolls to Mini Box or Package section and highlights the flavor |
| Package tier hint from flavor grid | ✅ | Pre-selects 12-piece tier when coming from a flavor card |
| Slot grid visual (box + compartments) | ✅ | Shared between Mini Box and Package builders |
| Delivery charge in cart | ✅ | Calculated per item; free delivery rules applied |

---

## Public site — not implemented

| Feature | Notes |
|---------|-------|
| Online payment (Stripe, etc.) | Orders go to WhatsApp only |
| Order confirmation page | Cart clears after WhatsApp send; no thank-you page |
| Email / SMS notifications | Not built |
| Customer accounts / login | Only admin auth exists |
| Inventory / stock tracking | Not built |
| Analytics dashboard | Firebase `measurementId` in config; no Analytics SDK wired |
| Multi-language | English only |
| SEO blog / CMS pages | Single-page site only |

---

## Admin panel (`/admin`) — implemented

**Access:** Firebase Auth + email allowlist (`NEXT_PUBLIC_ADMIN_EMAILS`). Hidden from public nav; blocked in `robots.txt`.

### Dashboard tabs

| Tab | Status | What you can do |
|-----|--------|-----------------|
| **Flavors** | ✅ | Add, edit, delete, reorder products; set name, price, description, classic flag, active status; upload photo or use site default |
| **Package prices** | ✅ | Edit classic/other prices and free-delivery flag per tier (1, 4, 6, 9, 12, 24 pieces) |
| **Settings & Mini Box** | ✅ | Announcements, featured flavor, store copy, WhatsApp number, delivery charge, social links, logo, hero image, mini box name/price/eligible flavors |
| **Orders** | ✅ | Live order feed; mark orders as reviewed |

### Admin capabilities detail

| Capability | Status |
|------------|--------|
| Flavor CRUD | ✅ |
| Flavor photo upload (Firebase Storage) | ✅ |
| Flavor reorder (sort order) | ✅ |
| Delete flavor (cleans up mini box + featured flavor refs) | ✅ |
| Edit package tier prices | ✅ |
| Upload logo / hero image | ✅ |
| Toggle announcement bar | ✅ |
| Configure mini box eligible flavors | ✅ |
| View logged WhatsApp orders | ✅ |

---

## Admin — not implemented

| Feature | Notes |
|---------|-------|
| Add / remove package tiers | Only existing tiers are editable |
| Bulk import / export menu | Not built |
| Seed / sync buttons | Removed — menu is managed manually in admin |
| Analytics / revenue reports | Not built |
| Customer database / CRM | Not built |

---

## Firebase integration

| Service | Usage |
|---------|--------|
| **Firestore** | `flavors`, `packageTiers`, `miniBox/config`, `settings/general`, `orders` |
| **Auth** | Admin email/password login |
| **Storage** | Admin uploads: flavor photos, logo, hero image |
| **Security rules** | Public read on menu data; auth write for admin; anyone can create orders; only auth can read/update orders |

### Firestore collections

```
flavors/{id}          name, slug, description, pricePerPiece, isClassic, imageUrl, active, sortOrder
packageTiers/{id}     pieceCount, classicPrice, otherFlavorPrice, freeDelivery
miniBox/config        name, totalPieces, price, freeDelivery, eligibleFlavorIds[]
settings/general      store copy, WhatsApp, delivery, announcements, featuredFlavorId, heroImageUrl, logoUrl, socials
orders/{id}           type, items, total, customer fields, message, status, createdAt
```

---

## Images — how they work

Design images live in `public/` and are used automatically when the admin hasn't uploaded a replacement.

### Bundled assets (`public/`)

| File | Used for |
|------|----------|
| `CR/CR_Classic.jpeg` | Classic Cinnamon |
| `CR/CR_Tiramissu.jpeg` | Tiramisu |
| `CR/CR_Caramel_Pecan.jpeg` | Caramel Pecan |
| `CR/CR_Lotus.jpeg` | Lotus |
| `CR/CR_Oreo.jpeg` | Oreo |
| `CR/CR_Hot_Choco.jpeg` | Hot Chocolate |
| `CR/CR_Apple_Pie.jpeg` | Apple Pie |
| `mini-box.jpeg` | Hero banner default |

Mapping is defined in `lib/localImages.ts`.

### Resolution order (flavor photos)

1. **Admin upload** — Firebase Storage URL stored in `flavor.imageUrl`
2. **Site default** — matching file from `public/CR/` by flavor ID
3. **Placeholder** — 🥐 emoji (no stock photos)

### Hero image

1. `settings.heroImageUrl` from admin (upload or URL)
2. Falls back to `public/mini-box.jpeg`

---

## Environment variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_WHATSAPP_NUMBER=96178904118
NEXT_PUBLIC_ADMIN_EMAILS=husseinay032@gmail.com,sarahosseili@outlook.com
```

---

## Key file map

```
app/
  page.tsx                    Homepage (all public sections)
  admin/
    page.tsx                  Admin login
    dashboard/page.tsx        Admin dashboard (4 tabs)

components/
  Hero.tsx                    Hero section
  FlavorGrid.tsx              Flavor menu grid
  FeaturedFlavorSpotlight.tsx Featured flavor
  MiniBoxBuilder/             Mini Box slot-grid builder
  OrderBuilder/               Package builder + shared slot UI
  Cart/                       Cart drawer, form, mobile bar
  FlavorImage.tsx             Shared image component (admin upload → public default → placeholder)

admin/components/
  FlavorEditor.tsx            Flavor CRUD
  TierEditor.tsx              Package tier prices
  SettingsEditor.tsx          Store settings + mini box config
  OrderLogPanel.tsx           Order log

lib/
  cart/CartProvider.tsx       Cart state + localStorage
  builder/BuilderContext.tsx  Flavor → builder navigation
  flavorMeta.ts               Descriptions + image resolution
  localImages.ts              public/ image paths
  buildWhatsAppMessage.ts     WhatsApp message formatting
  logOrder.ts                 Firestore order logging
  useFlavors.ts               Real-time flavor hook
  useSiteData.ts              Settings + mini box hooks
```

---

## Commands

```bash
npm run dev      # Local dev server
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint
```

Deploy Firebase rules:

```bash
firebase deploy --only firestore:rules,storage
```

---

## Related docs

- `sarahs-bakery-build-spec.md` — Original design and build specification
- `README.md` — Setup and development guide
