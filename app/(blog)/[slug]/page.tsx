import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostLayout from "@/components/blog/PostLayout";
import { CATEGORIES, SITE, extractFaq, getAllPosts, getPost } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `/${post.slug}/`;
  return {
    title: post.seo.title,
    description: post.seo.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.seo.title,
      description: post.seo.description,
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: ["Anuj Sengar"],
      images: post.featured_image ? [{ url: post.featured_image, alt: post.featured_alt || post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.title,
      description: post.seo.description,
      images: post.featured_image ? [post.featured_image] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const url = `${SITE}/${post.slug}/`;
  const cat = CATEGORIES[post.category];
  const faq = extractFaq(post.body);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: post.title,
      description: post.seo.description,
      url,
      datePublished: post.date,
      dateModified: post.modified,
      author: { "@type": "Person", name: "Anuj Sengar", jobTitle: "Licensed RCIC R515178", url: "https://www.linkedin.com/in/anuj-sengar-aj" },
      publisher: { "@id": `${SITE}/#organization` },
      image: post.featured_image
        ? { "@type": "ImageObject", url: post.featured_image, width: post.featured_size?.[0], height: post.featured_size?.[1] }
        : undefined,
      articleSection: post.categoryLabel,
      keywords: post.tags.map((t) => CATEGORIES[t]?.label ?? t).join(", "),
      wordCount: post.word_count,
      inLanguage: "en-CA",
      isPartOf: { "@id": `${SITE}/#website` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Immigration Blogs", item: `${SITE}/immigration-blogs/` },
        ...(cat ? [{ "@type": "ListItem", position: 3, name: cat.label, item: `${SITE}${cat.path}` }] : []),
        { "@type": "ListItem", position: cat ? 4 : 3, name: post.title, item: url },
      ],
    },
  ];
  if (faq.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
      />
      <PostLayout post={post} />
    </>
  );
}
