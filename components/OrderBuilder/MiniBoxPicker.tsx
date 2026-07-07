"use client";

import { useState } from "react";
import { FlavorStepper } from "./FlavorStepper";
import { PriceSummary } from "./PriceSummary";
import { SendToWhatsAppButton } from "./SendToWhatsAppButton";
import { getTotalAllocated } from "@/lib/buildWhatsAppMessage";
import { useFlavors } from "@/lib/useFlavors";
import { useMiniBoxConfig, useSiteSettings } from "@/lib/useSiteData";

export function MiniBoxPicker() {
  const { activeFlavors, loading: flavorsLoading } = useFlavors();
  const { config, loading: configLoading } = useMiniBoxConfig();
  const { settings, loading: settingsLoading } = useSiteSettings();

  const [allocations, setAllocations] = useState<Record<string, number>>({});

  const loading = flavorsLoading || configLoading || settingsLoading;

  const eligibleFlavors = activeFlavors.filter((f) =>
    config.eligibleFlavorIds.includes(f.id),
  );

  const totalAllocated = getTotalAllocated(allocations);
  const isComplete = totalAllocated === config.totalPieces;

  const total = config.price;
  const deliveryNote = "free delivery";

  const updateAllocation = (flavorId: string, quantity: number) => {
    setAllocations((prev) => ({ ...prev, [flavorId]: quantity }));
  };

  if (loading) {
    return <p className="text-center text-espresso/60">Loading mini box options...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-cinnamon/20 bg-white p-5 text-center">
        <h3 className="font-display text-xl font-semibold text-espresso">{config.name}</h3>
        <p className="mt-2 text-sm text-espresso/70">
          {config.totalPieces} mini rolls · ${config.price} · free delivery
        </p>
        <p className="mt-1 font-script text-2xl text-rose">you choose, we make it!</p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-espresso/70">
          Mix your flavors ({totalAllocated} / {config.totalPieces})
        </h3>
        <div className="space-y-2">
          {eligibleFlavors.map((flavor) => {
            const current = allocations[flavor.id] ?? 0;
            const othersTotal = totalAllocated - current;
            const max = config.totalPieces - othersTotal;

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

      <PriceSummary total={total} deliveryNote={deliveryNote} showFreeDelivery />

      <SendToWhatsAppButton
        disabled={!isComplete}
        type="mini-box"
        allocations={allocations}
        flavors={eligibleFlavors}
        miniBoxConfig={config}
        total={total}
        deliveryNote={deliveryNote}
        settings={settings}
      />
    </div>
  );
}
