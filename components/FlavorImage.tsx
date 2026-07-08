"use client";

import { AppImage } from "@/components/AppImage";
import { getFlavorImage } from "@/lib/flavorMeta";

interface FlavorImageProps {
  flavorId: string;
  imageUrl?: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function FlavorImage({
  flavorId,
  imageUrl,
  alt,
  fill,
  width,
  height,
  className = "object-cover",
  sizes,
  priority,
}: FlavorImageProps) {
  const src = getFlavorImage(flavorId, imageUrl);

  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-blush/40 text-2xl">
        🥐
      </div>
    );
  }

  return (
    <AppImage
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
