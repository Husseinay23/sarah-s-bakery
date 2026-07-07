"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getFlavorImage } from "@/lib/flavorMeta";
import type { Flavor } from "@/lib/types";

interface CompartmentProps {
  flavorId: string | null;
  flavor?: Flavor;
  index: number;
  highlighted: boolean;
  reduceMotion: boolean | null;
  innerRef?: (el: HTMLButtonElement | null) => void;
  onClick?: (index: number) => void;
  compact?: boolean;
}

export function Compartment({
  flavorId,
  flavor,
  index,
  highlighted,
  reduceMotion,
  innerRef,
  onClick,
  compact = false,
}: CompartmentProps) {
  const filled = flavorId !== null && flavor;

  return (
    <motion.button
      type="button"
      ref={innerRef}
      data-slot={index}
      onClick={() => filled && onClick?.(index)}
      disabled={!filled}
      layout={!reduceMotion}
      className={`compartment relative aspect-square overflow-hidden rounded-lg ${
        highlighted ? "compartment--highlight" : ""
      } ${filled ? "cursor-pointer hover:ring-2 hover:ring-rose/50" : "cursor-default"}`}
      animate={
        highlighted && !reduceMotion
          ? { scale: [1, 1.06, 1] }
          : { scale: 1 }
      }
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      aria-label={filled ? `Remove ${flavor.name} from slot ${index + 1}` : `Empty slot ${index + 1}`}
    >
      <div className={`compartment-paper absolute inset-0 ${compact ? "compartment-paper--compact" : ""}`} />

      <AnimatePresence mode="popLayout">
        {filled && (
          <motion.div
            key={`${index}-${flavorId}`}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.6, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 8 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute inset-0.5 sm:inset-1"
          >
            <div className="roll-shadow relative h-full w-full overflow-hidden rounded-full">
              <Image
                src={getFlavorImage(flavor.id, flavor.imageUrl)}
                alt={flavor.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
