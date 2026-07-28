import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildSitemapXml } from "../src/lib/seo/sitemap";

process.env.VITE_SITE_URL ??= "https://raiseone.com.br";

const xml = buildSitemapXml();
const outPath = resolve(import.meta.dirname, "../public/sitemap.xml");
writeFileSync(outPath, xml, "utf-8");

const count = xml.split("<url>").length - 1;
console.log(`✓ Sitemap: ${outPath} (${count} URLs)`);
