export function randomFillSlots(capacity: number, flavorIds: string[]): (string | null)[] {
  if (capacity <= 0 || flavorIds.length === 0) {
    return Array(capacity).fill(null);
  }
  return Array.from({ length: capacity }, () => {
    return flavorIds[Math.floor(Math.random() * flavorIds.length)] ?? null;
  });
}

export function getMinDeliveryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}
