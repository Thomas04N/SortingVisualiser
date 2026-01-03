import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
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
import { ALGORITHM_COMPLEXITY, type Algorithm } from './constants/algorithms';
import { ALGORITHM_STEPS } from './constants/algorithmSteps';

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

  const complexity = ALGORITHM_COMPLEXITY[algo];
  const steps = ALGORITHM_STEPS[algo];

  const algoLabel =
    algo === 'bubble' ? 'Bubble Sort' : algo === 'insertion' ? 'Insertion Sort' : algo === 'merge' ? 'Merge Sort' : algo ==  'quick' ? 'Quick Sort' : algo == 'heap' ? 'Heap Sort' : algo == 'selection' ? 'Selection Sort' : 'Bogo Sort';

  const shellCard: CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    boxShadow: '0 18px 48px rgba(0,0,0,0.35)',
    padding: 18
  };

  const controlButton: CSSProperties = {
    padding: '10px 14px',
    borderRadius: 12,
    border: 'none',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    boxShadow: '0 12px 30px rgba(94, 92, 230, 0.35)'
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '32px 36px',
        background: 'radial-gradient(circle at 20% 20%, rgba(88,28,135,0.25), transparent 30%), radial-gradient(circle at 80% 10%, rgba(37,99,235,0.25), transparent 26%), #0b1020',
        color: '#e5e7eb',
        fontFamily: '"Space Grotesk", "Inter", system-ui, -apple-system, sans-serif'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, letterSpacing: -0.5 }}>Sorting Algorithm Visualizer</h1>
          <p style={{ margin: '4px 0 0', opacity: 0.8 }}>Tune settings, play the sort, and follow the algorithm story.</p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(320px, 0.95fr)',
          gap: 24,
          alignItems: 'start'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ ...shellCard, background: 'rgba(255,255,255,0.035)' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 12,
                alignItems: 'end'
              }}
            >
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontWeight: 600, color: '#c7d2fe' }}>
                Algorithm
                <select
                  style={{
                    height: 42,
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.04)',
                    color: '#e5e7eb',
                    padding: '0 10px',
                    fontWeight: 600
                  }}
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
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#c7d2fe' }}>
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

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontWeight: 600, color: '#c7d2fe' }}>
                Size: {size}
                <input
                  style={{ display: 'block', width: '100%' }}
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

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontWeight: 600, color: '#c7d2fe' }}>
                Speed (ms): {speedMs}
                <input
                  style={{ display: 'block', width: '100%' }}
                  type="range"
                  min={1}
                  max={150}
                  value={speedMs}
                  onChange={(e) => setSpeedMs(Number(e.target.value))}
                />
              </label>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
              <button style={controlButton} onClick={() => setBaseValues(randomArray(size, 200))} disabled={isPlaying}>
                Shuffle
              </button>

              <button style={controlButton} onClick={buildActions} disabled={isPlaying}>
                Reset
              </button>

              {!isPlaying ? (
                <button style={controlButton} onClick={start} disabled={actions.length > 0 && !canStep}>
                  Start ({algoLabel})
                </button>
              ) : (
                <button style={controlButton} onClick={pause}>
                  Pause
                </button>
              )}

              <button style={controlButton} onClick={stepOnce} disabled={isPlaying || !canStep}>
                Step
              </button>
            </div>
          </div>

          <div style={{ ...shellCard, padding: 10 }}>
            <Bars values={player.values} active={player.active} sorted={player.sorted} />
          </div>
        </div>

        <div style={{ ...shellCard, position: 'sticky', top: 24, background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ fontWeight: 700, letterSpacing: 0.4 }}>Statistics</div>
              <div style={{ opacity: 0.7, fontSize: 12 }}>Live counters while you play</div>
            </div>
            <span
              style={{
                padding: '6px 10px',
                borderRadius: 12,
                background: 'rgba(37,99,235,0.15)',
                border: '1px solid rgba(37,99,235,0.4)',
                fontWeight: 700,
                color: '#bfdbfe'
              }}
            >
              {algoLabel}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
            <StatChip label="Comparisons" value={player.comparisons} />
            <StatChip label="Swaps" value={player.swaps} />
            <StatChip label="Step" value={player.step} />
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Time Complexity</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
              <StatChip label="Best" value={complexity.best} muted />
              <StatChip label="Average" value={complexity.average} muted />
              <StatChip label="Worst" value={complexity.worst} muted />
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Algorithm Steps</div>
            <ol style={{ paddingLeft: 18, margin: 0, display: 'grid', gap: 6 }}>
              {steps.map((step, idx) => (
                <li
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    padding: '10px 12px',
                    lineHeight: 1.4,
                    boxShadow: '0 10px 24px rgba(0,0,0,0.22)'
                  }}
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

type StatChipProps = { label: string; value: ReactNode; muted?: boolean };

function StatChip({ label, value, muted }: StatChipProps) {
  return (
    <div
      style={{
        padding: '10px 12px',
        borderRadius: 12,
        background: muted ? 'rgba(255,255,255,0.03)' : 'rgba(37,99,235,0.1)',
        border: muted ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(37,99,235,0.35)',
        boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <span style={{ fontSize: 12, opacity: 0.75 }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}
