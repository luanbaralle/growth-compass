import type { Case } from "@/types/case";

/**
 * Gera um Case com placeholders para bootstrap do template.
 * Substituir campos TODO ao preencher conteúdo definitivo.
 */
export function createPlaceholderCase(
  slug: string,
  title: string,
  overrides: Partial<Case> = {},
): Case {
  return {
    slug,
    title,
    subtitle: `TODO: Subtítulo — ${title}`,
    client: `TODO: Cliente — ${title}`,
    industry: "TODO: Indústria",
    category: "TODO: Categoria",
    year: 2024,
    website: undefined,
    coverImage: "/images/cases/placeholder-cover.jpg",
    heroImage: "/images/cases/placeholder-hero.jpg",
    description: "TODO: Descrição geral do projeto.",
    challenge: "TODO: Descrever o desafio do cliente.",
    solution: "TODO: Descrever a solução implementada.",
    goals: ["TODO: Objetivo 1", "TODO: Objetivo 2", "TODO: Objetivo 3"],
    deliverables: ["TODO: Entregável 1", "TODO: Entregável 2", "TODO: Entregável 3"],
    technologies: ["TODO: Tecnologia 1", "TODO: Tecnologia 2"],
    gallery: [
      { src: "/images/cases/placeholder-gallery-1.jpg", alt: "TODO: Galeria 1" },
      { src: "/images/cases/placeholder-gallery-2.jpg", alt: "TODO: Galeria 2" },
      { src: "/images/cases/placeholder-gallery-3.jpg", alt: "TODO: Galeria 3" },
    ],
    colors: [
      { name: "TODO: Primary", hex: "#000000" },
      { name: "TODO: Secondary", hex: "#ffffff" },
    ],
    typography: {
      heading: "TODO: Fonte heading",
      body: "TODO: Fonte body",
    },
    metrics: [
      { value: "TODO", label: "Métrica 1" },
      { value: "TODO", label: "Métrica 2" },
      { value: "TODO", label: "Métrica 3" },
    ],
    testimonial: {
      quote: "TODO: Depoimento do cliente sobre o projeto.",
      author: "TODO: Nome do autor",
      role: "TODO: Cargo",
    },
    process: [
      { phase: "01", title: "TODO: Descoberta", description: "TODO: Descrição da fase de descoberta." },
      { phase: "02", title: "TODO: Estratégia", description: "TODO: Descrição da fase de estratégia." },
      { phase: "03", title: "TODO: Execução", description: "TODO: Descrição da fase de execução." },
      { phase: "04", title: "TODO: Resultados", description: "TODO: Descrição da fase de resultados." },
    ],
    beforeAfter: [
      {
        label: "TODO: Comparativo",
        before: { src: "/images/cases/placeholder-before.jpg", alt: "TODO: Antes" },
        after: { src: "/images/cases/placeholder-after.jpg", alt: "TODO: Depois" },
      },
    ],
    nextProjects: [],
    ...overrides,
  };
}
