import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink, Card } from "@/components/ui";

export const metadata = { title: "Session summary" };

export default async function SummaryPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("workout_sessions")
    .select(
      "id, status, completed_at, session_rpe, client_notes, program_day:program_days(name)",
    )
    .eq("id", sessionId)
    .maybeSingle();
  if (!session) notFound();

  const { data: sets } = await supabase
    .from("set_logs")
    .select(
      "weight_kg, reps, is_pr, exercise:exercises!set_logs_exercise_id_fkey(name)",
    )
    .eq("session_id", sessionId);

  const totalVolume = (sets ?? []).reduce(
    (sum, s) => sum + (s.weight_kg ?? 0) * (s.reps ?? 0),
    0,
  );
  const totalSets = sets?.length ?? 0;
  const prs = (sets ?? []).filter((s) => s.is_pr);

  return (
    <main className="min-h-screen bg-ink px-6 py-10">
      <div className="mx-auto max-w-md space-y-6 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/animations/celebration.svg"
          alt=""
          className="mx-auto w-40"
        />
        <div>
          <h1 className="text-3xl font-extrabold">
            {session.program_day?.name ?? "Workout"} done
          </h1>
          {session.completed_at && (
            <p className="mt-1 text-sm text-text-muted">
              {new Date(session.completed_at).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Sets" value={totalSets} />
          <Stat label="Volume" value={`${Math.round(totalVolume)}`} unit="kg" />
          <Stat label="PRs" value={prs.length} accent={prs.length > 0} />
        </div>

        {prs.length > 0 && (
          <Card className="text-left">
            <h2 className="mb-2 font-bold text-accent">Personal records</h2>
            <ul className="space-y-1 text-sm">
              {prs.map((s, i) => (
                <li key={i} className="flex justify-between">
                  <span>{s.exercise?.name}</span>
                  <span className="tnum text-text-muted">
                    {s.weight_kg} kg × {s.reps}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {session.client_notes && (
          <Card className="text-left">
            <h2 className="mb-1 text-sm font-semibold text-text-muted">
              Your notes
            </h2>
            <p className="text-sm">{session.client_notes}</p>
          </Card>
        )}

        <ButtonLink href="/app" className="w-full text-center">
          Back to Today
        </ButtonLink>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string | number;
  unit?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-(--radius-card) border border-border bg-surface p-4">
      <p
        className={`tnum text-2xl font-extrabold ${accent ? "text-accent" : "text-text"}`}
      >
        {value}
        {unit && <span className="text-sm font-normal text-text-muted"> {unit}</span>}
      </p>
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
    </div>
  );
}
