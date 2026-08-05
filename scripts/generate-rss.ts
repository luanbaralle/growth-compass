import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { blogArticles } from "../src/lib/blog/articles";
import { absoluteUrl } from "../src/lib/seo/site";

process.env.VITE_SITE_URL ??= "https://raiseone.com.br";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toRfc822(dateStr: string): string {
  return new Date(dateStr).toUTCString();
}

const items = blogArticles
  .slice()
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  .map((article) => {
    const link = absoluteUrl(`/blog/${article.slug}`);
    return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${toRfc822(article.publishedAt)}</pubDate>
    </item>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Raise One — Blog</title>
    <link>${absoluteUrl("/blog")}</link>
    <description>Artigos, guias e comparativos sobre growth, marketing e tecnologia.</description>
    <language>pt-BR</language>
    <lastBuildDate>${toRfc822(new Date().toISOString().split("T")[0])}</lastBuildDate>
    <atom:link href="${absoluteUrl("/blog/rss.xml")}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

const outDir = resolve(import.meta.dirname, "../public/blog");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, "rss.xml");
writeFileSync(outPath, xml, "utf-8");

console.log(`✓ RSS feed: ${outPath} (${blogArticles.length} items)`);
