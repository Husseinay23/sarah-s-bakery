import { FAQ_ITEMS } from "@/lib/siteConfig";

export function FaqSection() {
  return (
    <section id="faq" className="border-t border-cinnamon/10 bg-white/40 px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
          FAQ
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-espresso sm:text-4xl">
          Common questions
        </h2>

        <dl className="mt-10 space-y-8">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question}>
              <dt className="font-display text-lg font-semibold text-espresso">
                {item.question}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-espresso/70">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
