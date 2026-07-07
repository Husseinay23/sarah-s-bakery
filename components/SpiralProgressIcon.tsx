"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SpiralProgressIconProps {
  progress: number;
}

export function SpiralProgressIcon({ progress }: SpiralProgressIconProps) {
  const reduceMotion = useReducedMotion();
  const rotation = reduceMotion ? 0 : progress * 360;
  const fillOpacity = 0.25 + progress * 0.75;

  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="shrink-0"
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <circle cx="16" cy="16" r="14" fill="none" stroke="#C68A4E" strokeWidth="2" opacity="0.25" />
      <path
        d="M16 4a12 12 0 0 1 0 24 9 9 0 0 1-7.5-4"
        fill="none"
        stroke="#C68A4E"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ opacity: fillOpacity }}
      />
      <circle cx="16" cy="16" r="3" fill="#E8969B" style={{ opacity: fillOpacity }} />
    </motion.svg>
  );
}
