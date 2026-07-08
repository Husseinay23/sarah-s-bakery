"use client";

import { ArcMarquee } from "./ArcMarquee";
import { HeroContent } from "./HeroContent";
import { useSiteSettings } from "@/lib/useSiteData";

export function Hero() {
  const { loading } = useSiteSettings();

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-blush/50 blur-3xl" />

      <ArcMarquee />
      <HeroContent loading={loading} />
    </section>
  );
}
