import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Brand assets are local, hand-authored SVGs; scripts are stripped by CSP.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Signed Storage URLs (meal/progress photos) come from the Supabase host.
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [
          {
            protocol: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
              .protocol.replace(":", "") as "http" | "https",
            hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
          },
        ]
      : [],
  },
};

export default nextConfig;
