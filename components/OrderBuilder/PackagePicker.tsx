"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { SlotGridVisual } from "./SlotGridVisual";
import { FlavorSelectorGrid } from "./FlavorSelectorGrid";
import { PriceSummary } from "./PriceSummary";
import { FlyingRoll, useFlyingRoll } from "@/components/MiniBoxBuilder/FlyingRoll";
import {
  calculatePackagePrice,
  formatOrderItems,
  getPackageDeliveryNote,
} from "@/lib/buildWhatsAppMessage";
import { useBuilder } from "@/lib/builder/BuilderContext";
import { useCart } from "@/lib/cart/CartProvider";
import { useFlavors } from "@/lib/useFlavors";
import { usePackageTiers } from "@/lib/usePackageTiers";
import { useSiteSettings } from "@/lib/useSiteData";
import { randomFillSlots } from "@/lib/randomFill";
import {
  addToSlots,
  createEmptySlots,
  getFilledCount,
  removeSlotAt,
} from "@/lib/miniBoxState";
import { getGridCols } from "@/lib/slotGrid";
import { BuilderSkeleton } from "@/components/Skeleton";

export function PackagePicker() {
  const { activeFlavors, loading: flavorsLoading } = useFlavors();
  const { tiers, loading: tiersLoading } = usePackageTiers();
  const { settings, loading: settingsLoading } = useSiteSettings();
  const { addPackage } = useCart();
  const { highlightedFlavorId, packagePieceCountHint } = useBuilder();
  const reduceMotion = useReducedMotion();

  const [pieceCount, setPieceCount] = useState<number | null>(null);
  const [slots, setSlots] = useState<(string | null)[]>([]);
  const [highlightedSlot, setHighlightedSlot] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  const { flying, registerFlavorRef, registerSlotRef, triggerFly } = useFlyingRoll();

  const loading = flavorsLoading || tiersLoading || settingsLoading;
  const flavorIds = activeFlavors.map((f) => f.id);

  const filledCount = getFilledCount(slots);
  const isComplete = pieceCount !== null && filledCount === pieceCount;

  const allocations = useMemo(() => {
    const map: Record<string, number> = {};
    for (const id of slots) {
      if (id) map[id] = (map[id] ?? 0) + 1;
    }
    return map;
  }, [slots]);

  const total = useMemo(() => {
    if (!pieceCount) return 0;
    return calculatePackagePrice(pieceCount, allocations, activeFlavors, tiers);
  }, [pieceCount, allocations, activeFlavors, tiers]);

  const deliveryNote = pieceCount
    ? getPackageDeliveryNote(pieceCount, tiers, settings)
    : "";

  const selectedTier = tiers.find((t) => t.pieceCount === pieceCount);
  const gridCols = pieceCount ? getGridCols(pieceCount) : 4;

  const flyingFlavor = flying
    ? activeFlavors.find((f) => f.id === flying.flavorId)
    : undefined;

  const flashSlot = useCallback((index: number) => {
    setHighlightedSlot(index);
    setTimeout(() => setHighlightedSlot(null), 400);
  }, []);

  const handlePieceCountChange = (count: number) => {
    setPieceCount(count);
    setSlots(createEmptySlots(count));
    setAdded(false);
  };

  useEffect(() => {
    if (!packagePieceCountHint) return;
    if (tiers.some((t) => t.pieceCount === packagePieceCountHint)) {
      setPieceCount(packagePieceCountHint);
      setSlots(createEmptySlots(packagePieceCountHint));
      setAdded(false);
    }
  }, [packagePieceCountHint, tiers]);

  useEffect(() => {
    if (!highlightedFlavorId) return;
    const el = document.querySelector(`[data-flavor-id="${highlightedFlavorId}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightedFlavorId, pieceCount]);

  const handleSelectFlavor = (flavorId: string) => {
    const preview = addToSlots(slots, flavorId);
    if (!preview) return;

    triggerFly(flavorId, preview.slotIndex, "add", () => {
      setSlots(preview.slots);
      flashSlot(preview.slotIndex);
    });
  };

  const handleSlotClick = (index: number) => {
    const preview = removeSlotAt(slots, index);
    if (!preview) return;

    triggerFly(preview.flavorId, preview.slotIndex, "remove", () => {
      setSlots(preview.slots);
    });
  };

  const handleAutoFill = () => {
    if (!pieceCount) return;
    setSlots(randomFillSlots(pieceCount, flavorIds));
  };

  const handleAddToCart = () => {
    if (!isComplete || !pieceCount) return;

    const items = formatOrderItems(allocations, activeFlavors);
    const hasMixed = items.length > 1;
    const flavorLabel = hasMixed ? "mixed flavors" : items[0]?.flavorName ?? "flavors";

    addPackage({
      type: "package",
      pieceCount,
      items,
      total,
      deliveryNote,
      label: `${pieceCount} pieces — ${flavorLabel}`,
    });

    setAdded(true);
    setPieceCount(null);
    setSlots([]);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="py-12">
        <BuilderSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
          Step 1 — Quantity
        </p>
        <div className="flex flex-wrap gap-2">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => handlePieceCountChange(tier.pieceCount)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                pieceCount === tier.pieceCount
                  ? "border-espresso bg-espresso text-white shadow-md"
                  : "border-cinnamon/20 bg-white text-espresso hover:border-cinnamon/50"
              }`}
            >
              <span className="block text-base font-semibold">{tier.pieceCount}</span>
              <span className="text-[10px] opacity-70">
                {tier.pieceCount === 1 ? "single" : "package"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {pieceCount !== null && (
        <div className="grid gap-6 lg:grid-cols-[minmax(220px,300px)_1fr] lg:gap-10">
          <div className="mini-box-scene--sticky-mobile order-2 lg:order-1 lg:sticky lg:top-24 lg:self-start">
            <SlotGridVisual
              slots={slots}
              flavors={activeFlavors}
              capacity={pieceCount}
              cols={gridCols}
              title={`${pieceCount}-Piece Package`}
              filledCount={filledCount}
              isComplete={isComplete}
              highlightedSlot={highlightedSlot}
              reduceMotion={reduceMotion}
              compact={pieceCount > 12}
              completeMessage="✓ Package complete"
              registerSlotRef={registerSlotRef}
              onSlotClick={handleSlotClick}
            />

            {selectedTier && (
              <div className="mt-4">
                <PriceSummary
                  total={total}
                  deliveryNote={deliveryNote}
                  showFreeDelivery={selectedTier.freeDelivery}
                />
              </div>
            )}

            {!isComplete && (
              <button
                type="button"
                onClick={handleAutoFill}
                className="mt-3 w-full rounded-full border border-dashed border-cinnamon/40 px-4 py-2.5 text-xs font-medium text-espresso/70 transition hover:border-cinnamon hover:bg-blush/30"
              >
                ✦ Surprise me — auto-fill package
              </button>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isComplete || total === 0}
              className="mt-3 w-full rounded-full bg-espresso px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-espresso/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added ? "Added to your order ✓" : "Add Package to Order"}
            </button>
          </div>

          <div className="order-1 lg:order-2">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
              Step 2 — Tap flavors ({filledCount}/{pieceCount})
            </p>
            <FlavorSelectorGrid
              flavors={activeFlavors}
              slots={slots}
              capacity={pieceCount}
              filledCount={filledCount}
              onSelect={handleSelectFlavor}
              registerRef={registerFlavorRef}
              highlightedFlavorId={highlightedFlavorId}
            />
          </div>
        </div>
      )}

      <FlyingRoll animation={flying} flavor={flyingFlavor} />
    </div>
  );
}
