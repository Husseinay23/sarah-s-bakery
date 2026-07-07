"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Compartment } from "./Compartment";
import type { Flavor } from "@/lib/types";

interface SlotGridVisualProps {
  slots: (string | null)[];
  flavors: Flavor[];
  capacity: number;
  cols: number;
  title: string;
  filledCount: number;
  isComplete: boolean;
  highlightedSlot: number | null;
  reduceMotion: boolean | null;
  compact?: boolean;
  completeMessage?: string;
  registerSlotRef: (index: number, el: HTMLElement | null) => void;
  onSlotClick?: (index: number) => void;
}

export function SlotGridVisual({
  slots,
  flavors,
  capacity,
  cols,
  title,
  filledCount,
  isComplete,
  highlightedSlot,
  reduceMotion,
  compact = false,
  completeMessage = "✓ Ready to add",
  registerSlotRef,
  onSlotClick,
}: SlotGridVisualProps) {
  const flavorMap = Object.fromEntries(flavors.map((f) => [f.id, f]));

  return (
    <div className={`mini-box-scene ${compact ? "mini-box-scene--compact" : ""}`}>
      <motion.div
        className={`mini-box-container ${isComplete ? "mini-box-container--complete" : ""}`}
        animate={
          isComplete && !reduceMotion
            ? { boxShadow: "0 0 0 2px rgba(198, 138, 78, 0.6), 0 12px 40px rgba(58, 35, 24, 0.18)" }
            : { boxShadow: "0 8px 32px rgba(58, 35, 24, 0.12)" }
        }
        transition={{ duration: 0.5 }}
      >
        <div className="mini-box-lid" aria-hidden="true" />

        <div className={`mini-box-body ${compact ? "mini-box-body--compact" : ""}`}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-display text-base font-semibold text-espresso sm:text-lg">{title}</p>
            <span className="text-xs font-medium text-cinnamon sm:text-sm">
              {filledCount} / {capacity}
            </span>
          </div>

          <div className="mini-box-progress mb-2" aria-hidden="true">
            <motion.div
              className="mini-box-progress-fill"
              animate={{ width: `${capacity > 0 ? (filledCount / capacity) * 100 : 0}%` }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            />
          </div>

          <div
            className="grid gap-1.5 sm:gap-2"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {slots.map((flavorId, index) => (
              <Compartment
                key={index}
                index={index}
                flavorId={flavorId}
                flavor={flavorId ? flavorMap[flavorId] : undefined}
                highlighted={highlightedSlot === index}
                reduceMotion={reduceMotion}
                compact={compact || capacity > 12}
                innerRef={(el) => registerSlotRef(index, el)}
                onClick={onSlotClick}
              />
            ))}
          </div>

          <AnimatePresence>
            {isComplete && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-center text-sm font-medium text-cinnamon"
              >
                {completeMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
