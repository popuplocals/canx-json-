import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "content", "legacy");
const SHARED = path.join(ROOT, "_shared");

export type LegacyScript = { src?: string; inline?: string; id?: string | null };
export type LegacyManifest = {
  path: string; url: string; wp_id: number; title_wp: string;
  seo_title: string; meta_description: string; h1: string; schema_types: string; og_title: string;
  body_class: string; stylesheets: string[]; styles: string[]; scripts: LegacyScript[]; body_chars: number;
};
export type LegacyPage = LegacyManifest & { body: string; inlineStyles: string[]; inlineScripts: Record<string, string> };

export function keyFor(segments: string[]) {
  return segments.length === 0 ? "home" : segments.join("__");
}

export function listLegacyKeys(): string[] {
  if (!fs.existsSync(ROOT)) return [];
  return fs.readdirSync(ROOT).filter((d) => !d.startsWith("_") && !d.startsWith("immigration-blogs") && fs.existsSync(path.join(ROOT, d, "page.json")));
}

export function getLegacyPage(segments: string[]): LegacyPage | null {
  const dir = path.join(ROOT, keyFor(segments));
  const mf = path.join(dir, "page.json");
  if (!fs.existsSync(mf)) return null;
  const manifest: LegacyManifest = JSON.parse(fs.readFileSync(mf, "utf8"));
  const body = fs.readFileSync(path.join(dir, "body.html"), "utf8");
  const inlineStyles = manifest.styles.map((f) => fs.readFileSync(path.join(SHARED, f), "utf8"));
  const inlineScripts: Record<string, string> = {};
  for (const s of manifest.scripts) if (s.inline) inlineScripts[s.inline] = fs.readFileSync(path.join(SHARED, s.inline), "utf8");
  return { ...manifest, body, inlineStyles, inlineScripts };
}

/* Page-level SEO description fallback for legacy pages with junk/empty descriptions. */
export function legacyDescription(p: LegacyManifest): string {
  const d = (p.meta_description || "").trim();
  if (d.length >= 50 && !/^published by|licensed rcic|^by anuj/i.test(d)) return d;
  return `${p.title_wp} — Can X Global Solutions Inc., licensed Canadian recruitment and immigration consultants in Surrey, BC. Talk to a regulated RCIC about your options.`.slice(0, 158);
}

/* Live-site SEO baseline lookup (title / description as crawled on 2026-10-06). */
const BASELINE: Record<string, { title: string; meta_description: string }> = Object.fromEntries(
  (JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "seo-baseline.json"), "utf8")) as { url: string; title: string; meta_description: string }[])
    .map((r) => [r.url.replace(/^https:\/\/canxglobal\.com/, "").replace(/\/$/, "") || "/", { title: r.title, meta_description: r.meta_description }]),
);
export function liveSeo(pathname: string): { title: string; description: string } | null {
  const r = BASELINE[pathname.replace(/\/$/, "") || "/"];
  if (!r) return null;
  const d = (r.meta_description || "").trim();
  const good = d.length >= 50 && !/^published by|^by anuj|^anuj sengar|style\.css|licensed rcic/i.test(d);
  return good ? { title: r.title, description: d } : null;
}
