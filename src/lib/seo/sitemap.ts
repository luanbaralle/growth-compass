import { blogArticles } from "@/lib/blog/content";
import { caseStudies } from "@/lib/cases/content";
import { SEGMENT_SLUGS } from "@/config/segments";
import { absoluteUrl } from "@/lib/seo/site";

export interface SitemapEntry {
  path: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  lastmod?: string;
}

export function getPublicSitemapEntries(): SitemapEntry[] {
  const staticPages: SitemapEntry[] = [
    { path: "/", changefreq: "weekly", priority: 1.0 },
    { path: "/programa-de-crescimento", changefreq: "monthly", priority: 0.95 },
    { path: "/solucoes", changefreq: "weekly", priority: 0.9 },
    { path: "/solucoes/google-ads", changefreq: "monthly", priority: 0.85 },
    { path: "/solucoes/meta-ads", changefreq: "monthly", priority: 0.85 },
    { path: "/solucoes/landing-pages", changefreq: "monthly", priority: 0.85 },
    { path: "/solucoes/producao-de-conteudo", changefreq: "monthly", priority: 0.85 },
    { path: "/metodologia", changefreq: "monthly", priority: 0.85 },
    { path: "/tecnologia", changefreq: "monthly", priority: 0.85 },
    { path: "/cases", changefreq: "weekly", priority: 0.85 },
    { path: "/diagnostico", changefreq: "monthly", priority: 0.9 },
    { path: "/blog", changefreq: "daily", priority: 0.9 },
    { path: "/projetos/pousada", changefreq: "yearly", priority: 0.5 },
  ];

  const blogCategories: SitemapEntry[] = [
    "insights",
    "google-ads",
    "meta-ads",
    "seo",
    "ia",
    "tecnologia",
    "imobiliario",
    "growth",
  ].map((cat) => ({
    path: `/blog/categoria/${cat}`,
    changefreq: "weekly" as const,
    priority: 0.75,
  }));

  const blogPosts: SitemapEntry[] = blogArticles.map((article) => ({
    path: `/blog/${article.slug}`,
    changefreq: "monthly" as const,
    priority: 0.7,
    lastmod: article.publishedAt,
  }));

  const cases: SitemapEntry[] = caseStudies.map((c) => ({
    path: `/cases/${c.slug}`,
    changefreq: "monthly" as const,
    priority: 0.75,
  }));

  const segments: SitemapEntry[] = SEGMENT_SLUGS.map((slug) => ({
    path: `/${slug}`,
    changefreq: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogCategories, ...blogPosts, ...cases, ...segments];
}

export function buildSitemapXml(): string {
  const entries = getPublicSitemapEntries();
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastmod
        ? `<lastmod>${entry.lastmod}</lastmod>`
        : `<lastmod>${new Date().toISOString().split("T")[0]}</lastmod>`;
      return `  <url>
    <loc>${absoluteUrl(entry.path)}</loc>
    ${lastmod}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(2)}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function buildRobotsTxt(): string {
  const sitemapUrl = absoluteUrl("/sitemap.xml");
  return `# Raise One — robots.txt
User-agent: *
Allow: /

# Admin e páginas internas
Disallow: /os/
Disallow: /admin/
Disallow: /obrigado

# Sitemap
Sitemap: ${sitemapUrl}
`;
}
