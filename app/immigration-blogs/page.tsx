import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, CATEGORY_ORDER, SITE, getAllPosts, getMostRead, getPostsByCategory } from "@/lib/content";
import { NumberedRow, Pane, Pills, PostCard, TrendingRow } from "@/components/blog/cards";
import "../../styles/blog.scoped.css";

const TITLE = "Immigration Blogs: Canada Immigration News, Guides & Updates | Can X Global";
const DESC =
  "Expert guides on Express Entry, LMIA, work permits, family sponsorship, study permits, PNP and more. Written by a licensed RCIC at Can X Global Solutions, Surrey BC.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/immigration-blogs/" },
  openGraph: { title: TITLE, description: DESC, url: "/immigration-blogs/", type: "website" },
};

export default function BlogIndex() {
  const all = getAllPosts().filter((p) => p.categories.includes("immigration-blogs"));
  const [hero, ...rest] = all;
  const side = rest.slice(0, 2);
  const trending = getMostRead(5);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": `${SITE}/immigration-blogs/`, url: `${SITE}/immigration-blogs/`, name: TITLE, description: DESC, isPartOf: { "@id": `${SITE}/#website` }, inLanguage: "en-CA" },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Immigration Blogs", item: `${SITE}/immigration-blogs/` },
        ],
      },
    ],
  };

  return (
    <div className="cxb">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Pills active="all" />

      <div className="wrap" style={{ paddingTop: 32 }}>
        <h1 className="sr-only">Canada Immigration Blogs by Can X Global</h1>
        <div className="e-mosaic">
          {hero && <Pane post={hero} big />}
          <div className="e-side-col">
            {side.map((p) => <Pane key={p.slug} post={p} />)}
          </div>
        </div>
      </div>

      <section className="trending">
        <div className="wrap">
          <div className="sec-label"><h2>Trending Now</h2></div>
          <div className="tr-list">
            {trending.map((p, i) => <TrendingRow key={p.slug} post={p} n={i + 1} />)}
          </div>
        </div>
      </section>

      {CATEGORY_ORDER.map((slug, i) => {
        const c = CATEGORIES[slug];
        const posts = getPostsByCategory(slug);
        if (!posts.length) return null;
        const list = i % 3 === 2;
        return (
          <section key={slug} className={["off-sec", "light-sec", "accent-sec"][i % 3]}>
            <div className="wrap">
              <div className="sec-label">
                <h2><Link href={c.path} style={{ color: "inherit", textDecoration: "none" }}>{c.label}</Link></h2>
                <Link href={c.path} className="sa">View all</Link>
              </div>
              {list ? (
                posts.slice(0, 5).map((p, n) => <NumberedRow key={p.slug} post={p} n={n + 1} />)
              ) : (
                <div className="g5">
                  {posts.slice(0, 5).map((p, n) => <PostCard key={p.slug} post={p} showChipOnImage={n === 0} />)}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
