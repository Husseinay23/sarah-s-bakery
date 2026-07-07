"use client";

import { useSiteSettings } from "@/lib/useSiteData";

export function ContactSection() {
  const { settings } = useSiteSettings();
  const whatsappNumber = settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const waLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

  return (
    <section id="contact" className="relative overflow-hidden bg-espresso px-4 py-20 text-cream sm:px-6 lg:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-cinnamon/30 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-rose/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
            Get in touch
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Order fresh rolls from Sarah
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-cream/75">
            {settings.preOrderNote}
          </p>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-cream/10 bg-cream/5 p-6 backdrop-blur-sm">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
              Pre-order
            </p>
            <p className="mt-2 font-display text-xl font-semibold">Made fresh, not stocked</p>
            <p className="mt-2 text-sm text-cream/65">
              Please place your order at least a day ahead so every roll is baked for you.
            </p>
          </div>

          <div className="rounded-2xl border border-cream/10 bg-cream/5 p-6 backdrop-blur-sm">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
              Delivery
            </p>
            <p className="mt-2 font-display text-xl font-semibold">${settings.deliveryCharge} flat fee</p>
            <p className="mt-2 text-sm text-cream/65">
              Free on {settings.deliveryFreeThreshold.toLowerCase()}.
            </p>
          </div>

          <div className="rounded-2xl border border-cream/10 bg-cream/5 p-6 backdrop-blur-sm sm:col-span-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
              Follow along
            </p>
            <div className="mt-4 flex flex-wrap gap-6 text-sm font-medium">
              <a href={settings.instagramUrl} className="text-cream/80 transition hover:text-cream">
                Instagram
              </a>
              <a href={settings.facebookUrl} className="text-cream/80 transition hover:text-cream">
                Facebook
              </a>
              <a href={settings.tiktokUrl} className="text-cream/80 transition hover:text-cream">
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
