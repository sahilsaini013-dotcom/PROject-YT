"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AssignResult =
  | { ok: true; sessions: number; clientId: string }
  | { ok: false; error: string };

// Assignment is atomic in the DB (assign_program RPC): it validates ownership
// + roster link, blocks duplicate active assignments, and materializes one
// workout_session per program day in a single transaction.
export async function assignProgram(
  programId: string,
  formData: FormData,
): Promise<AssignResult> {
  const clientId = String(formData.get("client_id") ?? "");
  const startDate = String(formData.get("start_date") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!clientId || !startDate) {
    return { ok: false, error: "Pick a client and a start date." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("assign_program", {
    _program_id: programId,
    _client_id: clientId,
    _start_date: startDate,
    _notes: notes || undefined,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(`/coach/programs/${programId}`);
  return { ok: true, sessions: data ?? 0, clientId };
}
