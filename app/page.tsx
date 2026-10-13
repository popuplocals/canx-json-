import type { Metadata } from "next";
import { getHome } from "@/lib/home";
import { getAllPosts, SITE } from "@/lib/content";
import { getLegacyPage, legacyDescription } from "@/lib/legacy";
import Hero from "@/components/home/Hero";
import Pathways from "@/components/home/Pathways";
import WorldMap from "@/components/home/WorldMap";
import { Challenges, Logos, FeatureCards, Tiers, Seekers, Easy, Countries, Blogs } from "@/components/home/Sections";
import "../styles/home.css";

const live = getLegacyPage([]);
const TITLE = live?.seo_title || "Recruitment and Immigration Experts in Canada | Can X Global";
const DESC = live ? legacyDescription(live) : "Expert recruitment & immigration services in Canada by Can X Global Solutions Inc.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", title: TITLE, description: DESC, images: ["/wp-content/uploads/2025/11/canX-hmepage-picture@3x-1-1-1.png.webp"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Home() {
  const d = getHome();
  const posts = getAllPosts().filter((p) => p.categories.includes("immigration-blogs")).slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${SITE}/`, url: `${SITE}/`, name: TITLE, description: DESC, isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${SITE}/#organization` }, inLanguage: "en-CA" },
      {
        "@type": "ItemList", name: "Immigration pathways",
        itemListElement: d.pathways.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.title, url: `${SITE}${p.href}` })),
      },
    ],
  };
  return (
    <main className="cxh">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Hero d={d.hero} />
      <Challenges d={d.challenges} />
      <Logos d={d.logos} />
      <FeatureCards heading={d.beyond.heading} items={d.beyond.items} cta={d.beyond.cta} eyebrow="Why Can X" />
      <Tiers d={d.tiers} />
      <Seekers d={d.seekers} />
      <Easy d={d.easy} />
      <FeatureCards heading={d.trust.heading} items={d.trust.items} cta={d.trust.cta} eyebrow="Our promise" photo tone="mist" />
      <Pathways items={d.pathways} />
      <Countries d={d.countries}><WorldMap /></Countries>
      <Blogs d={d.blogs} posts={posts} />
    </main>
  );
}
