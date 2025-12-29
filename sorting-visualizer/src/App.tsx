import { useMemo, useState } from 'react';
import { Bars } from './components/Bars';
import { randomArray } from './utils/randomArray';

export default function App() {
  const [size, setSize] = useState(40);
  const [values, setValues] = useState(() => randomArray(40, 200));

  const max = useMemo(() => Math.max(...values, 1), [values]);

  return (
    <div style={{ minHeight: '100vh', padding: 24, background: '#0b1020', color: 'white' }}>
      <h1 style={{ marginTop: 0 }}>Sorting Algorithm Visualizer</h1>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <label>
          Size: {size}
          <input
            style={{ display: 'block', width: 200 }}
            type="range"
            min={10}
            max={120}
            value={size}
            onChange={(e) => {
              const n = Number(e.target.value);
              setSize(n);
              setValues(randomArray(n, 200));
            }}
          />
        </label>

        <button onClick={() => setValues(randomArray(size, 200))}>Shuffle</button>

        <div style={{ marginLeft: 'auto', opacity: 0.8 }}>Max: {max}</div>
      </div>

      <Bars values={values} />
    </div>
  );
}
