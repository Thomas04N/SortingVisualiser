import type { SortAction } from '../types';

export function insertionSortActions(values: number[]): SortAction[] {
  const a = [...values];
  const actions: SortAction[] = [];

  // Standard insertion sort using adjacent swaps (easy to visualise)
  for (let i = 1; i < a.length; i++) {
    let j = i;

    while (j > 0) {
      actions.push({ type: 'compare', i: j - 1, j });

      if (a[j - 1] <= a[j]) break;

      actions.push({ type: 'swap', i: j - 1, j });
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      j--;
    }

    // Everything up to i is sorted at this point (in insertion sort)
    actions.push({ type: 'markSorted', i });
  }

  if (a.length > 0) actions.push({ type: 'markSorted', i: 0 });
  actions.push({ type: 'done' });

  return actions;
}
