import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { InviteForm } from "./invite-form";

export const metadata = { title: "Roster" };

const statusStyles: Record<string, string> = {
  active: "text-success",
  invited: "text-warning",
  paused: "text-text-muted",
  ended: "text-text-muted",
};

export default async function CoachRoster() {
  const supabase = await createClient();

  const { data: links } = await supabase
    .from("trainer_clients")
    .select(
      "id, status, client_id, client:profiles!trainer_clients_client_id_fkey(full_name)",
    )
    .order("created_at", { ascending: false });

  const { data: pendingInvites } = await supabase
    .from("invitations")
    .select("id, email, status, expires_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold">Roster</h1>
        <p className="mt-1 text-sm text-text-muted">
          Your clients and open invites at a glance.
        </p>
      </div>

      <Card>
        <InviteForm />
      </Card>

      {(!links || links.length === 0) && (
        <Card className="flex flex-col items-center py-12 text-center">
          <Image
            src="/brand/empty-states/no-clients.svg"
            alt=""
            width={140}
            height={140}
            className="mb-4 rounded-(--radius-control)"
          />
          <h2 className="text-lg font-bold">No clients yet</h2>
          <p className="mt-1 max-w-sm text-sm text-text-muted">
            Invite your first client above — they&apos;ll appear here as soon as
            they accept.
          </p>
        </Card>
      )}

      {links && links.length > 0 && (
        <Card className="p-0">
          <ul className="divide-y divide-border">
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  href={`/coach/clients/${link.client_id}`}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-surface-raised"
                >
                  <span className="font-medium">
                    {link.client?.full_name ?? "—"}
                  </span>
                  <span
                    className={`text-sm capitalize ${statusStyles[link.status] ?? "text-text-muted"}`}
                  >
                    {link.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {pendingInvites && pendingInvites.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-bold">Pending invites</h2>
          <Card className="p-0">
            <ul className="divide-y divide-border">
              {pendingInvites.map((invite) => (
                <li
                  key={invite.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <span className="text-sm">{invite.email}</span>
                  <span className="tnum text-sm text-text-muted">
                    expires{" "}
                    {new Date(invite.expires_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </main>
  );
}
