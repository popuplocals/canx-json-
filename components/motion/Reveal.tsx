"use client";
import { motion, type Variants } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};

/** Fade + rise + un-blur when the element scrolls into view. */
export function Reveal({ children, delay = 0, className, style, as = "div", once = true, amount = 0.25 }:
  { children: ReactNode; delay?: number; className?: string; style?: CSSProperties; as?: "div" | "section" | "li" | "article" | "span"; once?: boolean; amount?: number }) {
  const M = motion[as];
  return (
    <M
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: "0px 0px -8% 0px" }}
      variants={{ hidden: revealVariants.hidden, show: { ...(revealVariants.show as object), transition: { duration: 0.8, ease: EASE, delay } } }}
    >
      {children}
    </M>
  );
}

/** Parent that staggers its Reveal-like children (use <Item/> inside). */
export function Stagger({ children, className, style, gap = 0.08, as = "div" }:
  { children: ReactNode; className?: string; style?: CSSProperties; gap?: number; as?: "div" | "section" | "ul" }) {
  const M = motion[as];
  return (
    <M className={className} style={style} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15, margin: "0px 0px -6% 0px" }}
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
  const words = text.split(" ");
  return (
    <M className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}
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
