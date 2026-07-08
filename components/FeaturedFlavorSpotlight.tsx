"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getFlavorDescription } from "@/lib/flavorMeta";
import { FlavorImage } from "@/components/FlavorImage";
import { useFlavors } from "@/lib/useFlavors";
import { useSiteSettings } from "@/lib/useSiteData";
import { useBuilder } from "@/lib/builder/BuilderContext";

export function FeaturedFlavorSpotlight() {
  const { activeFlavors, loading } = useFlavors();
  const { settings } = useSiteSettings();
  const { navigateToBuilder } = useBuilder();
  const reduceMotion = useReducedMotion();

  const flavor = activeFlavors.find((f) => f.id === settings.featuredFlavorId) ?? activeFlavors[0];

  if (loading || !flavor) return null;

  const description = getFlavorDescription(flavor.id, flavor.description);

  return (
    <section className="px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid overflow-hidden rounded-3xl border border-cinnamon/15 bg-white shadow-[0_8px_40px_rgba(58,35,24,0.08)] lg:grid-cols-2"
        >
          <div className="relative aspect-[4/3] bg-blush/30 lg:aspect-auto lg:min-h-[320px]">
            <FlavorImage
              flavorId={flavor.id}
              imageUrl={flavor.imageUrl}
              alt={flavor.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute left-4 top-4 rounded-full bg-espresso px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-cream">
              Featured
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
              Sarah&apos;s pick
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-espresso sm:text-4xl">
              {flavor.name}
            </h2>
            {description && (
              <p className="mt-3 text-sm leading-relaxed text-espresso/65 sm:text-base">
                {description}
              </p>
            )}
            <p className="mt-4 font-medium text-cinnamon">${flavor.pricePerPiece} / piece</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigateToBuilder(flavor.id, "mini-box")}
                className="rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-espresso/90"
              >
                Add to Mini Box
              </button>
              <button
                type="button"
                onClick={() => navigateToBuilder(flavor.id, "package")}
                className="rounded-full border border-cinnamon/30 px-5 py-2.5 text-sm font-medium text-espresso transition hover:bg-blush/40"
              >
                Add to Package
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
