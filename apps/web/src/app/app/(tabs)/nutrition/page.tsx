import { createClient } from "@/lib/supabase/server";
import { NutritionClient } from "./nutrition-client";

export const metadata = { title: "Nutrition" };

export default async function NutritionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user!.id)
    .single();
  const tz = profile?.timezone ?? "UTC";
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(
    new Date(),
  );

  const { data: targets } = await supabase
    .from("nutrition_targets")
    .select("calories, protein_g, carbs_g, fat_g, water_ml")
    .eq("client_id", user!.id)
    .lte("effective_from", today)
    .order("effective_from", { ascending: false })
    .limit(1)
    .maybeSingle();

  const startOfDay = `${today}T00:00:00`;
  const { data: meals } = await supabase
    .from("meal_logs")
    .select("id, title, notes, calories, protein_g, carbs_g, fat_g, logged_at, meal_photos(storage_path)")
    .eq("client_id", user!.id)
    .gte("logged_at", startOfDay)
    .order("logged_at", { ascending: false });

  // Sign photo paths for display (private bucket).
  const withPhotos = await Promise.all(
    (meals ?? []).map(async (m) => {
      const path = m.meal_photos?.[0]?.storage_path;
      let photoUrl: string | null = null;
      if (path) {
        const { data } = await supabase.storage
          .from("meal-photos")
          .createSignedUrl(path, 3600);
        photoUrl = data?.signedUrl ?? null;
      }
      return { ...m, photoUrl };
    }),
  );

  const { data: water } = await supabase
    .from("water_logs")
    .select("total_ml")
    .eq("client_id", user!.id)
    .eq("logged_on", today)
    .maybeSingle();

  const consumed = (withPhotos ?? []).reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories ?? 0),
      protein: acc.protein + (m.protein_g ?? 0),
    }),
    { calories: 0, protein: 0 },
  );

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold">Nutrition</h1>
        <NutritionClient
          today={today}
          targets={targets ?? null}
          meals={withPhotos}
          waterMl={water?.total_ml ?? 0}
          consumed={consumed}
        />
      </div>
    </main>
  );
}
