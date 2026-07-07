"use client";

import { useMemo, useState } from "react";
import { FlavorStepper } from "./FlavorStepper";
import { PriceSummary } from "./PriceSummary";
import { SendToWhatsAppButton } from "./SendToWhatsAppButton";
import {
  calculatePackagePrice,
  getPackageDeliveryNote,
  getTotalAllocated,
} from "@/lib/buildWhatsAppMessage";
import { useFlavors } from "@/lib/useFlavors";
import { usePackageTiers } from "@/lib/usePackageTiers";
import { useSiteSettings } from "@/lib/useSiteData";

export function PackagePicker() {
  const { activeFlavors, loading: flavorsLoading } = useFlavors();
  const { tiers, loading: tiersLoading } = usePackageTiers();
  const { settings, loading: settingsLoading } = useSiteSettings();

  const [pieceCount, setPieceCount] = useState<number | null>(null);
  const [allocations, setAllocations] = useState<Record<string, number>>({});

  const loading = flavorsLoading || tiersLoading || settingsLoading;

  const totalAllocated = getTotalAllocated(allocations);
  const isComplete = pieceCount !== null && totalAllocated === pieceCount;

  const total = useMemo(() => {
    if (!pieceCount) return 0;
    return calculatePackagePrice(pieceCount, allocations, activeFlavors, tiers);
  }, [pieceCount, allocations, activeFlavors, tiers]);

  const deliveryNote = pieceCount
    ? getPackageDeliveryNote(pieceCount, tiers, settings)
    : "";

  const selectedTier = tiers.find((t) => t.pieceCount === pieceCount);

  const updateAllocation = (flavorId: string, quantity: number) => {
    setAllocations((prev) => ({ ...prev, [flavorId]: quantity }));
  };

  const handlePieceCountChange = (count: number) => {
    setPieceCount(count);
    setAllocations({});
  };

  if (loading) {
    return <p className="text-center text-espresso/60">Loading package options...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-espresso/70">
          Step 1 — Choose quantity
        </h3>
        <div className="flex flex-wrap gap-2">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => handlePieceCountChange(tier.pieceCount)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                pieceCount === tier.pieceCount
                  ? "border-espresso bg-espresso text-white"
                  : "border-cinnamon/30 bg-white text-espresso hover:border-cinnamon"
              }`}
            >
              {tier.pieceCount} {tier.pieceCount === 1 ? "piece" : "pieces"}
            </button>
          ))}
        </div>
      </div>

      {pieceCount !== null && (
        <>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-espresso/70">
              Step 2 — Pick flavors ({totalAllocated} / {pieceCount})
            </h3>
            <div className="space-y-2">
              {activeFlavors.map((flavor) => {
                const current = allocations[flavor.id] ?? 0;
                const othersTotal = totalAllocated - current;
                const max = pieceCount - othersTotal;

                return (
                  <FlavorStepper
                    key={flavor.id}
                    flavorName={flavor.name}
                    quantity={current}
                    max={max}
                    onChange={(qty) => updateAllocation(flavor.id, qty)}
                  />
                );
              })}
            </div>
          </div>

          {selectedTier && (
            <PriceSummary
              total={total}
              deliveryNote={deliveryNote}
              showFreeDelivery={selectedTier.freeDelivery}
            />
          )}

          <SendToWhatsAppButton
            disabled={!isComplete || total === 0}
            type="package"
            pieceCount={pieceCount}
            allocations={allocations}
            flavors={activeFlavors}
            tiers={tiers}
            total={total}
            deliveryNote={deliveryNote}
            settings={settings}
          />
        </>
      )}
    </div>
  );
}
