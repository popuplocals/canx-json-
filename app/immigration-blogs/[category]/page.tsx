import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { CATEGORIES, CATEGORY_ORDER, SITE, getMostRead, getPostsByCategory } from "@/lib/content";
import { BlogCard, NumRow, Pills } from "@/components/blog/cards";
import { liveSeo } from "@/lib/legacy";
import "../../../styles/blog.scoped.css";

type Copy = {
  eyebrow: string; h1_html: string; desc: string; hero_img: string;
  consult_h3: string; consult_p: string; consult_btn: string; sb_cta_h: string; sb_cta_p: string; tags: string[];
};
const COPY: Record<string, Copy> = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/categories.json"), "utf8"));

export const dynamicParams = false;
export function generateStaticParams() {
  return CATEGORY_ORDER.map((category) => ({ category }));
}

const decode = (s: string) => s.replace(/&amp;/g, "&");

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const c = CATEGORIES[category];
  if (!c) return {};
  const copy = COPY[category];
  const n = getPostsByCategory(category).length;
  const live = liveSeo(c.path);
  const title = live?.title ?? `${c.label} Canada 2026: Guides, Rules & Updates | Can X Global`;
  const description = live?.description ?? `${decode(copy?.desc || "")} ${n} expert articles from a licensed RCIC.`.trim().slice(0, 158);
  return {
    title,
    description,
    alternates: { canonical: c.path },
    openGraph: { title, description, url: c.path, type: "website", images: copy?.hero_img ? [copy.hero_img] : undefined },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = CATEGORIES[category];
  if (!c) notFound();
  const copy = COPY[category];
  const posts = getPostsByCategory(category);
  const mostRead = getMostRead(50).filter((p) => p.category === category).slice(0, 5);
  const popular = mostRead.length >= 4 ? mostRead.slice(0, 4) : posts.slice(0, 4);
  const avgRead = Math.round(posts.reduce((a, p) => a + p.readingMinutes, 0) / Math.max(1, posts.length));
  const latestYear = posts[0]?.date.slice(0, 4) ?? "2026";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": `${SITE}${c.path}`, url: `${SITE}${c.path}`, name: `${c.label} Articles`, description: decode(copy?.desc || ""), isPartOf: { "@id": `${SITE}/#website` }, inLanguage: "en-CA" },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Immigration Blogs", item: `${SITE}/immigration-blogs/` },
          { "@type": "ListItem", position: 3, name: c.label, item: `${SITE}${c.path}` },
        ],
      },
      { "@type": "ItemList", itemListElement: posts.slice(0, 20).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/${p.slug}/`, name: p.title })) },
    ],
  };

  return (
    <div className="cxb" style={{ ["--cat" as string]: c.color }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Pills active={category} />

      <div className="wrap">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span className="sep">/</span>
          <Link href="/immigration-blogs/">Immigration Blogs</Link><span className="sep">/</span>
          <strong style={{ color: "var(--ink)" }}>{c.label}</strong>
        </nav>
      </div>

      <section className="sub-hero">
        <div className="maple-bg" aria-hidden>🍁</div>
        <div className="wrap">
          <div className="sub-hero-grid">
            <div className="sub-hero-left">
              <div className="topic-eyebrow">{c.label}</div>
              <h1 dangerouslySetInnerHTML={{ __html: copy?.h1_html || c.label }} />
              <p className="sub-desc">{decode(copy?.desc || "")}</p>
              <div className="hero-stats">
                <div className="h-stat"><b>{posts.length}</b><span>Articles</span></div>
                <div className="h-stat"><b>{latestYear}</b><span>Updated</span></div>
                <div className="h-stat"><b>{avgRead} min</b><span>Avg Read</span></div>
              </div>
            </div>
            <div className="sub-hero-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {copy?.hero_img && <img src={copy.hero_img} alt={`${c.label} Canada`} loading="eager" />}
            </div>
          </div>
        </div>
      </section>

      <div className="consult-strip">
        <div className="wrap">
          <div className="consult-inner">
            <div className="consult-text">
              <h3>{copy?.consult_h3 || `Need help with ${c.label}?`}</h3>
              <p>{copy?.consult_p || "Talk to a licensed RCIC about your options."}</p>
            </div>
            <Link href="/get-started/" className="consult-btn">{copy?.consult_btn || "Get Expert Assessment →"}</Link>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="page-body">
          <main>
            <div className="filter-bar">
              <p className="filter-count">Showing <strong>{posts.length} articles</strong> in {c.label}</p>
            </div>

            <div className="sec-hd"><h2>Latest Articles</h2></div>
            <div className="blog-grid">
              {posts.map((p) => <BlogCard key={p.slug} post={p} />)}
            </div>

            {mostRead.length > 0 && (
              <div style={{ marginTop: 52 }}>
                <div className="sec-hd"><h2>Most Read</h2></div>
                <div className="num-list">
                  {mostRead.map((p, i) => <NumRow key={p.slug} post={p} n={i + 1} />)}
                </div>
              </div>
            )}
          </main>

          <aside className="sidebar">
            <div className="sb-box dark">
              <p className="sb-label">Consultation</p>
              <p className="sb-cta-h">{copy?.sb_cta_h || `Need a ${c.label} expert?`}</p>
              <p className="sb-cta-p">{(copy?.sb_cta_p || "Talk to a licensed RCIC about your case.").replace(/free/gi, "").replace(/\s{2,}/g, " ")}</p>
              <Link href="/get-started/" className="sb-btn">Book a Consultation →</Link>
            </div>
            <div className="sb-box">
              <p className="sb-label">Popular in {c.label}</p>
              <div>
                {popular.map((p, i) => (
                  <Link key={p.slug} href={`/${p.slug}/`} className="sb-post">
                    <span className="sb-num">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="sb-post-title">{p.title}</p>
                      <p className="sb-post-meta">{p.readingMinutes} min read</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="sb-box">
              <p className="sb-label">Other Topics</p>
              <div className="tag-cloud">
                {CATEGORY_ORDER.filter((s) => s !== category).map((s) => (
                  <Link key={s} href={CATEGORIES[s].path}>{CATEGORIES[s].label}</Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
