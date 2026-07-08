"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/dates";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in?next=/app/train");
  return { supabase, user };
}

export async function createRoutine(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("client_routines")
    .insert({ client_id: user.id, name })
    .select("id")
    .single();
  if (error || !data) return;
  redirect(`/app/train/routines/${data.id}`);
}

export async function renameRoutine(routineId: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  const { supabase } = await requireUser();
  await supabase
    .from("client_routines")
    .update({ name: trimmed })
    .eq("id", routineId);
  revalidatePath(`/app/train/routines/${routineId}`);
  revalidatePath("/app/train");
}

export async function deleteRoutine(routineId: string) {
  const { supabase } = await requireUser();
  await supabase.from("client_routines").delete().eq("id", routineId);
  redirect("/app/train");
}

export async function addRoutineExercise(routineId: string, exerciseId: string) {
  const { supabase } = await requireUser();
  const { data: last } = await supabase
    .from("client_routine_exercises")
    .select("position")
    .eq("routine_id", routineId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? 0) + 1;
  await supabase
    .from("client_routine_exercises")
    .insert({ routine_id: routineId, exercise_id: exerciseId, position });
  revalidatePath(`/app/train/routines/${routineId}`);
}

export async function updateRoutineExercise(
  id: string,
  routineId: string,
  patch: { target_sets?: number; reps_target?: string | null },
) {
  const { supabase } = await requireUser();
  await supabase.from("client_routine_exercises").update(patch).eq("id", id);
  revalidatePath(`/app/train/routines/${routineId}`);
}

export async function removeRoutineExercise(id: string, routineId: string) {
  const { supabase } = await requireUser();
  await supabase.from("client_routine_exercises").delete().eq("id", id);
  revalidatePath(`/app/train/routines/${routineId}`);
}

// Reorder by swapping positions with the neighbour in the given direction.
export async function moveRoutineExercise(
  id: string,
  routineId: string,
  direction: "up" | "down",
) {
  const { supabase } = await requireUser();
  const { data: rows } = await supabase
    .from("client_routine_exercises")
    .select("id, position")
    .eq("routine_id", routineId)
    .order("position");
  if (!rows) return;
  const idx = rows.findIndex((r) => r.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= rows.length) return;
  const a = rows[idx];
  const b = rows[swapIdx];
  // Two-step swap through a temporary value to avoid the unique-ish ordering
  // clashing mid-update.
  await supabase
    .from("client_routine_exercises")
    .update({ position: -1 })
    .eq("id", a.id);
  await supabase
    .from("client_routine_exercises")
    .update({ position: a.position })
    .eq("id", b.id);
  await supabase
    .from("client_routine_exercises")
    .update({ position: b.position })
    .eq("id", a.id);
  revalidatePath(`/app/train/routines/${routineId}`);
}

// Start a solo workout session (quick start when routineId is omitted) and
// jump into the player. If an unfinished solo session for the same routine
// already exists today, resume it instead of stacking duplicates.
export async function startSoloSession(routineId?: string) {
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();
  const today = todayISO(profile?.timezone ?? "UTC");

  let title = "Quick workout";
  if (routineId) {
    const { data: routine } = await supabase
      .from("client_routines")
      .select("name")
      .eq("id", routineId)
      .maybeSingle();
    if (!routine) redirect("/app/train");
    title = routine.name;
  }

  const existingQuery = supabase
    .from("workout_sessions")
    .select("id")
    .eq("client_id", user.id)
    .eq("scheduled_date", today)
    .is("assignment_id", null)
    .in("status", ["pending", "in_progress"]);
  const { data: existing } = routineId
    ? await existingQuery.eq("routine_id", routineId).maybeSingle()
    : await existingQuery.is("routine_id", null).maybeSingle();

  if (existing) redirect(`/app/workout/${existing.id}`);

  const { data: session, error } = await supabase
    .from("workout_sessions")
    .insert({
      client_id: user.id,
      scheduled_date: today,
      status: "pending",
      routine_id: routineId ?? null,
      title,
    })
    .select("id")
    .single();
  if (error || !session) redirect("/app/train");
  redirect(`/app/workout/${session.id}`);
}
