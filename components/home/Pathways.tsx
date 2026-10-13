"use client";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { HomeData } from "@/lib/home";

/**
 * Pinned horizontal rail: the section stays fixed while vertical scrolling slides the
 * 15 pathway cards sideways. Falls back to a native snap-scroll strip on phones.
 */
export default function Pathways({ items }: { items: HomeData["pathways"] }) {
  const outer = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const measure = () => {
      const m = window.matchMedia("(max-width: 640px)").matches; setMobile(m);
      if (!rail.current) return;
      setDist(Math.max(0, rail.current.scrollWidth - window.innerWidth + 40));
    };
    measure(); window.addEventListener("resize", measure); return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });
  const x = useTransform(smooth, [0, 1], [0, -dist]);
  const scaleX = smooth;

  return (
    <section ref={outer} className="cxh-paths" style={{ height: mobile ? "auto" : `${Math.max(220, 120 + dist / 8)}vh` }} aria-labelledby="paths-h">
      <div className="pin">
        <div className="head">
          <div>
            <div className="eyebrow">Immigration pathways</div>
            <h2 id="paths-h">Every route to Canada, <span className="gradient-text">handled end to end</span></h2>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="hint">Scroll to explore</div>
            <div className="progress"><motion.i style={{ scaleX }} /></div>
          </div>
        </div>
        <motion.div ref={rail} className="rail" style={mobile ? undefined : { x }}>
          {items.map((p, i) => (
            <Link key={p.title} href={p.href} className="pcard">
              <div className="pic">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.image && <img src={p.image.src} alt={p.title} loading="lazy" />}
              </div>
              <div className="body">
                <span className="idx">{String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <span className="go">{p.cta.text} →</span>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
