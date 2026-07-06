// Lightweight inline-SVG charts (no external deps; CSP-safe). Dark-theme,
// brand-token colored. Server-renderable.

export function LineChart({
  points,
  width = 300,
  height = 80,
  color = "var(--color-accent)",
}: {
  points: { x: number; y: number }[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (points.length === 0) return null;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pad = 6;
  const sx = (x: number) =>
    maxX === minX
      ? width / 2
      : pad + ((x - minX) / (maxX - minX)) * (width - 2 * pad);
  const sy = (y: number) =>
    maxY === minY
      ? height / 2
      : height - pad - ((y - minY) / (maxY - minY)) * (height - 2 * pad);

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path d={d} fill="none" stroke={color} strokeWidth="2" />
      {points.length === 1 && (
        <circle cx={sx(points[0].x)} cy={sy(points[0].y)} r="3" fill={color} />
      )}
      <circle
        cx={sx(points[points.length - 1].x)}
        cy={sy(points[points.length - 1].y)}
        r="3"
        fill={color}
      />
    </svg>
  );
}

export function BarChart({
  bars,
  height = 90,
  color = "var(--color-info)",
}: {
  bars: { label: string; value: number }[];
  height?: number;
  color?: string;
}) {
  const max = Math.max(1, ...bars.map((b) => b.value));
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {bars.map((b, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t"
              style={{
                height: `${(b.value / max) * 100}%`,
                minHeight: b.value > 0 ? 4 : 0,
                background: color,
              }}
              aria-hidden="true"
            />
          </div>
          <span className="tnum text-[10px] text-text-muted">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
