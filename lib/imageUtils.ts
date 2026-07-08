/** Firebase Storage PNGs are large cutouts — skip Next.js optimizer to avoid 500/timeouts. */
export function isFirebaseStorageUrl(src: string): boolean {
  return src.includes("firebasestorage.googleapis.com");
}

export function shouldBypassImageOptimization(src: string): boolean {
  return isFirebaseStorageUrl(src);
}
