"use client";

import { useSiteSettings } from "@/lib/useSiteData";

export function DeliveryInfo() {
  const { settings } = useSiteSettings();

  return (
    <section id="delivery" className="bg-cream px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">
          Delivery & Pre-Order
        </h2>

        <div className="mt-8 space-y-4 rounded-2xl border border-cinnamon/20 bg-white p-8 text-left">
          <p className="text-espresso/80">
            <span className="font-semibold text-espresso">Delivery charge:</span> $
            {settings.deliveryCharge} flat fee.
          </p>
          <p className="text-espresso/80">
            <span className="font-semibold text-espresso">Free delivery</span> on{" "}
            {settings.deliveryFreeThreshold}.
          </p>
          <p className="text-espresso/80">
            <span className="font-semibold text-espresso">Pre-order:</span> {settings.preOrderNote}
          </p>
        </div>
      </div>
    </section>
  );
}
