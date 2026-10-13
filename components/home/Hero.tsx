"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Counter from "@/components/motion/Counter";
import Magnetic from "@/components/motion/Magnetic";
import type { HomeData } from "@/lib/home";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero({ d }: { d: HomeData["hero"] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yPhoto = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yStats = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const [a, b] = d.display.split(". ").map((s) => s.replace(/\.$/, ""));
  const words = (t: string) => t.split(" ");

  return (
    <section ref={ref} className="cxh-hero">
      <div className="mesh" aria-hidden />
      <div className="wrap grid">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: EASE }}>{d.h1}</motion.h1>
          <h2 className="display" aria-label={d.display}>
            {[a, b].map((line, li) => (
              <span key={li} style={{ display: "block" }}>
                {words(line).map((w, i) => (
                  <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: ".08em" }}>
                    <motion.span
                      style={{ display: "inline-block" }}
                      className={li === 1 ? "hl" : undefined}
                      initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.15 + (li * 3 + i) * 0.07 }}
                    >
                      {w}{i < words(line).length - 1 ? " " : "."}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <motion.p className="lead" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}>{d.p1}</motion.p>
          <motion.p className="tag" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}>{d.tagline}</motion.p>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}>{d.p2}</motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.95 }}>
            <div className="years">{d.years}</div>
            <div>
              <Magnetic><Link href={d.cta.href} className="btn btn-primary">{d.cta.text} <span className="arr">→</span></Link></Magnetic>
            </div>
          </motion.div>
        </div>

        <motion.div className="visual" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}>
          <div className="orb" aria-hidden />
          <motion.div className="photo" style={{ y: yPhoto }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {d.image && <img src={d.image.src} alt="Can X Global recruitment and immigration consultants" width={426} height={336} loading="eager" fetchPriority="high" />}
          </motion.div>
          {d.counters.map((c, i) => (
            <motion.div key={c.label} className={`stat s${i + 1}`} style={{ y: yStats }}
              initial={{ opacity: 0, y: 24, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.9 + i * 0.12 }}>
              <b><Counter to={c.to} prefix={c.prefix} suffix={c.suffix} /></b>
              <span>{c.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
