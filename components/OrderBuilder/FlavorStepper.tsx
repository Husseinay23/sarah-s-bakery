"use client";

interface FlavorStepperProps {
  flavorName: string;
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
}

export function FlavorStepper({ flavorName, quantity, max, onChange }: FlavorStepperProps) {
  const canDecrease = quantity > 0;
  const canIncrease = quantity < max;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-cinnamon/20 bg-white px-4 py-3">
      <span className="text-sm font-medium text-espresso">{flavorName}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, quantity - 1))}
          disabled={!canDecrease}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-cinnamon/30 text-cinnamon transition hover:bg-blush disabled:opacity-30"
          aria-label={`Decrease ${flavorName}`}
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, quantity + 1))}
          disabled={!canIncrease}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-cinnamon/30 text-cinnamon transition hover:bg-blush disabled:opacity-30"
          aria-label={`Increase ${flavorName}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
