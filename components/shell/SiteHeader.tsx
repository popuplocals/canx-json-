"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BLOGS, COMPANY, GROUPS, IMMIGRATION, RECRUITMENT, RESOURCES, SITE_CONTACT, type GroupKey, type NavLeaf, type NavTab } from "@/lib/nav";
import HeaderSearch from "./HeaderSearch";

/* eslint-disable @next/next/no-img-element */
const LOGO = "/wp-content/uploads/2025/01/cropped-cropped-cropped-Untitled-design-300x85-1.webp";

/**
 * Site header. At the top of the page: a slim info strip + a full-width bar. After scrolling the strip
 * folds away and the bar becomes a floating glass capsule (same behaviour as the BBSM / Patle / Mannat
 * sites). Every mega-menu panel is rendered in the HTML at all times (shown/hidden with CSS only) so all
 * navigation links stay crawlable and the menu costs no JavaScript per frame.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<GroupKey | null>(null);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const closeT = useRef<number | undefined>(undefined);
  const openT = useRef<number | undefined>(undefined);
  const headerRef = useRef<HTMLElement>(null);

  /* scroll state (passive, rAF-throttled, only re-renders when the threshold is crossed) */
  useEffect(() => {
    let raf = 0;
    const read = () => { raf = 0; setScrolled(window.scrollY > 40); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  /* close everything on navigation */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) { setLastPath(pathname); setOpen(null); setMobile(false); }

  /* lock page scroll behind the mobile menu */
  useEffect(() => { document.documentElement.style.overflow = mobile ? "hidden" : ""; return () => { document.documentElement.style.overflow = ""; }; }, [mobile]);

  /* keyboard: Esc closes, Ctrl/Cmd+K or "/" opens search */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "Escape") { setOpen(null); setMobile(false); }
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && !(e.target as HTMLElement)?.isContentEditable)) { e.preventDefault(); setSearch(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* click outside closes an open mega panel */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const hoverOpen = useCallback((k: GroupKey) => {
    window.clearTimeout(closeT.current);
    window.clearTimeout(openT.current);
    openT.current = window.setTimeout(() => setOpen(k), open ? 0 : 90);
  }, [open]);
  const hoverClose = useCallback(() => {
    window.clearTimeout(openT.current);
    window.clearTimeout(closeT.current);
    closeT.current = window.setTimeout(() => setOpen(null), 160);
  }, []);
  const keepOpen = useCallback(() => window.clearTimeout(closeT.current), []);

  const isGroupActive = (m: readonly string[]) => m.some((p) => pathname.startsWith(p));

  return (
    <>
      <header ref={headerRef} className="hd" data-scrolled={scrolled ? "1" : "0"} data-open={open ?? ""}>
        {/* ── info strip: folds away once the page is scrolled ── */}
        <div className="hd-strip" aria-hidden={scrolled}>
          <div className="hd-wrap hd-strip-in">
            <a href={SITE_CONTACT.phoneHref} className="hd-strip-call">
              <span className="hd-dot" aria-hidden><i /><i /></span>
              <b>Call us</b><span>{SITE_CONTACT.phone}</span>
            </a>
            <span className="hd-strip-note">
              <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>
              <em>/</em>Toll-free <a href={SITE_CONTACT.tollFreeHref}>{SITE_CONTACT.tollFree}</a>
              <em>/</em>RCIC-regulated · Top Rated Recruitment &amp; Immigration Firm
            </span>
          </div>
        </div>

        {/* ── bar → capsule ── */}
        <div className="hd-barwrap">
          <div className="hd-bar">
            <div className="hd-bar-in">
              <Link href="/" className="hd-logo" aria-label="Can X Global — Home">
                <img src={LOGO} alt="Can X Global" width={200} height={57} />
              </Link>

              <nav className="hd-nav" aria-label="Main">
                {GROUPS.map((g) => (
                  <div key={g.key} className="hd-ni" onMouseEnter={() => hoverOpen(g.key)} onMouseLeave={hoverClose}>
                    <button
                      type="button"
                      className="hd-link"
                      aria-expanded={open === g.key}
                      aria-controls={`mega-${g.key}`}
                      aria-current={isGroupActive(g.match) ? "page" : undefined}
                      onClick={() => setOpen(open === g.key ? null : g.key)}
                      onFocus={() => { window.clearTimeout(closeT.current); }}
                    >
                      {g.label}
                      <svg className="hd-chev" width="9" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="m1 1 4 4 4-4" /></svg>
                    </button>
                  </div>
                ))}
              </nav>

              <div className="hd-actions">
                <button type="button" className="hd-icon" onClick={() => setSearch(true)} aria-label="Search (Ctrl+K)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                </button>
                <Link href="/get-started/" className="hd-cta">
                  <span>Get Started</span>
                  <svg width="13" height="13" viewBox="0 0 13 14" fill="none" aria-hidden><path d="M.9 12.6 12.1 1.4m0 0H3.7m8.4 0v8.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
                <button type="button" className="hd-burger" onClick={() => setMobile((m) => !m)} aria-expanded={mobile} aria-controls="mobile-menu" aria-label={mobile ? "Close menu" : "Open menu"}>
                  <i /><i /><i />
                </button>
              </div>
            </div>
          </div>

          {/* ── mega panels (always in the DOM, shown with CSS) ── */}
          <div className="hd-megas" onMouseEnter={keepOpen} onMouseLeave={hoverClose}>
            <Mega id="recruitment" open={open === "recruitment"}><TabbedPanel tabs={RECRUITMENT} cta={{ t: "Talk to a recruiter", h: "/get-started/" }} /></Mega>
            <Mega id="immigration" open={open === "immigration"}><TabbedPanel tabs={IMMIGRATION} cta={{ t: "Book an immigration consultation", h: "/get-started/" }} /></Mega>
            <Mega id="resources" open={open === "resources"} narrow><ResourcesPanel /></Mega>
            <Mega id="blogs" open={open === "blogs"}><BlogsPanel /></Mega>
            <Mega id="company" open={open === "company"}><CompanyPanel /></Mega>
          </div>
        </div>
      </header>
      {/* keeps page content where it was when the header was in the flow */}
      <div className="hd-spacer" aria-hidden />

      {/* ── mobile menu ── */}
      <div id="mobile-menu" className="hd-mobile" data-open={mobile ? "1" : "0"} aria-hidden={!mobile}>
        <MobileMenu close={() => setMobile(false)} pathname={pathname} />
      </div>

      <HeaderSearch open={search} onClose={() => setSearch(false)} />
    </>
  );
}

/* ───────────────────────── panels ───────────────────────── */

function Mega({ id, open, narrow, children }: { id: string; open: boolean; narrow?: boolean; children: React.ReactNode }) {
  return (
    <div id={`mega-${id}`} className={`hd-mega${narrow ? " hd-mega-narrow" : ""}`} data-open={open ? "1" : "0"} aria-label={id}>
      <div className="hd-mega-box">{children}</div>
    </div>
  );
}

function Card({ it, big }: { it: NavLeaf; big?: boolean }) {
  return (
    <Link href={it.h} className={`hd-card${big ? " hd-card-big" : ""}`}>
      <span className="hd-card-t">{it.t}<svg width="12" height="12" viewBox="0 0 13 14" fill="none" aria-hidden><path d="M.9 12.6 12.1 1.4m0 0H3.7m8.4 0v8.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      {it.d && <span className="hd-card-d">{it.d}</span>}
    </Link>
  );
}

/** Left tab list + right content (same structure as the live menu, restyled). */
function TabbedPanel({ tabs, cta }: { tabs: NavTab[]; cta: { t: string; h: string } }) {
  const [i, setI] = useState(0);
  return (
    <div className="hd-tabbed">
      <div className="hd-tabs" role="tablist">
        {tabs.map((t, n) => (
          <Link key={t.h} href={t.h} role="tab" aria-selected={i === n} className="hd-tab" data-on={i === n ? "1" : "0"}
            onMouseEnter={() => setI(n)} onFocus={() => setI(n)}>
            {t.t}<span className="hd-tab-arr" aria-hidden>›</span>
          </Link>
        ))}
        <Link href={cta.h} className="hd-tabs-cta">{cta.t} <span aria-hidden>→</span></Link>
      </div>
      <div className="hd-pane">
        {tabs.map((t, n) => (
          <div key={t.h} className="hd-pane-in" data-on={i === n ? "1" : "0"} role="tabpanel">
            <div className="hd-pane-head">
              <Link href={t.h} className="hd-pane-title">{t.t}</Link>
              {t.intro && <p>{t.intro}</p>}
            </div>
            {t.kids && (
              <div className="hd-grid">
                {t.kids.map((k) => <Card key={k.h} it={k} />)}
              </div>
            )}
            {t.sub && (
              <>
                <div className="hd-sub-title">{t.sub.title} routes</div>
                <div className="hd-grid">{t.sub.items.map((k) => <Card key={k.h} it={k} />)}</div>
              </>
            )}
            <Link href={t.h} className="hd-more">Learn more about {t.t} <span aria-hidden>→</span></Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourcesPanel() {
  return (
    <div className="hd-res">
      <div>
        <div className="hd-sub-title">Resources</div>
        <div className="hd-stack">{RESOURCES.main.map((m) => <Card key={m.h} it={m} big />)}</div>
      </div>
      <div>
        <div className="hd-sub-title">Inside the Career Guide</div>
        <div className="hd-stack">{RESOURCES.guides.map((m) => <Card key={m.h} it={m} />)}</div>
      </div>
    </div>
  );
}

function BlogsPanel() {
  const [i, setI] = useState(0);
  return (
    <div className="hd-blogs">
      <div className="hd-blog-cats">
        <div className="hd-sub-title">Blog categories</div>
        {BLOGS.map((b, n) => (
          <Link key={b.h} href={b.h} className="hd-card hd-card-big" data-on={i === n ? "1" : "0"} onMouseEnter={() => setI(n)} onFocus={() => setI(n)}>
            <span className="hd-card-t">{b.t}<svg width="12" height="12" viewBox="0 0 13 14" fill="none" aria-hidden><path d="M.9 12.6 12.1 1.4m0 0H3.7m8.4 0v8.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            <span className="hd-card-d">{b.d}</span>
          </Link>
        ))}
      </div>
      <div className="hd-feature-wrap">
        <div className="hd-sub-title">Featured read</div>
        {BLOGS.map((b, n) => (
          <Link key={b.feature.h} href={b.feature.h} className="hd-feature" data-on={i === n ? "1" : "0"}>
            <span className="hd-feature-img"><img src={b.feature.img} alt="" loading="lazy" /></span>
            <span className="hd-feature-t">{b.feature.t}</span>
            <span className="hd-more">Read the post <span aria-hidden>→</span></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CompanyPanel() {
  return (
    <div className="hd-co">
      <div className="hd-co-grid">
        {COMPANY.map((c) => (
          <Link key={c.h} href={c.h} className="hd-co-item">
            <span className="hd-co-ico" aria-hidden>{c.icon}</span>
            <span><span className="hd-card-t">{c.t}</span><span className="hd-card-d">{c.d}</span></span>
          </Link>
        ))}
      </div>
      <aside className="hd-co-side">
        <div className="hd-rating">
          <img src="/wp-content/uploads/2025/06/WhatsApp-Image-2025-05-31-at-17.56.43_1e8f9570-1.png.webp" alt="Google reviews" width={92} height={24} loading="lazy" />
          <b>4.8</b><span className="hd-stars" aria-label="5 stars">★★★★★</span><small>From 531+ reviews</small>
        </div>
        <img className="hd-affil" src="/wp-content/uploads/2025/06/Home-Page-Canx-global-1.png" alt="Can X Global affiliations" loading="lazy" />
        <div className="hd-chips">
          <Link href="/get-started/">Top Rated Immigration Firm</Link>
          <Link href="/get-started/">Top Rated Recruitment Firm</Link>
        </div>
        <Link href="/get-started/" className="hd-cta hd-cta-block"><span>Let&apos;s Connect</span><span aria-hidden>→</span></Link>
      </aside>
    </div>
  );
}

/* ───────────────────────── mobile ───────────────────────── */

function MobileMenu({ close, pathname }: { close: () => void; pathname: string }) {
  const [sec, setSec] = useState<GroupKey | null>(null);
  const groups: { key: GroupKey; label: string; links: NavLeaf[] }[] = [
    { key: "recruitment", label: "Recruitment", links: RECRUITMENT.flatMap((t) => [{ t: t.t, h: t.h }, ...(t.kids ?? []).map((k) => ({ t: `— ${k.t}`, h: k.h }))]) },
    { key: "immigration", label: "Immigration", links: IMMIGRATION.flatMap((t) => [{ t: t.t, h: t.h }, ...(t.kids ?? []).map((k) => ({ t: `— ${k.t}`, h: k.h })), ...(t.sub?.items ?? []).map((k) => ({ t: `—— ${k.t}`, h: k.h }))]) },
    { key: "resources", label: "Resources", links: [...RESOURCES.main, ...RESOURCES.guides.map((g) => ({ ...g, t: `— ${g.t}` }))] },
    { key: "blogs", label: "Blogs", links: BLOGS.map((b) => ({ t: `${b.t} Blog`, h: b.h })) },
    { key: "company", label: "Company", links: COMPANY.map((c) => ({ t: c.t, h: c.h })) },
  ];
  return (
    <nav className="hd-mobile-in" aria-label="Mobile">
      {groups.map((g, n) => (
        <div key={g.key} className="hd-m-sec" data-open={sec === g.key ? "1" : "0"} style={{ ["--i" as string]: n }}>
          <button type="button" className="hd-m-head" aria-expanded={sec === g.key} onClick={() => setSec(sec === g.key ? null : g.key)}>
            <span className="hd-m-num">0{n + 1}</span>{g.label}<span className="hd-m-plus" aria-hidden />
          </button>
          <div className="hd-m-body"><div>
            {g.links.map((l) => (
              <Link key={`${l.h}-${l.t}`} href={l.h} onClick={close} aria-current={pathname === l.h ? "page" : undefined}>{l.t}</Link>
            ))}
          </div></div>
        </div>
      ))}
      <div className="hd-m-foot" style={{ ["--i" as string]: 6 }}>
        <Link href="/get-started/" className="hd-cta hd-cta-block" onClick={close}><span>Get Started</span><span aria-hidden>↗</span></Link>
        <a href={SITE_CONTACT.phoneHref}>{SITE_CONTACT.phone}</a>
        <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>
      </div>
    </nav>
  );
}
