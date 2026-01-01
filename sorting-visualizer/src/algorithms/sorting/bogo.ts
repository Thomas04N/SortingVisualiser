import type { SortAction } from '../types';

function isSorted(a: number[]) {
  for (let i = 1; i < a.length; i++) {
    if (a[i - 1] > a[i]) return false;
  }
  return true;
}

function shuffle(a: number[], actions: SortAction[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    actions.push({ type: 'swap', i, j });
    [a[i], a[j]] = [a[j], a[i]];
  }
}

export function bogoSortActions(
  arr: number[],
  maxShuffles = 200
): SortAction[] {
  const actions: SortAction[] = [];
  const a = [...arr];

  let attempts = 0;
  while (!isSorted(a) && attempts < maxShuffles) {
    shuffle(a, actions);
    attempts++;
  }

  // Finalize so the visualizer marks everything sorted (green bars)
  actions.push({ type: 'done' });

  return actions;
}
