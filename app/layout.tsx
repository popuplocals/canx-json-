import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "../styles/header.css";
import "../styles/footer.css";
import SiteHeader from "@/components/shell/SiteHeader";
import SiteFooter from "@/components/shell/SiteFooter";
import { SITE, BRAND } from "@/lib/content";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], variable: "--font-poppins", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: `Recruitment and Immigration Experts in Canada | ${BRAND}`, template: `%s` },
  description: "Expert recruitment & immigration services in Canada by Can X Global Solutions Inc.",
  alternates: { canonical: "/" },
  openGraph: { siteName: BRAND, locale: "en_CA", type: "website" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
};

const ORG = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LegalService", "LocalBusiness", "ProfessionalService"],
      "@id": `${SITE}/#organization`,
      name: "Can X Global Solutions Inc.",
      alternateName: BRAND,
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/wp-content/uploads/2025/01/cropped-cropped-cropped-Untitled-design-300x85-1-200x57.webp` },
      address: { "@type": "PostalAddress", streetAddress: "504 - 13761 96 Ave", addressLocality: "Surrey", addressRegion: "BC", postalCode: "V3V 0E8", addressCountry: "CA" },
      areaServed: "CA",
      sameAs: ["https://www.facebook.com/canxglobal", "https://www.instagram.com/canxglobal", "https://www.linkedin.com/company/canxglobal", "https://x.com/canxglobal"],
    },
    { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: BRAND, publisher: { "@id": `${SITE}/#organization` }, inLanguage: "en-CA" },
  ],
};

const GTM_ID = "GTM-5SZ9JGPF";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className={`${poppins.variable} h-full antialiased`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG) }} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script id="gtag-src" src="https://www.googletagmanager.com/gtag/js?id=GT-PZSWFMQD" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("set","linker",{"domains":["canxglobal.com"]});gtag("js",new Date());gtag("config","GT-PZSWFMQD");`}</Script>
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}</Script>
        <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
