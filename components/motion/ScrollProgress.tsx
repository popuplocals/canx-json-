"use client";
import { motion, useScroll, useSpring } from "motion/react";

/** Thin brand-gradient reading-progress bar pinned under the header. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{
        scaleX, transformOrigin: "0 0", position: "fixed", left: 0, right: 0, top: 0, height: 3, zIndex: 9999,
        background: "linear-gradient(90deg,#39BBF9 0%,#1967B0 100%)", pointerEvents: "none",
      }}
    />
  );
}
