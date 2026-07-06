"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createProgram(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: program, error } = await supabase
    .from("programs")
    .insert({ trainer_id: user!.id, name, weeks_count: 1 })
    .select("id")
    .single();
  if (error || !program) return;

  // Seed a first week + day so the builder opens on something editable.
  const { data: week } = await supabase
    .from("program_weeks")
    .insert({ program_id: program.id, week_index: 1, label: "Week 1" })
    .select("id")
    .single();
  if (week) {
    await supabase
      .from("program_days")
      .insert({ week_id: week.id, day_index: 1, name: "Day 1" });
  }

  redirect(`/coach/programs/${program.id}`);
}

export async function deleteProgram(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("programs").delete().eq("id", id);
  revalidatePath("/coach/programs");
}
