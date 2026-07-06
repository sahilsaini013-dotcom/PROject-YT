"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";

export type ChatMessage = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export function Chat({
  threadId,
  meId,
  otherName,
  initialMessages,
}: {
  threadId: string;
  meId: string;
  otherName: string;
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = useRef(createClient());

  // Subscribe to new messages in this thread (RLS scopes delivery).
  useEffect(() => {
    const client = supabase.current;
    const channel = client
      .channel(`thread:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const m = payload.new as ChatMessage;
          setMessages((prev) =>
            prev.some((x) => x.id === m.id) ? prev : [...prev, m],
          );
        },
      )
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [threadId]);

  // Mark the other party's messages read on view.
  useEffect(() => {
    const unread = messages.filter(
      (m) => m.sender_id !== meId,
    );
    if (unread.length === 0) return;
    void supabase.current
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("thread_id", threadId)
      .neq("sender_id", meId)
      .is("read_at", null);
  }, [messages, meId, threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setSending(true);
    setDraft("");
    const { data, error } = await supabase.current
      .from("messages")
      .insert({ thread_id: threadId, sender_id: meId, body })
      .select("id, sender_id, body, created_at")
      .single();
    setSending(false);
    if (!error && data) {
      setMessages((prev) =>
        prev.some((x) => x.id === data.id) ? prev : [...prev, data],
      );
    } else if (error) {
      setDraft(body);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-text-muted">
            No messages yet. Say hi to {otherName}.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === meId;
          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-(--radius-card) px-3.5 py-2 text-sm ${
                  mine
                    ? "bg-accent text-ink"
                    : "border border-border bg-surface text-text"
                }`}
              >
                {m.body}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={send}
        className="flex gap-2 border-t border-border bg-ink p-3"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message…"
          aria-label="Message"
          className="flex-1 rounded-(--radius-control) border border-border bg-surface px-3.5 py-2.5 text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
        <Button type="submit" disabled={sending || !draft.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
