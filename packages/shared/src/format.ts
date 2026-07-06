// Volume/weight totals keep half-kilos (plates come in 1.25kg) but drop a
// trailing .0 so whole numbers stay clean.
export function formatKg(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

// "Week 2 · Lower A" — disambiguates days that share a name across weeks.
export function sessionLabel(
  weekIndex: number | null | undefined,
  dayName: string | null | undefined,
): string {
  const name = dayName ?? "Workout";
  return weekIndex ? `Week ${weekIndex} · ${name}` : name;
}
