import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegacyPage, legacyDescription } from "@/lib/legacy";
import { LegacyView } from "./[...path]/page";
import HomeWorldMap from "@/components/home/HomeWorldMap";

/**
 * Home page = the original Can X Global home exactly as it was on WordPress/Elementor
 * (hero, sections, copy, animations, colours, fonts), mirrored 1:1 in content/legacy/home.
 * The single addition is the interactive world map, placed in the
 * "Trusted by Clients from 30+ Countries" section (between its paragraph and its button).
 *
 * The earlier native redesign (components/home/*, styles/home.css, lib/home.ts) is no longer used
 * here; it stays in git history (commit 5539045 and earlier) if it is ever wanted again.
 */
import logos from "@/content/home-trusted-logos.json";

/* "Trusted by Businesses Big or Small": the live swiper strip becomes two slow marquee rows
   (row 1 drifts left, row 2 drifts right, both pause on hover). Heading and logos are the live ones. */
const LOGO_WIDGET = '<div class="elementor-element elementor-element-67027a8 ';
function marquee(): string {
  const half = Math.ceil(logos.length / 2);
  const row = (items: typeof logos, dir: "l" | "r") => {
    const cells = items.map((l) => `<span class="cxlm-cell"><img src="${l.src}" alt="${l.alt.replace(/"/g, "&quot;")}" loading="lazy" decoding="async" /></span>`).join("");
    return `<div class="cxlm-row cxlm-${dir}"><div class="cxlm-track">${cells}${cells}</div></div>`;
  };
  return `<div class="cxlm" aria-label="Clients and partners">${row(logos.slice(0, half), "l")}${row(logos.slice(half), "r")}</div>`;
}

const MAP_SLOT = '<div id="cx-worldmap-slot" class="cxhm" data-paused="1"></div>';
const BEFORE_BUTTON = '<div class="elementor-element elementor-element-c1138e5 ';

const live = getLegacyPage([]);
const TITLE = live?.seo_title || "Recruitment and Immigration Experts in Canada | Can X Global";
const DESC = live ? legacyDescription(live) : "Expert recruitment & immigration services in Canada by Can X Global Solutions Inc.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", title: live?.og_title || TITLE, description: DESC, images: ["/wp-content/uploads/2025/11/canX-hmepage-picture@3x-1-1-1.png.webp"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Home() {
  if (!live) notFound();
  const i = live.body.indexOf(BEFORE_BUTTON);
  let body = i === -1 ? live.body : live.body.slice(0, i) + MAP_SLOT + live.body.slice(i);
  const j = body.indexOf(LOGO_WIDGET);
  if (j !== -1) body = body.slice(0, j) + marquee() + body.slice(j);
  return (
    <>
      <LegacyView page={{ ...live, body }} />
      <HomeWorldMap />
    </>
  );
}
