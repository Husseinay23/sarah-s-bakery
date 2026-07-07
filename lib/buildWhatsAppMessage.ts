import type { Flavor, MiniBoxConfig, OrderItem, PackageTier, SiteSettings } from "./types";

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

export function buildWhatsAppUrl(message: string, whatsappNumber: string): string {
  const number = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function calculatePackagePrice(
  pieceCount: number,
  allocations: Record<string, number>,
  flavors: Flavor[],
  tiers: PackageTier[],
): number {
  const tier = tiers.find((t) => t.pieceCount === pieceCount);
  if (!tier) return 0;

  const hasNonClassic = Object.entries(allocations).some(([flavorId, qty]) => {
    if (qty <= 0) return false;
    const flavor = flavors.find((f) => f.id === flavorId);
    return flavor && !flavor.isClassic;
  });

  return hasNonClassic ? tier.otherFlavorPrice : tier.classicPrice;
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
