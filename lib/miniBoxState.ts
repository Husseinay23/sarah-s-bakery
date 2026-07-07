import type { OrderItem } from "./types";

export const MINI_BOX_CAPACITY = 12;

export function createEmptySlots(capacity: number = MINI_BOX_CAPACITY): (string | null)[] {
  return Array(capacity).fill(null);
}

export function getNextEmptySlot(slots: (string | null)[]): number {
  return slots.findIndex((s) => s === null);
}

export function getLastFlavorSlot(slots: (string | null)[], flavorId: string): number {
  for (let i = slots.length - 1; i >= 0; i--) {
    if (slots[i] === flavorId) return i;
  }
  return -1;
}

export function countFlavor(slots: (string | null)[], flavorId: string): number {
  return slots.filter((s) => s === flavorId).length;
}

export function addToSlots(slots: (string | null)[], flavorId: string): {
  slots: (string | null)[];
  slotIndex: number;
} | null {
  const index = getNextEmptySlot(slots);
  if (index === -1) return null;
  const next = [...slots];
  next[index] = flavorId;
  return { slots: next, slotIndex: index };
}

export function removeSlotAt(
  slots: (string | null)[],
  index: number,
): { slots: (string | null)[]; slotIndex: number; flavorId: string } | null {
  const flavorId = slots[index];
  if (!flavorId) return null;
  const next = [...slots];
  next[index] = null;
  return { slots: next, slotIndex: index, flavorId };
}

export function removeFromSlots(slots: (string | null)[], flavorId: string): {
  slots: (string | null)[];
  slotIndex: number;
} | null {
  const index = getLastFlavorSlot(slots, flavorId);
  if (index === -1) return null;
  const next = [...slots];
  next[index] = null;
  return { slots: next, slotIndex: index };
}

export function slotsToOrderItems(
  slots: (string | null)[],
  flavorNames: Record<string, string>,
): OrderItem[] {
  const counts: Record<string, number> = {};
  for (const id of slots) {
    if (id) counts[id] = (counts[id] ?? 0) + 1;
  }
  return Object.entries(counts).map(([flavorId, quantity]) => ({
    flavorId,
    flavorName: flavorNames[flavorId] ?? flavorId,
    quantity,
  }));
}

export function getFilledCount(slots: (string | null)[]): number {
  return slots.filter(Boolean).length;
}
