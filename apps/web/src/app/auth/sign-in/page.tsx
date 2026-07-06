"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Card, ErrorText, Input, Label } from "@/components/ui";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const supabase = createClient();

    if (mode === "password") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setBusy(false);
      if (error) {
        setError(error.message);
        return;
      }
      const role = data.user?.user_metadata?.role;
      const next = searchParams.get("next");
      // Only same-origin relative paths — an absolute/protocol-relative next
      // would let a crafted link bounce a fresh sign-in to a phishing site.
      const safeNext =
        next && next.startsWith("/") && !next.startsWith("//") ? next : null;
      router.push(safeNext ?? (role === "trainer" ? "/coach" : "/app"));
      router.refresh();
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      setBusy(false);
      if (error) {
        setError(error.message);
        return;
      }
      setMagicSent(true);
    }
  }

  return (
    <Card>
      <h1 className="mb-1 text-2xl font-bold">Sign in</h1>
      <p className="mb-6 text-sm text-text-muted">
        Welcome back. Let&apos;s get to work.
      </p>

      <div className="mb-6 flex gap-1 rounded-(--radius-control) border border-border p-1">
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${mode === "password" ? "bg-surface-raised text-text" : "text-text-muted hover:text-text"}`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setMode("magic")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${mode === "magic" ? "bg-surface-raised text-text" : "text-text-muted hover:text-text"}`}
        >
          Magic link
        </button>
      </div>

      {magicSent ? (
        <p className="text-sm text-success">
          Check your email — your sign-in link is on the way.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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
          {mode === "password" && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
          <ErrorText>{error}</ErrorText>
          <Button type="submit" disabled={busy} className="w-full">
            {busy
              ? "Signing in…"
              : mode === "password"
                ? "Sign in"
                : "Email me a link"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-text-muted">
        Coaching clients?{" "}
        <Link href="/auth/sign-up" className="text-text underline-offset-4 hover:underline">
          Create a trainer account
        </Link>
      </p>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
