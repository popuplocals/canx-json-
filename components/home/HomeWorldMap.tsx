"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Reveal } from "@/components/motion/Reveal";
import WorldMap from "./WorldMap";
import "../../styles/home-map.css";

/** Renders the interactive world map inside the mirrored home page's countries section. */
export default function HomeWorldMap() {
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.getElementById("cx-worldmap-slot");
    setSlot(el);
    if (!el) return;
    // the pulsing rings only run while the map is actually on screen
    const io = new IntersectionObserver(([e]) => { el.dataset.paused = e.isIntersecting ? "0" : "1"; }, { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (!slot) return null;
  return createPortal(<Reveal><WorldMap /></Reveal>, slot);
}
