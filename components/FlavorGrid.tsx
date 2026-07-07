"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { getFlavorDescription, getFlavorImage } from "@/lib/flavorMeta";
import { useFlavors } from "@/lib/useFlavors";
import { useSiteSettings, useMiniBoxConfig } from "@/lib/useSiteData";
import { useBuilder } from "@/lib/builder/BuilderContext";

export function FlavorGrid() {
  const { activeFlavors, loading, error } = useFlavors();
  const { settings } = useSiteSettings();
  const { config } = useMiniBoxConfig();
  const { navigateToBuilder } = useBuilder();
  const reduceMotion = useReducedMotion();

  const featuredId = settings.featuredFlavorId;
  const gridFlavors = activeFlavors.filter((f) => f.id !== featuredId);

  const canMiniBox = (flavorId: string) => config.eligibleFlavorIds.includes(flavorId);

  return (
    <section id="flavors" className="px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
              The menu
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-espresso sm:text-5xl">
              Seven rolls. One obsession.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-espresso/65 lg:text-right">
            Classic cinnamon at $4. Every specialty flavor at $5. Tap to start your order.
          </p>
        </div>

        {loading && <p className="text-center text-espresso/60">Loading flavors...</p>}
        {error && (
          <p className="text-center text-red-700">Could not load flavors. Please refresh.</p>
        )}

        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gridFlavors.map((flavor, index) => {
              const description = getFlavorDescription(flavor.id, flavor.description);
              const miniEligible = canMiniBox(flavor.id);

              return (
                <motion.article
                  key={flavor.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="group overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(58,35,24,0.04),0_8px_24px_rgba(58,35,24,0.06)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-blush/30">
                    <Image
                      src={getFlavorImage(flavor.id, flavor.imageUrl)}
                      alt={flavor.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      sizes="33vw"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
                      {flavor.isClassic ? "Classic" : "Specialty"}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-espresso">
                      {flavor.name}
                    </h3>
                    {description && (
                      <p className="mt-1 line-clamp-2 text-sm text-espresso/60">{description}</p>
                    )}
                    <p className="mt-2 font-medium text-cinnamon">${flavor.pricePerPiece} / piece</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {miniEligible && (
                        <button
                          type="button"
                          onClick={() => navigateToBuilder(flavor.id, "mini-box")}
                          className="rounded-full bg-espresso px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-espresso/90"
                        >
                          Mini Box
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => navigateToBuilder(flavor.id, "package")}
                        className="rounded-full border border-cinnamon/30 px-3.5 py-1.5 text-xs font-medium text-espresso transition hover:bg-blush/40"
                      >
                        Package
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
