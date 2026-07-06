import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

export const metadata = { title: "Today" };

export default async function ClientToday() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const { data: clientProfile } = await supabase
    .from("client_profiles")
    .select("id, goal")
    .eq("id", user!.id)
    .maybeSingle();

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <main className="min-h-screen bg-ink px-6 py-10">
      <div className="mx-auto max-w-md space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Today</p>
            <h1 className="text-2xl font-bold">Hey {firstName}</h1>
          </div>
          <Image src="/brand/icon.svg" alt="" width={40} height={40} />
        </header>

        {!clientProfile && (
          <Card>
            <h2 className="font-bold">Finish setting up</h2>
            <p className="mt-1 text-sm text-text-muted">
              Tell your coach about your goals and training setup.
            </p>
            <Link
              href="/app/onboarding"
              className="mt-4 inline-block rounded-(--radius-control) bg-accent px-5 py-2.5 font-semibold text-ink transition-colors hover:bg-accent-pressed"
            >
              Complete profile
            </Link>
          </Card>
        )}

        <Card className="flex flex-col items-center py-10 text-center">
          <Image
            src="/brand/empty-states/no-program.svg"
            alt=""
            width={130}
            height={130}
            className="mb-4 rounded-(--radius-control)"
          />
          <h2 className="text-lg font-bold">No workout scheduled</h2>
          <p className="mt-1 max-w-xs text-sm text-text-muted">
            Your coach hasn&apos;t assigned a program yet. It&apos;ll show up
            here the moment they do.
          </p>
        </Card>
      </div>
    </main>
  );
}
