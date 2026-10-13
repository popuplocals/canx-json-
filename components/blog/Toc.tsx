"use client";
import { useEffect, useState } from "react";

/** Sticky table of contents built from the article's H2s; highlights the section being read. */
export default function Toc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -70% 0px", threshold: [0, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  if (items.length < 3) return null;
  return (
    <nav className="widget toc" aria-label="On this page">
      <div className="widget-title">On this page</div>
      <ol>
        {items.map((i) => (
          <li key={i.id} className={active === i.id ? "on" : undefined}>
            <a href={`#${i.id}`} onClick={(e) => { e.preventDefault(); const el = document.getElementById(i.id); if (!el) return; const y = el.getBoundingClientRect().top + window.scrollY - 96; window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : window.scrollTo({ top: y, behavior: "smooth" }); }}>
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
