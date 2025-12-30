import type { SortAction } from '../types';

export function quickSortActions(values: number[]): SortAction[] {
    const a = [...values];
    const actions: SortAction[] = [];
    
    function partition(lo: number, hi: number): number {
        const pivot = a[hi];
        let i = lo - 1; 
        for (let j = lo; j < hi; j++) {
            actions.push({ type: 'compare', i: j, j: hi });
            if (a[j] < pivot) {
                i++;
                actions.push({ type: 'swap', i, j });
                [a[i], a[j]] = [a[j], a[i]];
            }
        }
        actions.push({ type: 'swap', i: i + 1, j: hi });
        [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
        return i + 1;
    }
    
    function sort(lo: number, hi: number) {
        if (lo < hi) {
            const p = partition(lo, hi);
            sort(lo, p - 1);
            sort(p + 1, hi);
        } else if (lo === hi) {
            actions.push({ type: 'markSorted', i: lo });
        }
    }
    
    if (a.length > 0) sort(0, a.length - 1);
    actions.push({ type: 'done' });
    
    return actions;
}