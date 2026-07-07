"use client";

import Image from "next/image";
import { useFlavors } from "@/lib/useFlavors";
import { useMiniBoxConfig } from "@/lib/useSiteData";

export function MiniBoxSpotlight() {
  const { activeFlavors } = useFlavors();
  const { config } = useMiniBoxConfig();

  const eligibleFlavors = activeFlavors.filter((f) =>
    config.eligibleFlavorIds.includes(f.id),
  );

  return (
    <section id="mini-box" className="bg-blush/50 px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-lg">
          <Image
            src="https://images.unsplash.com/photo-1558961363-fa8fdf8dbdf1?auto=format&fit=crop&w=800&q=80"
            alt="Signature Mini Box"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div>
          <h2 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">
            Signature Mini Box
          </h2>
          <p className="mt-2 font-script text-3xl text-rose">Twelve minis. Six flavors. All yours.</p>
          <p className="mt-4 text-espresso/80">
            Pick any {config.totalPieces} mini rolls from your favorite flavors — ${config.price},
            free delivery included.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {eligibleFlavors.map((flavor) => (
              <span
                key={flavor.id}
                className="rounded-full border border-cinnamon/30 bg-white px-3 py-1 text-sm text-espresso"
              >
                {flavor.name}
              </span>
            ))}
          </div>

          <a
            href="#order"
            className="mt-8 inline-flex rounded-full border-2 border-cinnamon px-6 py-3 text-sm font-medium text-espresso transition hover:bg-cinnamon hover:text-white"
          >
            Build Your Mini Box
          </a>
        </div>
      </div>
    </section>
  );
}
