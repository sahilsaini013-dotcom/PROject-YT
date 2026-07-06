import { NotificationsList } from "@/components/notifications-list";

export const metadata = { title: "Notifications" };

export default function CoachNotifications() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Notifications</h1>
      <NotificationsList path="/coach/notifications" />
    </main>
  );
}
