"use client";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { ReactNode } from "react";

/** Wraps a button/link so it gently follows the cursor inside its padding zone. */
export default function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 16, mass: 0.3 });
  const y = useSpring(my, { stiffness: 180, damping: 16, mass: 0.3 });
  return (
    <motion.div
      className={className}
      style={{ x, y, display: "inline-block" }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width / 2)) * strength);
        my.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
    >
      {children}
    </motion.div>
  );
}
