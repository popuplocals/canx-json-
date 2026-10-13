import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

/* Native rebuild of the live Can X Global footer (ElementsKit template 22926 + Astra below-footer).
   Content, links, logos and colours are taken verbatim from the live site. */

const SERVICES = [
  ["Employers", "/employers/"],
  ["Job Seekers", "/job-seekers/"],
  ["Job Board", "/job-board/"],
  ["Immigration", "/immigration-consultation-canada/"],
];
const WHY = [
  ["Our Story", "/our-story/"],
  ["Affiliations", "/affiliations/"],
  ["Diligence", "/diligence/"],
  ["Customer Stories", "/customer-stories/"],
];
const SOCIAL = [
  ["LinkedIn", "https://ca.linkedin.com/company/canxglobal", <svg key="li" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>],
  ["Facebook", "https://www.facebook.com/canxglobal/", <svg key="fb" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>],
  ["Instagram", "https://www.instagram.com/canxglobal/", <svg key="ig" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>],
  ["X", "https://x.com/canxglobal", <svg key="x" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>],
] as const;
const BADGES = [
  ["/wp-content/uploads/2025/08/mobile-1-1.png.webp", "RCIC – CICC Regulated Canadian Immigration Consultant"],
  ["/wp-content/uploads/2025/08/Group189000-ezgif.com-png-to-webp-converter-scaled-e1755776403189.webp", "BBB Accredited Business"],
  ["/wp-content/uploads/2025/08/Group189001-ezgif.com-png-to-webp-converter.webp", "ICBA – BC Built, BC Strong"],
  ["/wp-content/uploads/2025/08/Group188997-ezgif.com-png-to-webp-converter-e1755776478951.webp", "CAPIC – ACCPI"],
  ["/wp-content/uploads/2025/08/Group188998-ezgif.com-png-to-webp-converter.webp", "Surrey Board of Trade member"],
];

/* eslint-disable @next/next/no-img-element */
export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="cxf" id="colophon">
      <div className="cxf-main">
        <div className="cxf-wrap cxf-grid">
          <div className="cxf-brand">
            <Link href="/" className="cxf-logo" aria-label="Can X Global home">
              <img src="/wp-content/uploads/2025/01/CanX-Global-LOGO-3-1.webp" alt="Can X Global logo" width={1250} height={365} loading="lazy" />
            </Link>
            <p>We know finding the right talent can be time consuming and costly.</p>
            <div className="cxf-social">
              {SOCIAL.map(([name, href, icon]) => (
                <a key={name} href={href} target="_blank" rel="noopener" aria-label={name}>{icon}</a>
              ))}
            </div>
            <NewsletterForm />
          </div>

          <div>
            <h3 className="cxf-h">Services</h3>
            <ul className="cxf-list">{SERVICES.map(([t, h]) => <li key={h}><Link href={h}>{t}</Link></li>)}</ul>
          </div>

          <div>
            <h3 className="cxf-h">Why Can X</h3>
            <ul className="cxf-list">{WHY.map(([t, h]) => <li key={h}><Link href={h}>{t}</Link></li>)}</ul>
          </div>

          <div>
            <h3 className="cxf-h">Contact Us</h3>
            <ul className="cxf-contact">
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>
                <a href="https://maps.app.goo.gl/4ADpg3hfzjYGBj7U6" target="_blank" rel="noopener">504 - 13761 96 Ave Surrey BC V3V 0E8 Canada</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 4.2 2 2 0 0 1 5.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L9 9.7a16 16 0 0 0 5.3 5.3l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.7A2 2 0 0 1 22 16.9z" /></svg>
                <a href="tel:+17785643555">+1 778 564 3555</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="3" width="12" height="7" rx="1" /><rect x="2" y="10" width="20" height="11" rx="2" /><path d="M7 14h2M11 14h2M15 14h2M7 17h2M11 17h2M15 17h2" /></svg>
                <a href="tel:+18887522023">+1 888 752 2023</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                <a href="mailto:help@canxglobal.com">help@canxglobal.com</a>
              </li>
            </ul>
            <Link href="/get-started/" className="cxf-btn">Schedule a call</Link>
          </div>
        </div>

        <div className="cxf-wrap cxf-band">
          <p className="cxf-tag">We help Companies Thrive,<br />People Succeed!</p>
          <div className="cxf-badges">
            {BADGES.map(([src, alt]) => <span key={src}><img src={src} alt={alt} loading="lazy" /></span>)}
          </div>
        </div>
      </div>

      <div className="cxf-below">
        <div className="cxf-wrap">
          <Link href="/">Copyright © {year} canxglobal.com</Link>
          <nav aria-label="Legal">
            <Link href="/cookie-policy/">Cookie Policy</Link><span>|</span>
            <Link href="/privacy-policy/">Privacy Policy</Link><span>|</span>
            <Link href="/disclaimer/">Disclaimer</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
