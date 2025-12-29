export function randomArray(size: number, max = 100): number[] {
  return Array.from({ length: size }, () => 5 + Math.floor(Math.random() * max));
}
