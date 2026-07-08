"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useSiteSettings, useMiniBoxConfig } from "@/lib/useSiteData";
import { MINI_BOX_CUTOUT, HERO_DEFAULT_IMAGE } from "@/lib/localImages";

interface HeroContentProps {
  loading: boolean;
}

export function HeroContent({ loading }: HeroContentProps) {
  const { settings } = useSiteSettings();
  const { config: miniBox } = useMiniBoxConfig();
  const reduceMotion = useReducedMotion();

  const boxImage = settings.heroImageUrl || MINI_BOX_CUTOUT || HERO_DEFAULT_IMAGE;
  const miniBoxPrice = miniBox?.price ?? 20;
  const miniBoxName = miniBox?.name ?? "Signature Mini Box";
  const miniBoxPieces = miniBox?.totalPieces ?? 12;

  return (
    <div className="relative z-10 mx-auto max-w-3xl px-4 pb-16 pt-4 text-center sm:px-6 sm:pb-20 lg:pb-24">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {settings.logoUrl ? (
          <Image
            src={settings.logoUrl}
            alt="Sarah's Bakery logo"
            width={72}
            height={72}
            className="mx-auto mb-6 rounded-full"
          />
        ) : (
          <div className="mx-auto mb-6 inline-flex h-[72px] w-[72px] items-center justify-center rounded-full bg-blush text-3xl shadow-sm">
            🥐
          </div>
        )}

        <h1 className="font-display text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.05] tracking-tight text-espresso">
          {loading ? "Cinnamon rolls, rolled fresh." : settings.heroHeadline}
        </h1>

        <p className="mt-4 font-script text-[clamp(1.5rem,3.5vw,2.25rem)] text-rose">
          {loading ? "you choose, we make it" : settings.heroTagline}
        </p>

        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-espresso/70">
          Fill your Signature Mini Box roll by roll, or build a package — then send your full order
          to Sarah on WhatsApp.
        </p>

        <div className="relative mx-auto mt-10 w-full max-w-sm">
          <div className="kb-box relative mx-auto aspect-4/5 w-full max-w-[280px]">
            <Image
              src={boxImage}
              alt="Sarah's Bakery Signature Mini Box"
              fill
              className="object-contain drop-shadow-[0_20px_40px_rgba(58,35,24,0.15)]"
              sizes="280px"
              priority
            />
          </div>

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-2xl border border-cinnamon/15 bg-white/95 px-5 py-3 shadow-lg backdrop-blur-sm">
            <p className="font-display text-2xl font-semibold text-espresso">${miniBoxPrice}</p>
            <p className="text-xs text-espresso/60">
              {miniBoxName} · {miniBoxPieces} rolls
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
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
    </div>
  );
}
