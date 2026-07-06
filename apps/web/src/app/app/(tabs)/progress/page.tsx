import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { BarChart, LineChart } from "@/components/charts";

export const metadata = { title: "Progress" };

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // PRs
  const { data: prs } = await supabase
    .from("personal_records")
    .select("value, kind, achieved_at, exercise:exercises(name)")
    .eq("client_id", user!.id)
    .eq("kind", "weight")
    .order("achieved_at", { ascending: false })
    .limit(10);

  // Strength trend: heaviest logged set over time, for the most-logged
  // exercise.
  const { data: sets } = await supabase
    .from("set_logs")
    .select(
      "weight_kg, created_at, exercise_id, session:workout_sessions!inner(client_id), exercise:exercises!set_logs_exercise_id_fkey(name)",
    )
    .eq("session.client_id", user!.id)
    .not("weight_kg", "is", null)
    .order("created_at");

  // Group by exercise, keep the most frequently logged one.
  const byExercise = new Map<
    string,
    { name: string; points: { x: number; y: number }[] }
  >();
  for (const s of sets ?? []) {
    if (s.weight_kg == null) continue;
    const key = s.exercise_id;
    const entry = byExercise.get(key) ?? {
      name: s.exercise?.name ?? "Exercise",
      points: [],
    };
    entry.points.push({
      x: new Date(s.created_at).getTime(),
      y: Number(s.weight_kg),
    });
    byExercise.set(key, entry);
  }
  const topExercise = [...byExercise.values()].sort(
    (a, b) => b.points.length - a.points.length,
  )[0];
  // Reduce to the best (max) weight per day for a clean trend line.
  const trend = topExercise
    ? Object.values(
        topExercise.points.reduce<Record<string, { x: number; y: number }>>(
          (acc, p) => {
            const day = new Date(p.x).toISOString().slice(0, 10);
            if (!acc[day] || p.y > acc[day].y) acc[day] = p;
            return acc;
          },
          {},
        ),
      ).sort((a, b) => a.x - b.x)
    : [];

  // Consistency: completed sessions per week for the last 8 weeks.
  const { data: completed } = await supabase
    .from("workout_sessions")
    .select("scheduled_date")
    .eq("client_id", user!.id)
    .eq("status", "completed");
  const weekBars = lastEightWeeks(
    (completed ?? []).map((c) => c.scheduled_date),
  );

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Progress</h1>

        {(!prs || prs.length === 0) && trend.length === 0 ? (
          <Card className="flex flex-col items-center py-10 text-center">
            <Image
              src="/brand/empty-states/no-logs.svg"
              alt=""
              width={130}
              height={130}
              className="mb-4 rounded-(--radius-control)"
            />
            <h2 className="text-lg font-bold">No records yet</h2>
            <p className="mt-1 max-w-xs text-sm text-text-muted">
              Complete workouts and your trends and personal records will show
              up here.
            </p>
          </Card>
        ) : (
          <>
            {trend.length > 0 && topExercise && (
              <Card>
                <div className="mb-2 flex items-baseline justify-between">
                  <h2 className="font-bold">{topExercise.name}</h2>
                  <span className="tnum text-sm text-text-muted">
                    top {Math.max(...trend.map((p) => p.y))} kg
                  </span>
                </div>
                {trend.length >= 2 ? (
                  <>
                    <LineChart points={trend} />
                    <p className="mt-1 text-xs text-text-muted">
                      Heaviest set per day
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-text-muted">
                    Logged{" "}
                    <span className="tnum">{trend[0].y}</span> kg. Train this a
                    few more times to see your trend line.
                  </p>
                )}
              </Card>
            )}

            <Card>
              <h2 className="mb-3 font-bold">Consistency</h2>
              <BarChart bars={weekBars} />
              <p className="mt-2 text-xs text-text-muted">
                Completed workouts, last 8 weeks
              </p>
            </Card>

            {prs && prs.length > 0 && (
              <div>
                <h2 className="mb-3 font-bold">Personal records</h2>
                <Card className="p-0">
                  <ul className="divide-y divide-border">
                    {prs.map((pr, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between px-5 py-3"
                      >
                        <span className="font-medium">{pr.exercise?.name}</span>
                        <span className="tnum font-bold text-accent">
                          {pr.value} kg
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function lastEightWeeks(dates: string[]) {
  const now = new Date();
  const bars: { label: string; value: number }[] = [];
  for (let w = 7; w >= 0; w--) {
    const end = new Date(now);
    end.setUTCDate(end.getUTCDate() - w * 7);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 6);
    const count = dates.filter((d) => {
      const t = new Date(`${d}T00:00:00Z`).getTime();
      return t >= start.getTime() && t <= end.getTime();
    }).length;
    bars.push({
      label: `${end.getUTCMonth() + 1}/${end.getUTCDate()}`,
      value: count,
    });
  }
  return bars;
}
