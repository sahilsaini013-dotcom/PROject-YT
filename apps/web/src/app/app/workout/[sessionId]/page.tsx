import { notFound, redirect } from "next/navigation";
import {
  sessionLabel,
  type ExerciseCategory,
  type UnitPreference,
} from "@training-hub/shared";
import { createClient } from "@/lib/supabase/server";
import type { PickableExercise } from "@/components/exercise-picker";
import { WorkoutPlayer } from "./player";

export const metadata = { title: "Workout" };

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: session } = await supabase
    .from("workout_sessions")
    .select(
      `id, status, program_day_id, title, routine_id,
       program_day:program_days (
         name, week:program_weeks(week_index),
         program_day_exercises (
           id, position, sets, reps_target, rpe_target, rest_seconds, notes,
           exercise:exercises ( id, name, category )
         )
       ),
       routine:client_routines (
         name,
         client_routine_exercises (
           id, position, target_sets, reps_target,
           exercise:exercises ( id, name, category )
         )
       )`,
    )
    .eq("id", sessionId)
    .maybeSingle();

  if (!session) notFound();
  if (session.status === "completed") {
    redirect(`/app/workout/${sessionId}/summary`);
  }

  const solo = session.program_day_id === null;

  const { data: existing } = await supabase
    .from("set_logs")
    .select(
      "program_day_exercise_id, exercise_id, set_index, weight_kg, reps, rpe, pain_note, substituted_exercise_id",
    )
    .eq("session_id", sessionId);

  const { data: profile } = await supabase
    .from("client_profiles")
    .select("unit_preference")
    .eq("id", user!.id)
    .maybeSingle();
  const unit: UnitPreference =
    profile?.unit_preference === "imperial" ? "imperial" : "metric";

  let prescriptions;
  let exercises: PickableExercise[] = [];
  let hasTrainer = false;

  if (solo) {
    // Solo prescriptions come from the routine (if any), then append blocks for
    // any exercise already logged that the routine didn't include (resume +
    // ad-hoc adds). set_index numbering is per exercise.
    const routineRows = (session.routine?.client_routine_exercises ?? []).sort(
      (a, b) => a.position - b.position,
    );
    const blocks = routineRows.map((r) => ({
      id: r.id,
      exercise_id: r.exercise?.id ?? "",
      sets: r.target_sets,
      reps_target: r.reps_target ?? "",
      rpe_target: null,
      rest_seconds: null,
      notes: null,
      exercise: r.exercise,
    }));

    const known = new Set(blocks.map((b) => b.exercise_id));
    const loggedByExercise = new Map<
      string,
      { name: string; category: string; maxSet: number }
    >();
    for (const row of existing ?? []) {
      if (row.program_day_exercise_id !== null) continue;
      const cur = loggedByExercise.get(row.exercise_id);
      loggedByExercise.set(row.exercise_id, {
        name: cur?.name ?? "",
        category: cur?.category ?? "other",
        maxSet: Math.max(cur?.maxSet ?? 0, row.set_index),
      });
    }

    // Resolve display names for logged-but-not-in-routine exercises.
    const missingIds = [...loggedByExercise.keys()].filter(
      (id) => !known.has(id),
    );
    if (missingIds.length) {
      const { data: exRows } = await supabase
        .from("exercises")
        .select("id, name, category")
        .in("id", missingIds);
      for (const ex of exRows ?? []) {
        const entry = loggedByExercise.get(ex.id);
        blocks.push({
          id: `logged:${ex.id}`,
          exercise_id: ex.id,
          sets: entry?.maxSet ?? 1,
          reps_target: "",
          rpe_target: null,
          rest_seconds: null,
          notes: null,
          exercise: {
            id: ex.id,
            name: ex.name,
            category: ex.category as ExerciseCategory,
          },
        });
      }
    }

    prescriptions = blocks;

    const { data: allExercises } = await supabase
      .from("exercises")
      .select("id, name, category")
      .order("name");
    exercises = (allExercises ?? []) as PickableExercise[];

    const { count } = await supabase
      .from("trainer_clients")
      .select("id", { count: "exact", head: true })
      .eq("client_id", user!.id)
      .eq("status", "active");
    hasTrainer = (count ?? 0) > 0;
  } else {
    const assigned = (session.program_day?.program_day_exercises ?? []).sort(
      (a, b) => a.position - b.position,
    );
    prescriptions = assigned.map((p) => ({
      id: p.id,
      exercise_id: p.exercise?.id ?? "",
      sets: p.sets,
      reps_target: p.reps_target,
      rpe_target: p.rpe_target,
      rest_seconds: p.rest_seconds,
      notes: p.notes,
      exercise: p.exercise,
    }));
    // Assigned sessions always have a trainer behind them.
    hasTrainer = true;
  }

  const dayName = solo
    ? (session.title ?? "Workout")
    : sessionLabel(
        session.program_day?.week?.week_index,
        session.program_day?.name,
      );

  return (
    <WorkoutPlayer
      sessionId={sessionId}
      dayName={dayName}
      solo={solo}
      hasTrainer={hasTrainer}
      unit={unit}
      exercises={exercises}
      prescriptions={prescriptions}
      existing={existing ?? []}
    />
  );
}
