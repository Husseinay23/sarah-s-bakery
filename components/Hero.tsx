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
    <section className="relative overflow-hidden bg-cream px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt="Sarah's Bakery logo"
              width={80}
              height={80}
              className="mb-6 rounded-full"
            />
          ) : (
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blush text-3xl">
              🥐
            </div>
          )}

          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-espresso sm:text-5xl lg:text-6xl">
            {loading ? "Cinnamon rolls, rolled fresh in Lebanon." : settings.heroHeadline}
          </h1>

          <p className="mt-4 font-script text-3xl text-rose sm:text-4xl">
            {loading ? "you choose, we make it" : settings.heroTagline}
          </p>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-espresso/80">
            Build a package or mix your own Signature Mini Box — then send your order straight to
            Sarah on WhatsApp.
          </p>

          <a
            href="#order"
            className="mt-8 inline-flex rounded-full bg-espresso px-8 py-3 text-sm font-medium text-white transition hover:bg-espresso/90"
          >
            Build Your Order
          </a>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, rotate: -8 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <div className="absolute inset-0 rounded-full bg-blush/60 blur-3xl" />
          <Image
            src={heroImage}
            alt="Fresh cinnamon roll"
            fill
            className="relative rounded-3xl object-cover shadow-xl"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
