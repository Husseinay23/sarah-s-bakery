/** Canonical site URL for metadata, sitemap, and JSON-LD. Set NEXT_PUBLIC_SITE_URL in production. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export const SITE_NAME = "Sarah's Bakery";

export const DEFAULT_DESCRIPTION =
  "Sarah's Bakery is a home bakery in Lebanon specializing in fresh cinnamon rolls. Build a Signature Mini Box or package online and order via WhatsApp for delivery across Lebanon.";

export const SEO_KEYWORDS = [
  "cinnamon rolls Lebanon",
  "cinnamon rolls Beirut",
  "home bakery Lebanon",
  "order cinnamon rolls WhatsApp",
  "mini box cinnamon rolls",
  "Sarah's Bakery",
];

export const AEO_ANSWER =
  "Sarah's Bakery is a home bakery in Lebanon specializing in fresh-baked cinnamon rolls. Choose from seven flavors, fill a Signature Mini Box or build a custom package, then send your order to Sarah on WhatsApp for delivery across Lebanon.";

/** NAP — home bakery, delivery only (no storefront). */
export const BUSINESS_NAP = {
  serviceType: "Home bakery — delivery only, no storefront",
  areaServed: "Delivery across Lebanon",
  preOrderNote: "Order at least one day ahead — every roll is baked fresh to order.",
} as const;

export const FAQ_ITEMS = [
  {
    question: "How do I order from Sarah's Bakery?",
    answer:
      "Browse flavors on the website, fill a Signature Mini Box or build a package, add your name, phone, address, and preferred delivery date in the cart, then tap send to open WhatsApp with your full order ready for Sarah.",
  },
  {
    question: "Does Sarah's Bakery deliver in Lebanon?",
    answer:
      "Yes. Sarah's Bakery delivers across Lebanon. A flat delivery fee applies to most orders; the Signature Mini Box and packages of 24 pieces or more qualify for free delivery.",
  },
  {
    question: "How far in advance should I place my order?",
    answer:
      "Please order at least one day ahead. Every cinnamon roll is baked fresh to order — nothing is kept in stock.",
  },
  {
    question: "What cinnamon roll flavors does Sarah's Bakery offer?",
    answer:
      "Seven flavors: Classic Cinnamon, Tiramisu, Caramel Pecan, Lotus, Oreo, Hot Chocolate, and Apple Pie. Classic is $4 per piece; specialty flavors are $5 per piece.",
  },
  {
    question: "How much is the Signature Mini Box?",
    answer:
      "The Signature Mini Box includes 12 rolls of your choice from eligible flavors for $20, with free delivery included.",
  },
] as const;
