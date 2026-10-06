import Link from "next/link";
import { CATEGORIES, formatDate, getMostRead, getRelated, type Post } from "@/lib/content";
import "../../styles/post.css";

const AVATAR = "/wp-content/uploads/2026/05/anuj-avatar-400.png";

const Icon = {
  fb: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
  tw: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  li: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>,
  wa: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>,
};

export default function PostLayout({ post }: { post: Post }) {
  const cat = CATEGORIES[post.category];
  const related = getRelated(post, 4);
  const mostRead = getMostRead(4, post.slug);
  const url = `https://canxglobal.com/${post.slug}/`;
  const enc = encodeURIComponent(url);
  const updated = post.modified.slice(0, 10) !== post.date.slice(0, 10);

  return (
    <div className="page-wrap" style={{ ["--cat" as string]: cat?.color ?? "#1967B0" }}>
      <div className="content-grid">
        <main className="article-card">
          {post.featured_image && (
            <div className="hero-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featured_image}
                alt={post.featured_alt || post.title}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                width={post.featured_size?.[0]}
                height={post.featured_size?.[1]}
              />
            </div>
          )}
          <div className="article-inner">
            {cat && (
              <Link href={cat.path} className="category-pill">
                {cat.label}
              </Link>
            )}
            <h1 className="post-title">{post.h1 || post.title}</h1>
            <div className="author-row">
              <div className="author-left">
                <div className="avatar">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={AVATAR} alt="Anuj Sengar, RCIC" width={48} height={48} />
                </div>
                <div className="author-meta">
                  <a href="https://www.linkedin.com/in/anuj-sengar-aj" target="_blank" rel="noopener" style={{ textDecoration: "none" }}>
                    <div className="author-name">Anuj Sengar (AJ) · Licensed RCIC R515178</div>
                  </a>
                  <div className="author-date">
                    Published: {formatDate(post.date)}
                    {updated && <> · Updated: {formatDate(post.modified)}</>}
                    {" · "}
                    {post.readingMinutes} min read
                  </div>
                </div>
              </div>
              <div className="share-row">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`} target="_blank" rel="noopener" className="share-btn fb" aria-label="Share on Facebook">{Icon.fb}</a>
                <a href={`https://twitter.com/intent/tweet?url=${enc}`} target="_blank" rel="noopener" className="share-btn tw" aria-label="Share on X">{Icon.tw}</a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`} target="_blank" rel="noopener" className="share-btn li" aria-label="Share on LinkedIn">{Icon.li}</a>
                <a href={`https://wa.me/?text=${enc}`} target="_blank" rel="noopener" className="share-btn wa" aria-label="Share on WhatsApp">{Icon.wa}</a>
              </div>
            </div>
          </div>

          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.body }} />

          <div className="article-inner" style={{ paddingTop: 0 }}>
            <div className="note-box">
              <h3>Need help with your Canadian immigration or hiring plan?</h3>
              <p>Book a consultation with Can X Global Solutions. We have helped clients from more than 30 countries make Canada home.</p>
              <div className="cta-wrap">
                <Link href="/get-started/" className="cta-btn">Book a Consultation</Link>
              </div>
            </div>
          </div>
        </main>

        <aside className="sidebar">
          {related.length > 0 && (
            <div className="widget">
              <div className="widget-title">Top Stories</div>
              {related.map((r) => (
                <div className="story-item" key={r.slug}>
                  <Link href={`/${r.slug}/`}>
                    <span className="story-title">{r.title}</span>
                    <span className="story-tag" style={{ ["--c" as string]: CATEGORIES[r.category]?.color }}>{r.categoryLabel}</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="sidebar-cta">
            <h4>Talk to a Licensed RCIC</h4>
            <p>Get a clear, honest assessment of your options from a regulated Canadian immigration consultant.</p>
            <Link href="/get-started/">Book a Consultation</Link>
          </div>
        </aside>
      </div>

      {mostRead.length > 0 && (
        <section className="most-read-section">
          <div className="most-read-head">
            <h2>Most Read</h2>
            <Link href="/immigration-blogs/">View all →</Link>
          </div>
          <div className="mr-grid">
            {mostRead.map((m) => (
              <Link href={`/${m.slug}/`} className="mr-card" key={m.slug}>
                <div className="mr-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {m.featured_image && <img src={m.featured_image} alt={m.featured_alt || m.title} loading="lazy" />}
                </div>
                <div className="mr-body">
                  <span className="story-tag" style={{ ["--c" as string]: CATEGORIES[m.category]?.color }}>{m.categoryLabel}</span>
                  <h3>{m.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
