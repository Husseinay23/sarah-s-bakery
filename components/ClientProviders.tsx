"use client";

import { CartProvider } from "@/lib/cart/CartProvider";
import { BuilderProvider } from "@/lib/builder/BuilderContext";
import { CartDrawer } from "@/components/Cart/CartDrawer";
import { MobileOrderBar } from "@/components/Cart/MobileOrderBar";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <BuilderProvider>
        {children}
        <CartDrawer />
        <MobileOrderBar />
        <FloatingWhatsApp />
      </BuilderProvider>
    </CartProvider>
  );
}
