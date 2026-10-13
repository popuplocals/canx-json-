"use client";
import { motion, useInView, type Variants } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const MARGIN = 40;

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};

/**
 * Robust in-view state: IntersectionObserver first, plus a geometry check on scroll/resize
 * and a short timer, so content inside the viewport can never stay hidden if the observer
 * is throttled (background tabs, embedded panes, some in-app browsers).
 */
function useReveal(ref: RefObject<HTMLElement | null>, once = true) {
  const inView = useInView(ref, { once, amount: "some", margin: `0px 0px -${MARGIN}px 0px` });
  const [shown, setShown] = useState(false);
  useEffect(() => { if (inView) setShown(true); else if (!once) setShown(false); }, [inView, once]);
  useEffect(() => {
    const check = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - MARGIN && r.bottom > 0) setShown(true);
    };
    const t = setTimeout(check, 700);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { clearTimeout(t); window.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, [ref]);
  return shown;
}

/** Fade + rise + un-blur when the element scrolls into view. */
export function Reveal({ children, delay = 0, className, style, as = "div", once = true }:
  { children: ReactNode; delay?: number; className?: string; style?: CSSProperties; as?: "div" | "section" | "li" | "article" | "span"; once?: boolean; amount?: number | "some" | "all" }) {
  const M = motion[as];
  const ref = useRef<HTMLElement>(null);
  const shown = useReveal(ref, once);
  return (
    <M
      ref={ref as never}
      className={className}
      style={style}
      initial="hidden"
      animate={shown ? "show" : "hidden"}
      variants={{ hidden: revealVariants.hidden, show: { ...(revealVariants.show as object), transition: { duration: 0.8, ease: EASE, delay } } }}
    >
      {children}
    </M>
  );
}

/** Parent that staggers its Item children. */
export function Stagger({ children, className, style, gap = 0.08, as = "div" }:
  { children: ReactNode; className?: string; style?: CSSProperties; gap?: number; as?: "div" | "section" | "ul" }) {
  const M = motion[as];
  const ref = useRef<HTMLElement>(null);
  const shown = useReveal(ref);
  return (
    <M ref={ref as never} className={className} style={style} initial="hidden" animate={shown ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: 0.05 } } }}>
      {children}
    </M>
  );
}

export function Item({ children, className, style, as = "div" }: { children: ReactNode; className?: string; style?: CSSProperties; as?: "div" | "li" | "article" }) {
  const M = motion[as];
  return <M className={className} style={style} variants={revealVariants}>{children}</M>;
}

/** Headline that reveals word by word. */
export function Words({ text, className, as = "h2", delay = 0 }: { text: string; className?: string; as?: "h1" | "h2" | "h3" | "p"; delay?: number }) {
  const M = motion[as];
  const ref = useRef<HTMLElement>(null);
  const shown = useReveal(ref);
  const words = text.split(" ");
  return (
    <M ref={ref as never} className={className} initial="hidden" animate={shown ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: delay } } }} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
          <motion.span style={{ display: "inline-block" }} variants={{ hidden: { y: "110%", opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } } }}>
            {w}{i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </M>
  );
}
