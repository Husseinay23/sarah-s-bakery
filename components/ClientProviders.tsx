"use client";

import { CartProvider } from "@/lib/cart/CartProvider";
import { CartDrawer } from "@/components/Cart/CartDrawer";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
