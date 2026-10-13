import Link from "next/link";
import { Reveal, Stagger, Item, Words } from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import Magnetic from "@/components/motion/Magnetic";
import type { HomeData } from "@/lib/home";
import type { Post } from "@/lib/content";
import { CATEGORIES, formatDate } from "@/lib/content";

/* eslint-disable @next/next/no-img-element */
const Arrow = () => <span className="arr">→</span>;

export function Challenges({ d }: { d: HomeData["challenges"] }) {
  return (
    <section className="cream" aria-labelledby="ch-h">
      <div className="wrap">
        <Reveal className="center"><div className="eyebrow">Recruitment</div><Words as="h2" text={d.heading} className="" /><p className="lead">{d.note}</p></Reveal>
        <Stagger className="grid-3" gap={0.07}>
          {d.items.map((it) => (
            <Item key={it.title}><TiltCard style={{ height: "100%" }} max={5}><div className="card">
              <div className="ico">{it.image && <img src={it.image.src} alt="" loading="lazy" />}</div>
              <h3>{it.title}</h3><p>{it.desc}</p>
            </div></TiltCard></Item>
          ))}
        </Stagger>
        <Reveal className="sec-cta"><Magnetic><Link href={d.cta.href} className="btn btn-primary">{d.cta.text} <Arrow /></Link></Magnetic></Reveal>
      </div>
    </section>
  );
}

export function Logos({ d }: { d: HomeData["logos"] }) {
  const list = [...d.images, ...d.images];
  return (
    <section className="cxh-logos" style={{ paddingTop: 40, paddingBottom: 40 }} aria-labelledby="lg-h">
      <div className="wrap center"><Reveal><div className="eyebrow">Clients</div><h2 id="lg-h">{d.heading}</h2></Reveal></div>
      <Reveal className="mask">
        <div className="track">{list.map((src, i) => <img key={i} src={src} alt="Client logo" loading="lazy" />)}</div>
      </Reveal>
      <Reveal className="sec-cta" style={{ marginTop: 30 }}><Magnetic><Link href={d.cta.href} className="btn btn-ghost">{d.cta.text} <Arrow /></Link></Magnetic></Reveal>
    </section>
  );
}

export function FeatureCards({ heading, items, cta, eyebrow, photo = false, tone = "" }: { heading: string; items: HomeData["beyond"]["items"]; cta: { text: string; href: string }; eyebrow: string; photo?: boolean; tone?: string }) {
  return (
    <section className={tone} aria-label={heading}>
      <div className="wrap">
        <Reveal className="center"><div className="eyebrow">{eyebrow}</div><Words as="h2" text={heading} /></Reveal>
        <Stagger className={items.length === 4 ? "grid-4" : "grid-3"} gap={0.08}>
          {items.map((it) => (
            <Item key={it.title}><TiltCard style={{ height: "100%" }} max={5}>
              <div className={`card${photo ? " photo" : ""}`}>
                {photo ? (
                  <>
                    <div className="pic">{it.image && <img src={it.image.src} alt={it.title} loading="lazy" />}</div>
                    <div className="body"><h3>{it.title}</h3><p>{it.desc}</p></div>
                  </>
                ) : (
                  <><div className="ico">{it.image && <img src={it.image.src} alt="" loading="lazy" />}</div><h3>{it.title}</h3><p>{it.desc}</p></>
                )}
              </div>
            </TiltCard></Item>
          ))}
        </Stagger>
        <Reveal className="sec-cta"><Magnetic><Link href={cta.href} className="btn btn-primary">{cta.text} <Arrow /></Link></Magnetic></Reveal>
      </div>
    </section>
  );
}

