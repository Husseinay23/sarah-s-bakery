"use client";

import { useEffect, useRef } from "react";
import { AppImage } from "@/components/AppImage";
import { useReducedMotion } from "framer-motion";
import { HERO_MARQUEE_IMAGES } from "@/lib/localImages";
import { computeArcGeometry, rollPosition } from "@/lib/arcMarqueeGeometry";

const ROTATION_SPEED = 0.22; // degrees per frame (~27s per revolution)
const IMAGE_SIZE = 140;

const STATIC_FALLBACK_INDICES = [0, 2, 4, 6];

export function ArcMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotationRef = useRef(0);
  const rafRef = useRef<number>(0);
  const geomRef = useRef(computeArcGeometry(400, 280));
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduceMotion) return;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      geomRef.current = computeArcGeometry(rect.width, rect.height);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);

    const count = HERO_MARQUEE_IMAGES.length;
    const baseAngles = HERO_MARQUEE_IMAGES.map((_, i) => (i * 360) / count);

    const tick = () => {
      rotationRef.current = (rotationRef.current + ROTATION_SPEED) % 360;
      const geom = geomRef.current;

      HERO_MARQUEE_IMAGES.forEach((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return;

        const theta = (baseAngles[i] + rotationRef.current) % 360;
        const { x, y, opacity } = rollPosition(geom, theta, IMAGE_SIZE);
        el.style.transform = `translate(${x}px, ${y}px)`;
        el.style.opacity = String(opacity);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    const geom = computeArcGeometry(400, 200);
    const staticAngles = STATIC_FALLBACK_INDICES.map(
      (idx) => (idx * 360) / HERO_MARQUEE_IMAGES.length + 30,
    );

    return (
      <div className="arc-marquee-static relative mx-auto h-[260px] w-full max-w-4xl">
        {STATIC_FALLBACK_INDICES.map((imgIdx, i) => {
          const { x, y } = rollPosition(geom, staticAngles[i], IMAGE_SIZE);
          return (
            <div
              key={HERO_MARQUEE_IMAGES[imgIdx]}
              className="absolute"
              style={{ transform: `translate(${x}px, ${y}px)`, width: IMAGE_SIZE, height: IMAGE_SIZE }}
            >
              <AppImage
                src={HERO_MARQUEE_IMAGES[imgIdx]}
                alt=""
                width={IMAGE_SIZE}
                height={IMAGE_SIZE}
                className="h-full w-full object-contain drop-shadow-[0_8px_16px_rgba(58,35,24,0.12)]"
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="arc-marquee pointer-events-none relative h-[280px] w-full overflow-hidden sm:h-[340px] lg:h-[400px]"
      aria-hidden="true"
    >
      {HERO_MARQUEE_IMAGES.map((src, i) => (
        <div
          key={src}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 will-change-transform"
          style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
        >
          <AppImage
            src={src}
            alt=""
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            priority={i < 3}
            className="kb-roll h-full w-full object-contain drop-shadow-[0_8px_16px_rgba(58,35,24,0.12)]"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        </div>
      ))}
    </div>
  );
}
