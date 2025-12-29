type BarsProps = {
  values: number[];
  active?: number[];
  sorted?: Set<number>;
};

export function Bars({ values, active = [], sorted = new Set() }: BarsProps) {
  const maxVal = Math.max(...values, 1);

  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 360 }}>
      {values.map((v, i) => {
        const isActive = active.includes(i);
        const isSorted = sorted.has(i);

        return (
          <div
            key={i}
            title={`${v}`}
            style={{
              flex: 1,
              height: `${(v / maxVal) * 100}%`,
              borderRadius: 4,
              opacity: isSorted ? 0.75 : 1,
              outline: isActive ? '2px solid white' : 'none',
              background: isSorted ? '#2dd4bf' : '#60a5fa'
            }}
          />
        );
      })}
    </div>
  );
}
