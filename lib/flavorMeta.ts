export const FLAVOR_DESCRIPTIONS: Record<string, string> = {
  "classic-cinnamon": "White frosting glaze",
  tiramisu: "Cocoa powder and cream dollops",
  "caramel-pecan": "Caramel drizzle and whole pecans",
  lotus: "Biscoff crumbs and drizzle",
  oreo: "White frosting with a whole Oreo",
  "hot-chocolate": "Chocolate drizzle and mini marshmallows",
  "apple-pie": "Apple crumb topping and caramel drizzle",
};

import { FLAVOR_LOCAL_IMAGES } from "./localImages";

export const FLAVOR_PLACEHOLDER_IMAGES: Record<string, string> = FLAVOR_LOCAL_IMAGES;

export function getFlavorImage(flavorId: string, imageUrl?: string): string {
  if (imageUrl) return imageUrl;
  return (
    FLAVOR_PLACEHOLDER_IMAGES[flavorId] ??
    "https://images.unsplash.com/photo-1609120664715-9a83a1e2f1f6?auto=format&fit=crop&w=400&q=80"
  );
}

export function getFlavorDescription(flavorId: string, description?: string): string {
  return description ?? FLAVOR_DESCRIPTIONS[flavorId] ?? "";
}
