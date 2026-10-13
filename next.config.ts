import type { NextConfig } from "next";
import redirects from "./redirects.json";

const nextConfig: NextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "canxglobal.com" }, { protocol: "https", hostname: "i0.wp.com" }],
  },
  async redirects() {
    return redirects as Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>;
  },
  async headers() {
    return [
      // never let the *.vercel.app preview compete with canxglobal.com in search
      { source: "/:path*", has: [{ type: "host", value: "(.*)\.vercel\.app" }], headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/:path*", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }, { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }] },
    ];
  },
};

export default nextConfig;
