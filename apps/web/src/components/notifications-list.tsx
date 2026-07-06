import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { MarkReadOnView } from "./mark-read";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export async function NotificationsList({ path }: { path: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, kind, title, body, link_path, read_at, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (!notifications || notifications.length === 0) {
    return (
      <Card className="text-center text-sm text-text-muted">
        No notifications yet.
      </Card>
    );
  }

  return (
    <>
      <MarkReadOnView path={path} />
      <Card className="p-0">
        <ul className="divide-y divide-border">
          {notifications.map((n) => {
            const inner = (
              <div
                className={`px-5 py-4 ${n.read_at ? "" : "bg-surface-raised"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {!n.read_at && (
                        <span
                          aria-hidden="true"
                          className="mr-2 inline-block h-2 w-2 rounded-full bg-accent align-middle"
                        />
                      )}
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="mt-0.5 text-sm text-text-muted">{n.body}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-text-muted">
                    {timeAgo(n.created_at)}
                  </span>
                </div>
              </div>
            );
            return (
              <li key={n.id}>
                {n.link_path ? (
                  <Link
                    href={n.link_path}
                    className="block transition-colors hover:bg-surface-raised"
                  >
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}
