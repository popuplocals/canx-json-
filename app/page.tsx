import type { Metadata } from "next";
import Link from "next/link";
import { getLegacyPage, legacyDescription } from "@/lib/legacy";
import { LegacyView } from "./[...path]/page";

export function generateMetadata(): Metadata {
  const home = getLegacyPage([]);
  if (!home) return {};
  const title = home.seo_title || "Recruitment and Immigration Experts in Canada | Can X Global";
  const description = legacyDescription(home);
  return { title, description, alternates: { canonical: "/" }, openGraph: { type: "website", url: "/", title, description }, twitter: { card: "summary_large_image", title, description } };
}

export default function Home() {
  const home = getLegacyPage([]);
  if (home) return <LegacyView page={home} />;
  return (
    <main style={{ maxWidth: 960, margin: "60px auto", padding: "0 20px" }}>
      <h1>Can X Global</h1>
      <p><Link href="/immigration-blogs/">Immigration Blogs</Link></p>
    </main>
  );
}
