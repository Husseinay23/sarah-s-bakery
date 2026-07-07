import type { Metadata } from "next";
import { Fraunces, Caveat, Inter } from "next/font/google";
import { ClientProviders } from "@/components/ClientProviders";
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

export const metadata: Metadata = {
  title: "Sarah's Bakery | Cinnamon Rolls",
  description:
    "Cinnamon rolls, rolled fresh in Lebanon. Build your order and send it on WhatsApp in under a minute.",
  robots: {
    index: true,
    follow: true,
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
