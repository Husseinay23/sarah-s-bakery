"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FlavorImage } from "@/components/FlavorImage";
import type { Flavor } from "@/lib/types";

export interface FlyingRollState {
  id: string;
  flavorId: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  mode: "add" | "remove";
}

interface FlyingRollProps {
  animation: FlyingRollState | null;
  flavor: Flavor | undefined;
}

export function FlyingRoll({ animation, flavor }: FlyingRollProps) {
  const reduceMotion = useReducedMotion();

  if (!animation || !flavor || reduceMotion) return null;

  const midX = (animation.from.x + animation.to.x) / 2;
  const midY = Math.min(animation.from.y, animation.to.y) - 60;

  return (
    <AnimatePresence>
      <motion.div
        key={animation.id}
        className="flying-roll pointer-events-none fixed z-[100] h-14 w-14 overflow-hidden rounded-full shadow-lg"
        initial={{
          left: animation.from.x - 28,
          top: animation.from.y - 28,
          scale: animation.mode === "add" ? 0.8 : 1,
          opacity: 1,
        }}
        animate={{
          left: [animation.from.x - 28, midX - 28, animation.to.x - 28],
          top: [animation.from.y - 28, midY - 28, animation.to.y - 28],
          scale: animation.mode === "add" ? [0.8, 1.1, 1] : [1, 0.8, 0.4],
          opacity: animation.mode === "remove" ? [1, 1, 0] : 1,
        }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <FlavorImage
          flavorId={flavor.id}
          imageUrl={flavor.imageUrl}
          alt=""
          fill
          sizes="56px"
        />
      </motion.div>
    </AnimatePresence>
  );
}

export function useFlyingRoll() {
  const reduceMotion = useReducedMotion();
  const flavorRefs = useRef<Record<string, HTMLElement | null>>({});
  const slotRefs = useRef<Record<number, HTMLElement | null>>({});
  const [flying, setFlying] = useState<FlyingRollState | null>(null);

  const registerFlavorRef = (id: string, el: HTMLElement | null) => {
    flavorRefs.current[id] = el;
  };

  const registerSlotRef = (index: number, el: HTMLElement | null) => {
    slotRefs.current[index] = el;
  };

  const getCenter = (el: HTMLElement | null) => {
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  const triggerFly = (
    flavorId: string,
    slotIndex: number,
    mode: "add" | "remove",
    onLand: () => void,
  ) => {
    if (reduceMotion) {
      onLand();
      return;
    }

    const fromEl = mode === "add" ? flavorRefs.current[flavorId] : slotRefs.current[slotIndex];
    const toEl = mode === "add" ? slotRefs.current[slotIndex] : flavorRefs.current[flavorId];

    setFlying({
      id: `${Date.now()}-${flavorId}`,
      flavorId,
      from: getCenter(fromEl),
      to: getCenter(toEl),
      mode,
    });

    setTimeout(() => {
      onLand();
      setFlying(null);
    }, 500);
  };

  return { flying, registerFlavorRef, registerSlotRef, triggerFly };
}
