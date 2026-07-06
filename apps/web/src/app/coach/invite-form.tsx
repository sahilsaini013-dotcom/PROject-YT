"use client";

import { useActionState } from "react";
import { inviteClient, type InviteResult } from "./actions";
import { Button, ErrorText, Input, Label } from "@/components/ui";

export function InviteForm() {
  const [result, formAction, pending] = useActionState<
    InviteResult | null,
    FormData
  >(inviteClient, null);

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
          <p className="mb-1 text-success">Invite created for {result.email}.</p>
          <p className="text-text-muted">Share this link with them:</p>
          <code
            data-testid="invite-link"
            className="mt-1 block break-all text-xs text-text"
          >
            {result.inviteUrl}
          </code>
        </div>
      )}
    </div>
  );
}
