import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button, Card, Input } from "@/components/ui";
import { createProgram } from "./actions";

export const metadata = { title: "Programs" };

export default async function ProgramsPage() {
  const supabase = await createClient();
  const { data: programs } = await supabase
    .from("programs")
    .select("id, name, description, weeks_count, program_assignments(count)")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Programs</h1>
          <p className="mt-1 text-sm text-text-muted">
            Reusable training templates you assign to clients.
          </p>
        </div>
      </div>

      <Card>
        <form action={createProgram} className="flex items-end gap-3">
          <div className="flex-1">
            <label
              htmlFor="program-name"
              className="mb-1.5 block text-sm font-medium text-text-muted"
            >
              New program
            </label>
            <Input
              id="program-name"
              name="name"
              required
              placeholder="e.g. 12-Week Strength Base"
            />
          </div>
          <Button type="submit">Create</Button>
        </form>
      </Card>

      {(!programs || programs.length === 0) && (
        <Card className="flex flex-col items-center py-12 text-center">
          <Image
            src="/brand/empty-states/no-program.svg"
            alt=""
            width={140}
            height={140}
            className="mb-4 rounded-(--radius-control)"
          />
          <h2 className="text-lg font-bold">No programs yet</h2>
          <p className="mt-1 max-w-sm text-sm text-text-muted">
            Build your first program above — weeks, days, and exercises come
            next.
          </p>
        </Card>
      )}

      {programs && programs.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {programs.map((p) => {
            const assignments = p.program_assignments?.[0]?.count ?? 0;
            return (
              <Link key={p.id} href={`/coach/programs/${p.id}`}>
                <Card className="h-full transition-colors hover:border-text-muted">
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  {p.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-text-muted">
                      {p.description}
                    </p>
                  )}
                  <p className="mt-3 text-xs uppercase tracking-wide text-text-muted">
                    <span className="tnum">{p.weeks_count}</span>{" "}
                    {p.weeks_count === 1 ? "week" : "weeks"} ·{" "}
                    <span className="tnum">{assignments}</span> assigned
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
