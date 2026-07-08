# Sarah's Bakery — Website Build Spec

*Cinnamon rolls, done right. A single-page ordering experience built around the thing that makes this bakery worth driving to.*

---

## 1. Project Overview

**Client:** Sarah's Bakery (Lebanon, home bakery — cinnamon roll specialist)
**Type:** Marketing + interactive ordering site, WhatsApp checkout, admin-editable content
**Language:** English only
**Core user job:** Land on the site, get hungry, build an order (package or Mini Box), send it to Sarah on WhatsApp in under 60 seconds.

The entire site exists to serve one action: **a filled-out WhatsApp message.** Every design and copy decision below is in service of getting someone from "these look amazing" to "sent" with as little friction as possible.

---

## 2. Design System

### 2.1 The thesis

A cinnamon roll is a spiral — dough rolled around filling, again and again, until it's dense with layers. That's the one visual idea this whole site is built around. Not a swirl icon slapped on as decoration — the spiral becomes the actual interaction language: how sections reveal, how the order builder responds, how loading states behave.

### 2.2 Color palette

Pulled directly from Sarah's existing price list — this is *her* palette, not a template default:

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#FCF3EA` | Page background |
| `--blush` | `#F3D6D2` | Section backgrounds, card fills |
| `--rose` | `#E8969B` | Script accents, active states, hearts/dividers |
| `--espresso` | `#3A2318` | Headings, body text |
| `--cinnamon` | `#C68A4E` | Borders, icons, secondary CTA, price tags |
| `--white` | `#FFFFFF` | Card surfaces, contrast pockets |

Deliberately **not** doing the generic AI-bakery look (dark charcoal + single terracotta accent). Sarah's actual brand is soft, warm, feminine, hand-drawn — the palette above leans into that instead of fighting it.

### 2.3 Typography

Two roles, used with restraint:

- **Display / headings — Fraunces** (variable, optical size high, soft rounded serif). This has real warmth without being twee — it reads "bakery" without reading "clip art." Used at large sizes for section titles, tight letter-spacing.
- **Script accent — Caveat** (weight 600). Reserved *only* for 2–3 moments: the "Price List"-style flourish under the hero headline, and small hand-written-feeling labels like "you choose, we make it!" in the Mini Box section. Never for body copy or buttons — a script font used everywhere stops feeling handwritten and starts feeling like a template.
- **Body / UI — Inter**. Everything functional: nav, prices, buttons, form labels. Needs to disappear so the display face and product photography can carry personality.

### 2.4 Layout concept

```
┌─────────────────────────────────────┐
│  HERO                                │
│  Arch marquee: 7 roll cutouts orbit  │
│  on a clipped circle (top arc only)  │
│  Center: logo, headline, tagline,    │
│  mini box cutout + price badge       │
├─────────────────────────────────────┤
│  FLAVORS                             │
│  Floating cutout strip — scattered   │
│  rolls with sticker price tags       │
├─────────────────────────────────────┤
│  MINI BOX BUILDER                    │
│  Slot-grid picker + add to cart      │
├─────────────────────────────────────┤
│  PACKAGE BUILDER                     │
│  Tier picker + slot grid + cart      │
├─────────────────────────────────────┤
│  CONTACT / FOOTER                    │
└─────────────────────────────────────┘
```

Single page, anchor-linked nav. The hero arch marquee replaces the old "single roll macro shot" — rolls parade along the top arc while the mini box cutout anchors the center.

**Hero arch marquee technique:** Position roll images on a full circle whose center sits below the visible container; `overflow: hidden` clips everything except the top arc. Rotate the circle continuously via `requestAnimationFrame` (~0.13°/frame, ~45s per revolution). Edge fade opacity near clip boundaries. Ken Burns scale on orbit images (CSS, staggered delays). See `components/Hero/ArcMarquee.tsx`.

Single page, anchor-linked nav. No reason to fragment this into multiple routes — everything is in service of one conversion action, and a person should never have to "go back" to find the order builder.

### 2.5 The Spiral & The Arc

One rolling motif, expressed in four places:

