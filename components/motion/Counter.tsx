"use client";
import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";

/** Counts up with an ease-out curve when scrolled into view. */
export default function Counter({ to, prefix = "", suffix = "", duration = 1.6, className }: { to: number; prefix?: string; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const ctrl = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => { el.textContent = `${prefix}${Math.round(v).toLocaleString("en-CA")}${suffix}`; } });
    return () => ctrl.stop();
  }, [inView, to, duration, prefix, suffix]);
  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
