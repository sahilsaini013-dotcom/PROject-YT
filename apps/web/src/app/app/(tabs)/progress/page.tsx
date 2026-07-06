import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

export const metadata = { title: "Progress" };

// Full trends land in Sprint 6; this shows PRs and recent volume already logged.
export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: prs } = await supabase
    .from("personal_records")
    .select("value, kind, achieved_at, exercise:exercises(name)")
    .eq("client_id", user!.id)
    .order("achieved_at", { ascending: false })
    .limit(10);

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Progress</h1>

        {!prs || prs.length === 0 ? (
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
              Complete workouts and your personal records will show up here.
            </p>
          </Card>
        ) : (
          <div>
            <h2 className="mb-3 font-bold">Personal records</h2>
            <Card className="p-0">
              <ul className="divide-y divide-border">
                {prs.map((pr, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div>
                      <p className="font-medium">{pr.exercise?.name}</p>
                      <p className="text-xs uppercase tracking-wide text-text-muted">
                        {pr.kind === "weight" ? "Top weight" : "Est. 1RM"}
                      </p>
                    </div>
                    <span className="tnum font-bold text-accent">
                      {pr.value} kg
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
