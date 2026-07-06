import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

export const metadata = { title: "Client progress" };

export default async function ClientProgress({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: prs } = await supabase
    .from("personal_records")
    .select("value, kind, achieved_at, exercise:exercises(name)")
    .eq("client_id", id)
    .order("achieved_at", { ascending: false })
    .limit(20);

  const { data: metrics } = await supabase
    .from("body_metrics")
    .select("measured_on, weight_kg, body_fat_pct")
    .eq("client_id", id)
    .order("measured_on", { ascending: false })
    .limit(12);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="mb-3 font-bold">Personal records</h2>
        {!prs || prs.length === 0 ? (
          <p className="text-sm text-text-muted">No PRs recorded yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {prs.map((pr, i) => (
              <li
                key={i}
                className="flex items-center justify-between py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{pr.exercise?.name}</p>
                  <p className="text-xs uppercase tracking-wide text-text-muted">
                    {pr.kind === "weight" ? "Top weight" : "Est. 1RM"} ·{" "}
                    {new Date(pr.achieved_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className="tnum font-bold text-accent">{pr.value} kg</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 font-bold">Body metrics</h2>
        {!metrics || metrics.length === 0 ? (
          <p className="text-sm text-text-muted">No measurements logged yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {metrics.map((m) => (
              <li
                key={m.measured_on}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="tnum text-text-muted">
                  {new Date(`${m.measured_on}T00:00:00`).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" },
                  )}
                </span>
                <span className="tnum">
                  {m.weight_kg ? `${m.weight_kg} kg` : "—"}
                  {m.body_fat_pct ? ` · ${m.body_fat_pct}%` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
