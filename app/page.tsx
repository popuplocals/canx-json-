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
  const body = i === -1 ? live.body : live.body.slice(0, i) + MAP_SLOT + live.body.slice(i);
  return (
    <>
      <LegacyView page={{ ...live, body }} />
      <HomeWorldMap />
    </>
  );
}
