"use client";

import { useSiteSettings } from "@/lib/useSiteData";

export function Footer() {
  const { settings } = useSiteSettings();
  const whatsappNumber = settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <footer className="border-t border-cinnamon/20 bg-espresso px-4 py-12 text-cream sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
          <div className="text-center md:text-left">
            <p className="font-display text-2xl font-semibold">{settings.storeName}</p>
            <p className="mt-2 text-sm text-cream/70">Thank you for supporting Sarah&apos;s Bakery!</p>
          </div>

          <div className="flex flex-col items-center gap-3 md:items-end">
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-cream underline-offset-4 hover:underline"
            >
              WhatsApp us
            </a>
            <div className="flex gap-4 text-sm text-cream/70">
              <a href={settings.instagramUrl} className="hover:text-cream">
                Instagram
              </a>
              <a href={settings.facebookUrl} className="hover:text-cream">
                Facebook
              </a>
              <a href={settings.tiktokUrl} className="hover:text-cream">
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
