"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signUpMetadata } from "@/lib/auth";
import { Button, Card, ErrorText, Input, Label } from "@/components/ui";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: signUpMetadata("trainer", fullName) },
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/coach");
    router.refresh();
  }

  return (
    <Card>
      <h1 className="mb-1 text-2xl font-bold">Create your trainer account</h1>
      <p className="mb-6 text-sm text-text-muted">
        Your roster, programs, and client data in one place.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
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
          {busy ? "Creating account…" : "Start coaching"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="text-text underline underline-offset-4">
          Sign in
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-text-muted">
        Joining as a client? Use the invite link from your trainer.
      </p>
    </Card>
  );
}
