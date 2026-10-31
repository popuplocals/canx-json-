"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Entry = { t: string; h: string; k: string };

const SUGGESTIONS: Entry[] = [
  { t: "Express Entry", h: "/permanent-residency/express-entry/", k: "Immigration" },
  { t: "Work Permit", h: "/work-permit/", k: "Immigration" },
  { t: "LMIA", h: "/lmia/", k: "Recruitment" },
  { t: "Hire Global talent", h: "/hire-global/", k: "Recruitment" },
  { t: "Job Board", h: "/job-board/", k: "Resources" },
  { t: "Contact Us", h: "/contact-us/", k: "Company" },
];

let cache: Entry[] | null = null;

function score(e: Entry, words: string[]) {
  const t = e.t.toLowerCase();
  let s = 0;
  for (const w of words) {
    const i = t.indexOf(w);
    if (i < 0) return 0;
    s += 10 + (i === 0 ? 8 : t[i - 1] === " " ? 4 : 0);
  }
  if (e.k !== "Blog") s += 3;   // marketing pages first
  return s - t.length / 100;
}

export default function HeaderSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return <Panel onClose={onClose} />;
}

function Panel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState<Entry[]>(cache ?? []);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    if (!cache) fetch("/api/search-index/").then((r) => r.json()).then((d: Entry[]) => { cache = d; setIndex(d); }).catch(() => {});
    return () => { window.clearTimeout(t); document.documentElement.style.overflow = prev; };
  }, []);

  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return SUGGESTIONS;
    return index.map((e) => ({ e, s: score(e, words) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 9).map((x) => x.e);
  }, [q, index]);

  const go = (h: string) => { onClose(); router.push(h); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, list.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && list[active]) { e.preventDefault(); go(list[active].h); }
  };

  return (
    <div className="hs" role="dialog" aria-modal="true" aria-label="Search the site" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="hs-box">
        <div className="hs-field">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKey} placeholder="Search services, programs and articles…" aria-label="Search" />
          <kbd onClick={onClose}>Esc</kbd>
        </div>
        <ul className="hs-list" role="listbox">
          {!q && <li className="hs-label">Popular</li>}
          {q && !list.length && <li className="hs-empty">No results for “{q}”. Try “express entry”, “LMIA” or “work permit”.</li>}
          {list.map((r, i) => (
            <li key={r.h} role="option" aria-selected={i === active}>
              <button type="button" data-on={i === active ? "1" : "0"} onMouseEnter={() => setActive(i)} onClick={() => go(r.h)}>
                <span>{r.t}</span><small>{r.k}</small>
              </button>
            </li>
          ))}
        </ul>
        <div className="hs-foot"><span>↑↓ to move</span><span>↵ to open</span><span>Esc to close</span></div>
      </div>
    </div>
  );
}
