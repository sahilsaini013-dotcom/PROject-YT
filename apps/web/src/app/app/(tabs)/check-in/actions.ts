"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CheckInResult = { ok: boolean; error?: string };

export async function submitCheckIn(
  _prev: CheckInResult | null,
  formData: FormData,
): Promise<CheckInResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in again." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: profile?.timezone ?? "UTC",
  }).format(new Date());

  const n = (key: string) => {
    const v = formData.get(key);
    return v ? Number(v) : null;
  };

  // One check-in per day: upsert on (client_id, checked_in_on).
  const { error } = await supabase.from("check_ins").upsert(
    {
      client_id: user.id,
      checked_in_on: today,
      sleep_quality: n("sleep_quality"),
      sleep_hours: n("sleep_hours"),
      soreness: n("soreness"),
      energy: n("energy"),
      mood: n("mood"),
      motivation: n("motivation"),
      stress: n("stress"),
      pain_note: (formData.get("pain_note") as string) || null,
      comment: (formData.get("comment") as string) || null,
    },
    { onConflict: "client_id,checked_in_on" },
  );
  if (error) return { ok: false, error: error.message };

  revalidatePath("/app/check-in");
  revalidatePath("/app");
  return { ok: true };
}
