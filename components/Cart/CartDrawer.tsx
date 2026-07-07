"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCart, isCustomerValid } from "@/lib/cart/CartProvider";
import { buildCartWhatsAppMessage, buildWhatsAppUrl } from "@/lib/buildWhatsAppMessage";
import { logOrder } from "@/lib/logOrder";
import { hasLastOrderForPhone, saveLastOrder } from "@/lib/lastOrder";
import { useSiteSettings } from "@/lib/useSiteData";
import { CartCustomerForm } from "./CartCustomerForm";

type CartStep = "review" | "checkout";

export function CartDrawer() {
  const {
    items,
    subtotal,
    customer,
    updateCustomer,
    isOpen,
    closeCart,
    removeItem,
    clearCart,
    reorderForPhone,
  } = useCart();
  const { settings } = useSiteSettings();
  const [sending, setSending] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [step, setStep] = useState<CartStep>("review");
  const [reorderAvailable, setReorderAvailable] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isOpen && items.length > 0) {
      setStep("review");
      setShowErrors(false);
    }
  }, [isOpen, items.length]);

  useEffect(() => {
    setReorderAvailable(hasLastOrderForPhone(customer.phone));
  }, [customer.phone]);

  const handleSendOrder = async () => {
    if (items.length === 0 || sending) return;

    if (!isCustomerValid(customer)) {
      setShowErrors(true);
      return;
    }

    const message = buildCartWhatsAppMessage(items, settings, customer);
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
        customer,
      });
      saveLastOrder(customer.phone, items);
    } catch (err) {
      console.error("Failed to log order:", err);
    }

    const delay = reduceMotion ? 0 : 500;
    setTimeout(() => {
      window.open(buildWhatsAppUrl(message, whatsappNumber), "_blank", "noopener,noreferrer");
      setSending(false);
      clearCart();
      closeCart();
      setShowErrors(false);
      setStep("review");
    }, delay);
  };

  const handleReorder = () => {
    const ok = reorderForPhone(customer.phone);
    if (ok) setStep("review");
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
            className="cart-drawer fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-cream shadow-2xl sm:max-w-md"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-cinnamon/15 px-4 py-4 sm:px-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-espresso sm:text-2xl">
                  {step === "review" ? "Your Order" : "Checkout"}
                </h2>
                <p className="text-xs text-espresso/60 sm:text-sm">
                  {step === "review"
                    ? `${items.length} ${items.length === 1 ? "item" : "items"}`
                    : "Delivery details required"}
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

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
              {items.length === 0 ? (
                <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
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
              ) : step === "review" ? (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-2xl border border-cinnamon/15 bg-white p-3.5 sm:p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-espresso">
                            {item.type === "mini-box"
                              ? item.name
                              : `${item.pieceCount}-piece package`}
                          </p>
                          <p className="text-xs text-espresso/55 sm:text-sm">{item.deliveryNote}</p>
                        </div>
                        <div className="shrink-0 text-right">
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
                      <ul className="mt-2.5 space-y-0.5 border-t border-cinnamon/10 pt-2.5 text-xs text-espresso/70 sm:text-sm">
                        {item.items.map((orderItem) => (
                          <li key={orderItem.flavorId}>
                            {orderItem.quantity}× {orderItem.flavorName}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-4">
                  {reorderAvailable && (
                    <button
                      type="button"
                      onClick={handleReorder}
                      className="w-full rounded-xl border border-dashed border-cinnamon/40 bg-blush/20 px-4 py-3 text-sm font-medium text-espresso transition hover:bg-blush/40"
                    >
                      ↻ Order the same as last time
                    </button>
                  )}
                  <CartCustomerForm
                    customer={customer}
                    onChange={updateCustomer}
                    showErrors={showErrors}
                  />
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="cart-drawer-footer shrink-0 border-t border-cinnamon/15 px-4 py-4 sm:px-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-espresso/70">Subtotal</span>
                  <span className="font-display text-xl font-semibold text-espresso sm:text-2xl">
                    ${subtotal}
                  </span>
                </div>

                {step === "review" ? (
                  <button
                    type="button"
                    onClick={() => setStep("checkout")}
                    className="w-full rounded-full bg-espresso px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-espresso/90 sm:py-4 sm:text-base"
                  >
                    Continue to checkout
                  </button>
                ) : (
                  <>
                    {showErrors && !isCustomerValid(customer) && (
                      <p className="mb-3 text-xs text-rose">
                        Please complete all required fields including delivery date.
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setStep("review")}
                        className="rounded-full border border-cinnamon/25 px-4 py-3.5 text-sm font-medium text-espresso"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSendOrder}
                        disabled={sending}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#20bd5a] disabled:opacity-50"
                      >
                        {sending ? "Opening WhatsApp..." : "Send on WhatsApp"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
