"use client";

import { useSiteSettings } from "@/lib/useSiteData";
import { BUSINESS_NAP } from "@/lib/siteConfig";

export function ContactSection() {
  const { settings } = useSiteSettings();
  const whatsappNumber = settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const waLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;
  const formattedPhone = whatsappNumber ? `+${whatsappNumber.replace(/\D/g, "")}` : null;

  return (
    <section id="contact" className="relative overflow-hidden bg-espresso px-4 py-20 text-cream sm:px-6 lg:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-cinnamon/30 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-rose/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
          Get in touch
        </p>
        <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Order fresh rolls from Sarah
        </h2>

        <p className="mt-8 border-l-2 border-cinnamon/60 pl-4 font-display text-xl font-semibold leading-snug text-cream sm:text-2xl">
          ${settings.deliveryCharge} delivery · Free on {settings.deliveryFreeThreshold.toLowerCase()} ·
          Pre-order 1 day ahead
        </p>

        <div className="mt-8 space-y-4 text-base leading-relaxed text-cream/75">
          <p>
            {settings.preOrderNote} Add your name, phone, and address in the cart before sending your
            order on WhatsApp.
          </p>
          <p>
            Sarah bakes every roll at home in Lebanon — there is no storefront to visit. Orders are
            made fresh and delivered to your door.
          </p>
          <p>
            {formattedPhone && (
              <>
                WhatsApp{" "}
                <a href={waLink} className="text-cream underline-offset-2 hover:underline">
                  {formattedPhone}
                </a>
                {" · "}
              </>
            )}
            Follow along on{" "}
            <a href={settings.instagramUrl} className="text-cream underline-offset-2 hover:underline">
              Instagram
            </a>
            ,{" "}
            <a href={settings.facebookUrl} className="text-cream underline-offset-2 hover:underline">
              Facebook
            </a>
            , and{" "}
            <a href={settings.tiktokUrl} className="text-cream underline-offset-2 hover:underline">
              TikTok
            </a>
            .
          </p>
          <p className="text-sm text-cream/55">{BUSINESS_NAP.serviceType}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#20bd5a]"
          >
            Message on WhatsApp
          </a>
          <a
            href="#mini-box"
            className="inline-flex items-center rounded-full border border-cream/25 px-6 py-3.5 text-sm font-medium text-cream transition hover:bg-cream/10"
          >
            Build a Mini Box
          </a>
        </div>
      </div>
    </section>
  );
}
