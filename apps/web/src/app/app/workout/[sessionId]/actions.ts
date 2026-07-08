"use server";

import { createClient } from "@/lib/supabase/server";

export async function startSession(sessionId: string) {
  const supabase = await createClient();
  await supabase
    .from("workout_sessions")
    .update({ status: "in_progress", started_at: new Date().toISOString() })
    .eq("id", sessionId)
    .eq("status", "pending");
}

export type SavedSet = {
  program_day_exercise_id: string;
  exercise_id: string;
  set_index: number;
  weight_kg: number | null;
  reps: number | null;
  rpe: number | null;
  pain_note: string | null;
  substituted_exercise_id: string | null;
};

export async function saveSet(sessionId: string, set: SavedSet) {
  const supabase = await createClient();
  // Upsert on the (session, slot, set index) unique key so re-editing a set
  // updates the same row.
  await supabase.from("set_logs").upsert(
    { session_id: sessionId, ...set },
    { onConflict: "session_id,program_day_exercise_id,set_index" },
  );
}

export type SoloSet = {
  exercise_id: string;
  set_index: number;
  weight_kg: number | null;
  reps: number | null;
  rpe: number | null;
  pain_note: string | null;
};

export async function saveSoloSet(sessionId: string, set: SoloSet) {
  const supabase = await createClient();
  // Solo sets have no program-day-exercise slot, so a partial unique index
  // keys them by (session, exercise, set_index); PostgREST can't target it, so
  // the upsert goes through a security-invoker RPC.
  await supabase.rpc("save_solo_set", {
    _session_id: sessionId,
    _exercise_id: set.exercise_id,
    _set_index: set.set_index,
    _weight_kg: set.weight_kg ?? undefined,
    _reps: set.reps ?? undefined,
    _rpe: set.rpe ?? undefined,
    _pain_note: set.pain_note ?? undefined,
  });
}

export async function saveExerciseNote(
  sessionId: string,
  {
    programDayExerciseId,
    exerciseId,
    note,
  }: {
    programDayExerciseId: string | null;
    exerciseId: string;
    note: string | null;
  },
) {
  const supabase = await createClient();
  const query = supabase
    .from("set_logs")
    .update({ pain_note: note })
    .eq("session_id", sessionId);
  // Assigned sets are addressed by slot; solo sets by exercise with a null slot.
  if (programDayExerciseId === null) {
    await query.eq("exercise_id", exerciseId).is("program_day_exercise_id", null);
  } else {
    await query.eq("program_day_exercise_id", programDayExerciseId);
  }
}

export type PrAchieved = {
  exercise_id: string;
  exercise_name: string;
  kind: string;
  value: number;
};

export async function completeSession(
  sessionId: string,
  sessionRpe: number | null,
  clientNotes: string | null,
): Promise<{ ok: boolean; prs: PrAchieved[]; error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("complete_workout_session", {
    _session_id: sessionId,
    _session_rpe: sessionRpe ?? undefined,
    _client_notes: clientNotes ?? undefined,
  });
  if (error) return { ok: false, prs: [], error: error.message };
  return {
    ok: true,
    prs: (data ?? []).map((p) => ({
      exercise_id: p.exercise_id,
      exercise_name: p.exercise_name,
      kind: p.kind,
      value: p.value,
    })),
  };
}
