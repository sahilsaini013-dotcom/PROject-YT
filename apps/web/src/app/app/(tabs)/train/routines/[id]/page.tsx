import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RoutineEditor } from "./routine-editor";

export const metadata = { title: "Routine" };

export default async function RoutineEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: routine } = await supabase
    .from("client_routines")
    .select(
      `id, name,
       client_routine_exercises (
         id, position, target_sets, reps_target,
         exercise:exercises ( id, name, category )
       )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (!routine) notFound();

  // Public library + the client's own trainer-visible exercises, same source
  // the coach builder uses; RLS already limits this to readable rows.
  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, name, category")
    .order("name");

  const rows = (routine.client_routine_exercises ?? []).sort(
    (a, b) => a.position - b.position,
  );

  return (
    <RoutineEditor
      routineId={routine.id}
      name={routine.name}
      rows={rows.map((r) => ({
        id: r.id,
        target_sets: r.target_sets,
        reps_target: r.reps_target,
        exercise: r.exercise,
      }))}
      exercises={exercises ?? []}
    />
  );
}