1. **Scroll progress** — instead of a plain top progress bar, a small cinnamon-roll spiral icon in the nav slowly "rolls up" (rotates + fills in) as the person scrolls down the page. Subtle, top-right, ~32px.
2. **Hero arch marquee** — the hero-specific expression of the same rolling motif. Seven transparent roll cutouts orbit on a clipped circle above the headline; the mini box cutout sits center-stage with a subtle Ken Burns pulse. This is the page's opening "wow" moment without autoplay carousels or parallax.
3. **Section transitions** — flavor cards animate in with a slight rotate-and-settle (like a piece of dough uncurling into place), using Framer Motion on scroll-into-view. Applied once per section, not per-element, so it reads as orchestrated rather than jittery.
4. **Order confirmation moment** — when someone finishes checkout and taps send on WhatsApp, the cart clears after the link opens. (Button spin can be added on the send CTA.)

Everything else on the page stays quiet — real product photography, generous whitespace, no competing motion.

### 2.6 Motion principles

- Respect `prefers-reduced-motion` — spiral effects become simple fades.
- No autoplay carousels. No parallax for parallax's sake.
- Hover on flavor pieces: roll straightens (`rotate(0)`) and lifts (`translateY(-8px)`), ~200ms ease-out; sticker tag scales up slightly (~50ms delayed) so it feels hand-placed, not grid-snapped. No card containers — cutout PNGs float on the cream background with asymmetric sticker tags.

---

## 3. Content Architecture

Single scrolling page, sections in order:

1. **Hero** — logo, headline, script tagline, primary CTA ("Build Your Order" → scrolls to §4)
2. **Our Flavors** — all 7 flavors with photo, name, price/piece
3. **Build Your Order** — the interactive picker (Packages tab + Mini Box tab)
4. **Signature Mini Box spotlight** — larger feature callout, since it's the hero product
5. **Delivery & Pre-Order info** — charge, threshold, pre-order note
6. **Footer** — WhatsApp contact, socials, "Thank you for supporting Sarah's Bakery"

---

## 4. Data Schema (Firestore)

Structured so Sarah can edit everything from the admin panel without touching code.

```
flavors/{flavorId}
  name: string              // "Lotus"
  slug: string              // "lotus"
  pricePerPiece: number     // 5
  isClassic: boolean        // true only for Classic Cinnamon
  imageUrl: string
  active: boolean           // toggles visibility site-wide
  sortOrder: number

packageTiers/{tierId}
  pieceCount: number        // 1 | 4 | 6 | 9 | 12 | 24
  classicPrice: number
  otherFlavorPrice: number
  freeDelivery: boolean      // true for 24-piece tier

miniBox/config              // single document
  name: string               // "Signature Mini Box"
  totalPieces: number        // 12
  price: number              // 20
  freeDelivery: boolean
  eligibleFlavorIds: string[] // which flavors can go in the box

settings/general            // single document
  whatsappNumber: string
  deliveryCharge: number      // 4
  deliveryFreeThreshold: string // "24 pieces or Signature Mini Box"
  storeName: string
  heroImageUrl: string
  logoUrl: string
```

---

## 5. Ordering Flow Logic

### 5.1 Package Builder

