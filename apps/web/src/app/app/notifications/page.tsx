import Link from "next/link";
import { NotificationsList } from "@/components/notifications-list";

export const metadata = { title: "Notifications" };

export default function ClientNotifications() {
  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-md">
        <Link
          href="/app"
          className="text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Today
        </Link>
        <h1 className="mb-6 mt-2 text-2xl font-bold">Notifications</h1>
        <NotificationsList path="/app/notifications" />
      </div>
    </main>
  );
}
