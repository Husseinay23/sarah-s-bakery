"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  formatOrderItems,
} from "@/lib/buildWhatsAppMessage";
import { logOrder } from "@/lib/logOrder";
import type { Flavor, MiniBoxConfig, PackageTier, SiteSettings } from "@/lib/types";

interface SendToWhatsAppButtonProps {
  disabled: boolean;
  type: "package" | "mini-box";
  pieceCount?: number;
  allocations: Record<string, number>;
  flavors: Flavor[];
  tiers?: PackageTier[];
  miniBoxConfig?: MiniBoxConfig;
  total: number;
  deliveryNote: string;
  settings: SiteSettings;
}

export function SendToWhatsAppButton({
  disabled,
  type,
  pieceCount,
  allocations,
  flavors,
  miniBoxConfig,
  total,
  deliveryNote,
  settings,
}: SendToWhatsAppButtonProps) {
  const [spinning, setSpinning] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleSend = async () => {
    if (disabled || spinning) return;

    const items = formatOrderItems(allocations, flavors);
    const whatsappNumber = settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

    const message =
      type === "package" && pieceCount
        ? buildWhatsAppMessage({
            type: "package",
            pieceCount,
            items,
            total,
            deliveryNote,
            settings,
          })
        : buildWhatsAppMessage({
            type: "mini-box",
            config: miniBoxConfig!,
            items,
            total,
            deliveryNote,
          });

    setSpinning(true);

    try {
      await logOrder({
        type,
        items,
        total,
        pieceCount,
        deliveryNote,
        message,
      });
    } catch (err) {
      console.error("Failed to log order:", err);
    }

    const delay = reduceMotion ? 0 : 600;
    setTimeout(() => {
      window.open(buildWhatsAppUrl(message, whatsappNumber), "_blank", "noopener,noreferrer");
      setSpinning(false);
    }, delay);
  };

  return (
    <button
      type="button"
      onClick={handleSend}
      disabled={disabled || spinning}
      className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#20bd5a] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <motion.span
        animate={spinning && !reduceMotion ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        aria-hidden="true"
        className="text-xl"
      >
        ↻
      </motion.span>
      Send Order on WhatsApp
    </button>
  );
}
