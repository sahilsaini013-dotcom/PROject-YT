import localFont from "next/font/local";

// Self-hosted so builds never depend on Google Fonts at build time.
export const archivo = localFont({
  src: [
    { path: "../fonts/archivo-v25-latin-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/archivo-v25-latin-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-archivo",
  display: "swap",
});

export const inter = localFont({
  src: [
    { path: "../fonts/inter-v20-latin-regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter-v20-latin-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/inter-v20-latin-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});
