import fs from "node:fs";
import path from "node:path";

/* Typed view over content/home-sections.json (extracted verbatim from the live homepage). */
type Img = { src: string; alt: string; w?: string | null; h?: string | null } | null;
type Section = {
  headings: { tag: string; text: string }[];
  paragraphs: { tag: string; text: string; html: string }[];
  items: { title: string; desc: string; image: Img; href: string | null }[];
  buttons: { text: string; href: string | null }[];
  images: Img[];
  counters: { number: string; to: string; prefix: string; suffix: string; title: string }[];
};

const S: Section[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "home-sections.json"), "utf8"));
const LOGOS: string[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "home-logos.json"), "utf8"));
const rel = (u: string | null | undefined) => (u || "").replace(/^https?:\/\/(www\.)?canxglobal\.com/, "") || "/get-started/";
const clean = (t: string) => t.replace(/\s+([.,!?])/g, "$1").replace(/\s{2,}/g, " ").trim();
const dropExplore = (t: string) => clean(t.replace(/\s*Explore\s*$/, ""));

export const PATHWAY_LINKS: Record<string, string> = {
  "Express Entry": "/permanent-residency/express-entry/",
  "Provincial Nominee Program": "/permanent-residency/provincial-nominee-program/",
  "Family Sponsorship": "/permanent-residency/family-sponsorship/",
  "Start Up Visa": "/permanent-residency/start-up-visa/",
  "Humanitarian & Compassionate (H&C)": "/permanent-residency/humanitarian-and-compassionate-hc/",
  "LMIA Based Work Permit": "/work-permit/lmia-based-work-permit/",
  "International Free Trade Agreements": "/work-permit/international-free-trade-agreements/",
  "Intra Company Transfer": "/work-permit/intra-company-transfer/",
  "Spousal Open Work Permit": "/work-permit/",
  "Post-Graduation Work Permit (PGWP)": "/work-permit/post-graduation-work-permit/",
  "Bridging Open Work Permit (BOWP)": "/work-permit/bridging-open-work-permit/",
  "International Experience Canada (IEC)": "/work-permit/international-experience-canada/",
  "Study in Canada": "/study/",
  "Visit Canada": "/visit/",
  "Canadian Citizenship": "/citizenship/",
};

export function getHome() {
  const [hero, challenges, logos, beyond, tiers, seekers, easy, trust, pathways, countries, blogs] = S;
  const tierLinks = ["/hire-local/", "/hire-global/", "/hire-remote/", "/lmia/"];
  return {
    hero: {
      h1: clean(hero.headings[0].text),
      display: clean(hero.headings[1].text),             // "Connecting Talent. Simplifying Immigration."
      p1: clean(hero.paragraphs[0].text),
      tagline: clean(hero.paragraphs[1].text),
      p2: clean(hero.paragraphs[2].text),
      years: clean(hero.paragraphs[3].text),
      cta: { text: clean(hero.buttons[0].text), href: rel(hero.buttons[0].href) },
      image: hero.images[4],
      counters: hero.counters.map((c) => ({ to: Number(c.to), prefix: c.prefix, suffix: c.suffix, label: c.title })),
    },
    challenges: {
      heading: clean(challenges.headings[0].text),
      items: challenges.items.map((i) => ({ title: clean(i.title), desc: clean(i.desc), image: i.image })),
      note: clean(challenges.paragraphs[0]?.text || "").replace("C anada", "Canada"),
      cta: { text: clean(challenges.buttons[0].text), href: rel(challenges.buttons[0].href) },
    },
    logos: { heading: clean(logos.headings[0].text), images: LOGOS, cta: { text: clean(logos.buttons[0].text), href: rel(logos.buttons[0].href) } },
    beyond: { heading: clean(beyond.headings[0].text), items: beyond.items.map((i) => ({ title: clean(i.title), desc: clean(i.desc), image: i.image })), cta: { text: clean(beyond.buttons[0].text), href: rel(beyond.buttons[0].href) } },
    tiers: {
      items: [0, 1, 2, 3].map((n) => ({
        title: clean(tiers.headings[n].text),
        text: dropExplore(tiers.paragraphs[n].text),
        href: tierLinks[n],
        cta: { text: clean(tiers.buttons[n].text), href: rel(tiers.buttons[n].href) },
        image: tiers.images[n],
      })),
      lmiaStreams: tiers.buttons.slice(4, 7).map((b) => ({ text: clean(b.text), href: rel(b.href) })),
    },
    seekers: { heading: clean(seekers.headings[0].text), text: clean(seekers.paragraphs[0].text), buttons: seekers.buttons.map((b) => ({ text: clean(b.text), href: rel(b.href) })), images: seekers.images },
    easy: {
      heading: clean(easy.headings[0].text), sub: clean(easy.headings[1].text),
      intro: dropExplore(easy.paragraphs[0].text), lines: easy.paragraphs.slice(1).map((p) => clean(p.text)),
      items: easy.items.map((i) => ({ title: clean(i.title), desc: clean(i.desc), image: i.image })),
      image: easy.images[0], cta: { text: clean(easy.buttons[0].text), href: rel(easy.buttons[0].href) },
    },
    trust: { heading: clean(trust.headings[0].text), items: trust.items.map((i) => ({ title: clean(i.title), desc: clean(i.desc), image: i.image })), cta: { text: clean(trust.buttons[0].text), href: rel(trust.buttons[0].href) } },
    pathways: pathways.headings.map((h, n) => ({ title: clean(h.text), text: clean(pathways.paragraphs[n].text), image: pathways.images[n], href: PATHWAY_LINKS[clean(h.text)] ?? "/get-started/", cta: { text: clean(pathways.buttons[n].text), href: rel(pathways.buttons[n].href) } })),
    countries: { heading: clean(countries.headings[0].text), text: clean(countries.headings[1].text), cta: { text: clean(countries.buttons[0].text), href: rel(countries.buttons[0].href) } },
    blogs: { heading: clean(blogs.headings[0].text), text: clean(blogs.paragraphs[0].text), buttons: blogs.buttons.map((b) => ({ text: clean(b.text), href: rel(b.href) })) },
  };
}
export type HomeData = ReturnType<typeof getHome>;
