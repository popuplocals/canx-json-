import type { LegacyPage as LegacyPageData } from "@/lib/legacy";
import LegacyRuntime from "./LegacyRuntime";

/**
 * Renders a mirrored WordPress/Elementor page inside the Next.js shell.
 * - stylesheets are hoisted to <head> by React 19 (precedence)
 * - inline styles + body markup are rendered server-side exactly as live
 * - scripts are rendered as real <script> tags (execute on full page load) and
 *   re-run by LegacyRuntime after client-side navigations.
 */
export default function LegacyPage({ page }: { page: LegacyPageData }) {
  const bodyClass = page.body_class.replace(/\s+/g, " ").trim();
  return (
    <>
      {/* Astra/Elementor CSS targets body.<class>; apply before paint */}
      <script dangerouslySetInnerHTML={{ __html: `document.body.className+=" ${bodyClass} cx-legacy";window.__cxLegacyBooted=true;` }} />
      {page.stylesheets.map((href) => (
        // eslint-disable-next-line @next/next/no-css-tags
        <link key={href} rel="stylesheet" href={href} precedence="legacy" />
      ))}
      {page.inlineStyles.map((css, i) => (
        <style key={i} dangerouslySetInnerHTML={{ __html: css }} />
      ))}
      <div id="cx-legacy-root" dangerouslySetInnerHTML={{ __html: page.body }} suppressHydrationWarning />
      {page.scripts.map((s, i) =>
        s.src ? (
          <script key={i} src={s.src} />
        ) : s.inline ? (
          <script key={i} id={s.id ?? undefined} dangerouslySetInnerHTML={{ __html: page.inlineScripts[s.inline] ?? "" }} />
        ) : null,
      )}
      <LegacyRuntime scripts={page.scripts.map((s) => (s.src ? { src: s.src } : { inline: page.inlineScripts[s.inline!] ?? "" }))} bodyClass={bodyClass} />
    </>
  );
}
