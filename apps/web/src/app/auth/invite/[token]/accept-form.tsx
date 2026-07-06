"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signUpMetadata } from "@/lib/auth";
import { Button, ErrorText, Input, Label } from "@/components/ui";

export function AcceptInviteForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const supabase = createClient();

    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({
        email,
        password,
        options: { data: signUpMetadata("client", fullName) },
      });

    // If the email already has an account (e.g. a re-invite), fall back to
    // signing in so the accept RPC still runs authenticated.
    if (signUpError || !signUpData.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setBusy(false);
        setError(
          "That email already has an account. Enter its password to accept the invite.",
        );
        return;
      }
    }

    const { error: acceptError } = await supabase.rpc("accept_invitation", {
      _token: token,
    });
    setBusy(false);
    if (acceptError) {
      setError(acceptError.message);
      return;
    }

    router.push("/app/onboarding");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} disabled />
      </div>
      <div>
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="password">Choose a password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <ErrorText>{error}</ErrorText>
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Joining…" : "Join Training Hub"}
      </Button>
    </form>
  );
}
