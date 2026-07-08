import { FLAVOR_LOCAL_IMAGES, FLAVOR_CUTOUT_IMAGES } from "./localImages";

export const FLAVOR_DESCRIPTIONS: Record<string, string> = {
  "classic-cinnamon": "White frosting glaze",
  tiramisu: "Cocoa powder and cream dollops",
  "caramel-pecan": "Caramel drizzle and whole pecans",
  lotus: "Biscoff crumbs and drizzle",
  oreo: "White frosting with a whole Oreo",
  "hot-chocolate": "Chocolate drizzle and mini marshmallows",
  "apple-pie": "Apple crumb topping and caramel drizzle",
};

/** Admin upload wins; otherwise use bundled /public design assets. */
export function getFlavorImage(flavorId: string, imageUrl?: string): string | null {
  if (imageUrl) return imageUrl;
  return FLAVOR_LOCAL_IMAGES[flavorId] ?? null;
}

/** Cutout PNGs for the floating flavor strip (admin upload still wins). */
export function getFlavorCutout(flavorId: string, imageUrl?: string): string | null {
  if (imageUrl) return imageUrl;
  return FLAVOR_CUTOUT_IMAGES[flavorId] ?? FLAVOR_LOCAL_IMAGES[flavorId] ?? null;
}

export function getFlavorDescription(flavorId: string, description?: string): string {
  return description ?? FLAVOR_DESCRIPTIONS[flavorId] ?? "";
}
