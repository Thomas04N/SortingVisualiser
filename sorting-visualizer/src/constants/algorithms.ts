export type Algorithm = 'bubble' | 'insertion' | 'merge' | 'quick' | 'heap' | 'selection' | 'bogo';

export type Complexity = { best: string; average: string; worst: string };

export const ALGORITHM_COMPLEXITY: Record<Algorithm, Complexity> = {
  bubble: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  insertion: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  merge: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  quick: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
  heap: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  selection: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
  bogo: { best: 'O(n)', average: 'O(n · n!)', worst: 'Unbounded (n!)' }
};
