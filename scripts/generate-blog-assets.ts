import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { blogArticles } from "../src/lib/blog/articles";

const slugs = blogArticles.map((a) => a.slug);

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSvg(title: string, category: string, kind: "featured" | "og"): string {
  const isOg = kind === "og";
  const width = isOg ? 1200 : 960;
  const height = isOg ? 630 : 540;
  const truncated =
    title.length > 72 ? `${title.slice(0, 69).trim()}…` : title;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0A0A0A"/>
      <stop offset="100%" style="stop-color:#1a1a1a"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect x="48" y="48" width="120" height="4" fill="#F97316" rx="2"/>
  <text x="48" y="110" fill="#F97316" font-family="system-ui,sans-serif" font-size="14" font-weight="600" letter-spacing="2">${category.toUpperCase()}</text>
  <text x="48" y="${isOg ? 220 : 200}" fill="#FAFAFA" font-family="system-ui,sans-serif" font-size="${isOg ? 42 : 36}" font-weight="700">${truncated.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>
  <text x="48" y="${height - 48}" fill="#737373" font-family="system-ui,sans-serif" font-size="18" font-weight="500">Raise One — Blog</text>
  <circle cx="${width - 64}" cy="${height - 64}" r="24" fill="#F97316" opacity="0.9"/>
</svg>`;
}

const root = resolve(import.meta.dirname, "../public/blog");
for (const sub of ["featured", "og", "diagrams"]) {
  const dir = resolve(root, sub);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

for (const article of blogArticles) {
  const catLabel = article.category.replace(/-/g, " ");
  writeFileSync(
    resolve(root, "featured", `${article.slug}.svg`),
    buildSvg(article.title, catLabel, "featured"),
    "utf-8",
  );
  writeFileSync(
    resolve(root, "og", `${article.slug}.svg`),
    buildSvg(article.title, catLabel, "og"),
    "utf-8",
  );
}

console.log(`✓ Blog assets: ${slugs.length} featured + ${slugs.length} og SVGs`);
