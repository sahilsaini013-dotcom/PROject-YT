"use client";

import { useState, useTransition } from "react";
import { Button, Card, ErrorText, Label, Select } from "@/components/ui";
import { assignProgram, type AssignResult } from "./assign";

export function AssignPanel({
  programId,
  clients,
}: {
  programId: string;
  clients: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<AssignResult | null>(null);
  const [pending, startTransition] = useTransition();

  if (clients.length === 0) {
    return (
      <Card className="border-dashed text-sm text-text-muted">
        Invite and activate a client to assign this program.
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold">Assign to a client</h2>
          <p className="text-sm text-text-muted">
            Schedules the workouts on the client&apos;s calendar.
          </p>
        </div>
        {!open && <Button onClick={() => setOpen(true)}>Assign</Button>}
      </div>

      {open && (
        <form
          action={(formData) =>
            startTransition(async () => {
              const res = await assignProgram(programId, formData);
              setResult(res);
              if (res.ok) setOpen(false);
            })
          }
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <div>
            <Label htmlFor="client_id">Client</Label>
            <Select id="client_id" name="client_id" required>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="start_date">Start date</Label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              required
              className="w-full rounded-(--radius-control) border border-border bg-surface px-3.5 py-2.5 text-text focus:border-accent focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Assigning…" : "Confirm assignment"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {result && !result.ok && <ErrorText>{result.error}</ErrorText>}
      {result?.ok && (
        <p className="mt-3 text-sm text-success">
          Assigned — {result.sessions} workouts scheduled.
        </p>
      )}
    </Card>
  );
}
