import fs from "node:fs";
import path from "node:path";

export const SITE = "https://canxglobal.com";
export const BRAND = "Can X Global";

const ROOT = path.join(process.cwd(), "content");

export type PostMeta = {
  id: number; slug: string; url: string; date: string; modified: string;
  title: string; seo_title: string; meta_description: string; h1: string;
  schema_types: string; excerpt: string; author: string | null;
  featured_image: string | null; featured_alt: string | null; featured_size: [number, number] | null;
  categories: string[]; tags: string[]; word_count: number; in_sitemap: boolean;
};

export type Post = PostMeta & {
  body: string;
  seo: { title: string; description: string; descriptionSource: "original" | "generated" };
  category: string;         // primary tag slug used for colour + category page
  categoryLabel: string;
  readingMinutes: number;
};

export type Taxonomy = {
  categories: Record<string, { name: string; slug: string }>;
  tags: Record<string, { name: string; slug: string; count: number }>;
};

/* ---------- Category system (11 blog categories = WP tags) ---------- */
export const CATEGORIES: Record<string, { label: string; color: string; path: string }> = {
  "express-entry":            { label: "Express Entry",              color: "#1558d6", path: "/immigration-blogs/express-entry/" },
  "family-sponsorship":       { label: "Family Sponsorship",         color: "#c9202f", path: "/immigration-blogs/family-sponsorship/" },
  "lmia":                     { label: "LMIA",                       color: "#6d28d9", path: "/immigration-blogs/lmia/" },
  "work-permit":              { label: "Work Permit",                color: "#065f46", path: "/immigration-blogs/work-permit/" },
  "super-visa-visitor-visa":  { label: "Super Visa & Visitor Visa",  color: "#b45309", path: "/immigration-blogs/super-visa-visitor-visa/" },
  "provincial-nominee-program":{ label: "Provincial Nominee Program", color: "#1e40af", path: "/immigration-blogs/provincial-nominee-program/" },
  "study-permit":             { label: "Study Permit",               color: "#0369a1", path: "/immigration-blogs/study-permit/" },
  "citizenship-settlement":   { label: "Citizenship & Settlement",   color: "#3730a3", path: "/immigration-blogs/citizenship-settlement/" },
  "refusals-reapplications":  { label: "Refusals & Reapplications",  color: "#991b1b", path: "/immigration-blogs/refusals-reapplications/" },
  "immigration-ai":           { label: "Immigration & AI",           color: "#4c1d95", path: "/immigration-blogs/immigration-ai/" },
  "canada":                   { label: "Canada",                     color: "#7f1d1d", path: "/immigration-blogs/canada/" },
};
export const CATEGORY_ORDER = Object.keys(CATEGORIES);

/* ---------- SEO rules ---------- */
const JUNK_DESC = [/^published by/i, /^by anuj sengar/i, /^anuj sengar/i, /style\.css/i, /licensed rcic/i];

export function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#8217;|&rsquo;/g, "’").replace(/&#8211;/g, "–").replace(/\s+/g, " ").trim();
}

export function truncateAtWord(s: string, max = 155) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const i = cut.lastIndexOf(" ");
  return (i > 80 ? cut.slice(0, i) : cut).replace(/[,;:\-–—]$/, "") + "…";
}

export function normaliseTitle(raw: string, fallback: string) {
  let t = (raw || fallback || "").trim();
  if (!t) return `${fallback} | ${BRAND}`;
  t = t.replace(/^Can X Global\s*[|\-–]\s*/i, "").trim();
  t = t.replace(/\s*[|\-–]\s*Can X Global\s*$/i, "").trim();
  if (!t.includes(BRAND)) t = `${t} | ${BRAND}`;
  return t;
}

export function describe(meta: PostMeta, body: string): Post["seo"] {
  const d = (meta.meta_description || "").trim();
  const junk = !d || d.length < 50 || JUNK_DESC.some((r) => r.test(d)) || d === meta.title;
  if (!junk) return { title: normaliseTitle(meta.seo_title, meta.title), description: d, descriptionSource: "original" };
  // first substantive paragraph
  const paras = [...body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => stripTags(m[1])).filter((p) => p.split(" ").length > 12 && !JUNK_DESC.some((r) => r.test(p)));
  const gen = truncateAtWord(paras[0] || stripTags(meta.excerpt) || meta.title, 155);
  return { title: normaliseTitle(meta.seo_title, meta.title), description: gen, descriptionSource: "generated" };
}

/* ---------- Loading ---------- */
let _posts: Post[] | null = null;

export function getTaxonomy(): Taxonomy {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "taxonomy.json"), "utf8"));
}

export function getAllPosts(): Post[] {
  if (_posts) return _posts;
  const dir = path.join(ROOT, "posts");
  const posts: Post[] = fs.readdirSync(dir).map((slug) => {
    const meta: PostMeta = JSON.parse(fs.readFileSync(path.join(dir, slug, "meta.json"), "utf8"));
    const body = fs.readFileSync(path.join(dir, slug, "body.html"), "utf8");
    const category = meta.tags.find((t) => CATEGORIES[t]) || (meta.categories.includes("recruitment-blogs") ? "canada" : "canada");
    return {
      ...meta, body, category,
      categoryLabel: CATEGORIES[category]?.label ?? "Immigration",
      readingMinutes: Math.max(1, Math.round(meta.word_count / 220)),
      seo: describe(meta, body),
    };
  });
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  _posts = posts;
  return posts;
}

export function getPost(slug: string) {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function getPostsByCategory(cat: string) {
  return getAllPosts().filter((p) => p.tags.includes(cat));
}

export function getRelated(post: Post, n = 4) {
  const same = getAllPosts().filter((p) => p.slug !== post.slug && p.category === post.category);
  return same.slice(0, n);
}

export function getMostRead(n = 4, exclude?: string) {
  const gsc: { url: string; clicks: number }[] = JSON.parse(fs.readFileSync(path.join(ROOT, "gsc-pages.json"), "utf8"));
  const bySlug = new Map(getAllPosts().map((p) => [p.slug, p]));
  const out: Post[] = [];
  for (const g of gsc) {
    const slug = g.url.replace(/^https?:\/\/[^/]+\//, "").replace(/\/$/, "");
    const p = bySlug.get(slug);
    if (p && p.slug !== exclude) out.push(p);
    if (out.length >= n) break;
  }
  return out;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "America/Vancouver" });
}

/* FAQ extraction from <details><summary>Q</summary><p>A</p></details> blocks */
export function extractFaq(body: string): { q: string; a: string }[] {
  const details = [...body.matchAll(/<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi)]
    .map((m) => ({ q: stripTags(m[1]), a: stripTags(m[2]) }))
    .filter((f) => f.q && f.a);
  if (details.length) return details;
  // fallback: an "FAQ" / "Frequently Asked Questions" heading followed by h3/h4 questions with paragraph answers
  const start = body.search(/<h2[^>]*>[^<]*(faq|frequently asked)[^<]*<\/h2>/i);
  if (start < 0) return [];
  const rest = body.slice(start);
  const end = rest.slice(5).search(/<h2/i);
  const section = end > 0 ? rest.slice(0, end + 5) : rest;
  const out: { q: string; a: string }[] = [];
  for (const m of section.matchAll(/<h[34][^>]*>([\s\S]*?)<\/h[34]>\s*((?:<p[^>]*>[\s\S]*?<\/p>\s*)+)/gi)) {
    const q = stripTags(m[1]); const a = stripTags(m[2]);
    if (q.length > 8 && a.length > 20 && /\?/.test(q)) out.push({ q, a });
  }
  return out;
}
