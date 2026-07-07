"use client";

import { useSiteSettings } from "@/lib/useSiteData";
import { useCart } from "@/lib/cart/CartProvider";

export function Footer() {
  const { settings } = useSiteSettings();
  const { openCart } = useCart();
  const whatsappNumber = settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <footer className="border-t border-cinnamon/15 bg-cream px-4 py-16 text-espresso sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold">{settings.storeName}</p>
          <p className="mt-3 text-sm leading-relaxed text-espresso/65">
            Cinnamon rolls, rolled fresh in Lebanon. Every order is made to order — never stocked.
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
            Order
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="#mini-box" className="text-espresso/75 hover:text-espresso">
                Fill a Mini Box
              </a>
            </li>
            <li>
              <a href="#order" className="text-espresso/75 hover:text-espresso">
                Build a package
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={openCart}
                className="text-espresso/75 hover:text-espresso"
              >
                Review your order
              </button>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
            Connect
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-espresso/75 hover:text-espresso"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a href={settings.instagramUrl} className="text-espresso/75 hover:text-espresso">
                Instagram
              </a>
            </li>
            <li>
              <a href={settings.facebookUrl} className="text-espresso/75 hover:text-espresso">
                Facebook
              </a>
            </li>
            <li>
              <a href={settings.tiktokUrl} className="text-espresso/75 hover:text-espresso">
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-cinnamon/10 pt-8 text-center text-sm text-espresso/50">
        Thank you for supporting Sarah&apos;s Bakery!
      </p>
    </footer>
  );
}
