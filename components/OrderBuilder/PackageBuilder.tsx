import { PackagePicker } from "./PackagePicker";

export function PackageBuilder() {
  return (
    <section id="order" className="bg-blush/25 px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
            Packages
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-espresso sm:text-5xl">
            Build a package
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-espresso/70">
            Choose your quantity, tap flavors to fill the grid, then add to your order.
          </p>
        </div>

        <PackagePicker />
      </div>
    </section>
  );
}
