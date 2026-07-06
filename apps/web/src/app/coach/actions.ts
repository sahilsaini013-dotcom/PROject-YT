"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { emailShell, sendEmail } from "@/lib/email";

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

  // Email the invite (captured by Mailpit in dev/CI). The link is also
  // surfaced in the roster so the trainer can share it directly.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: trainer } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();
  await sendEmail({
    to: email,
    subject: `${trainer?.full_name ?? "Your coach"} invited you to Training Hub`,
    html: emailShell(
      "You've been invited",
      `${trainer?.full_name ?? "Your coach"} wants to coach you on Training Hub.
       <p style="margin-top:16px"><a href="${inviteUrl}" style="background:#C6FF00;color:#0B0D10;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">Accept invite</a></p>`,
    ),
  });

  revalidatePath("/coach");
  return { ok: true, inviteUrl, email };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // Redirect off the authed route so the roster never re-renders without a
  // session (which would deref a null user).
  redirect("/auth/sign-in");
}
