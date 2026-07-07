export interface Flavor {
  id: string;
  name: string;
  slug: string;
  pricePerPiece: number;
  isClassic: boolean;
  imageUrl: string;
  active: boolean;
  sortOrder: number;
}

export interface PackageTier {
  id: string;
  pieceCount: number;
  classicPrice: number;
  otherFlavorPrice: number;
  freeDelivery: boolean;
}

export interface MiniBoxConfig {
  name: string;
  totalPieces: number;
  price: number;
  freeDelivery: boolean;
  eligibleFlavorIds: string[];
}

export interface SiteSettings {
  whatsappNumber: string;
  deliveryCharge: number;
  deliveryFreeThreshold: string;
  storeName: string;
  heroImageUrl: string;
  logoUrl: string;
  heroHeadline: string;
  heroTagline: string;
  preOrderNote: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
}

export interface OrderItem {
  flavorId: string;
  flavorName: string;
  quantity: number;
}

export interface OrderLog {
  id: string;
  type: "package" | "mini-box";
  items: OrderItem[];
  total: number;
  pieceCount?: number;
  deliveryNote: string;
  message: string;
  status: "pending" | "reviewed";
  createdAt: Date;
}

export type PackageAllocation = Record<string, number>;
