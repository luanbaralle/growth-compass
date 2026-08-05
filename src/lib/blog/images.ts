/** Fotos reais por artigo — Unsplash (uso editorial). Substitua por assets próprios quando disponíveis. */

export interface BlogImageSet {
  featured: string;
  og: string;
  /** Imagens para o corpo do artigo (quebras visuais) */
  inline: string[];
  alt: string;
}

function photo(id: string, w: number, h: number): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

export const BLOG_IMAGE_REGISTRY: Record<string, BlogImageSet> = {
  "como-estruturar-campanhas-google-ads": {
    featured: photo("photo-1460925895917-afdab827c52f", 1200, 675),
    og: photo("photo-1460925895917-afdab827c52f", 1200, 630),
    inline: [
      photo("photo-1551288049-bebda4e38f71", 960, 540),
      photo("photo-1556761175-4b46a572b786", 960, 540),
    ],
    alt: "Profissional analisando métricas de campanhas de Google Ads em notebook",
  },
  "meta-ads-vs-google-ads": {
    featured: photo("photo-1563986768609-322da13575f3", 1200, 675),
    og: photo("photo-1563986768609-322da13575f3", 1200, 630),
    inline: [photo("photo-1556761175-4b46a572b786", 960, 540)],
    alt: "Telas com redes sociais e busca digital representando Meta Ads e Google Ads",
  },
  "funil-de-aquisicao-guia": {
    featured: photo("photo-1553877522-43269d4ea984", 1200, 675),
    og: photo("photo-1553877522-43269d4ea984", 1200, 630),
    inline: [photo("photo-1552664730-d307ca884978", 960, 540)],
    alt: "Equipe planejando funil de aquisição e crescimento comercial",
  },
  "landing-page-vs-site-institucional": {
    featured: photo("photo-1498050108023-c5249f4df085", 1200, 675),
    og: photo("photo-1498050108023-c5249f4df085", 1200, 630),
    inline: [photo("photo-1516321497487-e288fb19713f", 960, 540)],
    alt: "Desenvolvimento de landing page em laptop",
  },
  "ia-marketing-imobiliario": {
    featured: photo("photo-1560518883-ce09059eeffa", 1200, 675),
    og: photo("photo-1560518883-ce09059eeffa", 1200, 630),
    inline: [photo("photo-1497366811353-6870744d04b2", 960, 540)],
    alt: "Empreendimento imobiliário moderno com foco em marketing digital",
  },
  "seo-local-guia-completo": {
    featured: photo("photo-1524661135-423995f22d0b", 1200, 675),
    og: photo("photo-1524661135-423995f22d0b", 1200, 630),
    inline: [photo("photo-1556742049-0cfed4f6a45d", 960, 540)],
    alt: "Mapa e localização representando SEO local para negócios",
  },
  "5-erros-trafego-pago": {
    featured: photo("photo-1579621970563-ebec7560ff3e", 1200, 675),
    og: photo("photo-1579621970563-ebec7560ff3e", 1200, 630),
    inline: [photo("photo-1552581234-26160f608093", 960, 540)],
    alt: "Investimento em marketing digital e controle de budget",
  },
  "crm-para-negocios-em-crescimento": {
    featured: photo("photo-1552664730-d307ca884978", 1200, 675),
    og: photo("photo-1552664730-d307ca884978", 1200, 630),
    inline: [photo("photo-1522202176988-66273c2fd55f", 960, 540)],
    alt: "Equipe comercial usando CRM para gestão de leads",
  },
  "automacoes-ia-follow-up": {
    featured: photo("photo-1677442136019-21780ecad995", 1200, 675),
    og: photo("photo-1677442136019-21780ecad995", 1200, 630),
    inline: [photo("photo-1504384308090-c894fdcc538d", 960, 540)],
    alt: "Automação com inteligência artificial aplicada ao atendimento",
  },
  "como-medir-roi-meta-ads": {
    featured: photo("photo-1551288049-bebda4e38f71", 1200, 675),
    og: photo("photo-1551288049-bebda4e38f71", 1200, 630),
    inline: [photo("photo-1556155092-8707de31f9c4", 960, 540)],
    alt: "Dashboard de métricas e ROI de campanhas Meta Ads",
  },
  "google-ads-captacao-alunos": {
    featured: photo("photo-1523240795612-9a054b0db644", 1200, 675),
    og: photo("photo-1523240795612-9a054b0db644", 1200, 630),
    inline: [photo("photo-1524178232363-1fb2b075b655", 960, 540)],
    alt: "Estudantes em ambiente universitário — captação de alunos",
  },
  "google-ads-clinicas-estetica": {
    featured: photo("photo-1576091160550-2173dba999ef", 1200, 675),
    og: photo("photo-1576091160550-2173dba999ef", 1200, 630),
    inline: [photo("photo-1519494026892-80bbd2d6fd0d", 960, 540)],
    alt: "Clínica de estética — ambiente acolhedor para pacientes",
  },
  "integrar-google-ads-crm-whatsapp": {
    featured: photo("photo-1611746872915-64382b5c76da", 1200, 675),
    og: photo("photo-1611746872915-64382b5c76da", 1200, 630),
    inline: [photo("photo-1551434678-e076c223a692", 960, 540)],
    alt: "Integração de WhatsApp, CRM e campanhas de marketing",
  },
  "programa-crescimento-vs-agencia-trafego": {
    featured: photo("photo-1600880292089-90a7e086ee0c", 1200, 675),
    og: photo("photo-1600880292089-90a7e086ee0c", 1200, 630),
    inline: [photo("photo-1553877522-43269d4ea984", 960, 540)],
    alt: "Reunião estratégica entre empresa e parceiro de growth",
  },
  "marketing-imobiliario-portal-crm-campanhas": {
    featured: photo("photo-1497366811353-6870744d04b2", 1200, 675),
    og: photo("photo-1497366811353-6870744d04b2", 1200, 630),
    inline: [photo("photo-1560518883-ce09059eeffa", 960, 540)],
    alt: "Portal imobiliário e campanhas digitais para vendas de imóveis",
  },
  "google-ads-vs-seo-qual-usar": {
    featured: photo("photo-1560472354-b33ff0c44a43", 1200, 675),
    og: photo("photo-1560472354-b33ff0c44a43", 1200, 630),
    inline: [photo("photo-1516321497487-e288fb19713f", 960, 540)],
    alt: "Estratégia de tráfego pago e SEO orgânico no Google",
  },
  "landing-page-captacao-leads-elementos": {
    featured: photo("photo-1498050108023-c5249f4df085", 1200, 675),
    og: photo("photo-1498050108023-c5249f4df085", 1200, 630),
    inline: [photo("photo-1516321497487-e288fb19713f", 960, 540)],
    alt: "Landing page otimizada para captação de leads",
  },
};

