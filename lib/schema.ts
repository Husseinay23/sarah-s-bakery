import {
  FAQ_ITEMS,
  getSiteUrl,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
} from "./siteConfig";

export function getWebSiteSchema() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "en",
  };
}

export function getBakerySchema() {
  const url = getSiteUrl();
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url,
    image: `${url}/mini-box-cutout.png`,
    telephone: phone ? `+${phone.replace(/\D/g, "")}` : undefined,
    servesCuisine: "Bakery",
    priceRange: "$$",
    currenciesAccepted: "USD, LBP",
    paymentAccepted: "Cash, WhatsApp Order",
    address: {
      "@type": "PostalAddress",
      addressCountry: "LB",
      addressLocality: "Lebanon",
    },
    areaServed: {
      "@type": "Country",
      name: "Lebanon",
    },
  };
}

export function getFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
