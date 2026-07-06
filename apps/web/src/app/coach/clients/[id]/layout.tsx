import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientTabs } from "./client-tabs";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", id)
    .maybeSingle();
  if (!profile) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link
        href="/coach"
        className="text-sm text-text-muted transition-colors hover:text-text"
      >
        ← Roster
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{profile.full_name}</h1>
        <div className="flex gap-2">
          <Link
            href={`/coach/messages/${id}`}
            className="rounded-(--radius-control) border border-border px-4 py-2 text-sm font-medium text-text transition-colors hover:border-text-muted"
          >
            Message
          </Link>
          <Link
            href={`/coach/clients/${id}/nutrition/targets`}
            className="rounded-(--radius-control) border border-border px-4 py-2 text-sm font-medium text-text transition-colors hover:border-text-muted"
          >
            Set targets
          </Link>
        </div>
      </div>
      <ClientTabs clientId={id} />
      <div className="mt-6">{children}</div>
    </div>
  );
}
