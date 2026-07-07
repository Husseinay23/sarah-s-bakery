"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Flavor } from "@/lib/types";
import { getFlavorImage } from "@/lib/flavorMeta";

interface FlavorCardProps {
  flavor: Flavor;
  index: number;
}

export function FlavorCard({ flavor, index }: FlavorCardProps) {
  const reduceMotion = useReducedMotion();

  const imageUrl = getFlavorImage(flavor.id, flavor.imageUrl);

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, rotate: -8, y: 16 }}
      whileInView={{ opacity: 1, rotate: 0, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className="group w-64 shrink-0 overflow-hidden rounded-2xl border border-cinnamon/20 bg-white shadow-sm transition-shadow hover:shadow-lg sm:w-auto"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-blush">
        <Image
          src={imageUrl}
          alt={flavor.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 256px, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-espresso">{flavor.name}</h3>
        <p className="mt-1 text-sm font-medium text-cinnamon">${flavor.pricePerPiece} / piece</p>
      </div>
    </motion.article>
  );
}
