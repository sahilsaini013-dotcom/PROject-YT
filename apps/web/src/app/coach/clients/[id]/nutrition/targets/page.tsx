import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { TargetsForm } from "./form";

export const metadata = { title: "Nutrition targets" };

export default async function TargetsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", id)
    .maybeSingle();
  if (!profile) notFound();

  const { data: current } = await supabase
    .from("nutrition_targets")
    .select("calories, protein_g, carbs_g, fat_g, water_ml, notes, effective_from")
    .eq("client_id", id)
    .order("effective_from", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-10">
      <div>
        <Link
          href={`/coach/clients/${id}`}
          className="text-sm text-text-muted transition-colors hover:text-text"
        >
          ← {profile.full_name}
        </Link>
        <h1 className="mt-2 text-3xl font-bold">Nutrition targets</h1>
        <p className="mt-1 text-sm text-text-muted">
          Setting new targets keeps the previous ones as history.
        </p>
      </div>
      <Card>
        <TargetsForm clientId={id} current={current ?? null} />
      </Card>
    </main>
  );
}
