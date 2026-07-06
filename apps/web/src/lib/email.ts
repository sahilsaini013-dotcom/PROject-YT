import "server-only";
import nodemailer from "nodemailer";

// Captured test transport in dev/CI (Mailpit); real SMTP in production via
// env. A no-op when SMTP isn't configured, so the app never blocks on email.
const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;

const transporter =
  host && port
    ? nodemailer.createTransport({
        host,
        port,
        secure: false,
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
        tls: { rejectUnauthorized: false },
      })
    : null;

const FROM = process.env.EMAIL_FROM ?? "Training Hub <no-reply@traininghub.app>";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  if (!transporter) return false;
  try {
    await transporter.sendMail({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      text: opts.text ?? opts.html.replace(/<[^>]+>/g, " "),
      html: opts.html,
    });
    return true;
  } catch {
    // Never let a mail failure break the primary action.
    return false;
  }
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function emailShell(title: string, body: string) {
  return `<div style="background:#0B0D10;color:#F5F7FA;font-family:Inter,system-ui,sans-serif;padding:32px">
  <h1 style="color:#C6FF00;font-size:20px;margin:0 0 16px">${escapeHtml(title)}</h1>
  <div style="font-size:15px;line-height:1.6;color:#F5F7FA">${body}</div>
  <p style="margin-top:24px;color:#8A94A3;font-size:12px">Training Hub — coach smarter, train harder.</p>
</div>`;
}
