"use client";

import { useActionState } from "react";
import { Button, ErrorText, Input, Label } from "@/components/ui";
import { setTargets, type TargetsResult } from "./actions";

type Current = {
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  water_ml: number | null;
  notes: string | null;
} | null;

const fields: { name: string; label: string; unit: string }[] = [
  { name: "calories", label: "Calories", unit: "kcal" },
  { name: "protein_g", label: "Protein", unit: "g" },
  { name: "carbs_g", label: "Carbs", unit: "g" },
  { name: "fat_g", label: "Fat", unit: "g" },
  { name: "water_ml", label: "Water", unit: "ml" },
];

export function TargetsForm({
  clientId,
  current,
}: {
  clientId: string;
  current: Current;
}) {
  const action = setTargets.bind(null, clientId);
  const [result, formAction, pending] = useActionState<
    TargetsResult | null,
    FormData
  >(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name}>
            <Label htmlFor={f.name}>
              {f.label} ({f.unit})
            </Label>
            <Input
              id={f.name}
              name={f.name}
              type="number"
              inputMode="numeric"
              min={0}
              defaultValue={
                (current
                  ? (current[f.name as keyof NonNullable<Current>] as
                      | number
                      | null)
                  : null) ?? ""
              }
            />
          </div>
        ))}
      </div>
      <div>
        <Label htmlFor="notes">Guidance (optional)</Label>
        <Input
          id="notes"
          name="notes"
          defaultValue={current?.notes ?? ""}
          placeholder="e.g. hit protein first, carbs around training"
        />
      </div>
      {result && !result.ok && <ErrorText>{result.error}</ErrorText>}
      {result?.ok && <p className="text-sm text-success">Targets saved.</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save targets"}
      </Button>
    </form>
  );
}
