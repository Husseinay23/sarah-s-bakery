"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { SlotGridVisual } from "@/components/OrderBuilder/SlotGridVisual";
import { FlavorSelectorGrid } from "@/components/OrderBuilder/FlavorSelectorGrid";
import { FlyingRoll, useFlyingRoll } from "./FlyingRoll";
import { useBuilder } from "@/lib/builder/BuilderContext";
import { useCart } from "@/lib/cart/CartProvider";
import { useFlavors } from "@/lib/useFlavors";
import { useMiniBoxConfig } from "@/lib/useSiteData";
import { randomFillSlots } from "@/lib/randomFill";
import {
  addToSlots,
  createEmptySlots,
  getFilledCount,
  MINI_BOX_CAPACITY,
  removeSlotAt,
  slotsToOrderItems,
} from "@/lib/miniBoxState";

export function MiniBoxBuilder() {
  const { activeFlavors, loading: flavorsLoading } = useFlavors();
  const { config, loading: configLoading } = useMiniBoxConfig();
  const { addMiniBox } = useCart();
  const { highlightedFlavorId } = useBuilder();
  const reduceMotion = useReducedMotion();

  const [slots, setSlots] = useState<(string | null)[]>(() => createEmptySlots());
  const [highlightedSlot, setHighlightedSlot] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  const { flying, registerFlavorRef, registerSlotRef, triggerFly } = useFlyingRoll();

  const eligibleFlavors = activeFlavors.filter((f) =>
    config.eligibleFlavorIds.includes(f.id),
  );
  const eligibleIds = eligibleFlavors.map((f) => f.id);

  const filledCount = getFilledCount(slots);
  const isComplete = filledCount === config.totalPieces;
  const flyingFlavor = flying
    ? eligibleFlavors.find((f) => f.id === flying.flavorId)
    : undefined;

  const flashSlot = useCallback((index: number) => {
    setHighlightedSlot(index);
    setTimeout(() => setHighlightedSlot(null), 400);
  }, []);

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
    setSlots(randomFillSlots(config.totalPieces, eligibleIds));
  };

  const handleAddToCart = () => {
    if (!isComplete) return;

    const flavorNames = Object.fromEntries(eligibleFlavors.map((f) => [f.id, f.name]));
    const items = slotsToOrderItems(slots, flavorNames);

    addMiniBox({
      type: "mini-box",
      name: config.name,
      items,
      total: config.price,
      deliveryNote: "free delivery",
    });

    setAdded(true);
    setSlots(createEmptySlots());
    setTimeout(() => setAdded(false), 2500);
  };

  useEffect(() => {
    if (!highlightedFlavorId || !eligibleIds.includes(highlightedFlavorId)) return;
    const el = document.querySelector(`[data-flavor-id="${highlightedFlavorId}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightedFlavorId, eligibleIds]);

  if (flavorsLoading || configLoading) {
    return (
      <section className="px-4 py-24 text-center text-espresso/60">
        Loading your box builder...
      </section>
    );
  }

  return (
    <section id="mini-box" className="mini-box-section relative overflow-hidden px-4 py-20 sm:px-6 lg:py-28">
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-rose/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-cinnamon/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
            Signature experience
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-espresso sm:text-5xl">
            Fill your own Mini Box
          </h2>
          <p className="mt-4 font-script text-3xl text-rose">you choose, we make it</p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-espresso/70">
            Tap a flavor to drop it in your box. Tap a roll in the box to remove it.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,320px)_1fr] lg:gap-10">
          <div className="mini-box-scene--sticky-mobile order-2 lg:order-1 lg:sticky lg:top-24 lg:self-start">
            <SlotGridVisual
              slots={slots}
              flavors={eligibleFlavors}
              capacity={MINI_BOX_CAPACITY}
              cols={4}
              title="Signature Mini Box"
              filledCount={filledCount}
              isComplete={isComplete}
              highlightedSlot={highlightedSlot}
              reduceMotion={reduceMotion}
              completeMessage="✓ Your Mini Box is Ready"
              registerSlotRef={registerSlotRef}
              onSlotClick={handleSlotClick}
            />

            <div className="mt-3 flex flex-col gap-2">
              {!isComplete && (
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="w-full rounded-full border border-dashed border-cinnamon/40 px-4 py-2.5 text-xs font-medium text-espresso/70 transition hover:border-cinnamon hover:bg-blush/30"
                >
                  ✦ Surprise me — auto-fill box
                </button>
              )}
              {isComplete ? (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#20bd5a]"
                >
                  {added ? "Added to your order ✓" : "Add Mini Box to Order"}
                </button>
              ) : (
                <p className="rounded-xl border border-cinnamon/15 bg-white/60 px-4 py-3 text-center text-xs text-espresso/65">
                  Fill all 12 slots — ${config.price}, free delivery
                </p>
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
              Pick flavors
            </p>
            <FlavorSelectorGrid
              flavors={eligibleFlavors}
              slots={slots}
              capacity={config.totalPieces}
              filledCount={filledCount}
              onSelect={handleSelectFlavor}
              registerRef={registerFlavorRef}
              highlightedFlavorId={highlightedFlavorId}
            />
          </div>
        </div>
      </div>

      <FlyingRoll animation={flying} flavor={flyingFlavor} />
    </section>
  );
}