export function Tiers({ d }: { d: HomeData["tiers"] }) {
  return (
    <section className="cxh-tiers mist" aria-label="Recruitment services">
      <div className="wrap">
        <Reveal className="center"><div className="eyebrow">How we hire for you</div><Words as="h2" text="Local, global, remote, or LMIA-backed" /></Reveal>
        {d.items.map((t, i) => (
          <div className="row" key={t.title}>
            <Reveal className="media">{t.image && <img src={t.image.src} alt={t.title} loading="lazy" />}</Reveal>
            <Reveal delay={0.1}>
              <div className="num">0{i + 1}</div>
              <h3 style={{ fontSize: "1.7rem", marginBottom: 12 }}>{t.title}</h3>
              <p>{t.text} <Link href={t.href} className="more">Explore →</Link></p>
              {i === 3 && <div className="streams">{d.lmiaStreams.map((s) => <Link key={s.href} href={s.href}>{s.text}</Link>)}</div>}
              <Magnetic><Link href={t.cta.href} className="btn btn-primary">{t.cta.text} <Arrow /></Link></Magnetic>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Seekers({ d }: { d: HomeData["seekers"] }) {
  return (
    <section className="cxh-seekers" aria-labelledby="js-h">
      <div className="wrap">
        <Reveal className="band">
          <div>
            <div className="eyebrow" style={{ color: "#39bbf9" }}>Candidates</div>
            <h2 id="js-h">{d.heading}</h2>
            <p>{d.text}</p>
            <div className="actions">
              {d.buttons.map((b, i) => <Magnetic key={b.text + i}><Link href={b.href} className={`btn ${i === 0 ? "btn-primary" : "btn-ghost"}`}>{b.text}</Link></Magnetic>)}
            </div>
          </div>
          <div className="art">{d.images[1] && <img src={d.images[1].src} alt="Job board" loading="lazy" />}</div>
        </Reveal>
      </div>
    </section>
  );
}

export function Easy({ d }: { d: HomeData["easy"] }) {
  return (
    <section className="cxh-easy pale" aria-labelledby="ez-h">
      <div className="wrap">
        <div className="top">
          <Reveal>
            <div className="eyebrow">Immigration</div>
            <h2 id="ez-h">{d.heading}</h2>
            <p className="lead">{d.intro}</p>
            {d.lines.map((l) => <p key={l} className="quote">{l}</p>)}
            <Magnetic><Link href={d.cta.href} className="btn btn-primary">{d.cta.text} <Arrow /></Link></Magnetic>
          </Reveal>
          <Reveal className="media" delay={0.15}>{d.image && <img src={d.image.src} alt="Canadian passport and map" loading="lazy" />}</Reveal>
        </div>
        <Reveal className="center"><Words as="h2" text={d.sub} /></Reveal>
        <Stagger className="grid-3" gap={0.07}>
          {d.items.map((it) => (
            <Item key={it.title}><TiltCard style={{ height: "100%" }} max={5}><div className="card">
              <div className="ico">{it.image && <img src={it.image.src} alt="" loading="lazy" />}</div>
              <h3>{it.title}</h3><p>{it.desc}</p>
            </div></TiltCard></Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function Countries({ d, children }: { d: HomeData["countries"]; children: React.ReactNode }) {
  return (
    <section className="cxh-map" aria-labelledby="co-h">
      <div className="wrap">
        <Reveal className="center"><div className="eyebrow">Worldwide</div><Words as="h2" text={d.heading} /><p className="lead">{d.text}</p></Reveal>
        <Reveal>{children}</Reveal>
        <Reveal className="sec-cta"><Magnetic><Link href={d.cta.href} className="btn btn-primary">{d.cta.text} <Arrow /></Link></Magnetic></Reveal>
      </div>
    </section>
  );
}

export function Blogs({ d, posts }: { d: HomeData["blogs"]; posts: Post[] }) {
  return (
    <section className="cxh-blogs cream" aria-labelledby="bl-h">
      <div className="wrap">
        <Reveal className="center"><div className="eyebrow">Insights</div><h2 id="bl-h">{d.heading}</h2><p className="lead">{d.text}</p></Reveal>
        <Reveal className="tabs">{d.buttons.map((b) => <Link key={b.href} href={b.href} className="btn btn-ghost">{b.text}</Link>)}</Reveal>
        <Stagger className="grid-3" gap={0.08}>
          {posts.map((p) => (
            <Item key={p.slug}><TiltCard style={{ height: "100%" }} max={5}>
              <Link href={`/${p.slug}/`} className="card photo post">
                <div className="pic">{p.featured_image && <img src={p.featured_image} alt={p.featured_alt || p.title} loading="lazy" />}</div>
                <div className="body">
                  <span className="chip" style={{ color: CATEGORIES[p.category]?.color }}>{p.categoryLabel}</span>
                  <h3>{p.title}</h3>
                  <span className="meta">{formatDate(p.date)} · {p.readingMinutes} min read</span>
                </div>
              </Link>
            </TiltCard></Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
