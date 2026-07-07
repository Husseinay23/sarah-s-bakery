"use client";

import Image from "next/image";
import { getFlavorImage } from "@/lib/flavorMeta";
import { countFlavor } from "@/lib/miniBoxState";
import type { Flavor } from "@/lib/types";

interface FlavorSelectorGridProps {
  flavors: Flavor[];
  slots: (string | null)[];
  capacity: number;
  filledCount: number;
  onSelect: (flavorId: string) => void;
  registerRef: (id: string, el: HTMLElement | null) => void;
  highlightedFlavorId?: string | null;
}

export function FlavorSelectorGrid({
  flavors,
  slots,
  capacity,
  filledCount,
  onSelect,
  registerRef,
  highlightedFlavorId,
}: FlavorSelectorGridProps) {
  const canAdd = filledCount < capacity;

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
      {flavors.map((flavor) => {
        const quantity = countFlavor(slots, flavor.id);
        const isHighlighted = highlightedFlavorId === flavor.id;

        return (
          <button
            key={flavor.id}
            type="button"
            data-flavor-id={flavor.id}
            onClick={() => canAdd && onSelect(flavor.id)}
            disabled={!canAdd}
            className={`group relative flex flex-col items-center overflow-hidden rounded-xl border bg-white p-2 transition sm:rounded-2xl sm:p-2.5 ${
              isHighlighted
                ? "border-rose ring-2 ring-rose/50 animate-pulse"
                : quantity > 0
                  ? "border-cinnamon/50 ring-1 ring-cinnamon/30"
                  : "border-cinnamon/15 hover:border-cinnamon/40"
            } disabled:opacity-40`}
          >
            <div
              ref={(el) => registerRef(flavor.id, el)}
              className="relative h-14 w-14 overflow-hidden rounded-lg bg-blush/30 sm:h-16 sm:w-16 sm:rounded-xl"
            >
              <Image
                src={getFlavorImage(flavor.id, flavor.imageUrl)}
                alt={flavor.name}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="64px"
              />
            </div>
            <span className="mt-1.5 line-clamp-2 text-center text-[10px] font-medium leading-tight text-espresso sm:text-xs">
              {flavor.name}
            </span>
            {quantity > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-espresso px-1 text-[9px] font-bold text-white">
                {quantity}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
