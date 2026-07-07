"use client";

import { useState } from "react";
import { PackagePicker } from "./PackagePicker";
import { MiniBoxPicker } from "./MiniBoxPicker";

type Tab = "packages" | "mini-box";

export function OrderBuilderTabs() {
  const [tab, setTab] = useState<Tab>("packages");

  return (
    <section id="order" className="bg-cream px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">
            Build Your Order
          </h2>
          <p className="mt-3 text-espresso/70">Pick a package or mix your Signature Mini Box.</p>
        </div>

        <div className="mb-8 flex justify-center gap-2 rounded-full bg-blush/60 p-1">
          <button
            type="button"
            onClick={() => setTab("packages")}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${
              tab === "packages"
                ? "bg-white text-espresso shadow-sm"
                : "text-espresso/70 hover:text-espresso"
            }`}
          >
            Packages
          </button>
          <button
            type="button"
            onClick={() => setTab("mini-box")}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${
              tab === "mini-box"
                ? "bg-white text-espresso shadow-sm"
                : "text-espresso/70 hover:text-espresso"
            }`}
          >
            Mini Box
          </button>
        </div>

        {tab === "packages" ? <PackagePicker /> : <MiniBoxPicker />}
      </div>
    </section>
  );
}
