import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

export const metadata = { title: "Messages" };

export default async function CoachMessages() {
  const supabase = await createClient();
  const { data: threads } = await supabase
    .from("message_threads")
    .select(
      "id, client_id, client:profiles!message_threads_client_id_fkey(full_name)",
    )
    .order("updated_at", { ascending: false });

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-3xl font-bold">Messages</h1>
      {!threads || threads.length === 0 ? (
        <Card className="mt-6 flex flex-col items-center py-12 text-center">
          <Image
            src="/brand/empty-states/no-clients.svg"
            alt=""
            width={130}
            height={130}
            className="mb-4 rounded-(--radius-control)"
          />
          <p className="text-sm text-text-muted">
            Your conversations with clients appear here once they join.
          </p>
        </Card>
      ) : (
        <Card className="mt-6 p-0">
          <ul className="divide-y divide-border">
            {threads.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/coach/messages/${t.client_id}`}
                  className="block px-6 py-4 font-medium transition-colors hover:bg-surface-raised"
                >
                  {t.client?.full_name ?? "Client"}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </main>
  );
}
