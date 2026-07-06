import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { Chat } from "@/components/chat";

export const metadata = { title: "Messages" };

export default async function ClientMessages() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: thread } = await supabase
    .from("message_threads")
    .select(
      "id, trainer:profiles!message_threads_trainer_id_fkey(full_name)",
    )
    .maybeSingle();

  if (!thread) {
    return (
      <main className="px-6 py-10">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold">Messages</h1>
          <Card className="mt-6 text-center text-sm text-text-muted">
            You&apos;ll be able to message your coach here once you&apos;re set
            up.
          </Card>
        </div>
      </main>
    );
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at")
    .eq("thread_id", thread.id)
    .order("created_at")
    .limit(200);

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col">
      <div className="border-b border-border px-5 py-3">
        <Link
          href="/app"
          className="text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Today
        </Link>
        <h1 className="text-lg font-bold">
          {thread.trainer?.full_name ?? "Your coach"}
        </h1>
      </div>
      <Chat
        threadId={thread.id}
        meId={user!.id}
        otherName={thread.trainer?.full_name ?? "your coach"}
        initialMessages={messages ?? []}
      />
    </div>
  );
}
