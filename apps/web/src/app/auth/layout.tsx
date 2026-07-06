import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-12">
      <Link href="/" className="mb-8">
        <Image
          src="/brand/lockup.svg"
          alt="Training Hub"
          width={200}
          height={46}
          priority
        />
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
