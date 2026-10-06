"use client";
import { useEffect } from "react";

type S = { src?: string; inline?: string };

declare global {
  interface Window { __cxLegacyBooted?: boolean; elementorFrontend?: unknown; jQuery?: unknown }
}

/**
 * After a client-side navigation into a legacy page the SSR <script> tags do not execute,
 * so we re-inject them sequentially. On a full page load the scripts have already run
 * (elementorFrontend exists) and this is a no-op.
 */
export default function LegacyRuntime({ scripts, bodyClass }: { scripts: S[]; bodyClass: string }) {
  useEffect(() => {
    const body = document.body;
    const added = bodyClass.split(" ").filter(Boolean).concat("cx-legacy");
    added.forEach((c) => body.classList.add(c));

    let cancelled = false;
    const booted = typeof window.elementorFrontend !== "undefined" || window.__cxLegacyBooted;
    if (!booted) {
      window.__cxLegacyBooted = true;
      (async () => {
        for (const s of scripts) {
          if (cancelled) return;
          await new Promise<void>((resolve) => {
            const el = document.createElement("script");
            if (s.src) { el.src = s.src; el.onload = () => resolve(); el.onerror = () => resolve(); }
            else { el.textContent = s.inline ?? ""; }
            document.body.appendChild(el);
            if (!s.src) resolve();
          });
        }
        window.dispatchEvent(new Event("load"));
      })();
    }
    return () => {
      cancelled = true;
      added.forEach((c) => body.classList.remove(c));
    };
  }, [scripts, bodyClass]);
  return null;
}
