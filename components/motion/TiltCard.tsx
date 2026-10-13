"use client";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

/**
 * Subtle 3D tilt + light glare that follows the cursor. Spring-damped so it feels
 * physical rather than jittery. No-op on touch devices (no hover).
 */
export default function TiltCard({ children, className, style, max = 7 }: { children: ReactNode; className?: string; style?: CSSProperties; max?: number }) {
  const x = useMotionValue(0.5), y = useMotionValue(0.5);
  const rx = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 220, damping: 20, mass: 0.4 });
  const ry = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 220, damping: 20, mass: 0.4 });
  const gx = useTransform(x, (v) => `${v * 100}%`), gy = useTransform(y, (v) => `${v * 100}%`);
  const glare = useSpring(useMotionValue(0), { stiffness: 200, damping: 25 });

  return (
    <motion.div
      className={className}
      style={{ ...style, rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", perspective: 900, position: "relative" }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width); y.set((e.clientY - r.top) / r.height); glare.set(1);
      }}
      onPointerLeave={() => { x.set(0.5); y.set(0.5); glare.set(0); }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 22 } }}
    >
      {children}
      <motion.span
        aria-hidden
        style={{
          position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", opacity: glare, mixBlendMode: "soft-light",
          background: useTransform([gx, gy], ([a, b]) => `radial-gradient(420px circle at ${a} ${b}, rgba(255,255,255,.85), transparent 60%)`),
        }}
      />
    </motion.div>
  );
}
