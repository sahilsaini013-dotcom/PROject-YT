"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AssignResult =
  | { ok: true; sessions: number; clientId: string }
  | { ok: false; error: string };

// Assigning materializes one workout_session per program day. Day D of week W
// lands on start_date + ((W-1)*7 + (D-1)) days — a simple weekly calendar.
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: weeks } = await supabase
    .from("program_weeks")
    .select("week_index, program_days(id, day_index)")
    .eq("program_id", programId);

  const dayRows = (weeks ?? []).flatMap((w) =>
    (w.program_days ?? []).map((d) => ({
      program_day_id: d.id,
      offset: (w.week_index - 1) * 7 + (d.day_index - 1),
    })),
  );

  if (dayRows.length === 0) {
    return { ok: false, error: "Add at least one day before assigning." };
  }

  const { data: assignment, error: assignError } = await supabase
    .from("program_assignments")
    .insert({
      program_id: programId,
      client_id: clientId,
      trainer_id: user!.id,
      start_date: startDate,
      notes: notes || null,
    })
    .select("id")
    .single();
  if (assignError || !assignment) {
    return { ok: false, error: assignError?.message ?? "Could not assign." };
  }

  const base = new Date(`${startDate}T00:00:00Z`);
  const sessions = dayRows.map((row) => {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() + row.offset);
    return {
      assignment_id: assignment.id,
      client_id: clientId,
      program_day_id: row.program_day_id,
      scheduled_date: d.toISOString().slice(0, 10),
    };
  });

  const { error: sessionError } = await supabase
    .from("workout_sessions")
    .insert(sessions);
  if (sessionError) {
    return { ok: false, error: sessionError.message };
  }

  await supabase.from("notifications").insert({
    user_id: clientId,
    kind: "workout_assigned",
    title: "New program assigned",
    body: "Your coach assigned you a new training program.",
    link_path: "/app",
  });

  revalidatePath(`/coach/programs/${programId}`);
  return { ok: true, sessions: sessions.length, clientId };
}
