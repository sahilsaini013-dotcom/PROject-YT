"use server";

import { createClient } from "@/lib/supabase/server";
import { emailShell, escapeHtml, sendEmail } from "@/lib/email";
import type { ChatMessage } from "@/components/chat";

// Sends a message and emails the recipient. Insert still fires the Realtime
// event + the in-app notification trigger; email is best-effort on top.
export async function sendMessage(
  threadId: string,
  body: string,
): Promise<{ ok: boolean; message?: ChatMessage; error?: string }> {
  const trimmed = body.trim();
  if (!trimmed) return { ok: false, error: "Empty message." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in again." };

  const { data: message, error } = await supabase
    .from("messages")
    .insert({ thread_id: threadId, sender_id: user.id, body: trimmed })
    .select("id, sender_id, body, created_at")
    .single();
  if (error || !message) {
    return { ok: false, error: error?.message ?? "Could not send." };
  }

  // Resolve the recipient and email them (best effort).
  const { data: thread } = await supabase
    .from("message_threads")
    .select("trainer_id, client_id")
    .eq("id", threadId)
    .maybeSingle();
  if (thread) {
    const recipient =
      thread.trainer_id === user.id ? thread.client_id : thread.trainer_id;
    const { data: sender } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    const { data: email } = await supabase.rpc("email_for_user", {
      _user: recipient,
    });
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const path = thread.trainer_id === recipient ? "/coach/messages" : "/app/messages";
    const senderName = sender?.full_name ?? "Training Hub";
    if (email) {
      await sendEmail({
        to: email,
        subject: `New message from ${senderName}`,
        html: emailShell(
          `Message from ${senderName}`,
          `${escapeHtml(trimmed.slice(0, 200))}
           <p style="margin-top:16px"><a href="${site}${path}" style="background:#C6FF00;color:#0B0D10;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">Reply</a></p>`,
        ),
      });
    }
  }

  return { ok: true, message };
}
