import { useEffect, useMemo, useRef, useState } from 'react';
import { Bars } from './components/Bars';
import { randomArray } from './utils/randomArray';

import type { SortAction } from './algorithms/types';
import { bubbleSortActions } from './algorithms/sorting/bubble';
import { insertionSortActions } from './algorithms/sorting/insertion';
import { mergeSortActions } from './algorithms/sorting/merge';
import { quickSortActions } from './algorithms/sorting/quick';

import { applyAction, initialPlayerState, type PlayerState } from './engine/sortPlayer';

type Algorithm = 'bubble' | 'insertion' | 'merge' | 'quick';

export default function App() {
  const [algo, setAlgo] = useState<Algorithm>('bubble');

  const [size, setSize] = useState(40);
  const [baseValues, setBaseValues] = useState<number[]>(() => randomArray(40, 200));

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
    algo === 'bubble' ? 'Bubble Sort' : algo === 'insertion' ? 'Insertion Sort' : algo === 'merge' ? 'Merge Sort' : 'Quick Sort';

  return (
    <div style={{ minHeight: '100vh', padding: 24, background: '#0b1020', color: 'white' }}>
      <h1 style={{ marginTop: 0 }}>Sorting Algorithm Visualizer</h1>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
        <label>
          Algorithm
          <select
            style={{ display: 'block', width: 220 }}
            value={algo}
            onChange={(e) => setAlgo(e.target.value as Algorithm)}
            disabled={isPlaying}
          >
            <option value="bubble">Bubble Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
          </select>
        </label>

        <label>
          Size: {size}
          <input
            style={{ display: 'block', width: 240 }}
            type="range"
            min={10}
            max={120}
            value={size}
            onChange={(e) => {
              const n = Number(e.target.value);
              setSize(n);
              setBaseValues(randomArray(n, 200));
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
