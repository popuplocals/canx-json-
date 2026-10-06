import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostLayout from "@/components/blog/PostLayout";
import LegacyPage from "@/components/legacy/LegacyPage";
import { CATEGORIES, SITE, extractFaq, getAllPosts, getPost, type Post } from "@/lib/content";
import { getLegacyPage, legacyDescription, listLegacyKeys, type LegacyPage as LegacyData } from "@/lib/legacy";

export const dynamicParams = false;

type Params = { params: Promise<{ path: string[] }> };

export function generateStaticParams() {
  const posts = getAllPosts().map((p) => ({ path: [p.slug] }));
  const legacy = listLegacyKeys().filter((k) => k !== "home").map((k) => ({ path: k.split("__") }));
  return [...posts, ...legacy];
}

function resolve(segments: string[]): { post: Post } | { legacy: LegacyData } | null {
  if (segments.length === 1) {
    const post = getPost(segments[0]);
    if (post) return { post };
  }
  const legacy = getLegacyPage(segments);
  return legacy ? { legacy } : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { path } = await params;
  const r = resolve(path);
  if (!r) return {};
  if ("post" in r) {
    const post = r.post;
    const url = `/${post.slug}/`;
    return {
      title: post.seo.title,
      description: post.seo.description,
      alternates: { canonical: url },
      openGraph: {
        type: "article", url, title: post.seo.title, description: post.seo.description,
        publishedTime: post.date, modifiedTime: post.modified, authors: ["Anuj Sengar"],
        images: post.featured_image ? [{ url: post.featured_image, alt: post.featured_alt || post.title }] : undefined,
      },
      twitter: { card: "summary_large_image", title: post.seo.title, description: post.seo.description, images: post.featured_image ? [post.featured_image] : undefined },
    };
  }
  const p = r.legacy;
  const title = p.seo_title || `${p.title_wp} | Can X Global`;
  const description = legacyDescription(p);
  return {
    title, description,
    alternates: { canonical: p.path },
    openGraph: { type: "website", url: p.path, title: p.og_title || title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CatchAll({ params }: Params) {
  const { path } = await params;
  const r = resolve(path);
  if (!r) notFound();
  return "post" in r ? <PostView post={r.post} /> : <LegacyView page={r.legacy} />;
}

/* ---------------- post ---------------- */
function PostView({ post }: { post: Post }) {
  const url = `${SITE}/${post.slug}/`;
  const cat = CATEGORIES[post.category];
  const faq = extractFaq(post.body);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting", "@id": `${url}#article`, mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: post.title, description: post.seo.description, url, datePublished: post.date, dateModified: post.modified,
      author: { "@type": "Person", name: "Anuj Sengar", jobTitle: "Licensed RCIC R515178", url: "https://www.linkedin.com/in/anuj-sengar-aj" },
      publisher: { "@id": `${SITE}/#organization` },
      image: post.featured_image ? { "@type": "ImageObject", url: post.featured_image, width: post.featured_size?.[0], height: post.featured_size?.[1] } : undefined,
      articleSection: post.categoryLabel, keywords: post.tags.map((t) => CATEGORIES[t]?.label ?? t).join(", "),
      wordCount: post.word_count, inLanguage: "en-CA", isPartOf: { "@id": `${SITE}/#website` },
    },
    {
      "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Immigration Blogs", item: `${SITE}/immigration-blogs/` },
        ...(cat ? [{ "@type": "ListItem", position: 3, name: cat.label, item: `${SITE}${cat.path}` }] : []),
        { "@type": "ListItem", position: cat ? 4 : 3, name: post.title, item: url },
      ],
    },
  ];
  if (faq.length) graph.push({ "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />
      <PostLayout post={post} />
    </>
  );
}

/* ---------------- legacy page ---------------- */
export function LegacyView({ page }: { page: LegacyData }) {
  const url = `${SITE}${page.path}`;
  const crumbs = page.path.split("/").filter(Boolean);
  const graph: Record<string, unknown>[] = [
    { "@type": "WebPage", "@id": url, url, name: page.seo_title || page.title_wp, description: legacyDescription(page), isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${SITE}/#organization` }, inLanguage: "en-CA" },
  ];
  if (crumbs.length) {
    let acc = "";
    graph.push({
      "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        ...crumbs.map((c, i) => { acc += `/${c}`; return { "@type": "ListItem", position: i + 2, name: i === crumbs.length - 1 ? page.title_wp : c.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()), item: `${SITE}${acc}/` }; }),
      ],
    });
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />
      <LegacyPage page={page} />
    </>
  );
}
