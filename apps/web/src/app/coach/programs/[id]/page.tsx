import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProgramBuilder } from "./builder";

export const metadata = { title: "Program builder" };

export default async function ProgramBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: program } = await supabase
    .from("programs")
    .select(
      `id, name, description,
       program_weeks (
         id, week_index, label,
         program_days (
           id, day_index, name,
           program_day_exercises (
             id, position, sets, reps_target, rpe_target, rest_seconds, notes,
             exercise:exercises ( id, name, category )
           )
         )
       )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (!program) notFound();

  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, name, category")
    .order("name");

  // Sort the tree — nested selects don't guarantee order.
  const weeks = (program.program_weeks ?? [])
    .sort((a, b) => a.week_index - b.week_index)
    .map((w) => ({
      ...w,
      program_days: (w.program_days ?? [])
        .sort((a, b) => a.day_index - b.day_index)
        .map((d) => ({
          ...d,
          program_day_exercises: (d.program_day_exercises ?? []).sort(
            (a, b) => a.position - b.position,
          ),
        })),
    }));

  const { data: clients } = await supabase
    .from("trainer_clients")
    .select("client_id, client:profiles!trainer_clients_client_id_fkey(full_name)")
    .eq("status", "active");

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <Link
        href="/coach/programs"
        className="text-sm text-text-muted transition-colors hover:text-text"
      >
        ← Programs
      </Link>
      <ProgramBuilder
        program={{ id: program.id, name: program.name, description: program.description }}
        weeks={weeks}
        exercises={exercises ?? []}
        clients={(clients ?? []).map((c) => ({
          id: c.client_id,
          name: c.client?.full_name ?? "Client",
        }))}
      />
    </main>
  );
}
