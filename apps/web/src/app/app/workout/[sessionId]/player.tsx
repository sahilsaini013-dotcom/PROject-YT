"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  categoryLabel,
  kgToLb,
  lbToKg,
  weightUnitLabel,
  type ExerciseCategory,
  type UnitPreference,
} from "@training-hub/shared";
import { Button, Card, ErrorText } from "@/components/ui";
import {
  ExercisePicker,
  type PickableExercise,
} from "@/components/exercise-picker";
import {
  completeSession,
  saveExerciseNote,
  saveSet,
  saveSoloSet,
  startSession,
} from "./actions";

type Prescription = {
  id: string;
  exercise_id: string;
  sets: number;
  reps_target: string;
  rpe_target: number | null;
  rest_seconds: number | null;
  notes: string | null;
  exercise: { id: string; name: string; category: ExerciseCategory } | null;
};
type ExistingSet = {
  program_day_exercise_id: string | null;
  exercise_id: string;
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
  solo,
  hasTrainer,
  unit,
  exercises,
  prescriptions,
  existing,
}: {
  sessionId: string;
  dayName: string;
  solo: boolean;
  hasTrainer: boolean;
  unit: UnitPreference;
  exercises: PickableExercise[];
  prescriptions: Prescription[];
  existing: ExistingSet[];
}) {
  const router = useRouter();
  const [rest, setRest] = useState<number | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionRpe, setSessionRpe] = useState("");
  const [notes, setNotes] = useState("");
  // Solo sessions can grow: routine/logged blocks come from props, ad-hoc adds
  // append here.
  const [blocks, setBlocks] = useState<Prescription[]>(prescriptions);
  const [picking, setPicking] = useState(false);

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

  // Assigned sets are keyed by the program-day-exercise slot; solo sets have no
  // slot and are keyed by exercise id.
  const existingFor = (p: Prescription, setIndex: number) =>
    solo
      ? existing.find(
          (e) =>
            e.program_day_exercise_id === null &&
            e.exercise_id === p.exercise_id &&
            e.set_index === setIndex,
        )
      : existing.find(
          (e) =>
            e.program_day_exercise_id === p.id && e.set_index === setIndex,
        );

  function addExercise(ex: PickableExercise) {
    setBlocks((prev) => {
      if (prev.some((b) => b.exercise_id === ex.id)) return prev;
      return [
        ...prev,
        {
          id: `adhoc:${ex.id}`,
          exercise_id: ex.id,
          sets: 3,
          reps_target: "",
          rpe_target: null,
          rest_seconds: null,
          notes: null,
          exercise: ex,
        },
      ];
    });
    setPicking(false);
  }

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
            onClick={() => router.push(solo ? "/app/train" : "/app")}
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            ← {solo ? "Train" : "Today"}
          </button>
          <h1 className="mt-2 text-2xl font-bold">{dayName}</h1>
          <p className="text-sm text-text-muted">
            {hasTrainer
              ? "Log every set. Your coach sees this."
              : "Log every set. This is just for you."}
          </p>
        </header>

        {blocks.map((p) => (
          <ExerciseBlock
            key={p.id}
            sessionId={sessionId}
            prescription={p}
            solo={solo}
            unit={unit}
            existingFor={existingFor}
            onRest={() => p.rest_seconds && setRest(p.rest_seconds)}
          />
        ))}

        {solo && (
          <Button
            variant="secondary"
            onClick={() => setPicking(true)}
            className="w-full"
          >
            + Add exercise
          </Button>
        )}

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
              {hasTrainer ? "Notes for your coach (optional)" : "Notes (optional)"}
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

      {/* Finish CTA — solid ink so content reads as passing behind it */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-ink px-5 py-3">
        <div className="mx-auto max-w-md space-y-2">
          {error && <ErrorText>{error}</ErrorText>}
          <Button onClick={finish} disabled={finishing} className="w-full">
            {finishing ? "Saving…" : "Complete workout"}
          </Button>
        </div>
      </div>

      {picking && (
        <ExercisePicker
          exercises={exercises}
          onPick={(exId) => {
            const ex = exercises.find((e) => e.id === exId);
            if (ex) addExercise(ex);
          }}
          onClose={() => setPicking(false)}
        />
      )}
    </main>
  );
}

