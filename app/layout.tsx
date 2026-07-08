import type { Metadata } from "next";
import { Fraunces, Caveat, Inter } from "next/font/google";
import { ClientProviders } from "@/components/ClientProviders";
import {
  DEFAULT_DESCRIPTION,
  getSiteUrl,
  SEO_KEYWORDS,
  SITE_NAME,
} from "@/lib/siteConfig";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-caveat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Cinnamon Rolls in Lebanon | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: SITE_NAME,
    title: `Cinnamon Rolls in Lebanon | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/mini-box-cutout.png",
        width: 1200,
        height: 630,
        alt: "Sarah's Bakery Signature Mini Box",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Cinnamon Rolls in Lebanon | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
    images: ["/mini-box-cutout.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${caveat.variable} ${inter.variable} font-sans antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