const FALLBACK = BLOG_IMAGE_REGISTRY["como-estruturar-campanhas-google-ads"];

export function getBlogImages(slug: string): BlogImageSet {
  return BLOG_IMAGE_REGISTRY[slug] ?? FALLBACK;
}

export function blogFeatured(slug: string): string {
  return getBlogImages(slug).featured;
}

export function blogOg(slug: string): string {
  return getBlogImages(slug).og;
}

export function blogInline(slug: string, index = 0): string {
  const set = getBlogImages(slug);
  return set.inline[index] ?? set.featured;
}

export function blogImageAlt(slug: string): string {
  return getBlogImages(slug).alt;
}

/** @deprecated Use blogFeatured, blogOg ou blogInline */
export function blogImage(slug: string, kind: "featured" | "og" | "diagrams" = "featured"): string {
  if (kind === "og") return blogOg(slug);
  if (kind === "diagrams") return blogInline(slug, 1);
  return blogFeatured(slug);
}

export function blogThumbnail(slug: string): string {
  const featured = getBlogImages(slug).featured;
  return featured.replace(/w=\d+&h=\d+/, "w=400&h=225");
}

/** Valida todas as URLs do registro (útil em scripts de CI). */
export async function validateBlogImages(): Promise<string[]> {
  const urls = new Set<string>();
  for (const set of Object.values(BLOG_IMAGE_REGISTRY)) {
    urls.add(set.featured);
    urls.add(set.og);
    for (const inline of set.inline) urls.add(inline);
  }

  const broken: string[] = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: "HEAD", redirect: "follow" });
      if (!res.ok) broken.push(url);
    } catch {
      broken.push(url);
    }
  }
  return broken;
}
