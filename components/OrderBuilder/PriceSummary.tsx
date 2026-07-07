"use client";

interface PriceSummaryProps {
  total: number;
  deliveryNote: string;
  showFreeDelivery?: boolean;
}

export function PriceSummary({ total, deliveryNote, showFreeDelivery }: PriceSummaryProps) {
  return (
    <div className="rounded-2xl border border-cinnamon/20 bg-blush/30 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-espresso/70">Total</span>
        <span className="font-display text-2xl font-semibold text-espresso">${total}</span>
      </div>
      <p className="mt-2 text-sm text-espresso/70">{deliveryNote}</p>
      {showFreeDelivery && (
        <p className="mt-2 rounded-lg bg-rose/20 px-3 py-2 text-sm font-medium text-espresso">
          Free delivery included
        </p>
      )}
    </div>
  );
}
