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
