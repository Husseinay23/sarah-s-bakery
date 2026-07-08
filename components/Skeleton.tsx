import type { CSSProperties } from "react";

interface SkeletonBlockProps {
  className?: string;
  style?: CSSProperties;
}

export function SkeletonBlock({ className = "", style }: SkeletonBlockProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-blush/50 ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function FlavorStripSkeleton() {
  return (
    <div
      className="flex flex-wrap items-end justify-center gap-6 overflow-visible sm:gap-8"
      aria-label="Loading flavors"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonBlock
          key={i}
          className="h-[148px] w-[148px] rounded-full"
          style={{ transform: `translateY(${i % 2 === 0 ? 0 : 12}px) rotate(${i % 3 - 1}deg)` }}
        />
      ))}
    </div>
  );
}

/** @deprecated Use FlavorStripSkeleton */
export const FlavorGridSkeleton = FlavorStripSkeleton;

export function BuilderSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2" aria-label="Loading builder">
      <SkeletonBlock className="aspect-square w-full max-w-md mx-auto" />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonBlock key={i} className="aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}
