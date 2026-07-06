import Image from "next/image";

export const metadata = { title: "Coach" };

// Placeholder shell — auth and the coach dashboard land in Sprint 1+.
export default function CoachHome() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center">
      <Image src="/brand/icon.svg" alt="" width={72} height={72} />
      <h1 className="text-3xl font-bold">Coach dashboard</h1>
      <p className="max-w-md text-text-muted">
        Sign-in, your roster, and the program builder arrive here in the next
        sprint.
      </p>
    </main>
  );
}
