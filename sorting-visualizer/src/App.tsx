import { useEffect, useMemo, useRef, useState } from 'react';
import { Bars } from './components/Bars';
import { randomArray } from './utils/randomArray';

import type { SortAction } from './algorithms/types';
import { bubbleSortActions } from './algorithms/sorting/bubble';
import { insertionSortActions } from './algorithms/sorting/insertion';
import { mergeSortActions } from './algorithms/sorting/merge';
import { quickSortActions } from './algorithms/sorting/quick';
import {heapSortActions} from './algorithms/sorting/heap';
import { selectionSortActions } from './algorithms/sorting/selection';
import { bogoSortActions } from './algorithms/sorting/bogo';

import { applyAction, initialPlayerState, type PlayerState } from './engine/sortPlayer';

type Algorithm = 'bubble' | 'insertion' | 'merge' | 'quick' | 'heap' | 'selection' | 'bogo';

export default function App() {
  const [algo, setAlgo] = useState<Algorithm>('bubble');

  const [size, setSize] = useState(5);
  const [baseValues, setBaseValues] = useState<number[]>(() => randomArray(5, 200));
  const bogoBlocked = size > 8;
  const [bogoInfinite, setBogoInfinite] = useState(false);

  const [player, setPlayer] = useState<PlayerState>(() => initialPlayerState(baseValues));
  const [actions, setActions] = useState<SortAction[]>([]);
  const [actionIndex, setActionIndex] = useState(0);

  const [speedMs, setSpeedMs] = useState(25);
  const [isPlaying, setIsPlaying] = useState(false);

  const timerRef = useRef<number | null>(null);

  // Reset playback state when the base array changes
  useEffect(() => {
    setPlayer(initialPlayerState(baseValues));
    setActions([]);
    setActionIndex(0);
    setIsPlaying(false);
  }, [baseValues]);

  // Also reset when algorithm changes (keeps UX predictable)
  useEffect(() => {
    setPlayer(initialPlayerState(baseValues));
    setActions([]);
    setActionIndex(0);
    setIsPlaying(false);
    if (algo !== 'bogo') setBogoInfinite(false);
  }, [algo, baseValues]);

  const canStep = actionIndex < actions.length;

  function generateActions(values: number[], algorithm: Algorithm): SortAction[] {
    switch (algorithm) {
      case 'bubble':
        return bubbleSortActions(values);
      case 'insertion':
        return insertionSortActions(values);
      case 'merge':
        return mergeSortActions(values);
      case 'quick':
        return quickSortActions(values);
      case 'heap':
        return heapSortActions(values);
      case 'selection':
        return selectionSortActions(values);
      case 'bogo':
        return bogoSortActions(values, bogoInfinite ? Infinity : undefined);
      default:
        return bubbleSortActions(values);
    }
  }

  function buildActions() {
    const a = generateActions(baseValues, algo);
    setActions(a);
    setActionIndex(0);
    setPlayer(initialPlayerState(baseValues));
  }

  function stepOnce() {
    if (!canStep) return;
    const action = actions[actionIndex];
    setPlayer((prev) => applyAction(prev, action));
    setActionIndex((i) => i + 1);
  }

  function start() {
    if (actions.length === 0) buildActions();
    setIsPlaying(true);
  }

  function pause() {
    setIsPlaying(false);
  }

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;
    if (!actions.length) return;

    if (!canStep) {
      setIsPlaying(false);
      return;
    }

    timerRef.current = window.setTimeout(() => {
      stepOnce();
    }, speedMs);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, actionIndex, actions, speedMs, canStep]);

  const max = useMemo(() => Math.max(...player.values, 1), [player.values]);

  const algoLabel =
    algo === 'bubble' ? 'Bubble Sort' : algo === 'insertion' ? 'Insertion Sort' : algo === 'merge' ? 'Merge Sort' : algo ==  'quick' ? 'Quick Sort' : algo == 'heap' ? 'Heap Sort' : algo == 'selection' ? 'Selection Sort' : 'Bogo Sort';

  return (
    <div style={{ minHeight: '100vh', padding: 24, background: '#0b1020', color: 'white' }}>
      <h1 style={{ marginTop: 0 }}>Sorting Algorithm Visualizer</h1>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
        <label>
          Algorithm
          <select
            style={{ display: 'block', width: 220 }}
            value={algo}
            onChange={(e) => {
              const nextAlgo = e.target.value as Algorithm;
              if (nextAlgo === 'bogo' && bogoBlocked) {
                window.alert('Bogo sort is disabled for arrays larger than 8 items to avoid freezing the app.');
                return;
              }
              setAlgo(nextAlgo);
            }}
            disabled={isPlaying}
          >
            <option value="bubble">Bubble Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
            <option value="heap">Heap Sort</option>
            <option value="selection">Selection Sort</option>
            <option
              value="bogo"
              aria-disabled={bogoBlocked}
              style={{ color: bogoBlocked ? '#94a3b8' : 'inherit' }}
            >
              Bogo Sort (max size 8)
            </option>
          </select>
        </label>
        {algo === 'bogo' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={bogoInfinite}
              onChange={(e) => {
                const next = e.target.checked;
                if (next) {
                  const ok = window.confirm(
                    'Infinite Bogo Sort will run without a shuffle cap and may take a long time. Continue?'
                  );
                  if (!ok) return;
                }
                setBogoInfinite(next);
              }}
              disabled={bogoBlocked || isPlaying}
            />
            Infinite Bogo Sort
          </label>
        )}

        <label>
          Size: {size}
          <input
            style={{ display: 'block', width: 240 }}
            type="range"
            min={5}
            max={120}
            value={size}
            onChange={(e) => {
              const n = Number(e.target.value);
              setSize(n);
              setBaseValues(randomArray(n, 200));
              if (n > 8 && algo === 'bogo') {
                setAlgo('bubble');
              }
            }}
            disabled={isPlaying}
          />
        </label>

        <label>
          Speed (ms): {speedMs}
          <input
            style={{ display: 'block', width: 240 }}
            type="range"
            min={1}
            max={150}
            value={speedMs}
            onChange={(e) => setSpeedMs(Number(e.target.value))}
          />
        </label>

        <button onClick={() => setBaseValues(randomArray(size, 200))} disabled={isPlaying}>
          Shuffle
        </button>

        <button onClick={buildActions} disabled={isPlaying}>
          Reset
        </button>

        {!isPlaying ? (
          <button onClick={start} disabled={actions.length > 0 && !canStep}>
            Start ({algoLabel})
          </button>
        ) : (
          <button onClick={pause}>Pause</button>
        )}

        <button onClick={stepOnce} disabled={isPlaying || !canStep}>
          Step
        </button>

        <div style={{ marginLeft: 'auto', opacity: 0.85 }}>
          <div>Comparisons: {player.comparisons}</div>
          <div>Swaps: {player.swaps}</div>
          <div>Step: {player.step}</div>
          <div>Max: {max}</div>
        </div>
      </div>

      <Bars values={player.values} active={player.active} sorted={player.sorted} />
    </div>
  );
}
