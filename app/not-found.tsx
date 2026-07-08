import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-espresso">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-4 max-w-md text-sm text-espresso/65">
        Sarah&apos;s Bakery is a single-page site — head back home to browse flavors and
        build your order.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-espresso px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-espresso/90"
      >
        Back to Sarah&apos;s Bakery
      </Link>
    </div>
  );
}
