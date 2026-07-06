import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Program in minutes",
    body: "Build multi-week programs from a 100+ exercise library — sets, reps, RPE, rest, and your cues on every slot.",
    illustration: "/brand/exercises/squat.svg",
    alt: "Squat illustration",
  },
  {
    title: "The whole athlete",
    body: "Workouts, daily check-ins, nutrition, and photos flow into one timeline, so you coach the person — not a spreadsheet.",
    illustration: "/brand/exercises/cardio.svg",
    alt: "Cardio illustration",
  },
  {
    title: "Coaching that lands",
    body: "Clients get a focused Today view, a workout player built for the gym floor, and you — one message away.",
    illustration: "/brand/exercises/push-horizontal.svg",
    alt: "Push movement illustration",
  },
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-ink text-text">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Image
          src="/brand/lockup.svg"
          alt="Training Hub"
          width={190}
          height={44}
          priority
        />
        <nav className="flex items-center gap-6 text-sm text-text-muted">
          <Link href="/coach" className="transition-colors hover:text-text">
            For coaches
          </Link>
          <Link href="/app" className="transition-colors hover:text-text">
            For clients
          </Link>
          <Link
            href="/coach"
            className="rounded-(--radius-control) border border-border px-4 py-2 text-text transition-colors hover:border-text-muted"
          >
            Sign in
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {/* Animated SVG: <img> keeps CSS keyframes running; next/image adds nothing here */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/animations/hero-loop.svg"
            alt=""
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink/40 to-ink" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-28 text-center md:py-36">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
            The trainer-first coaching platform
          </p>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] md:text-7xl">
            Coach smarter.
            <br />
            Train harder.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-text-muted">
            Programs, check-ins, nutrition, and messaging — everything you and
            your clients need to close the loop, in one dark, fast, focused app.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/coach"
              className="rounded-(--radius-control) bg-accent px-7 py-3 font-semibold text-ink transition-colors hover:bg-accent-pressed"
            >
              Start coaching
            </Link>
            <Link
              href="/app"
              className="rounded-(--radius-control) border border-border px-7 py-3 font-semibold text-text transition-colors hover:border-text-muted"
            >
              I&apos;m a client
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold md:text-4xl">
          The full coaching loop, closed.
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-(--radius-card) border border-border bg-surface p-6"
            >
              <Image
                src={f.illustration}
                alt={f.alt}
                width={96}
                height={96}
                className="mb-5 rounded-(--radius-control)"
              />
              <h3 className="text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {f.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-text-muted md:flex-row">
          <Image
            src="/brand/lockup.svg"
            alt="Training Hub"
            width={150}
            height={35}
          />
          <p>Built for coaches who take their clients seriously.</p>
        </div>
      </footer>
    </main>
  );
}
