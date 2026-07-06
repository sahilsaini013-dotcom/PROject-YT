"use client";

import { useActionState, useState } from "react";
import { inviteClient, type InviteResult } from "./actions";
import { Button, ErrorText, Input, Label } from "@/components/ui";

export function InviteForm() {
  const [result, formAction, pending] = useActionState<
    InviteResult | null,
    FormData
  >(inviteClient, null);
  const [copied, setCopied] = useState(false);

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div>
      <form action={formAction} className="flex items-end gap-3">
        <div className="flex-1">
          <Label htmlFor="invite-email">Invite a client by email</Label>
          <Input
            id="invite-email"
            name="email"
            type="email"
            required
            placeholder="client@example.com"
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Inviting…" : "Send invite"}
        </Button>
      </form>
      {result && !result.ok && <ErrorText>{result.error}</ErrorText>}
      {result?.ok && (
        <div className="mt-3 rounded-(--radius-control) border border-border bg-surface-raised p-3 text-sm">
          <p className="mb-1 text-success">
            Invite emailed to {result.email}.
          </p>
          <p className="text-text-muted">Or share the link directly:</p>
          <div className="mt-1 flex items-center gap-2">
            <code
              data-testid="invite-link"
              className="block min-w-0 flex-1 truncate text-xs text-text"
            >
              {result.inviteUrl}
            </code>
            <Button
              type="button"
              variant="secondary"
              onClick={() => copy(result.inviteUrl)}
              className="shrink-0 px-3 py-1.5 text-xs"
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
