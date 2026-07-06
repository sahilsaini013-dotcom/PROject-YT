import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

export const metadata = { title: "Client workouts" };

export default async function ClientWorkouts({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: sessions } = await supabase
    .from("workout_sessions")
    .select(
      `id, scheduled_date, status, session_rpe, completed_at,
       program_day:program_days(name),
       set_logs(weight_kg, reps, is_pr, exercise:exercises!set_logs_exercise_id_fkey(name))`,
    )
    .eq("client_id", id)
    .order("scheduled_date", { ascending: false })
    .limit(30);

  if (!sessions || sessions.length === 0) {
    return <p className="text-sm text-text-muted">No workouts scheduled yet.</p>;
  }

  return (
    <div className="space-y-4">
      {sessions.map((s) => {
        const volume = (s.set_logs ?? []).reduce(
          (sum, l) => sum + (l.weight_kg ?? 0) * (l.reps ?? 0),
          0,
        );
        return (
          <Card key={s.id}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">
                  {s.program_day?.name ?? "Workout"}
                </h3>
                <p className="tnum text-xs text-text-muted">
                  {new Date(`${s.scheduled_date}T00:00:00`).toLocaleDateString(
                    "en-US",
                    { weekday: "short", month: "short", day: "numeric" },
                  )}
                </p>
              </div>
              <StatusBadge status={s.status} />
            </div>

            {s.set_logs && s.set_logs.length > 0 && (
              <>
                <ul className="mt-3 space-y-1 text-sm">
                  {s.set_logs.map((l, i) => (
                    <li key={i} className="flex justify-between">
                      <span>
                        {l.exercise?.name}
                        {l.is_pr && (
                          <span className="ml-2 text-xs font-semibold uppercase text-accent">
                            PR
                          </span>
                        )}
                      </span>
                      <span className="tnum text-text-muted">
                        {l.weight_kg ?? "—"} kg × {l.reps ?? "—"}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="tnum mt-3 text-xs text-text-muted">
                  Volume {Math.round(volume)} kg
                  {s.session_rpe ? ` · session RPE ${s.session_rpe}` : ""}
                </p>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "text-success",
    in_progress: "text-warning",
    pending: "text-text-muted",
    skipped: "text-danger",
  };
  return (
    <span className={`text-sm capitalize ${styles[status] ?? "text-text-muted"}`}>
      {status.replace("_", " ")}
    </span>
  );
}
