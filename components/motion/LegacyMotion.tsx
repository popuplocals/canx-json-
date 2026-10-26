"use client";
import { useEffect } from "react";
import { animate, scroll } from "motion";

/**
 * Scroll + entrance motion for the mirrored (Elementor) pages.
 *
 * Design is untouched: only opacity / transform / filter / clip-path are animated, never size,
 * position in the flow, colour or fonts. Every inline style set here is removed again once an
 * element has finished animating, so the page is pixel-identical at rest.
 *
 * Fail-safes: nothing above the fold is ever hidden; anything still hidden is force-revealed
 * after a timeout; users with "reduce motion" get the plain page.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const ROOT = "#cx-legacy-root";
const SKIP = ".swiper, .owl-carousel, [class*='carousel'], .elementor-widget-nav-menu, .elementor-sticky--active, [data-cx-nomotion]";
const UNIT = [
  ".elementor-widget-heading", ".elementor-widget-text-editor", ".elementor-widget-button", ".elementor-widget-image",
  ".elementor-widget-icon-box", ".elementor-widget-image-box", ".elementor-widget-counter", ".elementor-widget-icon-list",
  ".elementor-widget-elementskit-heading", ".elementor-widget-elementskit-icon-box", ".elementor-post",
].join(",");

type Kind = "words" | "image" | "button" | "rise";
const clear = (el: HTMLElement, props: string[]) => props.forEach((p) => el.style.removeProperty(p));

/** Wrap every word of the element's text nodes in an inline-block span (child elements, e.g. coloured spans, are kept). */
function splitWords(el: HTMLElement): HTMLElement[] {
  const words: HTMLElement[] = [];
  const walk = (node: Node) => {
    [...node.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const parts = (c.textContent ?? "").split(/(\s+)/);
        if (parts.length === 1 && !parts[0].trim()) return;
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          const s = document.createElement("span");
          s.className = "cxm-w"; s.textContent = p; s.style.display = "inline-block";
          words.push(s); frag.appendChild(s);
        });
        c.parentNode?.replaceChild(frag, c);
      } else if (c.nodeType === 1 && !(c as HTMLElement).classList.contains("cxm-w")) walk(c);
    });
  };
  walk(el);
  return words;
}

