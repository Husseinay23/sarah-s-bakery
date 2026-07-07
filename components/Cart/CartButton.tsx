"use client";

import { useCart } from "@/lib/cart/CartProvider";

export function CartButton() {
  const { itemCount, toggleCart } = useCart();

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label={`Your order, ${itemCount} items`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cinnamon/25 bg-white text-espresso transition hover:border-cinnamon hover:bg-blush/30"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 6h15l-1.5 9H8L6 6ZM6 6L5 3H2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="20" r="1.2" fill="currentColor" />
        <circle cx="18" cy="20" r="1.2" fill="currentColor" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </button>
  );
}
