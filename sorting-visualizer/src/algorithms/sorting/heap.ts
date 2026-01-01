import type { SortAction } from '../types';

export function heapSortActions(values: number[]): SortAction[] {
    const a = [...values];
    const actions: SortAction[] = [];

    // Helper function to maintain the heap property
    const heapify = (length: number, index: number) => {

        // Assume the largest is the root
        let largest = index;

        // Calculate left and right child indices
        const left = 2 * index + 1;
        const right = 2 * index + 2;

        // If left child is larger than root
        if (left < length) {
            actions.push({ type: 'compare', i: left, j: largest });
            if (a[left] > a[largest]) {
                largest = left;
            }
        }

        // If right child is larger than largest so far
        if (right < length) {
            actions.push({ type: 'compare', i: right, j: index });
            if (a[right] > a[largest]) {
                largest = right;
            }
        }

        // If largest is not root
        if (largest !== index) {
            actions.push({ type: 'swap', i: index, j: largest });
            [a[index], a[largest]] = [a[largest], a[index]];
            heapify(length, largest);
        }
    };

    const n = a.length;

    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i);
    }

    // One by one extract elements from heap
    for (let end = n - 1; end > 0; end--) {
        actions.push({ type: 'swap', i: 0, j: end });
        [a[0], a[end]] = [a[end], a[0]];
        actions.push({ type: 'markSorted', i: end });
        heapify(end, 0);
    }

    // Mark the first element as sorted
    actions.push({ type: 'markSorted', i: 0 });
    // Indicate completion
    actions.push({ type: 'done' });

    return actions;
}