1. Person picks a piece count: `1 / 4 / 6 / 9 / 12 / 24`
2. Person picks flavor(s) — if mixing flavors within a package, split the count across flavors with a stepper per flavor, total must equal the selected piece count before "Send Order" enables
3. Live price calc:
   - If **all** selected pieces are Classic Cinnamon → `classicPrice` for that tier
   - If **any** other flavor is included → `otherFlavorPrice` for that tier applies to the whole package (matches Sarah's actual pricing table — mixed packages price at the "other flavors" tier)
4. Free delivery banner auto-appears when `pieceCount === 24`
5. "Send Order on WhatsApp" button — disabled until the count is fully allocated

### 5.2 Mini Box Builder

1. Fixed at 12 pieces, $20, free delivery — no piece-count choice
2. Person taps `+` under each of the 6 eligible flavors (Classic, Lotus, Oreo, Caramel Pecan, Apple Pie, Tiramisu), each capped so total never exceeds 12
3. Running counter: "8 / 12 selected" pinned near the button
4. "Send Order" disables until exactly 12 are allocated

### 5.3 WhatsApp Message Format

Generated client-side, URL-encoded into a `wa.me` link:

```
Hi Sarah! I'd like to order:

[Package] 9 pieces — mixed flavors
- 4x Classic Cinnamon
- 3x Lotus
- 2x Oreo
Total: $40

Delivery: standard ($4 charge applies)
```

or for the Mini Box:

```
Hi Sarah! Signature Mini Box (12 pcs) — $20, free delivery

- 3x Classic Cinnamon
- 2x Lotus
- 2x Oreo
- 2x Caramel Pecan
- 2x Apple Pie
- 1x Tiramisu
```

Message is built from live Firestore data (names + prices), so it never goes stale even if Sarah changes a price.

---

## 6. Admin Panel

Route: `/admin`, protected by Firebase Auth (single user — Sarah).

**Scope, deliberately minimal:**
- Log in / log out
- Edit flavor: name, price, photo, active toggle
- Reorder flavors (drag-and-drop, writes `sortOrder`)
- Edit package tier prices
- Edit Mini Box price/eligible flavors
- Edit delivery charge + WhatsApp number

**Explicitly out of scope** (keeps this maintainable): no order history, no analytics dashboard, no customer accounts. Orders live in WhatsApp — that's the point.

---

## 7. Component Breakdown

```
app/
  page.tsx                    // assembles all sections
  admin/
    page.tsx                  // login gate
    dashboard/page.tsx

components/
  Hero/
    Hero.tsx
    ArcMarquee.tsx
    HeroContent.tsx
  FlavorStrip/
    FlavorStrip.tsx
    FlavorPiece.tsx      // floating cutout + sticker tag (not a card)
  FlavorImage.tsx
  OrderBuilder/
    PackagePicker.tsx
    PackageBuilder.tsx
    SlotGridVisual.tsx
    FlavorSelectorGrid.tsx
    Compartment.tsx
    PriceSummary.tsx
  MiniBoxBuilder/
    MiniBoxBuilder.tsx
    FlyingRoll.tsx
  Cart/
  Footer.tsx
  SpiralProgressIcon.tsx

lib/
  firebase.ts
  buildWhatsAppMessage.ts
  useFlavors.ts                // Firestore hook
  usePackageTiers.ts

admin/components/
  FlavorEditor.tsx
  TierEditor.tsx
  SettingsEditor.tsx
```

---

## 8. Tech Stack

- **Next.js 15 (App Router)** — single repo, no split customer/admin apps needed at this scale
- **Tailwind CSS** — theme tokens mapped directly to the palette in §2.2, no default Tailwind colors used
- **Firebase** — Firestore for content, Auth for the admin login
- **Framer Motion** — scoped to the three signature moments in §2.5, not sprinkled everywhere
- **Vercel** — deployment

---

## 9. Build Order

1. Scaffold Next.js + Tailwind, wire up theme tokens and both fonts
2. Static hero + flavor grid with placeholder data (get the design feel right before wiring Firestore)
2b. **Build ArcMarquee** with placeholder divs first to confirm geometry, then swap in real cutout PNGs from `public/CR-cutout/`
3. Firestore schema + admin manual setup (flavors, tiers, mini box config, settings)
4. Package Builder logic + live price calc — **use `getTierPrice()`**: any non-classic flavor → entire package at `otherFlavorPrice` tier (not per-flavor sum)
5. Mini Box Builder logic — **read `eligibleFlavorIds` from Firestore**, never hardcode the 6 flavors
6. `buildWhatsAppMessage` util + cart checkout → WhatsApp (`encodeURIComponent`; test line breaks on iOS + Android devices)
7. Signature Spiral moments (nav scroll indicator, card reveal)
8. Skeleton loading states for flavor grid + builders while Firestore loads
9. Admin tier editor: explicit Save per row (no live auto-save on price blur)
10. Admin panel (flavor CRUD, settings, order log)
11. Firebase security rules + deploy
8. Admin panel: auth gate → flavor editor → tier/settings editor
9. Responsive pass + reduced-motion pass
10. Real photography swap-in (replace placeholders with Sarah's actual shots)
11. Deploy to Vercel, connect domain

---

## 10. Copy Starting Points

Kept plain, warm, and specific — not generic bakery-speak:

- **Hero headline:** "Cinnamon rolls, rolled fresh in Lebanon."
- **Script tagline:** "you choose, we make it"
- **Mini Box section:** "Twelve minis. Six flavors. All yours to mix."
- **Delivery note:** "Free delivery on 24-piece orders and every Signature Mini Box."
- **Pre-order note:** "Please order a day ahead — every roll is made fresh, not stocked."

---

*Next step: scaffold the repo and start with §9, step 1–2 (hero + flavor grid), then wire Firestore once the visual direction is approved.*
