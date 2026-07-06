import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

export const metadata = { title: "Client" };

export default async function ClientProfilePage({
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

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <div>
        <Link
          href="/coach"
          className="text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Roster
        </Link>
        <h1 className="mt-2 text-3xl font-bold">{profile.full_name}</h1>
      </div>

      <Card>
        <h2 className="mb-3 font-bold">Profile</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <Detail label="Goal" value={clientProfile?.goal} />
          <Detail
            label="Experience"
            value={clientProfile?.experience_level}
          />
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
    </main>
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
