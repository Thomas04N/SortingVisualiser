import type { SortAction } from '../algorithms/types';

export type PlayerState = {
  values: number[];
  active: number[];
  sorted: Set<number>;
  comparisons: number;
  swaps: number;
  step: number;
};

export function initialPlayerState(values: number[]): PlayerState {
  return {
    values: [...values],
    active: [],
    sorted: new Set<number>(),
    comparisons: 0,
    swaps: 0,
    step: 0
  };
}

export function applyAction(state: PlayerState, action: SortAction): PlayerState {
  const next: PlayerState = {
    values: [...state.values],
    active: [],
    sorted: new Set(state.sorted),
    comparisons: state.comparisons,
    swaps: state.swaps,
    step: state.step + 1
  };

  switch (action.type) {
    case 'compare': {
      next.active = [action.i, action.j];
      next.comparisons += 1;
      return next;
    }
    case 'swap': {
      next.active = [action.i, action.j];
      next.swaps += 1;
      const a = next.values;
      [a[action.i], a[action.j]] = [a[action.j], a[action.i]];
      return next;
    }
    case 'markSorted': {
      next.sorted.add(action.i);
      return next;
    }
    case 'done': {
      next.active = [];
      // mark all sorted as a nice finish
      for (let i = 0; i < next.values.length; i++) next.sorted.add(i);
      return next;
    }
    default:
      return next;
  }
}
