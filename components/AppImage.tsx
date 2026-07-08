"use client";

import Image, { type ImageProps } from "next/image";
import { shouldBypassImageOptimization } from "@/lib/imageUtils";

export function AppImage({ src, unoptimized, ...props }: ImageProps) {
  const srcString = typeof src === "string" ? src : "";
  const bypass =
    unoptimized ?? (srcString ? shouldBypassImageOptimization(srcString) : false);

  return <Image src={src} unoptimized={bypass} {...props} />;
}
