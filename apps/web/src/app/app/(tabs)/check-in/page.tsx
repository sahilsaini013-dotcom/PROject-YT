import { createClient } from "@/lib/supabase/server";
import { CheckInForm } from "./form";

export const metadata = { title: "Check-in" };

export default async function CheckInPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user!.id)
    .single();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: profile?.timezone ?? "UTC",
  }).format(new Date());

  const { data: existing } = await supabase
    .from("check_ins")
    .select(
      "sleep_quality, sleep_hours, soreness, energy, mood, motivation, stress, pain_note, comment",
    )
    .eq("client_id", user!.id)
    .eq("checked_in_on", today)
    .maybeSingle();

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold">Daily check-in</h1>
        <p className="mt-1 text-sm text-text-muted">
          How are you recovering? Your coach uses this to adjust your training.
        </p>
        <CheckInForm existing={existing ?? null} />
      </div>
    </main>
  );
}
