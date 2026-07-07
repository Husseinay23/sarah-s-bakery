"use client";

import { motion, useReducedMotion } from "framer-motion";

const steps = [
  {
    title: "Pick your rolls",
    body: "Fill a Signature Mini Box or build a package — tap flavors to drop them in.",
  },
  {
    title: "Add your details",
    body: "Name, phone, address, and delivery date — required at checkout before WhatsApp.",
  },
  {
    title: "Send on WhatsApp",
    body: "One message to Sarah with everything she needs to bake and deliver.",
  },
];

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-y border-cinnamon/10 bg-white/50 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-cinnamon">
            How it works
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-espresso sm:text-4xl">
            Three taps to fresh rolls
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative rounded-2xl border border-cinnamon/12 bg-cream p-6"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blush text-sm font-semibold text-espresso">
                {index + 1}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-espresso">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-espresso/65">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
