import type { CartItem } from "./types";

const LAST_ORDER_KEY = "sarahs-bakery-last-order";

export interface SavedOrder {
  phone: string;
  items: CartItem[];
  savedAt: number;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function saveLastOrder(phone: string, items: CartItem[]): void {
  if (typeof window === "undefined" || items.length === 0) return;
  const normalized = normalizePhone(phone);
  if (normalized.length < 8) return;

  const saved: SavedOrder = {
    phone: normalized,
    items: items.map((item) => ({ ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` })),
    savedAt: Date.now(),
  };
  localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(saved));
}

export function getLastOrderForPhone(phone: string): CartItem[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as SavedOrder;
    if (normalizePhone(phone) !== saved.phone) return null;
    return saved.items.map((item) => ({
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    }));
  } catch {
    return null;
  }
}

export function hasLastOrderForPhone(phone: string): boolean {
  return getLastOrderForPhone(phone) !== null;
}
