import type { SortAction } from '../types';;

export function selectionSortActions(arr: number[]): SortAction[] {
  const actions: SortAction[] = [];
  const a = [...arr];

  // Selection sort algorithm with action recording
  for (let i = 0; i < a.length; i++) {

    // Assume the minimum is the first element of the unsorted portion
    let minIndex = i;

    // Find the index of the minimum element in the unsorted portion
    for (let j = i + 1; j < a.length; j++) {
      actions.push({ type: 'compare', i: minIndex, j });
      if (a[j] < a[minIndex]) {
        minIndex = j;
      }
    }

    // Swap the found minimum element with the first element of the unsorted portion
    if (minIndex !== i) {
      actions.push({ type: 'swap', i, j: minIndex });
      [a[i], a[minIndex]] = [a[minIndex], a[i]];
    }

    // Mark the element at index i as sorted
    actions.push({ type: 'markSorted', i });
  }

  // Final action to indicate completion
  actions.push({ type: 'done' });
  return actions;
}
