"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type InviteResult =
  | { ok: true; inviteUrl: string; email: string }
  | { ok: false; error: string };

export async function inviteClient(
  _prev: InviteResult | null,
  formData: FormData,
): Promise<InviteResult> {
  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_invitation", {
    _email: email,
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  const invitation = data?.[0];
  if (!invitation) {
    return { ok: false, error: "Could not create the invitation." };
  }

  // Build the link on the origin the trainer is actually using, so the
  // invitee stays on the same host their auth cookies will live on.
  const requestHeaders = await headers();
  const base =
    requestHeaders.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";
  const inviteUrl = `${base}/auth/invite/${invitation.token}`;

  // Email delivery becomes a real notification in Sprint 5; the link is
  // always surfaced in the roster so trainers can share it directly.
  revalidatePath("/coach");
  return { ok: true, inviteUrl, email };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
