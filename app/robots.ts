import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/_next/", "/thank-you/", "/thank-you-appointment/"] }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
