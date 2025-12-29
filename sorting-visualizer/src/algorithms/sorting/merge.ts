import type { SortAction } from '../types';

export function mergeSortActions(values: number[]): SortAction[] {
  const a = [...values];
  const aux = new Array<number>(a.length);
  const actions: SortAction[] = [];

  function merge(lo: number, mid: number, hi: number) {
    // Copy into aux
    for (let k = lo; k <= hi; k++) aux[k] = a[k];

    let i = lo;
    let j = mid + 1;

    for (let k = lo; k <= hi; k++) {
      if (i > mid) {
        // Take from right
        actions.push({ type: 'overwrite', i: k, value: aux[j] });
        a[k] = aux[j];
        j++;
      } else if (j > hi) {
        // Take from left
        actions.push({ type: 'overwrite', i: k, value: aux[i] });
        a[k] = aux[i];
        i++;
      } else {
        // Compare current candidates
        actions.push({ type: 'compare', i, j });

        if (aux[i] <= aux[j]) {
          actions.push({ type: 'overwrite', i: k, value: aux[i] });
          a[k] = aux[i];
          i++;
        } else {
          actions.push({ type: 'overwrite', i: k, value: aux[j] });
          a[k] = aux[j];
          j++;
        }
      }
    }

    // Mark this segment as sorted (visually nice)
    for (let k = lo; k <= hi; k++) actions.push({ type: 'markSorted', i: k });
  }

  function sort(lo: number, hi: number) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  if (a.length > 0) sort(0, a.length - 1);
  actions.push({ type: 'done' });

  return actions;
}
