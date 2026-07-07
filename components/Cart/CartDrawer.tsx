"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCart } from "@/lib/cart/CartProvider";
import { buildCartWhatsAppMessage, buildWhatsAppUrl } from "@/lib/buildWhatsAppMessage";
import { logOrder } from "@/lib/logOrder";
import { useSiteSettings } from "@/lib/useSiteData";

export function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, removeItem, clearCart } = useCart();
  const { settings } = useSiteSettings();
  const [sending, setSending] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleSendOrder = async () => {
    if (items.length === 0 || sending) return;

    const message = buildCartWhatsAppMessage(items, settings);
    const whatsappNumber = settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
    const allItems = items.flatMap((i) => i.items);

    setSending(true);
    try {
      await logOrder({
        type: "cart",
        items: allItems,
        total: subtotal,
        deliveryNote: "see message",
        message,
        cartItemCount: items.length,
      });
    } catch (err) {
      console.error("Failed to log order:", err);
    }

    const delay = reduceMotion ? 0 : 500;
    setTimeout(() => {
      window.open(buildWhatsAppUrl(message, whatsappNumber), "_blank", "noopener,noreferrer");
      setSending(false);
      clearCart();
      closeCart();
    }, delay);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-espresso/40 backdrop-blur-sm"
            onClick={closeCart}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-cinnamon/15 px-6 py-5">
              <div>
                <h2 className="font-display text-2xl font-semibold text-espresso">Your Order</h2>
                <p className="text-sm text-espresso/60">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cinnamon/20 text-espresso/70 hover:bg-blush/40"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-xl text-espresso/80">Your order is empty</p>
                  <p className="mt-2 text-sm text-espresso/55">
                    Build a Mini Box or add a package to get started.
                  </p>
                  <a
                    href="#mini-box"
                    onClick={closeCart}
                    className="mt-6 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-white"
                  >
                    Fill a Mini Box
                  </a>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-2xl border border-cinnamon/15 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-espresso">
                            {item.type === "mini-box"
                              ? item.name
                              : `${item.pieceCount}-piece package`}
                          </p>
                          <p className="text-sm text-espresso/55">{item.deliveryNote}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-espresso">${item.total}</p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="mt-1 text-xs text-rose hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <ul className="mt-3 space-y-0.5 border-t border-cinnamon/10 pt-3 text-sm text-espresso/70">
                        {item.items.map((orderItem) => (
                          <li key={orderItem.flavorId}>
                            {orderItem.quantity}× {orderItem.flavorName}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-cinnamon/15 px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-espresso/70">Subtotal</span>
                  <span className="font-display text-2xl font-semibold text-espresso">
                    ${subtotal}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSendOrder}
                  disabled={sending}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#20bd5a] disabled:opacity-50"
                >
                  {sending ? "Opening WhatsApp..." : "Send Full Order on WhatsApp"}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
