import type { BlogCategoryMeta } from "@/lib/blog/types";

export const blogSeo = {
  title: "Blog — Insights de Growth | Raise One",
  description:
    "Artigos, guias e comparativos sobre Google Ads, Meta Ads, SEO, IA, tecnologia e crescimento. Conteúdo prático para empresas que querem escalar.",
};

export const blogCategories: BlogCategoryMeta[] = [
  { id: "all", label: "Todos", description: "Todo o conteúdo Raise One" },
  {
    id: "insights",
    label: "Insights",
    description: "Análises e tendências de growth e marketing",
  },
  {
    id: "google-ads",
    label: "Google Ads",
    description: "Aquisição, campanhas e otimização no Google",
  },
  {
    id: "meta-ads",
    label: "Meta Ads",
    description: "Instagram, Facebook e geração de demanda",
  },
  {
    id: "seo",
    label: "SEO",
    description: "Busca orgânica e visibilidade local",
  },
  {
    id: "ia",
    label: "IA",
    description: "Inteligência artificial aplicada ao crescimento",
  },
  {
    id: "tecnologia",
    label: "Tecnologia",
    description: "CRM, automações, dashboards e plataformas",
  },
  {
    id: "imobiliario",
    label: "Mercado Imobiliário",
    description: "Marketing e tecnologia para o setor imobiliário",
  },
  {
    id: "growth",
    label: "Growth",
    description: "Estratégia, funis e escala de negócios",
  },
];
