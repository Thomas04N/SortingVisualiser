import type { SortAction } from '../types';

export function bubbleSortActions(values: number[]): SortAction[] {
  const a = [...values];
  const actions: SortAction[] = [];

  for (let end = a.length - 1; end > 0; end--) {
    let swapped = false;

    for (let i = 0; i < end; i++) {
      actions.push({ type: 'compare', i, j: i + 1 });

      if (a[i] > a[i + 1]) {
        actions.push({ type: 'swap', i, j: i + 1 });
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        swapped = true;
      }
    }

    actions.push({ type: 'markSorted', i: end });

    if (!swapped) break;
  }

  actions.push({ type: 'markSorted', i: 0 });
  actions.push({ type: 'done' });

  return actions;
}
