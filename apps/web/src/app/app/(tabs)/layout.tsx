import { ClientTabBar } from "./tab-bar";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink pb-24">
      {children}
      <ClientTabBar />
    </div>
  );
}
