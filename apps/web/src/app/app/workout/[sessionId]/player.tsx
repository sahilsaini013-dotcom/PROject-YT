"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { categoryLabel, type ExerciseCategory } from "@training-hub/shared";
import { Button, Card, ErrorText } from "@/components/ui";
import {
  completeSession,
  saveExerciseNote,
  saveSet,
  startSession,
} from "./actions";

type Prescription = {
  id: string;
  sets: number;
  reps_target: string;
  rpe_target: number | null;
  rest_seconds: number | null;
  notes: string | null;
  exercise: { id: string; name: string; category: ExerciseCategory } | null;
};
type ExistingSet = {
  program_day_exercise_id: string | null;
  set_index: number;
  weight_kg: number | null;
  reps: number | null;
  rpe: number | null;
  pain_note: string | null;
  substituted_exercise_id: string | null;
};

export function WorkoutPlayer({
  sessionId,
  dayName,
  prescriptions,
  existing,
}: {
  sessionId: string;
  dayName: string;
  prescriptions: Prescription[];
  existing: ExistingSet[];
}) {
  const router = useRouter();
  const [rest, setRest] = useState<number | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionRpe, setSessionRpe] = useState("");
  const [notes, setNotes] = useState("");

  // Mark the session in progress once, on mount.
  useEffect(() => {
    void startSession(sessionId);
  }, [sessionId]);

  // Rest timer countdown.
  useEffect(() => {
    if (rest === null) return;
    if (rest <= 0) {
      setRest(null);
      return;
    }
    const t = setTimeout(() => setRest((r) => (r === null ? null : r - 1)), 1000);
    return () => clearTimeout(t);
  }, [rest]);

  const existingFor = (pdeId: string, setIndex: number) =>
    existing.find(
      (e) => e.program_day_exercise_id === pdeId && e.set_index === setIndex,
    );

  async function finish() {
    setFinishing(true);
    setError(null);
    const res = await completeSession(
      sessionId,
      sessionRpe ? Number(sessionRpe) : null,
      notes || null,
    );
    if (res.ok) {
      // The summary page shows the celebration + PRs.
      router.push(`/app/workout/${sessionId}/summary`);
    } else {
      setError(res.error ?? "Could not save your workout. Try again.");
      setFinishing(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink px-5 pb-32 pt-8">
      <div className="mx-auto max-w-md space-y-5">
        <header>
          <button
            onClick={() => router.push("/app")}
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            ← Today
          </button>
          <h1 className="mt-2 text-2xl font-bold">{dayName}</h1>
          <p className="text-sm text-text-muted">
            Log every set. Your coach sees this.
          </p>
        </header>

        {prescriptions.map((p) => (
          <ExerciseBlock
            key={p.id}
            sessionId={sessionId}
            prescription={p}
            existingFor={existingFor}
            onRest={() => p.rest_seconds && setRest(p.rest_seconds)}
          />
        ))}

        <Card className="space-y-3">
          <h2 className="font-bold">Finish up</h2>
          <label className="block text-sm">
            <span className="mb-1 block text-text-muted">
              Overall session RPE (optional)
            </span>
            <input
              type="number"
              min={1}
              max={10}
              step="0.5"
              value={sessionRpe}
              onChange={(e) => setSessionRpe(e.target.value)}
              className="tnum w-24 rounded-(--radius-control) border border-border bg-surface px-3 py-2 focus:border-accent focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-text-muted">
              Notes for your coach (optional)
            </span>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-(--radius-control) border border-border bg-surface px-3 py-2 focus:border-accent focus:outline-none"
            />
          </label>
        </Card>
      </div>

      {/* Rest timer bar */}
      {rest !== null && (
        <div className="fixed inset-x-0 bottom-20 z-40 mx-auto max-w-md px-5">
          <div className="flex items-center justify-between rounded-(--radius-card) border border-accent/40 bg-surface-raised px-5 py-3">
            <span className="text-sm text-text-muted">Rest</span>
            <span className="tnum text-2xl font-bold text-accent">
              {Math.floor(rest / 60)}:{String(rest % 60).padStart(2, "0")}
            </span>
            <button
              onClick={() => setRest(null)}
              className="text-sm text-text-muted hover:text-text"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Finish CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-ink/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto max-w-md space-y-2">
          {error && <ErrorText>{error}</ErrorText>}
          <Button onClick={finish} disabled={finishing} className="w-full">
            {finishing ? "Saving…" : "Complete workout"}
          </Button>
        </div>
      </div>
    </main>
  );
}

function ExerciseBlock({
  sessionId,
  prescription,
  existingFor,
  onRest,
}: {
  sessionId: string;
  prescription: Prescription;
  existingFor: (pdeId: string, setIndex: number) => ExistingSet | undefined;
  onRest: () => void;
}) {
  const p = prescription;
  const initialNote =
    Array.from({ length: p.sets }, (_, i) => existingFor(p.id, i + 1)?.pain_note)
      .find((value): value is string => Boolean(value)) ?? "";
  const [note, setNote] = useState(initialNote);

  return (
    <Card className="space-y-3">
      <div>
        <h2 className="font-bold">{p.exercise?.name ?? "Exercise"}</h2>
        <p className="text-xs uppercase tracking-wide text-text-muted">
          {p.exercise ? categoryLabel[p.exercise.category] : ""} ·{" "}
          <span className="tnum">{p.sets}</span> × {p.reps_target}
          {p.rpe_target ? ` @ RPE ${p.rpe_target}` : ""}
        </p>
        {p.notes && (
          <p className="mt-1 text-sm text-text-muted">{p.notes}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-[2rem_1fr_1fr_1fr] gap-2 text-[10px] uppercase tracking-wide text-text-muted">
          <span>Set</span>
          <span>Weight (kg)</span>
          <span>Reps</span>
          <span>RPE</span>
        </div>
        {Array.from({ length: p.sets }, (_, i) => {
          const setIndex = i + 1;
          const prev = existingFor(p.id, setIndex);
          return (
            <SetRow
              key={setIndex}
              sessionId={sessionId}
              pde={p}
              setIndex={setIndex}
              prev={prev}
              painNote={note.trim() || null}
              onLogged={onRest}
            />
          );
        })}
      </div>

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={() =>
          void saveExerciseNote(sessionId, p.id, note.trim() || null)
        }
        placeholder="Substitution / note (optional)…"
        className="w-full rounded-(--radius-control) border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-muted focus:border-accent focus:outline-none"
        aria-label={`Substitution note for ${p.exercise?.name ?? "exercise"}`}
      />
    </Card>
  );
}

function SetRow({
  sessionId,
  pde,
  setIndex,
  prev,
  painNote,
  onLogged,
}: {
  sessionId: string;
  pde: Prescription;
  setIndex: number;
  prev: ExistingSet | undefined;
  painNote: string | null;
  onLogged: () => void;
}) {
  const [weight, setWeight] = useState(prev?.weight_kg?.toString() ?? "");
  const [reps, setReps] = useState(prev?.reps?.toString() ?? "");
  const [rpe, setRpe] = useState(prev?.rpe?.toString() ?? "");
  const saved = useRef(false);

  function persist(restAfter: boolean) {
    if (!weight && !reps) return;
    saved.current = true;
    void saveSet(sessionId, {
      program_day_exercise_id: pde.id,
      exercise_id: pde.exercise!.id,
      set_index: setIndex,
      weight_kg: weight ? Number(weight) : null,
      reps: reps ? Number(reps) : null,
      rpe: rpe ? Number(rpe) : null,
      pain_note: painNote,
      substituted_exercise_id: null,
    });
    if (restAfter) onLogged();
  }

  const cell =
    "tnum w-full rounded border border-border bg-surface-raised px-2 py-2 text-center focus:border-accent focus:outline-none";

  return (
    <div className="grid grid-cols-[2rem_1fr_1fr_1fr] items-center gap-2">
      <span className="tnum text-center text-sm text-text-muted">{setIndex}</span>
      <input
        inputMode="decimal"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        onBlur={() => persist(false)}
        className={cell}
        aria-label={`Set ${setIndex} weight`}
      />
      <input
        inputMode="numeric"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        onBlur={() => persist(true)}
        className={cell}
        aria-label={`Set ${setIndex} reps`}
      />
      <input
        inputMode="decimal"
        value={rpe}
        onChange={(e) => setRpe(e.target.value)}
        onBlur={() => persist(false)}
        className={cell}
        aria-label={`Set ${setIndex} RPE`}
      />
    </div>
  );
}
