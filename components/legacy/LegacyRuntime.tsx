"use client";
import { useEffect } from "react";

type S = { src?: string; inline?: string };

type ElementorFrontend = { elementsHandler?: { runReadyTrigger?: (el: Element) => void } };

declare global {
  interface Window {
    __cxLegacyBooted?: boolean;
    /** pathname of the page whose legacy scripts executed natively during a full document load */
    __cxLegacyFull?: string;
    elementorFrontend?: ElementorFrontend;
    jQuery?: unknown;
  }
}

/**
 * Keeps the mirrored WordPress/Elementor runtime working inside the Next.js shell.
 *
 * Full page load:   the SSR <script> tags already ran (see LegacyPage) — nothing to do.
 * SPA → legacy:     the SSR tags never execute, so every script is fetched and then executed
 *                   synchronously, in order, within ONE task. That matters: Elementor schedules
 *                   `elementorFrontend.init()` through jQuery's ready queue (a setTimeout on an
 *                   already-loaded document) and Elementor Pro / ElementsKit only register their
 *                   widget handlers on the `elementor/frontend/init` event. If init fires before the
 *                   later scripts have loaded, widgets such as the Posts grid never initialise.
 * legacy → legacy:  the runtime already exists, so Elementor's ready triggers are re-run for the
 *                   elements of the freshly rendered page.
 */
let mountCount = 0;

export default function LegacyRuntime({ scripts, bodyClass }: { scripts: S[]; bodyClass: string }) {
  useEffect(() => {
    const body = document.body;
    const added = bodyClass.split(" ").filter(Boolean).concat("cx-legacy");
    added.forEach((c) => body.classList.add(c));
    let cancelled = false;
    const myMount = ++mountCount;

    const loadedNatively = window.__cxLegacyFull === window.location.pathname;
    if (!loadedNatively) window.__cxLegacyFull = undefined; // stale marker from an earlier page
    const runtimeReady = typeof window.elementorFrontend !== "undefined";

    const rerunHandlers = () => {
      const root = document.getElementById("cx-legacy-root");
      const run = window.elementorFrontend?.elementsHandler?.runReadyTrigger;
      if (!root || !run) return;
      root.querySelectorAll<HTMLElement>(".elementor-element").forEach((el) => {
        try { run(el); } catch { /* a single widget failing must not block the rest */ }
      });
      window.dispatchEvent(new Event("resize"));
    };

    const boot = async () => {
      const parts = await Promise.all(
        scripts.map(async (s): Promise<{ code?: string; src?: string }> => {
          if (!s.src) return { code: s.inline ?? "" };
          try {
            const r = await fetch(s.src, { credentials: "same-origin" });
            if (!r.ok) throw new Error(String(r.status));
            return { code: `${await r.text()}\n//# sourceURL=${s.src}` };
          } catch {
            return { src: s.src }; // cross-origin without CORS → let the browser load it
          }
        }),
      );
      if (cancelled) return;
      window.__cxLegacyBooted = true;
      for (const p of parts) {
        const el = document.createElement("script");
        if (p.src) { el.src = p.src; el.async = false; } else { el.textContent = p.code ?? ""; }
        document.body.appendChild(el);
      }
      window.dispatchEvent(new Event("load"));
    };

    if (!loadedNatively) {
      if (runtimeReady) rerunHandlers();
      else void boot();
    }

    return () => {
      cancelled = true;
      added.forEach((c) => body.classList.remove(c));
      // Forget the full-load marker once this page is really gone (React dev mode re-runs effects
      // immediately after cleanup, in which case mountCount has already moved on).
      setTimeout(() => { if (mountCount === myMount) window.__cxLegacyFull = undefined; }, 0);
    };
  }, [scripts, bodyClass]);
  return null;
}
