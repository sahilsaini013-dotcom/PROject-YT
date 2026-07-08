"use client";

import { useState, useTransition } from "react";
import { categoryLabel, type ExerciseCategory } from "@training-hub/shared";
import { Button, Card } from "@/components/ui";
import { ExercisePicker } from "@/components/exercise-picker";
import {
  addDay,
  addExercise,
  addWeek,
  deleteDay,
  deleteWeek,
  removeExercise,
  updateDayName,
  updateExercise,
  updateProgramMeta,
} from "./actions";
import { AssignPanel } from "./assign-panel";

type Ex = { id: string; name: string; category: ExerciseCategory };
type DayExercise = {
  id: string;
  sets: number;
  reps_target: string;
  rpe_target: number | null;
  rest_seconds: number | null;
  notes: string | null;
  exercise: { id: string; name: string; category: ExerciseCategory } | null;
};
type Day = {
  id: string;
  day_index: number;
  name: string | null;
  program_day_exercises: DayExercise[];
};
type Week = { id: string; week_index: number; label: string | null; program_days: Day[] };

export function ProgramBuilder({
  program,
  weeks,
  exercises,
  clients,
}: {
  program: { id: string; name: string; description: string | null };
  weeks: Week[];
  exercises: Ex[];
  clients: { id: string; name: string }[];
}) {
  const [picker, setPicker] = useState<string | null>(null); // dayId being edited
  const [, startTransition] = useTransition();

  const run = (fn: () => Promise<unknown>) => startTransition(() => void fn());

  return (
    <div className="mt-4 space-y-8">
      <header className="space-y-3">
        <input
          defaultValue={program.name}
          onBlur={(e) => {
            if (e.target.value.trim() && e.target.value !== program.name) {
              run(() =>
                updateProgramMeta(program.id, { name: e.target.value.trim() }),
              );
            }
          }}
          className="w-full bg-transparent text-3xl font-bold text-text focus:outline-none"
          aria-label="Program name"
        />
        <textarea
          defaultValue={program.description ?? ""}
          placeholder="Add a description (optional)…"
          onBlur={(e) =>
            run(() =>
              updateProgramMeta(program.id, { description: e.target.value }),
            )
          }
          rows={2}
          className="w-full resize-none rounded-(--radius-control) border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
          aria-label="Program description"
        />
      </header>

      <AssignPanel programId={program.id} clients={clients} />

      {weeks.map((week) => (
        <Card key={week.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{week.label ?? `Week ${week.week_index}`}</h2>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="px-3 py-1.5 text-sm"
                onClick={() => run(() => addDay(program.id, week.id))}
              >
                + Day
              </Button>
              {weeks.length > 1 && (
                <Button
                  variant="ghost"
                  className="px-2 py-1.5 text-sm text-danger hover:text-danger"
                  onClick={() => run(() => deleteWeek(program.id, week.id))}
                >
                  Delete week
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {week.program_days.map((day) => (
              <div
                key={day.id}
                className="rounded-(--radius-control) border border-border bg-surface-raised p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <input
                    defaultValue={day.name ?? `Day ${day.day_index}`}
                    onBlur={(e) => {
                      if (e.target.value.trim()) {
                        run(() =>
                          updateDayName(program.id, day.id, e.target.value.trim()),
                        );
                      }
                    }}
                    className="bg-transparent font-semibold text-text focus:outline-none"
                    aria-label="Day name"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="px-3 py-1 text-sm"
                      onClick={() => setPicker(day.id)}
                    >
                      + Exercise
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-2 py-1 text-sm text-danger hover:text-danger"
                      onClick={() => run(() => deleteDay(program.id, day.id))}
                    >
                      ✕
                    </Button>
                  </div>
                </div>

                {day.program_day_exercises.length === 0 ? (
                  <p className="text-sm text-text-muted">No exercises yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {day.program_day_exercises.map((row) => (
                      <ExerciseRow
                        key={row.id}
                        programId={program.id}
                        row={row}
                        onChange={run}
                      />
                    ))}
                  </ul>
                )}

                {picker === day.id && (
                  <ExercisePicker
                    exercises={exercises}
                    onPick={(exId) => {
                      run(() => addExercise(program.id, day.id, exId));
                      setPicker(null);
                    }}
                    onClose={() => setPicker(null)}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Button
        variant="secondary"
        onClick={() => run(() => addWeek(program.id))}
      >
        + Add week
      </Button>
    </div>
  );
}

function ExerciseRow({
  programId,
  row,
  onChange,
}: {
  programId: string;
  row: DayExercise;
  onChange: (fn: () => Promise<unknown>) => void;
}) {
  const num = (v: string) => (v === "" ? null : Number(v));
  return (
    <li className="grid grid-cols-[1fr_auto] items-start gap-2 rounded-(--radius-control) bg-surface p-3">
      <div className="min-w-0">
        <p className="truncate font-medium">
          {row.exercise?.name ?? "Exercise"}
        </p>
        <p className="text-xs uppercase tracking-wide text-text-muted">
          {row.exercise ? categoryLabel[row.exercise.category] : ""}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Field label="Sets">
            <input
              type="number"
              min={1}
              defaultValue={row.sets}
              onBlur={(e) =>
                onChange(() =>
                  updateExercise(programId, row.id, {
                    sets: Number(e.target.value) || 1,
                  }),
                )
              }
              className="tnum w-full rounded border border-border bg-surface-raised px-2 py-1 text-sm focus:border-accent focus:outline-none"
            />
          </Field>
          <Field label="Reps">
            <input
              defaultValue={row.reps_target}
              onBlur={(e) =>
                onChange(() =>
                  updateExercise(programId, row.id, {
                    reps_target: e.target.value || "1",
                  }),
                )
              }
              className="w-full rounded border border-border bg-surface-raised px-2 py-1 text-sm focus:border-accent focus:outline-none"
            />
          </Field>
          <Field label="RPE">
            <input
              type="number"
              step="0.5"
              min={1}
              max={10}
              defaultValue={row.rpe_target ?? ""}
              onBlur={(e) =>
                onChange(() =>
                  updateExercise(programId, row.id, {
                    rpe_target: num(e.target.value),
                  }),
                )
              }
              className="tnum w-full rounded border border-border bg-surface-raised px-2 py-1 text-sm focus:border-accent focus:outline-none"
            />
          </Field>
          <Field label="Rest (s)">
            <input
              type="number"
              min={0}
              step={15}
              defaultValue={row.rest_seconds ?? ""}
              onBlur={(e) =>
                onChange(() =>
                  updateExercise(programId, row.id, {
                    rest_seconds: num(e.target.value),
                  }),
                )
              }
              className="tnum w-full rounded border border-border bg-surface-raised px-2 py-1 text-sm focus:border-accent focus:outline-none"
            />
          </Field>
        </div>
        <input
          defaultValue={row.notes ?? ""}
          placeholder="Coaching note (optional)…"
          onBlur={(e) =>
            onChange(() =>
              updateExercise(programId, row.id, {
                notes: e.target.value || null,
              }),
            )
          }
          className="mt-2 w-full rounded border border-border bg-surface-raised px-2 py-1 text-sm placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>
      <button
        type="button"
        aria-label="Remove exercise"
        onClick={() => onChange(() => removeExercise(programId, row.id))}
        className="text-text-muted transition-colors hover:text-danger"
      >
        ✕
      </button>
    </li>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

