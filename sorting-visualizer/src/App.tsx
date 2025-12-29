import { useEffect, useMemo, useRef, useState } from 'react';
import { Bars } from './components/Bars';
import { randomArray } from './utils/randomArray';
import { bubbleSortActions } from './algorithms/sorting/bubble';
import { applyAction, initialPlayerState, type PlayerState } from './engine/sortPlayer';
import type { SortAction } from './algorithms/types';

export default function App() {
  const [size, setSize] = useState(40);
  const [baseValues, setBaseValues] = useState<number[]>(() => randomArray(40, 200));

  const [player, setPlayer] = useState<PlayerState>(() => initialPlayerState(baseValues));
  const [actions, setActions] = useState<SortAction[]>([]);
  const [actionIndex, setActionIndex] = useState(0);

  const [speedMs, setSpeedMs] = useState(25);
  const [isPlaying, setIsPlaying] = useState(false);

  const timerRef = useRef<number | null>(null);

  // Keep player in sync when baseValues changes (shuffle/size)
  useEffect(() => {
    setPlayer(initialPlayerState(baseValues));
    setActions([]);
    setActionIndex(0);
    setIsPlaying(false);
  }, [baseValues]);

  const canStep = actionIndex < actions.length;

  function buildActions() {
    const a = bubbleSortActions(baseValues);
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

  return (
    <div style={{ minHeight: '100vh', padding: 24, background: '#0b1020', color: 'white' }}>
      <h1 style={{ marginTop: 0 }}>Sorting Algorithm Visualizer</h1>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
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
            Start (Bubble)
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
