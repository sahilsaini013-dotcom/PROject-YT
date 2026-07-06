"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// All mutations go through RLS: a trainer can only touch their own program
// tree (policies resolve program ownership from the row up).

async function sb() {
  return createClient();
}

function refresh(programId: string) {
  revalidatePath(`/coach/programs/${programId}`);
}

export async function updateProgramMeta(
  programId: string,
  data: { name?: string; description?: string },
) {
  const supabase = await sb();
  await supabase.from("programs").update(data).eq("id", programId);
  refresh(programId);
}

export async function addWeek(programId: string) {
  const supabase = await sb();
  const { data: weeks } = await supabase
    .from("program_weeks")
    .select("week_index")
    .eq("program_id", programId)
    .order("week_index", { ascending: false })
    .limit(1);
  const nextIndex = (weeks?.[0]?.week_index ?? 0) + 1;

  const { data: week } = await supabase
    .from("program_weeks")
    .insert({
      program_id: programId,
      week_index: nextIndex,
      label: `Week ${nextIndex}`,
    })
    .select("id")
    .single();
  if (week) {
    await supabase
      .from("program_days")
      .insert({ week_id: week.id, day_index: 1, name: "Day 1" });
  }
  await syncWeeksCount(supabase, programId);
  refresh(programId);
}

export async function deleteWeek(programId: string, weekId: string) {
  const supabase = await sb();
  await supabase.from("program_weeks").delete().eq("id", weekId);
  await syncWeeksCount(supabase, programId);
  refresh(programId);
}

export async function addDay(programId: string, weekId: string) {
  const supabase = await sb();
  const { data: days } = await supabase
    .from("program_days")
    .select("day_index")
    .eq("week_id", weekId)
    .order("day_index", { ascending: false })
    .limit(1);
  const nextIndex = (days?.[0]?.day_index ?? 0) + 1;
  await supabase
    .from("program_days")
    .insert({ week_id: weekId, day_index: nextIndex, name: `Day ${nextIndex}` });
  refresh(programId);
}

export async function updateDayName(
  programId: string,
  dayId: string,
  name: string,
) {
  const supabase = await sb();
  await supabase.from("program_days").update({ name }).eq("id", dayId);
  refresh(programId);
}

export async function deleteDay(programId: string, dayId: string) {
  const supabase = await sb();
  await supabase.from("program_days").delete().eq("id", dayId);
  refresh(programId);
}

export async function addExercise(
  programId: string,
  dayId: string,
  exerciseId: string,
) {
  const supabase = await sb();
  const { data: rows } = await supabase
    .from("program_day_exercises")
    .select("position")
    .eq("day_id", dayId)
    .order("position", { ascending: false })
    .limit(1);
  const position = (rows?.[0]?.position ?? 0) + 1;
  await supabase.from("program_day_exercises").insert({
    day_id: dayId,
    exercise_id: exerciseId,
    position,
    sets: 3,
    reps_target: "8-12",
  });
  refresh(programId);
}

export async function updateExercise(
  programId: string,
  rowId: string,
  data: {
    sets?: number;
    reps_target?: string;
    rpe_target?: number | null;
    rest_seconds?: number | null;
    notes?: string | null;
  },
) {
  const supabase = await sb();
  await supabase.from("program_day_exercises").update(data).eq("id", rowId);
  refresh(programId);
}

export async function removeExercise(programId: string, rowId: string) {
  const supabase = await sb();
  await supabase.from("program_day_exercises").delete().eq("id", rowId);
  refresh(programId);
}

async function syncWeeksCount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  programId: string,
) {
  const { count } = await supabase
    .from("program_weeks")
    .select("id", { count: "exact", head: true })
    .eq("program_id", programId);
  await supabase
    .from("programs")
    .update({ weeks_count: count ?? 0 })
    .eq("id", programId);
}
