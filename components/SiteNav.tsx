"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpiralProgressIcon } from "./SpiralProgressIcon";
import { CartButton } from "./Cart/CartButton";

const links = [
  { href: "#flavors", label: "Flavors" },
  { href: "#mini-box", label: "Mini Box" },
  { href: "#order", label: "Packages" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-cinnamon/20 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="#" className="font-display text-lg font-semibold text-espresso sm:text-xl">
          Sarah&apos;s Bakery
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-espresso/80 transition hover:text-espresso"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CartButton />
          <a
            href="#mini-box"
            className="hidden rounded-full bg-cinnamon px-4 py-2 text-sm font-medium text-white transition hover:bg-cinnamon/90 sm:inline-flex"
          >
            Fill Your Box
          </a>
          <SpiralProgressIcon progress={scrollProgress} />
        </div>
      </div>
    </header>
  );
}
