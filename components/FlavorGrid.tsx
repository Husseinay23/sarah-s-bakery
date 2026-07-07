"use client";

import { FlavorCard } from "./FlavorCard";
import { useFlavors } from "@/lib/useFlavors";

export function FlavorGrid() {
  const { activeFlavors, loading, error } = useFlavors();

  return (
    <section id="flavors" className="bg-blush/40 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">
            Our Flavors
          </h2>
          <p className="mt-3 text-espresso/70">Seven rolls. One obsession.</p>
        </div>

        {loading && (
          <p className="text-center text-espresso/60">Loading flavors...</p>
        )}

        {error && (
          <p className="text-center text-red-700">
            Could not load flavors. Please refresh the page.
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="flavor-scroll -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-4">
              {activeFlavors.map((flavor, index) => (
                <FlavorCard key={flavor.id} flavor={flavor} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
