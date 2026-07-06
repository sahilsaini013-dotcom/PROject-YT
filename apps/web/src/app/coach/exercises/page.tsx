import { createClient } from "@/lib/supabase/server";
import { ExerciseLibrary } from "./library";

export const metadata = { title: "Exercises" };

export default async function ExercisesPage() {
  const supabase = await createClient();
  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, name, category, equipment, instructions")
    .order("name");

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Exercise library</h1>
        <p className="mt-1 text-sm text-text-muted">
          {exercises?.length ?? 0} movements, categorized. Search or filter to
          find what you need.
        </p>
      </div>
      <ExerciseLibrary exercises={exercises ?? []} />
    </main>
  );
}
