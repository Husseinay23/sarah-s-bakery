"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { getFlavorDescription, getFlavorImage } from "@/lib/flavorMeta";
import { useFlavors } from "@/lib/useFlavors";

export function FlavorGrid() {
  const { activeFlavors, loading, error } = useFlavors();
  const reduceMotion = useReducedMotion();

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
            Classic cinnamon at $4. Every specialty flavor at $5. All baked fresh to order.
          </p>
        </div>

        {loading && <p className="text-center text-espresso/60">Loading flavors...</p>}
        {error && (
          <p className="text-center text-red-700">Could not load flavors. Please refresh.</p>
        )}

        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {activeFlavors.map((flavor, index) => {
              const isFeatured = index === 0;
              const description = getFlavorDescription(flavor.id, flavor.description);

              return (
                <motion.article
                  key={flavor.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`group overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(58,35,24,0.04),0_8px_24px_rgba(58,35,24,0.06)] ${
                    isFeatured ? "sm:col-span-2 lg:row-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden bg-blush/30 ${
                      isFeatured ? "aspect-[16/10]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={getFlavorImage(flavor.id, flavor.imageUrl)}
                      alt={flavor.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      sizes={isFeatured ? "50vw" : "25vw"}
                    />
                  </div>
                  <div className={`p-5 ${isFeatured ? "sm:p-6" : ""}`}>
                    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
                      {flavor.isClassic ? "Classic" : "Specialty"}
                    </p>
                    <h3
                      className={`mt-1 font-display font-semibold text-espresso ${
                        isFeatured ? "text-2xl sm:text-3xl" : "text-lg"
                      }`}
                    >
                      {flavor.name}
                    </h3>
                    {description && (
                      <p className="mt-1 text-sm text-espresso/60">{description}</p>
                    )}
                    <p className="mt-3 font-medium text-cinnamon">${flavor.pricePerPiece} / piece</p>
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
