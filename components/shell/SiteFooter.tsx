import fs from "node:fs";
import path from "node:path";

const html = fs
  .readFileSync(path.join(process.cwd(), "components/shell/footer.html"), "utf8")
  .replace(/https:\/\/canxglobal\.com\/(?!wp-content\/)/g, "/");

export default function SiteFooter() {
  return <div dangerouslySetInnerHTML={{ __html: html }} suppressHydrationWarning />;
}
