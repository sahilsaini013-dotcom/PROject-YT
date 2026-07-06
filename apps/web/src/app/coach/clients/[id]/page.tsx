import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

export const metadata = { title: "Client overview" };

export default async function ClientOverview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: clientProfile } = await supabase
    .from("client_profiles")
    .select("goal, experience_level, injuries, schedule_notes, equipment_notes")
    .eq("id", id)
    .maybeSingle();

  const { data: assignments } = await supabase
    .from("program_assignments")
    .select("id, start_date, status, program:programs(name)")
    .eq("client_id", id)
    .order("start_date", { ascending: false });

  // Adherence: completed vs scheduled sessions to date.
  const today = new Date().toISOString().slice(0, 10);
  const { count: dueCount } = await supabase
    .from("workout_sessions")
    .select("id", { count: "exact", head: true })
    .eq("client_id", id)
    .lte("scheduled_date", today);
  const { count: doneCount } = await supabase
    .from("workout_sessions")
    .select("id", { count: "exact", head: true })
    .eq("client_id", id)
    .eq("status", "completed");

  const adherence =
    dueCount && dueCount > 0
      ? Math.round(((doneCount ?? 0) / dueCount) * 100)
      : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Adherence" value={adherence === null ? "—" : `${adherence}%`} accent />
        <Stat label="Completed" value={doneCount ?? 0} />
        <Stat label="Scheduled" value={dueCount ?? 0} />
      </div>

      <Card>
        <h2 className="mb-3 font-bold">Profile</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <Detail label="Goal" value={clientProfile?.goal} />
          <Detail label="Experience" value={clientProfile?.experience_level} />
          <Detail label="Injuries" value={clientProfile?.injuries} />
          <Detail label="Schedule" value={clientProfile?.schedule_notes} />
          <Detail label="Equipment" value={clientProfile?.equipment_notes} />
        </dl>
      </Card>

      <Card>
        <h2 className="mb-3 font-bold">Assigned programs</h2>
        {!assignments || assignments.length === 0 ? (
          <p className="text-sm text-text-muted">Nothing assigned yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {assignments.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span>{a.program?.name}</span>
                <span className="tnum text-text-muted">
                  from{" "}
                  {new Date(`${a.start_date}T00:00:00`).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" },
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <Card>
      <p
        className={`tnum text-2xl font-extrabold ${accent ? "text-accent" : "text-text"}`}
      >
        {value}
      </p>
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
    </Card>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-text-muted">
        {label}
      </dt>
      <dd className="mt-0.5 text-text">
        {value || <span className="text-text-muted">—</span>}
      </dd>
    </div>
  );
}
