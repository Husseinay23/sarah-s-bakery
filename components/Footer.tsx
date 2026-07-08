"use client";

import { useSiteSettings } from "@/lib/useSiteData";
import { useCart } from "@/lib/cart/CartProvider";
import { AEO_ANSWER, BUSINESS_NAP } from "@/lib/siteConfig";

export function Footer() {
  const { settings } = useSiteSettings();
  const { openCart } = useCart();
  const whatsappNumber = settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const formattedPhone = whatsappNumber ? `+${whatsappNumber.replace(/\D/g, "")}` : null;

  return (
    <footer className="border-t border-cinnamon/15 bg-cream px-4 py-20 text-espresso sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold">{settings.storeName}</p>
          <p className="mt-4 text-sm leading-relaxed text-espresso/65">{AEO_ANSWER}</p>

          <div className="mt-6 space-y-2 text-sm text-espresso/60">
            <p className="font-medium text-espresso/75">{BUSINESS_NAP.serviceType}</p>
            <p>{BUSINESS_NAP.areaServed}</p>
            <p>{BUSINESS_NAP.preOrderNote}</p>
            {formattedPhone && (
              <p>
                WhatsApp{" "}
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                  className="text-espresso/80 hover:text-espresso"
                >
                  {formattedPhone}
                </a>
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
            Order
          </p>
          <ul className="mt-4 space-y-2 text-sm">
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
            <li>
              <a href="#contact" className="text-espresso/75 hover:text-espresso">
                Contact & delivery
              </a>
            </li>
            <li>
              <a href="#faq" className="text-espresso/75 hover:text-espresso">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
            Connect
          </p>
          <ul className="mt-4 space-y-2 text-sm">
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

      <p className="mx-auto mt-16 max-w-6xl border-t border-cinnamon/10 pt-8 text-center text-sm text-espresso/50">
        Thank you for supporting Sarah&apos;s Bakery!
      </p>
    </footer>
  );
}
