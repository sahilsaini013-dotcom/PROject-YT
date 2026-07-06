"use client";

import { useActionState } from "react";
import { Button, Card, ErrorText } from "@/components/ui";
import { submitCheckIn, type CheckInResult } from "./actions";

type Existing = {
  sleep_quality: number | null;
  sleep_hours: number | null;
  soreness: number | null;
  energy: number | null;
  mood: number | null;
  motivation: number | null;
  stress: number | null;
  pain_note: string | null;
  comment: string | null;
} | null;

const scales: { name: keyof NonNullable<Existing>; label: string }[] = [
  { name: "sleep_quality", label: "Sleep quality" },
  { name: "soreness", label: "Soreness" },
  { name: "energy", label: "Energy" },
  { name: "mood", label: "Mood" },
  { name: "motivation", label: "Motivation" },
  { name: "stress", label: "Stress" },
];

export function CheckInForm({ existing }: { existing: Existing }) {
  const [result, formAction, pending] = useActionState<
    CheckInResult | null,
    FormData
  >(submitCheckIn, null);

  return (
    <form action={formAction} className="mt-6 space-y-5">
      {existing && !result?.ok && (
        <p className="rounded-(--radius-control) border border-border bg-surface-raised px-3 py-2 text-sm text-text-muted">
          You already checked in today — submitting updates it.
        </p>
      )}

      <Card className="space-y-5">
        {scales.map((s) => (
          <ScaleField
            key={s.name}
            name={s.name}
            label={s.label}
            defaultValue={existing?.[s.name] as number | null}
          />
        ))}
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Sleep (hours)</span>
          <input
            name="sleep_hours"
            type="number"
            step="0.5"
            min={0}
            max={16}
            defaultValue={existing?.sleep_hours ?? ""}
            className="tnum w-24 rounded-(--radius-control) border border-border bg-surface px-3 py-2 focus:border-accent focus:outline-none"
          />
        </label>
      </Card>

      <Card className="space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">
            Any pain or niggles? (optional)
          </span>
          <textarea
            name="pain_note"
            rows={2}
            defaultValue={existing?.pain_note ?? ""}
            className="w-full rounded-(--radius-control) border border-border bg-surface px-3 py-2 focus:border-accent focus:outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">
            Anything else for your coach? (optional)
          </span>
          <textarea
            name="comment"
            rows={2}
            defaultValue={existing?.comment ?? ""}
            className="w-full rounded-(--radius-control) border border-border bg-surface px-3 py-2 focus:border-accent focus:outline-none"
          />
        </label>
      </Card>

      {result && !result.ok && <ErrorText>{result.error}</ErrorText>}
      {result?.ok && (
        <p className="text-sm text-success">Checked in — thanks!</p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : existing ? "Update check-in" : "Submit check-in"}
      </Button>
    </form>
  );
}

// 1–5 pill selector; required so RLS check constraints (1..5) are satisfied.
function ScaleField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: number | null;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm text-text-muted">{label}</legend>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((v) => (
          <label key={v} className="flex-1">
            <input
              type="radio"
              name={name}
              value={v}
              defaultChecked={defaultValue === v}
              required={name === "sleep_quality"}
              className="peer sr-only"
            />
            <span className="tnum block cursor-pointer rounded-(--radius-control) border border-border py-2 text-center text-sm transition-colors peer-checked:border-accent peer-checked:bg-accent peer-checked:text-ink hover:border-text-muted">
              {v}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
