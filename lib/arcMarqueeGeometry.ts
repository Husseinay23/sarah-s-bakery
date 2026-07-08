/** Geometry for the clipped-circle hero marquee arc. */

export interface ArcGeometry {
  cx: number;
  cy: number;
  R: number;
  W: number;
  H: number;
}

export function computeArcGeometry(
  width: number,
  height: number,
  apexY = 26,
  touchdownY?: number,
): ArcGeometry {
  const W = width;
  const H = height;
  const cx = W / 2;
  const touch = touchdownY ?? H - 30;
  const cy = (cx * cx + touch * touch - apexY * apexY) / (2 * (touch - apexY));
  const R = cy - apexY;
  return { cx, cy, R, W, H };
}

export function rollPosition(
  geom: ArcGeometry,
  thetaDeg: number,
  imageSize: number,
): { x: number; y: number; opacity: number } {
  const rad = (thetaDeg * Math.PI) / 180;
  const x = geom.cx + geom.R * Math.sin(rad) - imageSize / 2;
  const y = geom.cy - geom.R * Math.cos(rad) - imageSize / 2;

  const margin = 44;
  let opacity = 1;
  const centerY = y + imageSize / 2;
  if (centerY < margin) opacity = centerY / margin;
  else if (centerY > geom.H - margin) opacity = (geom.H - centerY) / margin;
  opacity = Math.max(0, Math.min(1, opacity));

  return { x, y, opacity };
}
