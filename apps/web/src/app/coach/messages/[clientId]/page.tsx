import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Chat } from "@/components/chat";

export const metadata = { title: "Chat" };

export default async function CoachThread({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: thread } = await supabase
    .from("message_threads")
    .select(
      "id, client:profiles!message_threads_client_id_fkey(full_name)",
    )
    .eq("client_id", clientId)
    .maybeSingle();
  if (!thread) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at")
    .eq("thread_id", thread.id)
    .order("created_at")
    .limit(200);

  return (
    <div className="mx-auto flex h-[calc(100vh-57px)] max-w-2xl flex-col">
      <div className="border-b border-border px-6 py-3">
        <Link
          href="/coach/messages"
          className="text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Messages
        </Link>
        <h1 className="text-lg font-bold">{thread.client?.full_name}</h1>
      </div>
      <Chat
        threadId={thread.id}
        meId={user!.id}
        otherName={thread.client?.full_name ?? "your client"}
        initialMessages={messages ?? []}
      />
    </div>
  );
}
