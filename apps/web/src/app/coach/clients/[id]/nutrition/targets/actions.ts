"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type TargetsResult = { ok: boolean; error?: string };

export async function setTargets(
  clientId: string,
  _prev: TargetsResult | null,
  formData: FormData,
): Promise<TargetsResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in again." };

  const n = (key: string) => {
    const v = formData.get(key);
    return v ? Number(v) : null;
  };

  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase.from("nutrition_targets").insert({
    client_id: clientId,
    trainer_id: user.id,
    calories: n("calories"),
    protein_g: n("protein_g"),
    carbs_g: n("carbs_g"),
    fat_g: n("fat_g"),
    water_ml: n("water_ml"),
    notes: (formData.get("notes") as string) || null,
    effective_from: today,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/coach/clients/${clientId}/nutrition/targets`);
  return { ok: true };
}
