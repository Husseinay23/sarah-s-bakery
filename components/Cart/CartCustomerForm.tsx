"use client";

import { useEffect } from "react";
import type { CustomerDetails } from "@/lib/types";
import { getMinDeliveryDate } from "@/lib/randomFill";

interface CartCustomerFormProps {
  customer: CustomerDetails;
  onChange: (details: Partial<CustomerDetails>) => void;
  showErrors: boolean;
}

export function CartCustomerForm({ customer, onChange, showErrors }: CartCustomerFormProps) {
  const fieldClass =
    "w-full rounded-xl border border-cinnamon/20 bg-white px-3.5 py-2.5 text-sm text-espresso outline-none transition focus:border-cinnamon focus:ring-1 focus:ring-cinnamon/30";
  const errorClass = "border-rose/60 focus:border-rose focus:ring-rose/30";
  const minDate = getMinDeliveryDate();

  useEffect(() => {
    if (!customer.preferredDate) {
      onChange({ preferredDate: minDate });
    }
    // Set default delivery date once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
          Delivery details
        </p>
        <p className="mt-1 text-xs text-espresso/55">
          Required before your order is sent to Sarah.
        </p>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-espresso">Full name *</span>
        <input
          type="text"
          value={customer.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Your name"
          className={`${fieldClass} ${showErrors && customer.name.trim().length < 2 ? errorClass : ""}`}
          autoComplete="name"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-espresso">Phone *</span>
        <input
          type="tel"
          value={customer.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="e.g. 03 123 456"
          className={`${fieldClass} ${showErrors && customer.phone.trim().length < 8 ? errorClass : ""}`}
          autoComplete="tel"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-espresso">Delivery address *</span>
        <input
          type="text"
          value={customer.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="Area, building, directions"
          className={`${fieldClass} ${showErrors && customer.address.trim().length < 3 ? errorClass : ""}`}
          autoComplete="street-address"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-espresso">Preferred delivery date *</span>
        <input
          type="date"
          value={customer.preferredDate}
          min={minDate}
          onChange={(e) => onChange({ preferredDate: e.target.value })}
          className={`${fieldClass} ${showErrors && !customer.preferredDate ? errorClass : ""}`}
        />
      </label>

      <label className="flex items-center gap-3 rounded-xl border border-cinnamon/15 bg-white px-3.5 py-3">
        <input
          type="checkbox"
          checked={customer.isGift}
          onChange={(e) => onChange({ isGift: e.target.checked })}
          className="h-4 w-4 accent-espresso"
        />
        <span className="text-sm font-medium text-espresso">This is a gift order</span>
      </label>

      {customer.isGift && (
        <>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-espresso">Recipient name</span>
            <input
              type="text"
              value={customer.giftRecipientName}
              onChange={(e) => onChange({ giftRecipientName: e.target.value })}
              placeholder="Who is this for?"
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-espresso">Gift message</span>
            <textarea
              value={customer.giftMessage}
              onChange={(e) => onChange({ giftMessage: e.target.value })}
              placeholder="A note for Sarah to include"
              rows={2}
              className={`${fieldClass} resize-none`}
            />
          </label>
        </>
      )}

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-espresso">
          Notes <span className="font-normal text-espresso/45">(optional)</span>
        </span>
        <textarea
          value={customer.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Gate code, delivery time window, etc."
          rows={2}
          className={`${fieldClass} resize-none`}
        />
      </label>
    </div>
  );
}