export default function LegacyMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.querySelector<HTMLElement>(ROOT);
    if (!root) return;

    const stops: Array<() => void> = [];
    const restore: Array<() => void> = [];
    const pending = new Map<HTMLElement, Kind>();
    const split = new Map<HTMLElement, { words: HTMLElement[]; html: string }>();
    let disposed = false;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const start = () => {
      if (disposed) return;
      const vh = window.innerHeight;
      const h1 = root.querySelector("h1");
      let hero: HTMLElement | null = null;
      if (h1) { let p: HTMLElement | null = h1.closest(".e-parent"); while (p?.parentElement?.closest(".e-parent")) p = p.parentElement.closest(".e-parent"); hero = p as HTMLElement | null; }

      /* ---------- 1. prepare entrance state for everything below the fold ---------- */
      const all = [...root.querySelectorAll<HTMLElement>(UNIT)];
      const units = all.filter((el) => !all.some((o) => o !== el && o.contains(el)) && !el.closest(SKIP) && !(hero && hero.contains(el)));
      units.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) return;       // hidden (mega-menu, drawers)
        if (r.top < vh * 0.98) return;                  // already on screen: leave untouched
        let kind: Kind = "rise";
        if (el.matches(".elementor-widget-heading, .elementor-widget-elementskit-heading") && el.textContent && el.textContent.trim().length < 140) kind = "words";
        else if (el.matches(".elementor-widget-image") && r.width > 160) kind = "image";
        else if (el.matches(".elementor-widget-button")) kind = "button";
        if (kind === "words") {
          const t = el.querySelector<HTMLElement>(".elementor-heading-title, .elementskit-section-title") ?? el;
          const html = t.innerHTML;
          const words = splitWords(t);
          if (!words.length) { kind = "rise"; }
          else {
            words.forEach((w) => { w.style.opacity = "0"; w.style.transform = "translateY(0.55em)"; w.style.filter = "blur(6px)"; });
            split.set(el, { words, html });
            restore.push(() => { t.innerHTML = html; });
          }
        }
        if (kind === "image") { el.style.clipPath = "inset(0 0 100% 0)"; el.style.opacity = "0"; }
        else if (kind === "button") { el.style.opacity = "0"; el.style.transform = "scale(.9) translateY(14px)"; }
        else if (kind === "rise") { el.style.opacity = "0"; el.style.transform = "translateY(38px)"; el.style.filter = "blur(5px)"; }
        pending.set(el, kind);
      });

      const reveal = (el: HTMLElement, delay: number) => {
        const kind = pending.get(el); if (!kind) return;
        pending.delete(el);
        if (kind === "words") {
          const s = split.get(el)!;
          animate(s.words, { opacity: [0, 1], transform: ["translateY(0.55em)", "translateY(0)"], filter: ["blur(6px)", "blur(0px)"] }, { duration: 0.75, ease: EASE, delay: (i: number) => delay + i * 0.045 })
            .finished.then(() => s.words.forEach((w) => clear(w, ["opacity", "transform", "filter"])));
        } else if (kind === "image") {
          animate(el, { clipPath: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"], opacity: [0, 1] }, { duration: 1.1, ease: EASE, delay })
            .finished.then(() => setTimeout(() => clear(el, ["clip-path", "opacity"]), 60));
        } else if (kind === "button") {
          animate(el, { opacity: [0, 1], transform: ["scale(.9) translateY(14px)", "scale(1) translateY(0)"] }, { duration: 0.7, ease: EASE, delay })
            .finished.then(() => clear(el, ["opacity", "transform"]));
        } else {
          animate(el, { opacity: [0, 1], transform: ["translateY(38px)", "translateY(0)"], filter: ["blur(5px)", "blur(0px)"] }, { duration: 0.9, ease: EASE, delay })
            .finished.then(() => clear(el, ["opacity", "transform", "filter", "will-change"]));
        }
      };

      /* batch → stagger by reading order so a row of cards cascades */
      const flush = () => {
        const vis: HTMLElement[] = [];
        pending.forEach((_, el) => { const r = el.getBoundingClientRect(); if (r.top < vh * 0.9 && r.bottom > 0) vis.push(el); });
        if (!vis.length) return;
        vis.sort((a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return Math.abs(ra.top - rb.top) > 40 ? ra.top - rb.top : ra.left - rb.left; });
        vis.forEach((el, i) => reveal(el, Math.min(i * 0.08, 0.5)));
      };
      let raf = 0;
      const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; flush(); }); };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      const io = new IntersectionObserver(() => onScroll(), { rootMargin: "0px 0px -8% 0px" });
      pending.forEach((_, el) => io.observe(el));
      const failsafe = window.setInterval(() => {
        // anything whose reveal never fired but is on screen (throttled observers, hidden tabs) shows anyway
        pending.forEach((_, el) => { const r = el.getBoundingClientRect(); if (r.top < vh && r.bottom > 0 && document.visibilityState === "visible") reveal(el, 0); });
        if (!pending.size) window.clearInterval(failsafe);
      }, 1500);
      stops.push(() => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); io.disconnect(); window.clearInterval(failsafe); cancelAnimationFrame(raf); });

      /* ---------- 2. scroll progress bar ---------- */
      const bar = document.createElement("div");
      bar.setAttribute("aria-hidden", "true");
      bar.style.cssText = "position:fixed;left:0;top:0;height:3px;width:100%;transform-origin:0 50%;transform:scaleX(0);z-index:2147483000;pointer-events:none;background:linear-gradient(90deg,#39bbf9,#1967b0)";
      document.body.appendChild(bar);
      stops.push(scroll(animate(bar, { transform: ["scaleX(0)", "scaleX(1)"] }, { ease: "linear" })), () => bar.remove());

      /* ---------- 3. image parallax (large images only, clipped by their own widget) ---------- */
      root.querySelectorAll<HTMLElement>(".elementor-widget-image").forEach((w) => {
        if (w.closest(SKIP) || (hero && hero.contains(w))) return;
        const img = w.querySelector<HTMLImageElement>("img"); if (!img) return;
        const r = w.getBoundingClientRect(); if (r.width < 260 || r.height < 160) return;
        const box = w.querySelector<HTMLElement>(".elementor-widget-container") ?? w;
        const prev = box.style.overflow; box.style.overflow = "hidden";
        img.style.willChange = "transform";
        stops.push(scroll(animate(img, { transform: ["translateY(-4%) scale(1.09)", "translateY(4%) scale(1.09)"] }, { ease: "linear" }), { target: w, offset: ["start end", "end start"] }));
        restore.push(() => { box.style.overflow = prev; clear(img, ["transform", "will-change"]); });
      });

      /* ---------- 4. hero: scroll-out depth + pointer parallax ---------- */
      if (hero) {
        const heroImgs = [...hero.querySelectorAll<HTMLElement>(".elementor-widget-image")];
        const heroText = [...hero.querySelectorAll<HTMLElement>(".elementor-widget-heading, .elementor-widget-text-editor, .elementor-widget-button")];
        const out = { target: hero, offset: ["start start", "end start"] as never };
        heroImgs.forEach((el) => stops.push(scroll(animate(el, { transform: ["translateY(0px) scale(1)", "translateY(90px) scale(1.06)"] }, { ease: "linear" }), out)));
        heroText.forEach((el) => stops.push(scroll(animate(el, { transform: ["translateY(0px)", "translateY(-40px)"], opacity: [1, 0.25] }, { ease: "linear" }), out)));
        restore.push(() => [...heroImgs, ...heroText].forEach((el) => clear(el, ["transform", "opacity"])));
        if (fine && heroImgs.length) {
          const move = (e: PointerEvent) => {
            const r = hero!.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 2, y = (e.clientY / window.innerHeight - 0.5) * 2;
            heroImgs.forEach((el) => { const img = el.querySelector<HTMLElement>("img"); if (img) animate(img, { transform: `translate(${x * -14}px, ${y * -10}px)` }, { duration: 0.8, ease: "easeOut" }); });
          };
          window.addEventListener("pointermove", move, { passive: true });
          stops.push(() => window.removeEventListener("pointermove", move));
          restore.push(() => heroImgs.forEach((el) => clear(el.querySelector<HTMLElement>("img") ?? el, ["transform"])));
        }
      }

      /* ---------- 5. magnetic buttons ---------- */
      if (fine) {
        root.querySelectorAll<HTMLElement>(".elementor-widget-button .elementor-button").forEach((b) => {
          if (b.closest(SKIP)) return;
          const mv = (e: PointerEvent) => {
            const r = b.getBoundingClientRect();
            const x = (e.clientX - (r.left + r.width / 2)) / r.width, y = (e.clientY - (r.top + r.height / 2)) / r.height;
            animate(b, { transform: `translate(${x * 12}px, ${y * 10}px)` }, { duration: 0.35, ease: "easeOut" });
          };
          const lv = () => animate(b, { transform: "translate(0px, 0px)" }, { type: "spring", stiffness: 260, damping: 14 });
          b.addEventListener("pointermove", mv); b.addEventListener("pointerleave", lv);
          stops.push(() => { b.removeEventListener("pointermove", mv); b.removeEventListener("pointerleave", lv); });
          restore.push(() => clear(b, ["transform"]));
        });
      }

      flush();
    };

    const t = window.setTimeout(start, 250);   // let layout + Elementor settle first
    return () => {
      disposed = true;
      window.clearTimeout(t);
      stops.forEach((s) => { try { s(); } catch { /* ignore */ } });
      restore.forEach((r) => { try { r(); } catch { /* ignore */ } });
      pending.forEach((_, el) => clear(el, ["opacity", "transform", "filter", "clip-path"]));
    };
  }, []);
  return null;
}
