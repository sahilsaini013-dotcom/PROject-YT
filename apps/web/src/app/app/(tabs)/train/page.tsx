import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button, Card, Input } from "@/components/ui";
import { createRoutine, deleteRoutine, startSoloSession } from "./actions";

export const metadata = { title: "Train" };

export default async function TrainPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: routines } = await supabase
    .from("client_routines")
    .select("id, name, client_routine_exercises(id)")
    .eq("client_id", user!.id)
    .order("created_at", { ascending: false });

  const startQuick = startSoloSession.bind(null, undefined);

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-md space-y-6">
        <header>
          <p className="text-sm text-text-muted">Train</p>
          <h1 className="text-2xl font-bold">Your workouts</h1>
        </header>

        <Card className="border-accent/40">
          <h2 className="font-bold">Quick start</h2>
          <p className="mt-1 text-sm text-text-muted">
            Jump straight in and add exercises as you go.
          </p>
          <form action={startQuick} className="mt-4">
            <Button type="submit" className="w-full">
              Start a workout
            </Button>
          </form>
        </Card>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-text-muted">
            Routines
          </h2>
          {routines && routines.length > 0 ? (
            <ul className="space-y-3">
              {routines.map((r) => {
                const count = r.client_routine_exercises?.length ?? 0;
                const startRoutine = startSoloSession.bind(null, r.id);
                const remove = deleteRoutine.bind(null, r.id);
                return (
                  <Card key={r.id} className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-bold">{r.name}</p>
                        <p className="tnum text-xs text-text-muted">
                          {count} {count === 1 ? "exercise" : "exercises"}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Link
                          href={`/app/train/routines/${r.id}`}
                          className="rounded-(--radius-control) border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-text"
                        >
                          Edit
                        </Link>
                        <form action={remove}>
                          <button
                            type="submit"
                            className="rounded-(--radius-control) border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-danger"
                            aria-label={`Delete ${r.name}`}
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                    <form action={startRoutine}>
                      <Button
                        type="submit"
                        variant={count > 0 ? "primary" : "secondary"}
                        className="w-full"
                      >
                        Start {r.name}
                      </Button>
                    </form>
                  </Card>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">
              No routines yet. Save one below to reuse it any time.
            </p>
          )}
        </div>

        <Card>
          <h2 className="font-bold">New routine</h2>
          <p className="mt-1 text-sm text-text-muted">
            Name it, then add your exercises.
          </p>
          <form action={createRoutine} className="mt-4 flex gap-2">
            <Input
              name="name"
              required
              maxLength={80}
              placeholder="Push day, Legs, Full body…"
              aria-label="Routine name"
            />
            <Button type="submit" className="shrink-0">
              Create
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
