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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
      setScrolled(scrollTop > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
          scrolled
            ? "border-cinnamon/20 bg-cream/95 backdrop-blur-md"
            : "border-transparent bg-cream/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="#"
            className="font-display text-base font-semibold text-espresso sm:text-xl"
          >
            Sarah&apos;s Bakery
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-espresso/75 transition hover:text-espresso"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <CartButton />
            <a
              href="#mini-box"
              className="hidden rounded-full bg-cinnamon px-4 py-2 text-sm font-medium text-white transition hover:bg-cinnamon/90 md:inline-flex"
            >
              Fill Your Box
            </a>
            <div className="hidden sm:block">
              <SpiralProgressIcon progress={scrollProgress} />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cinnamon/20 text-espresso lg:hidden"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-espresso/30 backdrop-blur-sm"
            onClick={closeMenu}
          />
          <nav className="absolute right-0 top-[57px] flex w-full max-w-xs flex-col gap-1 border-b border-l border-cinnamon/15 bg-cream p-4 shadow-xl">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-base font-medium text-espresso transition hover:bg-blush/40"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#mini-box"
              onClick={closeMenu}
              className="mt-2 rounded-full bg-espresso px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Fill Your Mini Box
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
