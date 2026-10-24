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
    setSlot(document.getElementById("cx-worldmap-slot"));
  }, []);
  if (!slot) return null;
  return createPortal(<Reveal><WorldMap /></Reveal>, slot);
}
