"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { getFlavorCutout } from "@/lib/flavorMeta";
import { getFlavorLayout } from "@/lib/flavorLayout";
import type { Flavor } from "@/lib/types";

interface FlavorPieceProps {
  flavor: Flavor;
  index: number;
  miniEligible: boolean;
  onPackage: () => void;
  onMiniBox?: () => void;
}

function useNarrowScreen() {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return narrow;
}

export function FlavorPiece({
  flavor,
  index,
  miniEligible,
  onPackage,
  onMiniBox,
}: FlavorPieceProps) {
  const reduceMotion = useReducedMotion();
  const narrow = useNarrowScreen();
  const layout = getFlavorLayout(index);
  const rot = narrow ? layout.rotation * 0.5 : layout.rotation;
  const tagRot = narrow ? layout.tagRotation * 0.5 : layout.tagRotation;

  const src = getFlavorCutout(flavor.id, flavor.imageUrl);

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="group relative shrink-0"
      style={{ paddingBottom: 28 }}
    >
      <motion.button
        type="button"
        onClick={onPackage}
        className="group/piece relative block cursor-pointer border-0 bg-transparent p-0"
        style={{ width: narrow ? 120 : 148, height: narrow ? 120 : 148 }}
        animate={{ y: layout.yOffset, rotate: rot }}
        whileHover={
          reduceMotion
            ? undefined
            : { y: layout.yOffset - 8, rotate: 0, transition: { duration: 0.2, ease: "easeOut" } }
        }
        aria-label={`Add ${flavor.name} to a package`}
      >
        {src ? (
          <Image
            src={src}
            alt={flavor.name}
            width={narrow ? 120 : 148}
            height={narrow ? 120 : 148}
            className="h-full w-full object-contain drop-shadow-[0_10px_20px_rgba(58,35,24,0.12)]"
            sizes="(max-width: 640px) 120px, 148px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">🥐</div>
        )}

        <div
          className={`pointer-events-none absolute bottom-[-10px] ${
            layout.tagSide === "right" ? "right-[-12px]" : "left-[-12px]"
          }`}
          style={{ transform: `rotate(${tagRot}deg)` }}
        >
          <div
            className="bg-white px-2.5 py-1 transition-transform duration-300 ease-out group-hover/piece:scale-[1.08]"
            style={{
              borderRadius: "14px 4px 14px 4px",
              filter: "drop-shadow(0 2px 3px rgba(58,35,24,0.15))",
              transitionDelay: "50ms",
            }}
          >
            <p className="font-script text-[15px] leading-tight text-espresso">{flavor.name}</p>
            <p className="font-sans text-[13px] font-semibold leading-tight text-cinnamon">
              ${flavor.pricePerPiece}
            </p>
          </div>
        </div>
      </motion.button>

      {miniEligible && onMiniBox && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMiniBox();
          }}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-espresso/90 px-2.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          Mini Box
        </button>
      )}
    </motion.article>
  );
}
