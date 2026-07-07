export const FLAVOR_DESCRIPTIONS: Record<string, string> = {
  "classic-cinnamon": "White frosting glaze",
  tiramisu: "Cocoa powder and cream dollops",
  "caramel-pecan": "Caramel drizzle and whole pecans",
  lotus: "Biscoff crumbs and drizzle",
  oreo: "White frosting with a whole Oreo",
  "hot-chocolate": "Chocolate drizzle and mini marshmallows",
  "apple-pie": "Apple crumb topping and caramel drizzle",
};

export const FLAVOR_PLACEHOLDER_IMAGES: Record<string, string> = {
  "classic-cinnamon":
    "https://images.unsplash.com/photo-1609120664715-9a83a1e2f1f6?auto=format&fit=crop&w=400&q=80",
  tiramisu:
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
  "caramel-pecan":
    "https://images.unsplash.com/photo-1558961363-fa8fdf8dbdf1?auto=format&fit=crop&w=400&q=80",
  lotus:
    "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=400&q=80",
  oreo:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400&q=80",
  "hot-chocolate":
    "https://images.unsplash.com/photo-1511381939415-e44015437734?auto=format&fit=crop&w=400&q=80",
  "apple-pie":
    "https://images.unsplash.com/photo-1535920527002-b35e00c08ae9?auto=format&fit=crop&w=400&q=80",
};

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
