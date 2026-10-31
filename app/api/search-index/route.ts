import { getAllPosts } from "@/lib/content";
import { getLegacyPage, listLegacyKeys } from "@/lib/legacy";

export const dynamic = "force-static";

/** Lightweight title index for the header search (built at deploy time). */
export function GET() {
  const entries: { t: string; h: string; k: string }[] = [];
  for (const key of listLegacyKeys()) {
    const p = getLegacyPage(key === "home" ? [] : key.split("__"));
    if (!p || p.path === "/") continue;
    const t = (p.h1 || p.title_wp || "").replace(/\s+/g, " ").trim();
    if (t) entries.push({ t, h: p.path, k: "Page" });
  }
  for (const p of getAllPosts()) entries.push({ t: p.title, h: `/${p.slug}/`, k: "Blog" });
  return Response.json(entries, { headers: { "Cache-Control": "public, max-age=3600" } });
}
