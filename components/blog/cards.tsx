import Link from "next/link";
import { CATEGORIES, type Post } from "@/lib/content";

/* chip class suffix used by blog.css (--ce, --cf, …) */
export const CHIP: Record<string, string> = {
  "express-entry": "ce",
  "family-sponsorship": "cf",
  lmia: "cl",
  "work-permit": "cw",
  "super-visa-visitor-visa": "cs",
  "provincial-nominee-program": "cp",
  "study-permit": "cst",
  "citizenship-settlement": "cc",
  "refusals-reapplications": "cr",
  "immigration-ai": "ca",
  canada: "cn",
};

export function Chip({ cat }: { cat: string }) {
  return <span className={`chip ${CHIP[cat] ?? "cn"}`}>{CATEGORIES[cat]?.label ?? "Immigration"}</span>;
}

/* eslint-disable @next/next/no-img-element */
export function Img({ post, eager = false }: { post: Post; eager?: boolean }) {
  if (!post.featured_image) return <div style={{ background: "#eef2f7", width: "100%", height: "100%" }} />;
  return <img src={post.featured_image} alt={post.featured_alt || post.title} loading={eager ? "eager" : "lazy"} decoding="async" />;
}

/* 5-card grid card (.g5 > .pc) */
export function PostCard({ post, showChipOnImage = false }: { post: Post; showChipOnImage?: boolean }) {
  return (
    <Link href={`/${post.slug}/`} className="pc">
      <div className="pct">
        <Img post={post} />
        {showChipOnImage && <Chip cat={post.category} />}
      </div>
      <div className="pcb">
        <h3>{post.title}</h3>
        <div className="pcm">
          <Chip cat={post.category} />
          <span className="rd">Read →</span>
        </div>
      </div>
    </Link>
  );
}

/* numbered list row (.nl-row) */
export function NumberedRow({ post, n }: { post: Post; n: number }) {
  return (
    <Link href={`/${post.slug}/`} className="nl-row">
      <span className="nl-n">{String(n).padStart(2, "0")}</span>
      <div className="nl-img"><Img post={post} /></div>
      <div className="nl-b">
        <Chip cat={post.category} />
        <h4>{post.title}</h4>
      </div>
    </Link>
  );
}

/* trending row (.tr-row) */
export function TrendingRow({ post, n }: { post: Post; n: number }) {
  return (
    <Link href={`/${post.slug}/`} className="tr-row">
      <div className="tr-n">{String(n).padStart(2, "0")}</div>
      <div className="tr-img"><Img post={post} /></div>
      <div className="tr-b">
        <div className="tr-title">{post.title}</div>
        <div><Chip cat={post.category} /></div>
      </div>
    </Link>
  );
}

/* mosaic pane (.e-pane) */
export function Pane({ post, big = false }: { post: Post; big?: boolean }) {
  const H = big ? "h2" : "h3";
  return (
    <Link href={`/${post.slug}/`} className="e-pane">
      <Img post={post} eager={big} />
      <div className="e-grad" />
      <div className="e-body">
        <Chip cat={post.category} />
        <H>{post.title}</H>
      </div>
    </Link>
  );
}

/* category-page card (.blog-card) */
export function BlogCard({ post }: { post: Post }) {
  const color = CATEGORIES[post.category]?.color ?? "#1967B0";
  return (
    <Link href={`/${post.slug}/`} className="blog-card">
      <div className="card-img">
        <Img post={post} />
        <div className="canx-mark">⊙CAN<span>X</span></div>
      </div>
      <div className="card-body">
        <p className="card-title">{post.title}</p>
        <div className="card-footer">
          <span className="card-chip" style={{ background: color }}>{post.categoryLabel}</span>
          <span className="card-read">Read →</span>
        </div>
      </div>
    </Link>
  );
}

/* category-page most-read row (.num-row) */
export function NumRow({ post, n }: { post: Post; n: number }) {
  const color = CATEGORIES[post.category]?.color ?? "#1967B0";
  return (
    <Link href={`/${post.slug}/`} className="num-row">
      <span className="num-n">{String(n).padStart(2, "0")}</span>
      <div className="num-thumb"><Img post={post} /></div>
      <div className="num-body">
        <span className="num-chip" style={{ background: color }}>{post.categoryLabel}</span>
        <p className="num-title">{post.title}</p>
      </div>
    </Link>
  );
}

export function Pills({ active }: { active: string }) {
  return (
    <section className="hero-wrap">
      <div className="hero-pills-wrap">
        <div className="hero-pills">
          <Link href="/immigration-blogs/" className={`h-pill${active === "all" ? " on" : ""}`}>All</Link>
          {Object.entries(CATEGORIES).map(([slug, c]) => (
            <Link key={slug} href={c.path} className={`h-pill${active === slug ? " on" : ""}`}>{c.label}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
