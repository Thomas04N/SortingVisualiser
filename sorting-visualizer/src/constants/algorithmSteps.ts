import type { Algorithm } from './algorithms';

// Human-readable steps for each algorithm to display alongside the visualization
export const ALGORITHM_STEPS: Record<Algorithm, string[]> = {
  bubble: [
    'Loop through the array, comparing adjacent items',
    'Swap neighbors that are out of order',
    'After each pass, the largest remaining element bubbles to the end',
    'Repeat passes until no swaps occur'
  ],
  insertion: [
    'Start from the second element',
    'Pick the current element and compare it backward',
    'Shift larger elements right to make space',
    'Insert the picked element into its sorted spot',
    'Advance and repeat'
  ],
  merge: [
    'Recursively split the array into halves until size 1',
    'Merge pairs of sorted halves',
    'During merge, repeatedly take the smaller front element',
    'Return the fully merged sorted array'
  ],
  quick: [
    'Choose a pivot (here: last element of the partition)',
    'Partition: move items < pivot to the left, > pivot to the right',
    'Place pivot between the partitions',
    'Recursively quicksort left and right partitions'
  ],
  heap: [
    'Build a max heap from the array',
    'Swap the root (max) with the last element of the heap',
    'Reduce heap size and heapify the root to restore heap order',
    'Repeat swap + heapify until the heap shrinks to 1'
  ],
  selection: [
    'Scan the unsorted region to find the smallest element',
    'Swap that minimum with the first element of the region',
    'Move the boundary forward and repeat',
    'Continue until the array is sorted'
  ],
  bogo: [
    'Shuffle the array randomly',
    'Check if the array is sorted',
    'If not sorted, repeat shuffle and check',
    'Stop once a sorted order appears (or after a cap if enabled)'
  ]
};
