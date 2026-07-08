export interface FlavorLayoutSlot {
  rotation: number;
  yOffset: number;
  tagSide: "left" | "right";
  tagRotation: number;
}

/** Deterministic per-index offsets — never use Math.random() (hydration-safe). */
export const FLAVOR_LAYOUT: FlavorLayoutSlot[] = [
  { rotation: -4, yOffset: 0, tagSide: "right", tagRotation: 6 },
  { rotation: 3, yOffset: 18, tagSide: "left", tagRotation: -5 },
  { rotation: -2, yOffset: -10, tagSide: "right", tagRotation: 7 },
  { rotation: 5, yOffset: 8, tagSide: "left", tagRotation: -6 },
  { rotation: -6, yOffset: 0, tagSide: "right", tagRotation: 5 },
  { rotation: 2, yOffset: 14, tagSide: "left", tagRotation: -4 },
  { rotation: -3, yOffset: -6, tagSide: "right", tagRotation: 6 },
];

export function getFlavorLayout(index: number): FlavorLayoutSlot {
  return FLAVOR_LAYOUT[index % FLAVOR_LAYOUT.length];
}
