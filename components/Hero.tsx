"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useSiteSettings } from "@/lib/useSiteData";

export function Hero() {
  const { settings, loading } = useSiteSettings();
  const reduceMotion = useReducedMotion();

  const heroImage =
    settings.heroImageUrl ||
    "https://images.unsplash.com/photo-1609120664715-9a83a1e2f1f6?auto=format&fit=crop&w=900&q=80";

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-blush/50 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-end gap-8 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-4 lg:pb-24 lg:pt-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          className="lg:pb-16"
        >
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt="Sarah's Bakery logo"
              width={72}
              height={72}
              className="mb-8 rounded-full"
            />
          ) : (
            <div className="mb-8 inline-flex h-[72px] w-[72px] items-center justify-center rounded-full bg-blush text-3xl shadow-sm">
              🥐
            </div>
          )}

          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
            Lebanon · Home bakery
          </p>

          <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-tight text-espresso">
            {loading ? "Cinnamon rolls, rolled fresh in Lebanon." : settings.heroHeadline}
          </h1>

          <p className="mt-5 font-script text-[clamp(1.75rem,4vw,2.5rem)] text-rose">
            {loading ? "you choose, we make it" : settings.heroTagline}
          </p>

          <p className="mt-6 max-w-md text-base leading-relaxed text-espresso/70">
            Fill your Signature Mini Box roll by roll, or build a package — then send your full
            order to Sarah on WhatsApp.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#mini-box"
              className="inline-flex rounded-full bg-espresso px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-espresso/90"
            >
              Fill Your Mini Box
            </a>
            <a
              href="#flavors"
              className="inline-flex rounded-full border border-cinnamon/30 px-8 py-3.5 text-sm font-medium text-espresso transition hover:bg-blush/40"
            >
              See all flavors
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 40, rotate: 3 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative lg:-mr-8"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(58,35,24,0.15)]">
            <Image
              src={heroImage}
              alt="Fresh cinnamon roll"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/20 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-4 -left-4 rounded-2xl border border-cinnamon/15 bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm sm:-left-8">
            <p className="font-display text-2xl font-semibold text-espresso">$20</p>
            <p className="text-xs text-espresso/60">Signature Mini Box · 12 rolls</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
