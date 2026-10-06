import type { MetadataRoute } from "next";
import { CATEGORIES, SITE, getAllPosts } from "@/lib/content";
import { getLegacyPage, listLegacyKeys } from "@/lib/legacy";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  // pages (legacy mirrors) — home first
  out.push({ url: `${SITE}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 });
  for (const key of listLegacyKeys()) {
    if (key === "home") continue;
    const p = getLegacyPage(key.split("__"));
    if (!p) continue;
    out.push({ url: `${SITE}${p.path}`, changeFrequency: "monthly", priority: 0.7 });
  }

  // blog index + categories
  out.push({ url: `${SITE}/immigration-blogs/`, changeFrequency: "daily", priority: 0.8 });
  for (const c of Object.values(CATEGORIES)) out.push({ url: `${SITE}${c.path}`, changeFrequency: "weekly", priority: 0.6 });

  // posts (all published, including the 12 that the old sitemap omitted)
  for (const p of getAllPosts()) {
    out.push({
      url: `${SITE}/${p.slug}/`,
      lastModified: new Date(p.modified),
      changeFrequency: "monthly",
      priority: 0.6,
      images: p.featured_image ? [p.featured_image] : undefined,
    });
  }
  return out;
}
