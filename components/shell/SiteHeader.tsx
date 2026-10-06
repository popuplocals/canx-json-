import fs from "node:fs";
import path from "node:path";
import HeaderBehaviour from "./HeaderBehaviour";

const html = fs
  .readFileSync(path.join(process.cwd(), "components/shell/header.html"), "utf8")
  .replace(/https:\/\/canxglobal\.com\/(?!wp-content\/)/g, "/");

export default function SiteHeader() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} suppressHydrationWarning />
      <HeaderBehaviour />
    </>
  );
}
