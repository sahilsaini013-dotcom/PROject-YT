import Image from "next/image";
import Link from "next/link";
import { sessionLabel } from "@training-hub/shared";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink, Card } from "@/components/ui";

export const metadata = { title: "Today" };

function todayISO(timezone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default async function ClientToday() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, timezone")
    .eq("id", user!.id)
    .single();

  const { data: clientProfile } = await supabase
    .from("client_profiles")
    .select("id")
    .eq("id", user!.id)
    .maybeSingle();

  const today = todayISO(profile?.timezone ?? "UTC");
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  const { data: sessions } = await supabase
    .from("workout_sessions")
    .select(
      "id, scheduled_date, status, program_day:program_days(name, week:program_weeks(week_index))",
    )
    .eq("client_id", user!.id)
    .neq("status", "completed")
    .gte("scheduled_date", today)
    .order("scheduled_date")
    .limit(8);

  const todaySession = sessions?.find((s) => s.scheduled_date === today);
  const upcoming = (sessions ?? []).filter((s) => s.id !== todaySession?.id);

  const { data: checkedInToday } = await supabase
    .from("check_ins")
    .select("id")
    .eq("client_id", user!.id)
    .eq("checked_in_on", today)
    .maybeSingle();

  const { count: unread } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .is("read_at", null);

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-md space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Today</p>
            <h1 className="text-2xl font-bold">Hey {firstName}</h1>
          </div>
          <Link
            href="/app/notifications"
            aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
            className="relative text-text-muted transition-colors hover:text-text"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
            </svg>
            {unread ? (
              <span className="tnum absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink">
                {unread}
              </span>
            ) : null}
          </Link>
        </header>

        {!clientProfile && (
          <Card>
            <h2 className="font-bold">Finish setting up</h2>
            <p className="mt-1 text-sm text-text-muted">
              Tell your coach about your goals and training setup.
            </p>
            <ButtonLink href="/app/onboarding" className="mt-4">
              Complete profile
            </ButtonLink>
          </Card>
        )}

        {clientProfile && !checkedInToday && (
          <Card className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bold">Daily check-in</h2>
              <p className="text-sm text-text-muted">
                Two minutes. Helps your coach dial in your training.
              </p>
            </div>
            <ButtonLink
              href="/app/check-in"
              variant="secondary"
              className="shrink-0"
            >
              Check in
            </ButtonLink>
          </Card>
        )}

        {todaySession ? (
          <Card className="border-accent/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Today&apos;s workout
            </p>
            <h2 className="mt-1 text-xl font-bold">
              {sessionLabel(
                todaySession.program_day?.week?.week_index,
                todaySession.program_day?.name,
              )}
            </h2>
            <ButtonLink
              href={`/app/workout/${todaySession.id}`}
              className="mt-4 w-full text-center"
            >
              {todaySession.status === "in_progress" ? "Resume" : "Start"}{" "}
              workout
            </ButtonLink>
          </Card>
        ) : (
          <Card className="flex flex-col items-center py-10 text-center">
            <Image
              src="/brand/empty-states/no-program.svg"
              alt=""
              width={130}
              height={130}
              className="mb-4 rounded-(--radius-control)"
            />
            <h2 className="text-lg font-bold">Nothing due today</h2>
            <p className="mt-1 max-w-xs text-sm text-text-muted">
              Rest up. Your next session shows up here when it&apos;s scheduled.
            </p>
          </Card>
        )}

        {upcoming.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-text-muted">
              Coming up
            </h3>
            <Card className="p-0">
              <ul className="divide-y divide-border">
                {upcoming.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between px-5 py-3 text-sm"
                  >
                    <span>
                      {sessionLabel(
                        s.program_day?.week?.week_index,
                        s.program_day?.name,
                      )}
                    </span>
                    <span className="tnum text-text-muted">
                      {new Date(
                        `${s.scheduled_date}T00:00:00`,
                      ).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
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
