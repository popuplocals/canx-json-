"use client";
import { useEffect } from "react";

/**
 * Makes <details class="faq"> blocks open and close with a spring-like height animation
 * (native <details> snaps). Keeps the markup identical, so FAQPage schema still matches.
 */
export default function FaqEnhancer() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const details = Array.from(document.querySelectorAll<HTMLDetailsElement>(".blog-content details"));
    const handlers: (() => void)[] = [];
    details.forEach((d) => {
      const summary = d.querySelector("summary");
      if (!summary) return;
      d.classList.add("faq", "faq-enh");
      const onClick = (e: Event) => {
        e.preventDefault();
        if (reduce) { d.open = !d.open; return; }
        const content = Array.from(d.children).filter((c) => c !== summary) as HTMLElement[];
        const getH = () => content.reduce((a, c) => a + c.offsetHeight, 0);
        if (d.open) {
          const h = getH();
          const anim = d.animate([{ height: `${summary.offsetHeight + h}px` }, { height: `${summary.offsetHeight}px` }], { duration: 380, easing: "cubic-bezier(.22,1,.36,1)" });
          d.style.overflow = "hidden";
          anim.onfinish = () => { d.open = false; d.style.overflow = ""; d.style.height = ""; };
        } else {
          d.open = true;
          const h = getH();
          d.style.overflow = "hidden";
          const anim = d.animate([{ height: `${summary.offsetHeight}px` }, { height: `${summary.offsetHeight + h}px` }], { duration: 440, easing: "cubic-bezier(.22,1,.36,1)" });
          content.forEach((c) => c.animate([{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 420, delay: 80, easing: "ease-out", fill: "both" }));
          anim.onfinish = () => { d.style.overflow = ""; };
        }
      };
      summary.addEventListener("click", onClick);
      handlers.push(() => summary.removeEventListener("click", onClick));
    });
    return () => handlers.forEach((h) => h());
  }, []);
  return null;
}
