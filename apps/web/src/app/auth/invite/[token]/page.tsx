import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { AcceptInviteForm } from "./accept-form";

export const metadata = { title: "Accept invite" };

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_invitation", {
    _token: token,
  });

  const invitation = data?.[0];

  if (error || !invitation) {
    return (
      <Card className="text-center">
        <Image
          src="/brand/empty-states/no-clients.svg"
          alt=""
          width={120}
          height={120}
          className="mx-auto mb-4 rounded-(--radius-control)"
        />
        <h1 className="mb-2 text-xl font-bold">Invite not found</h1>
        <p className="text-sm text-text-muted">
          This invite link isn&apos;t valid. Ask your trainer to send a new one.
        </p>
      </Card>
    );
  }

  if (invitation.status !== "pending") {
    return (
      <Card className="text-center">
        <h1 className="mb-2 text-xl font-bold">
          {invitation.status === "expired"
            ? "This invite has expired"
            : "This invite is no longer valid"}
        </h1>
        <p className="text-sm text-text-muted">
          {invitation.status === "expired"
            ? `Ask ${invitation.trainer_name} to send you a fresh link.`
            : "It may have already been used. Try signing in instead."}
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="mb-1 text-2xl font-bold">
        {invitation.trainer_name} invited you
      </h1>
      <p className="mb-6 text-sm text-text-muted">
        Create your account to start training with {invitation.trainer_name} on
        Training Hub.
      </p>
      <AcceptInviteForm token={token} email={invitation.email} />
    </Card>
  );
}
