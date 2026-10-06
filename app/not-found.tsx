import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, getMostRead } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page Not Found | Can X Global",
  description: "The page you were looking for has moved or no longer exists. Browse our immigration guides or contact Can X Global.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const popular = getMostRead(5);
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "72px 20px 96px", fontFamily: "var(--font-poppins)" }}>
      <p style={{ color: "#1967B0", fontWeight: 700, letterSpacing: ".1em", fontSize: 12 }}>ERROR 404</p>
      <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", lineHeight: 1.15, color: "#111827", margin: "10px 0 16px", fontWeight: 800 }}>
        We couldn&apos;t find that page
      </h1>
      <p style={{ color: "#475569", fontSize: "1.05rem", lineHeight: 1.7 }}>
        The link may be out of date or the page may have moved. Try one of the options below, or{" "}
        <Link href="/contact-us/" style={{ color: "#1967B0", fontWeight: 600 }}>contact our team</Link>.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "28px 0 40px" }}>
        <Link href="/" style={{ background: "linear-gradient(135deg,#39BBF9,#1967B0)", color: "#fff", padding: "12px 22px", borderRadius: 100, fontWeight: 700, textDecoration: "none" }}>Go to homepage</Link>
        <Link href="/immigration-blogs/" style={{ border: "1px solid #dbe3ee", color: "#111827", padding: "12px 22px", borderRadius: 100, fontWeight: 600, textDecoration: "none" }}>Immigration blogs</Link>
        <Link href="/get-started/" style={{ border: "1px solid #dbe3ee", color: "#111827", padding: "12px 22px", borderRadius: 100, fontWeight: 600, textDecoration: "none" }}>Book a consultation</Link>
      </div>
      <h2 style={{ fontSize: "1.2rem", color: "#111827", marginBottom: 12 }}>Most-read guides</h2>
      <ul style={{ paddingLeft: 18, color: "#475569", lineHeight: 1.8 }}>
        {popular.map((p) => (
          <li key={p.slug}><Link href={`/${p.slug}/`} style={{ color: "#1967B0" }}>{p.title}</Link></li>
        ))}
      </ul>
      <h2 style={{ fontSize: "1.2rem", color: "#111827", margin: "28px 0 12px" }}>Browse by topic</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Object.values(CATEGORIES).map((c) => (
          <Link key={c.path} href={c.path} style={{ border: `1px solid ${c.color}33`, color: c.color, padding: "6px 12px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>{c.label}</Link>
        ))}
      </div>
    </main>
  );
}
