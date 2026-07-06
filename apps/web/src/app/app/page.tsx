import Image from "next/image";

export const metadata = { title: "Today" };

// Placeholder shell — the client Today view lands in Sprint 3.
export default function ClientHome() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center">
      <Image src="/brand/icon.svg" alt="" width={72} height={72} />
      <h1 className="text-3xl font-bold">Today</h1>
      <p className="max-w-md text-text-muted">
        Your workouts, check-ins, and nutrition will live here once your coach
        sets you up.
      </p>
    </main>
  );
}
