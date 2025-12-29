export type SortAction =
  | { type: 'compare'; i: number; j: number }
  | { type: 'swap'; i: number; j: number }
  | { type: 'markSorted'; i: number }
  | { type: 'done' };
