"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { emailShell, sendEmail } from "@/lib/email";

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

  // Email the client that a program is waiting (in-app notification is
  // written inside the assign_program RPC).
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data: client } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", clientId)
    .single();
  const { data: email } = await supabase.rpc("email_for_user", {
    _user: clientId,
  });
  if (email) {
    await sendEmail({
      to: email,
      subject: "Your coach assigned you a new program",
      html: emailShell(
        `Time to train${client?.full_name ? `, ${client.full_name.split(" ")[0]}` : ""}`,
        `Your coach just assigned you a new training program.
         <p style="margin-top:16px"><a href="${site}/app" style="background:#C6FF00;color:#0B0D10;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">Open Today</a></p>`,
      ),
    });
  }

  revalidatePath(`/coach/programs/${programId}`);
  return { ok: true, sessions: data ?? 0, clientId };
}
