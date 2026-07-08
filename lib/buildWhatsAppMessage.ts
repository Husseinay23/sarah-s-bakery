import type {
  CartItem,
  CustomerDetails,
  Flavor,
  MiniBoxConfig,
  OrderItem,
  PackageTier,
  SiteSettings,
} from "./types";

interface PackageOrderInput {
  type: "package";
  pieceCount: number;
  items: OrderItem[];
  total: number;
  deliveryNote: string;
  settings: SiteSettings;
}

interface MiniBoxOrderInput {
  type: "mini-box";
  config: MiniBoxConfig;
  items: OrderItem[];
  total: number;
  deliveryNote: string;
}

export function buildWhatsAppMessage(input: PackageOrderInput | MiniBoxOrderInput): string {
  const lines: string[] = ["Hi Sarah! I'd like to order:", ""];

  if (input.type === "package") {
    const hasMixed = input.items.length > 1;
    const flavorLabel = hasMixed ? "mixed flavors" : input.items[0]?.flavorName ?? "flavors";
    lines.push(`[Package] ${input.pieceCount} pieces — ${flavorLabel}`);
    lines.push("");
    for (const item of input.items) {
      if (item.quantity > 0) {
        lines.push(`- ${item.quantity}x ${item.flavorName}`);
      }
    }
    lines.push(`Total: $${input.total}`);
    lines.push("");
    lines.push(`Delivery: ${input.deliveryNote}`);
  } else {
    lines.push(
      `Hi Sarah! ${input.config.name} (${input.config.totalPieces} pcs) — $${input.total}, free delivery`,
      "",
    );
    for (const item of input.items) {
      if (item.quantity > 0) {
        lines.push(`- ${item.quantity}x ${item.flavorName}`);
      }
    }
  }

  return lines.join("\n");
}

export function buildCartWhatsAppMessage(
  cartItems: CartItem[],
  settings: SiteSettings,
  customer?: CustomerDetails,
): string {
  const lines: string[] = ["Hi Sarah! I'd like to order:", ""];

  if (customer && (customer.name || customer.phone)) {
    lines.push("--- My details ---");
    if (customer.name.trim()) lines.push(`Name: ${customer.name.trim()}`);
    if (customer.phone.trim()) lines.push(`Phone: ${customer.phone.trim()}`);
    if (customer.address.trim()) lines.push(`Address: ${customer.address.trim()}`);
    if (customer.preferredDate) lines.push(`Preferred delivery date: ${customer.preferredDate}`);
    if (customer.isGift) {
      lines.push("This is a gift order");
      if (customer.giftRecipientName.trim()) {
        lines.push(`Gift for: ${customer.giftRecipientName.trim()}`);
      }
      if (customer.giftMessage.trim()) {
        lines.push(`Gift message: ${customer.giftMessage.trim()}`);
      }
    }
    if (customer.notes.trim()) lines.push(`Notes: ${customer.notes.trim()}`);
    lines.push("");
  }

  let orderTotal = 0;
  let hasFreeDeliveryItem = false;

  cartItems.forEach((item, index) => {
    const num = index + 1;
    if (item.type === "mini-box") {
      lines.push(`[${num}] ${item.name} (${item.items.reduce((s, i) => s + i.quantity, 0)} pcs) — $${item.total}, free delivery`);
      lines.push("");
      for (const orderItem of item.items) {
        lines.push(`- ${orderItem.quantity}x ${orderItem.flavorName}`);
      }
      hasFreeDeliveryItem = true;
    } else {
      const hasMixed = item.items.length > 1;
      const flavorLabel = hasMixed ? "mixed flavors" : item.items[0]?.flavorName ?? "flavors";
      lines.push(`[${num}] Package — ${item.pieceCount} pieces — ${flavorLabel} — $${item.total}`);
      lines.push("");
      for (const orderItem of item.items) {
        lines.push(`- ${orderItem.quantity}x ${orderItem.flavorName}`);
      }
      lines.push(`Delivery: ${item.deliveryNote}`);
      if (item.deliveryNote.includes("free")) hasFreeDeliveryItem = true;
    }
    lines.push("");
    orderTotal += item.total;
  });

  lines.push(`Order total: $${orderTotal}`);

  if (!hasFreeDeliveryItem) {
    lines.push(`Delivery charge: $${settings.deliveryCharge} (applies once per order)`);
  } else {
    lines.push("At least one item qualifies for free delivery.");
  }

  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string, whatsappNumber: string): string {
  const number = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Package pricing rule: if ANY slot uses a non-classic flavor, the entire package
 * is priced at the tier's otherFlavorPrice. All-classic packages use classicPrice.
 */
export function getTierPrice(
  pieceCount: number,
  flavorIds: string[],
  flavors: Flavor[],
  tiers: PackageTier[],
): number {
  const tier = tiers.find((t) => t.pieceCount === pieceCount);
  if (!tier) return 0;

  const uniqueIds = [...new Set(flavorIds.filter(Boolean))];
  const allClassic =
    uniqueIds.length > 0 &&
    uniqueIds.every((id) => flavors.find((f) => f.id === id)?.isClassic ?? false);

  return allClassic ? tier.classicPrice : tier.otherFlavorPrice;
}

export function calculatePackagePrice(
  pieceCount: number,
  allocations: Record<string, number>,
  flavors: Flavor[],
  tiers: PackageTier[],
): number {
  const flavorIds = Object.entries(allocations)
    .filter(([, qty]) => qty > 0)
    .map(([id]) => id);

  return getTierPrice(pieceCount, flavorIds, flavors, tiers);
}

export function getPackageDeliveryNote(
  pieceCount: number,
  tiers: PackageTier[],
  settings: SiteSettings,
): string {
  const tier = tiers.find((t) => t.pieceCount === pieceCount);
  if (tier?.freeDelivery) {
    return "free delivery";
  }
  return `standard ($${settings.deliveryCharge} charge applies)`;
}

export function getTotalAllocated(allocations: Record<string, number>): number {
  return Object.values(allocations).reduce((sum, qty) => sum + qty, 0);
}

export function formatOrderItems(
  allocations: Record<string, number>,
  flavors: Flavor[],
): OrderItem[] {
  return flavors
    .filter((f) => (allocations[f.id] ?? 0) > 0)
    .map((f) => ({
      flavorId: f.id,
      flavorName: f.name,
      quantity: allocations[f.id] ?? 0,
    }));
}
