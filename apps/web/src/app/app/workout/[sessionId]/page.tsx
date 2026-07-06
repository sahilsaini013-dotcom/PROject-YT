import { notFound, redirect } from "next/navigation";
import { sessionLabel } from "@training-hub/shared";
import { createClient } from "@/lib/supabase/server";
import { WorkoutPlayer } from "./player";

export const metadata = { title: "Workout" };

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("workout_sessions")
    .select(
      `id, status, program_day_id,
       program_day:program_days (
         name, week:program_weeks(week_index),
         program_day_exercises (
           id, position, sets, reps_target, rpe_target, rest_seconds, notes,
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

  const { data: existing } = await supabase
    .from("set_logs")
    .select(
      "program_day_exercise_id, exercise_id, set_index, weight_kg, reps, rpe, pain_note, substituted_exercise_id",
    )
    .eq("session_id", sessionId);

  const prescriptions = (session.program_day?.program_day_exercises ?? []).sort(
    (a, b) => a.position - b.position,
  );

  return (
    <WorkoutPlayer
      sessionId={sessionId}
      dayName={sessionLabel(
        session.program_day?.week?.week_index,
        session.program_day?.name,
      )}
      prescriptions={prescriptions.map((p) => ({
        id: p.id,
        sets: p.sets,
        reps_target: p.reps_target,
        rpe_target: p.rpe_target,
        rest_seconds: p.rest_seconds,
        notes: p.notes,
        exercise: p.exercise,
      }))}
      existing={existing ?? []}
    />
  );
}
