import type { ProposalDemandKeyword, ProposalLandingMockup } from "../types";

export function buildDemandKeywords(input: {
  companyName: string;
  opportunityText?: string;
  bullets?: string[];
}): ProposalDemandKeyword[] {
  const corpus = [
    input.companyName,
    input.opportunityText ?? "",
    ...(input.bullets ?? []),
  ]
    .join(" ")
    .toLowerCase();

  const templates: Array<{ pattern: RegExp; keywords: ProposalDemandKeyword[] }> = [
    {
      pattern: /seguro|corretor|plano de sa[uú]de|cons[oó]rcio/i,
      keywords: [
        { keyword: "seguro auto", volume: 2400, competition: "medium" },
        { keyword: "plano de saúde", volume: 1900, competition: "high" },
        { keyword: "corretora seguros", volume: 880, competition: "low" },
        { keyword: "consórcio automóvel", volume: 720, competition: "medium" },
        { keyword: "seguro residencial", volume: 590, competition: "low" },
      ],
    },
    {
      pattern: /cl[ií]nica|odont|dent|sa[uú]de|m[eé]dico/i,
      keywords: [
        { keyword: "clínica odontológica", volume: 1600, competition: "medium" },
        { keyword: "dentista", volume: 3200, competition: "high" },
        { keyword: "implante dentário", volume: 1100, competition: "medium" },
        { keyword: "harmonização facial", volume: 980, competition: "high" },
        { keyword: "clínica estética", volume: 740, competition: "medium" },
      ],
    },
    {
      pattern: /curso|faculdade|matr[ií]cula|educa|ensino/i,
      keywords: [
        { keyword: "curso superior", volume: 2100, competition: "high" },
        { keyword: "faculdade ead", volume: 1800, competition: "medium" },
        { keyword: "matrícula faculdade", volume: 920, competition: "medium" },
        { keyword: "vestibular", volume: 1400, competition: "high" },
        { keyword: "pós graduação", volume: 680, competition: "low" },
      ],
    },
    {
      pattern: /restaurante|delivery|comida|bar|caf[eé]/i,
      keywords: [
        { keyword: "restaurante", volume: 2800, competition: "high" },
        { keyword: "delivery comida", volume: 1500, competition: "medium" },
        { keyword: "almoço executivo", volume: 620, competition: "low" },
        { keyword: "reservar mesa", volume: 480, competition: "low" },
        { keyword: "cardápio online", volume: 390, competition: "low" },
      ],
    },
  ];

  for (const template of templates) {
    if (template.pattern.test(corpus)) {
      return template.keywords;
    }
  }

  const base = input.companyName.split(/\s+/)[0] || "serviço";
  return [
    { keyword: `${base} perto de mim`, volume: 1200, competition: "medium" },
    { keyword: `melhor ${base}`, volume: 880, competition: "high" },
    { keyword: `${base} preço`, volume: 640, competition: "low" },
    { keyword: `${base} avaliações`, volume: 520, competition: "low" },
    { keyword: `contratar ${base}`, volume: 410, competition: "medium" },
  ];
}

export function buildLandingMockup(input: {
  companyName: string;
  heroTitle: string;
  heroSubtitle?: string;
}): ProposalLandingMockup {
  const shortName = input.companyName.split(/\s+/).slice(0, 2).join(" ");
  return {
    headline: input.heroTitle.includes(shortName)
      ? input.heroTitle
      : `${shortName} — ${input.heroTitle.replace(/^Projeto de Aceleração — /, "")}`,
    subheadline:
      input.heroSubtitle ??
      "Solução especializada para quem busca resultado com confiança e atendimento próximo.",
    ctaLabel: "Falar no WhatsApp",
  };
}
