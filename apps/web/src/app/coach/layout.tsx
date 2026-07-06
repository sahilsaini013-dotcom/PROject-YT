import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui";
import { signOut } from "./actions";

const nav = [
  { href: "/coach", label: "Roster" },
  { href: "/coach/programs", label: "Programs" },
  { href: "/coach/exercises", label: "Exercises" },
];

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("full_name").eq("id", user.id).single()
    : { data: null };

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <Link href="/coach">
              <Image
                src="/brand/lockup.svg"
                alt="Training Hub"
                width={150}
                height={35}
              />
            </Link>
            <nav className="flex items-center gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-(--radius-control) px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface hover:text-text"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-text-muted sm:inline">
              {profile?.full_name}
            </span>
            <form action={signOut}>
              <Button variant="ghost" type="submit" className="px-2 py-1 text-sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
