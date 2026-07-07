"use client";

import { useCart } from "@/lib/cart/CartProvider";

export function MobileOrderBar() {
  const { itemCount, subtotal, openCart } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="mobile-order-bar fixed bottom-0 left-0 right-0 z-40 border-t border-cinnamon/20 bg-cream/95 px-4 py-3 backdrop-blur-md md:hidden">
      <button
        type="button"
        onClick={openCart}
        className="flex w-full items-center justify-between rounded-full bg-espresso px-5 py-3.5 text-sm font-semibold text-white"
      >
        <span>
          Review order ({itemCount})
        </span>
        <span>${subtotal}</span>
      </button>
    </div>
  );
}
