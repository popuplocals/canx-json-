"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

declare global {
  interface Window { __lenis?: Lenis }
}

/**
 * Inertia scrolling (Lenis) for the light, native pages (blog posts, categories).
 * Uses native scroll position, so anchors and GTM scroll triggers keep working.
 *
 * It is deliberately OFF on the mirrored Elementor pages (home + marketing pages): they carry
 * 3,500–4,000 DOM nodes, so driving every scroll frame from JavaScript costs more main-thread
 * time than anything else on the page. Native scrolling runs on the compositor thread and is
 * smoother there. Also disabled for reduced-motion users and touch devices.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const heavy = !!document.getElementById("cx-legacy-root");
    if (reduce || coarse || heavy) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true, anchors: true });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); delete window.__lenis; };
  }, [pathname]);
  return null;
}
