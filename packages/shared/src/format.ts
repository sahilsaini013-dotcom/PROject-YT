// Volume/weight totals keep half-kilos (plates come in 1.25kg) but drop a
// trailing .0 so whole numbers stay clean.
export function formatKg(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

// Unit conversions — the database is canonical metric (kg/cm/ml); these render
// or accept the client's preferred display units. `unit_preference` is
// 'metric' | 'imperial'.
export type UnitPreference = "metric" | "imperial";

export const KG_PER_LB = 0.45359237;
export const CM_PER_IN = 2.54;

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}
export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}
export function cmToFtIn(cm: number): { ft: number; inches: number } {
  const totalInches = cm / CM_PER_IN;
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - ft * 12);
  // Carry 12" up to the next foot (e.g. 5'12" -> 6'0").
  return inches === 12 ? { ft: ft + 1, inches: 0 } : { ft, inches };
}
export function ftInToCm(ft: number, inches: number): number {
  return (ft * 12 + inches) * CM_PER_IN;
}

// Render a stored kg weight in the client's unit. kg keeps half-kilos like
// formatKg; lb rounds to whole pounds (plate math there is coarser).
export function formatWeight(kg: number, unit: UnitPreference): string {
  return unit === "imperial"
    ? `${Math.round(kgToLb(kg))} lb`
    : `${formatKg(kg)} kg`;
}

// The unit label alone, for input adornments and column headers.
export function weightUnitLabel(unit: UnitPreference): string {
  return unit === "imperial" ? "lb" : "kg";
}

// Water is stored in ml; clients read it in liters, trimmed to at most two
// decimals with no trailing zeros: 0 -> "0 L", 250 -> "0.25 L", 3000 -> "3 L".
export function formatWater(ml: number): string {
  return `${parseFloat((ml / 1000).toFixed(2))} L`;
}


// "Week 2 · Lower A" — disambiguates days that share a name across weeks.
export function sessionLabel(
  weekIndex: number | null | undefined,
  dayName: string | null | undefined,
): string {
  const name = dayName ?? "Workout";
  return weekIndex ? `Week ${weekIndex} · ${name}` : name;
}
