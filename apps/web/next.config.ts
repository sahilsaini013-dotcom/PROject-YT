import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Brand assets are local, hand-authored SVGs; scripts are stripped by CSP.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
