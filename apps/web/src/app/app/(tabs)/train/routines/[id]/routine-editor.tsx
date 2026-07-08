"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { categoryLabel, type ExerciseCategory } from "@training-hub/shared";
import { Button, Card, Input } from "@/components/ui";
import {
  ExercisePicker,
  type PickableExercise,
} from "@/components/exercise-picker";
import {
  addRoutineExercise,
  deleteRoutine,
  moveRoutineExercise,
  removeRoutineExercise,
  renameRoutine,
  startSoloSession,
  updateRoutineExercise,
} from "../../actions";

type Row = {
  id: string;
  target_sets: number;
  reps_target: string | null;
  exercise: { id: string; name: string; category: ExerciseCategory } | null;
};

export function RoutineEditor({
  routineId,
  name,
  rows,
  exercises,
}: {
  routineId: string;
  name: string;
  rows: Row[];
  exercises: PickableExercise[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [routineName, setRoutineName] = useState(name);
  const [picking, setPicking] = useState(false);

  const run = (fn: () => Promise<unknown>) =>
    startTransition(() => {
      void fn();
    });

  const start = startSoloSession.bind(null, routineId);

  return (
    <main className="min-h-screen bg-ink px-6 py-8">
      <div className="mx-auto max-w-md space-y-5">
        <button
          onClick={() => router.push("/app/train")}
          className="text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Train
        </button>

        <Card className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-text-muted">Routine name</span>
            <Input
              value={routineName}
              maxLength={80}
              onChange={(e) => setRoutineName(e.target.value)}
              onBlur={() => {
                if (routineName.trim() && routineName !== name) {
                  run(() => renameRoutine(routineId, routineName));
                }
              }}
              aria-label="Routine name"
            />
          </label>
        </Card>

        <div className="space-y-3">
          {rows.length === 0 ? (
            <p className="text-sm text-text-muted">
              No exercises yet. Add your first below.
            </p>
          ) : (
            rows.map((r, i) => (
              <Card key={r.id} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold">
                      {r.exercise?.name ?? "Exercise"}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-text-muted">
                      {r.exercise ? categoryLabel[r.exercise.category] : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() =>
                        run(() =>
                          moveRoutineExercise(r.id, routineId, "up"),
                        )
                      }
                      disabled={i === 0 || pending}
                      aria-label="Move up"
                      className="rounded-(--radius-control) border border-border px-2 py-1 text-sm text-text-muted disabled:opacity-40"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() =>
                        run(() =>
                          moveRoutineExercise(r.id, routineId, "down"),
                        )
                      }
                      disabled={i === rows.length - 1 || pending}
                      aria-label="Move down"
                      className="rounded-(--radius-control) border border-border px-2 py-1 text-sm text-text-muted disabled:opacity-40"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() =>
                        run(() => removeRoutineExercise(r.id, routineId))
                      }
                      disabled={pending}
                      aria-label={`Remove ${r.exercise?.name ?? "exercise"}`}
                      className="rounded-(--radius-control) border border-border px-2 py-1 text-sm text-text-muted hover:text-danger"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm">
                    <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-text-muted">
                      Sets
                    </span>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={20}
                      defaultValue={r.target_sets}
                      onBlur={(e) =>
                        run(() =>
                          updateRoutineExercise(r.id, routineId, {
                            target_sets: Math.max(1, Number(e.target.value) || 1),
                          }),
                        )
                      }
                      aria-label={`Sets for ${r.exercise?.name ?? "exercise"}`}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-text-muted">
                      Reps
                    </span>
                    <Input
                      defaultValue={r.reps_target ?? ""}
                      placeholder="8-12"
                      onBlur={(e) =>
                        run(() =>
                          updateRoutineExercise(r.id, routineId, {
                            reps_target: e.target.value.trim() || null,
                          }),
                        )
                      }
                      aria-label={`Reps for ${r.exercise?.name ?? "exercise"}`}
                    />
                  </label>
                </div>
              </Card>
            ))
          )}

          <Button
            variant="secondary"
            onClick={() => setPicking(true)}
            className="w-full"
          >
            + Add exercise
          </Button>
        </div>

        <form action={start}>
          <Button type="submit" className="w-full" disabled={rows.length === 0}>
            Start this routine
          </Button>
        </form>

        <button
          onClick={() => run(() => deleteRoutine(routineId))}
          disabled={pending}
          className="w-full py-2 text-center text-sm text-text-muted transition-colors hover:text-danger"
        >
          Delete routine
        </button>
      </div>

      {picking && (
        <ExercisePicker
          exercises={exercises}
          onPick={(exId) => {
            run(() => addRoutineExercise(routineId, exId));
            setPicking(false);
          }}
          onClose={() => setPicking(false)}
        />
      )}
    </main>
  );
}
