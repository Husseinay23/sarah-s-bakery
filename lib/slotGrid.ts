export function getGridCols(count: number): number {
  switch (count) {
    case 1:
      return 1;
    case 4:
      return 2;
    case 6:
      return 3;
    case 9:
      return 3;
    case 12:
      return 4;
    case 24:
      return 6;
    default:
      return Math.min(6, Math.ceil(Math.sqrt(count)));
  }
}
