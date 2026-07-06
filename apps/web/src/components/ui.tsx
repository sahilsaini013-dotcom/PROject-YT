import Link from "next/link";
import type { ComponentProps } from "react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// One definition of each control's look, shared by every call site.
const primaryButton =
  "inline-block rounded-(--radius-control) bg-accent px-5 py-2.5 font-semibold text-ink transition-colors hover:bg-accent-pressed disabled:cursor-not-allowed disabled:opacity-50";
const ghostButton =
  "inline-block rounded-(--radius-control) px-5 py-2.5 font-semibold text-text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButton =
  "inline-block rounded-(--radius-control) border border-border px-5 py-2.5 font-semibold text-text transition-colors hover:border-text-muted disabled:cursor-not-allowed disabled:opacity-50";
const fieldClasses =
  "w-full rounded-(--radius-control) border border-border bg-surface px-3.5 py-2.5 text-text placeholder:text-text-muted focus:border-accent focus:outline-none";

const buttonVariant = {
  primary: primaryButton,
  secondary: secondaryButton,
  ghost: ghostButton,
} as const;

type Variant = keyof typeof buttonVariant;

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cx(buttonVariant[variant], className)} {...props} />;
}

// Anchor styled as a button — for CTAs that navigate.
export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cx(buttonVariant[variant], className)} {...props} />;
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(fieldClasses, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(fieldClasses, className)} {...props} />;
}

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cx(fieldClasses, className)} {...props} />;
}

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cx("mb-1.5 block text-sm font-medium text-text-muted", className)}
      {...props}
    />
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        "rounded-(--radius-card) border border-border bg-surface p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ErrorText({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-sm text-danger">
      {children}
    </p>
  );
}