function ExerciseBlock({
  sessionId,
  prescription,
  solo,
  unit,
  existingFor,
  onRest,
}: {
  sessionId: string;
  prescription: Prescription;
  solo: boolean;
  unit: UnitPreference;
  existingFor: (p: Prescription, setIndex: number) => ExistingSet | undefined;
  onRest: () => void;
}) {
  const p = prescription;
  const initialNote =
    Array.from({ length: p.sets }, (_, i) => existingFor(p, i + 1)?.pain_note)
      .find((value): value is string => Boolean(value)) ?? "";
  const [note, setNote] = useState(initialNote);
  // Solo blocks can grow set rows on demand.
  const [setCount, setSetCount] = useState(p.sets);

  return (
    <Card className="space-y-3">
      <div>
        <h2 className="font-bold">{p.exercise?.name ?? "Exercise"}</h2>
        <p className="text-xs uppercase tracking-wide text-text-muted">
          {p.exercise ? categoryLabel[p.exercise.category] : ""}
          {p.reps_target ? (
            <>
              {" "}· <span className="tnum">{p.sets}</span> × {p.reps_target}
            </>
          ) : null}
          {p.rpe_target ? ` @ RPE ${p.rpe_target}` : ""}
        </p>
        {p.notes && <p className="mt-1 text-sm text-text-muted">{p.notes}</p>}
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-[2rem_1fr_1fr_1fr] gap-2 text-[10px] uppercase tracking-wide text-text-muted">
          <span>Set</span>
          <span>Weight ({weightUnitLabel(unit)})</span>
          <span>Reps</span>
          <span>RPE</span>
        </div>
        {Array.from({ length: setCount }, (_, i) => {
          const setIndex = i + 1;
          const prev = existingFor(p, setIndex);
          return (
            <SetRow
              key={setIndex}
              sessionId={sessionId}
              pde={p}
              solo={solo}
              unit={unit}
              setIndex={setIndex}
              prev={prev}
              painNote={note.trim() || null}
              onLogged={onRest}
            />
          );
        })}
        {solo && (
          <button
            type="button"
            onClick={() => setSetCount((c) => c + 1)}
            className="w-full rounded-(--radius-control) border border-dashed border-border py-2 text-sm text-text-muted transition-colors hover:text-text"
          >
            + Add set
          </button>
        )}
      </div>

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={() =>
          void saveExerciseNote(sessionId, {
            programDayExerciseId: solo ? null : p.id,
            exerciseId: p.exercise_id,
            note: note.trim() || null,
          })
        }
        placeholder={
          solo ? "Note (optional)…" : "Substitution / note (optional)…"
        }
        className="w-full rounded-(--radius-control) border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-muted focus:border-accent focus:outline-none"
        aria-label={`${solo ? "Note" : "Substitution note"} for ${p.exercise?.name ?? "exercise"}`}
      />
    </Card>
  );
}

function SetRow({
  sessionId,
  pde,
  solo,
  unit,
  setIndex,
  prev,
  painNote,
  onLogged,
}: {
  sessionId: string;
  pde: Prescription;
  solo: boolean;
  unit: UnitPreference;
  setIndex: number;
  prev: ExistingSet | undefined;
  painNote: string | null;
  onLogged: () => void;
}) {
  // Weight is entered in the client's unit and stored in kg.
  const prevDisplay =
    prev?.weight_kg != null
      ? unit === "imperial"
        ? String(Math.round(kgToLb(prev.weight_kg)))
        : String(prev.weight_kg)
      : "";
  const [weight, setWeight] = useState(prevDisplay);
  const [reps, setReps] = useState(prev?.reps?.toString() ?? "");
  const [rpe, setRpe] = useState(prev?.rpe?.toString() ?? "");
  const saved = useRef(false);

  function persist(restAfter: boolean) {
    if (!weight && !reps) return;
    saved.current = true;
    const weightKg = weight
      ? unit === "imperial"
        ? Number(lbToKg(Number(weight)).toFixed(2))
        : Number(weight)
      : null;
    if (solo) {
      void saveSoloSet(sessionId, {
        exercise_id: pde.exercise_id,
        set_index: setIndex,
        weight_kg: weightKg,
        reps: reps ? Number(reps) : null,
        rpe: rpe ? Number(rpe) : null,
        pain_note: painNote,
      });
    } else {
      void saveSet(sessionId, {
        program_day_exercise_id: pde.id,
        exercise_id: pde.exercise_id,
        set_index: setIndex,
        weight_kg: weightKg,
        reps: reps ? Number(reps) : null,
        rpe: rpe ? Number(rpe) : null,
        pain_note: painNote,
        substituted_exercise_id: null,
      });
    }
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
