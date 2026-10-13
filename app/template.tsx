"use client";
import { motion } from "motion/react";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Curtain transition: on every navigation a brand-blue panel is already covering the
 * viewport, then sweeps upward to reveal the new page while the content rises in.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.05 }}
        style={{ position: "fixed", inset: 0, zIndex: 99999, transformOrigin: "top", pointerEvents: "none", background: "linear-gradient(180deg,#39bbf9 0%,#1967b0 60%,#0b2a4a 100%)" }}
      />
      <motion.div
        aria-hidden
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.18 }}
        style={{ position: "fixed", inset: 0, zIndex: 99998, transformOrigin: "top", pointerEvents: "none", background: "#fff" }}
      />
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}>
        {children}
      </motion.div>
    </>
  );
}
