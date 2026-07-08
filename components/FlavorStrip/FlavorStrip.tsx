"use client";

import { useFlavors } from "@/lib/useFlavors";
import { useSiteSettings, useMiniBoxConfig } from "@/lib/useSiteData";
import { useBuilder } from "@/lib/builder/BuilderContext";
import { FlavorStripSkeleton } from "@/components/Skeleton";
import { FlavorPiece } from "./FlavorPiece";

export function FlavorStrip() {
  const { activeFlavors, loading, error } = useFlavors();
  const { settings } = useSiteSettings();
  const { config } = useMiniBoxConfig();
  const { navigateToBuilder } = useBuilder();

  const featuredId = settings.featuredFlavorId;
  const stripFlavors = activeFlavors.filter((f) => f.id !== featuredId);

  const canMiniBox = (flavorId: string) => config.eligibleFlavorIds.includes(flavorId);

  return (
    <section id="flavors" className="overflow-visible px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-7xl overflow-visible">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
              The menu
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-espresso sm:text-5xl">
              Seven rolls. One obsession.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-espresso/65 lg:text-right">
            Classic cinnamon at $4. Every specialty flavor at $5. Tap a roll to start your order.
          </p>
        </div>

        {loading && <FlavorStripSkeleton />}
        {error && (
          <p className="text-center text-red-700">Could not load flavors. Please refresh.</p>
        )}

        {!loading && !error && (
          <div className="flavor-strip flex flex-wrap items-end justify-center gap-6 overflow-visible sm:gap-8">
            {stripFlavors.map((flavor, index) => (
              <FlavorPiece
                key={flavor.id}
                flavor={flavor}
                index={index}
                miniEligible={canMiniBox(flavor.id)}
                onPackage={() => navigateToBuilder(flavor.id, "package")}
                onMiniBox={
                  canMiniBox(flavor.id)
                    ? () => navigateToBuilder(flavor.id, "mini-box")
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
