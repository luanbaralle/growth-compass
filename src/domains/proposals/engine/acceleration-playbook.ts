import type { CopilotMeetingArtifact } from "@/domains/copilot/meeting/types";
import type { CopilotSessionSnapshot } from "@/domains/copilot/types";
import type { OSCommercialDefaults } from "@/domains/settings/types";
import type {
  ProposalAssetMode,
  ProposalCommercialPipelineStep,
  ProposalContent,
  ProposalDiagnosisCard,
  ProposalFunnelStep,
  ProposalMovement,
  ProposalPricingTier,
} from "../types";
import { R1_ACCELERATION_PRICING } from "../pricing/r1-pricing";

export interface AccelerationPlaybookParams {
  assetMode: ProposalAssetMode;
  hasCapacityConstraint: boolean;
  capacityNote?: string;
  hasSocialPresence: boolean;
  includeMetaNow: boolean;
  companyName: string;
  constraintText?: string;
  mainProblem?: string;
  opportunityText?: string;
}

function buildCorpus(artifact: CopilotMeetingArtifact): string {
  const graph = artifact.evidence_graph ?? [];
  const learned = artifact.what_we_learned ?? [];
  const diagnosis = artifact.diagnosis as Record<string, unknown>;
  return [
    graph.map((item) => `${item.label} ${item.value}`).join(" "),
    learned.join(" "),
    String(diagnosis.situation ?? ""),
    String(diagnosis.mainProblem ?? ""),
    String(diagnosis.constraint ?? ""),
    String(diagnosis.opportunity ?? ""),
    artifact.transcript_summary ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

export function inferAccelerationPlaybookParams(input: {
  artifact: CopilotMeetingArtifact;
  companyName: string;
}): AccelerationPlaybookParams {
  const { artifact, companyName } = input;
  const corpus = buildCorpus(artifact);
  const diagnosis = artifact.diagnosis as Record<string, unknown>;
  const constraintText = String(diagnosis.constraint ?? "").trim() || undefined;
  const mainProblem = String(diagnosis.mainProblem ?? "").trim() || undefined;
  const opportunityText = String(diagnosis.opportunity ?? "").trim() || undefined;

  const existingLpSignals =
    /lp\s+(j[aá]|pronta|existente|nova|quase)|landing\s+(j[aá]|pronta|existente|nova)|p[aá]gina\s+(j[aá]|pronta|existente)|j[aá]\s+(tem|possui|recebe).*(lp|landing|p[aá]gina)|ma[ií]ra|designer|terceir/.test(
      corpus,
    );
  const newLpSignals =
    /desenvolv(er|imento)\s+(de\s+)?(lp|landing|p[aá]gina|site)|criar\s+(lp|landing|p[aá]gina|site)|nova\s+landing\s+page/.test(
      corpus,
    );

  let assetMode: ProposalAssetMode = "new_lp";
  if (existingLpSignals && !/desenvolv.*landing.*do zero/.test(corpus)) {
    assetMode = "existing_lp";
  } else if (/sem\s+(lp|landing|site)|n[aã]o\s+tem\s+(site|lp)/.test(corpus)) {
    assetMode = "no_lp";
  } else if (newLpSignals) {
    assetMode = "new_lp";
  }

  const hasCapacityConstraint =
    Boolean(constraintText) &&
    /capacidade|atend|lead|volume|equipe|comercial|dia|absorv/.test(
      `${constraintText} ${corpus}`.toLowerCase(),
    );

  const hasSocialPresence = /instagram|rede\s+social|perfil|bio|destaque/.test(corpus);
  const includeMetaNow =
    /meta\s+ads|facebook\s+ads|instagram\s+ads/.test(corpus) &&
    !/depois|futuro|etapa\s+3|n[aã]o\s+agora|posterior/.test(corpus);

  return {
    assetMode,
    hasCapacityConstraint,
    capacityNote: constraintText,
    hasSocialPresence,
    includeMetaNow,
    companyName,
    constraintText,
    mainProblem,
    opportunityText,
  };
}

function lpDeliverable(assetMode: ProposalAssetMode): string {
  if (assetMode === "existing_lp") {
    return "Validação técnica e instrumentação da landing page existente";
  }
  if (assetMode === "new_lp") {
    return "Landing page de conversão";
  }
  return "Página de conversão (a definir no kick-off)";
}

function structureDeliverables(params: AccelerationPlaybookParams): string[] {
  const items = [
    params.hasSocialPresence
      ? "Organização da presença digital (Instagram, bio, CTA, alinhamento com Google e LP)"
      : "Organização da presença digital mínima (Google + LP + pontos de contato)",
    lpDeliverable(params.assetMode),
    "Google Tag Manager, GA4, eventos e conversões configurados",
    "Padronização de UTMs e nomenclatura de origem dos leads",
  ];
  if (params.assetMode === "new_lp") {
    items.push("Domínio e hospedagem (quando aplicável)");
  }
  return items;
}

function acquisitionDeliverables(params: AccelerationPlaybookParams): string[] {
  return [
    "Configuração Google Ads (Search)",
    "Campanhas por intenção de busca — produtos prioritários definidos no diagnóstico",
    "Gestão, otimização e controle de orçamento",
    "Acompanhamento de termos de pesquisa e qualidade do tráfego",
    params.hasCapacityConstraint
      ? "Controle de volume alinhado à capacidade comercial da operação"
      : "Monitoramento de volume e qualidade dos leads gerados",
  ];
}

function commercialDeliverables(): string[] {
  return [
    "Estrutura mínima de registro de leads (origem, produto, status, responsável)",
    "Definição do funil comercial mensurável",
    "Orientação de atendimento e qualificação",
    "Acompanhamento da qualidade dos leads recebidos",
  ];
}

function strategicDeliverables(): string[] {
  return [
    "Reuniões de acompanhamento estratégico",
    "Leitura dos indicadores e análise dos leads",
    "Recomendações de otimização e próximos testes",
    "Planejamento da próxima etapa com base em dados reais",
  ];
}

export function buildPhase1Deliverables(params: AccelerationPlaybookParams): string[] {
  return [
    ...structureDeliverables(params).map((item) => `Estrutura: ${item}`),
    ...acquisitionDeliverables(params).map((item) => `Aquisição: ${item}`),
    ...commercialDeliverables().map((item) => `Comercial: ${item}`),
    ...strategicDeliverables().map((item) => `Estratégia: ${item}`),
  ];
}

export function buildMovements(params: AccelerationPlaybookParams): ProposalMovement[] {
  return [
    {
      number: "01",
      title: "Estruturar",
      subtitle: "Organizar presença digital + tracking + LP + mensuração",
      duration: "Semanas 1 – 2",
      objective: "Preparar a infraestrutura mensurável de aquisição.",
      deliverables: structureDeliverables(params),
    },
    {
      number: "02",
      title: "Validar",
      subtitle: "Google Ads + primeiros leads + acompanhamento comercial",
      duration: "Semanas 3 – 8",
      objective: "Provar o primeiro canal de aquisição com dados reais.",
      deliverables: [
        ...acquisitionDeliverables(params),
        ...commercialDeliverables(),
        ...strategicDeliverables(),
      ],
    },
    {
      number: "03",
      title: "Escalar",
      subtitle: "CRM + LPs específicas + remarketing + Meta + novos produtos",
      duration: "Após validação (30–60 dias)",
      objective: "Expandir o ecossistema de conversão orientado pelos dados da fase anterior.",
      deliverables: [
        "Landing pages específicas por produto/intenção",
        "Remarketing e audiências contextualizadas",
        "Meta Ads (quando houver base de tráfego e mensagens validadas)",
        "CRM ou automações comerciais (quando o volume justificar)",
        "Expansão para novos produtos e canais prioritários",
      ],
      conditional: true,
    },
  ];
}

export function buildDiagnosisCards(input: {
  params: AccelerationPlaybookParams;
  session: CopilotSessionSnapshot;
  artifact: CopilotMeetingArtifact;
}): ProposalDiagnosisCard[] {
  const { params, session, artifact } = input;
  const diagnosis = artifact.diagnosis as Record<string, unknown>;
  const cards: ProposalDiagnosisCard[] = [];

  const situation = String(diagnosis.situation ?? artifact.transcript_summary ?? "").trim();
  if (situation) {
    cards.push({
      label: "Situação atual",
      value: situation.slice(0, 80) + (situation.length > 80 ? "…" : ""),
      description: situation,
    });
  }
  if (params.mainProblem) {
    cards.push({
      label: "Principal desafio",
      value: params.mainProblem.slice(0, 72) + (params.mainProblem.length > 72 ? "…" : ""),
      description: params.mainProblem,
    });
  }
  if (params.hasCapacityConstraint && params.capacityNote) {
    cards.push({
      label: "Capacidade comercial",
      value: "Volume controlado",
      description: params.capacityNote,
    });
  }
  if (params.opportunityText) {
    cards.push({
      label: "Oportunidade",
      value: "Demanda identificável",
      description: params.opportunityText,
    });
  }

  return cards.slice(0, 5);
}

export function buildCommercialPipeline(): ProposalCommercialPipelineStep[] {
  return [
    { title: "Pesquisa no Google", description: "Cliente busca solução com intenção ativa", metricLabel: "Impressões / cliques" },
    { title: "Anúncio", description: "Captura da demanda qualificada", metricLabel: "CTR / CPC" },
    { title: "Landing page", description: "Proposta de valor e prova social", metricLabel: "Taxa de conversão" },
    { title: "WhatsApp / Formulário", description: "Contato de baixo atrito", metricLabel: "Leads gerados" },
    { title: "Registro do lead", description: "Origem, produto e responsável", metricLabel: "CPL" },
    { title: "Atendimento", description: "Qualidade define a escolha", metricLabel: "Taxa de contato" },
    { title: "Qualificação", description: "Fit comercial e capacidade", metricLabel: "Leads qualificados" },
    { title: "Proposta", description: "Apresentação comercial", metricLabel: "Taxa de proposta" },
    { title: "Venda", description: "Fechamento e receita", metricLabel: "CAC / ROI" },
  ];
}

export function buildMetricsToTrack(params: AccelerationPlaybookParams): string[] {
  const base = [
    "Cliques e impressões (Google Ads)",
    "Leads recebidos e custo por lead (CPL)",
    "Produto de interesse e origem do lead",
    "Leads contatados e qualificados",
    "Propostas enviadas e vendas fechadas",
  ];
  if (params.hasCapacityConstraint) {
    base.push("Capacidade comercial vs. volume de leads (controle de ritmo)");
  }
  base.push("Receita atribuída ao canal (quando dados estiverem disponíveis)");
  return base;
}

export function buildStrategicGuidance(params: AccelerationPlaybookParams): string[] {
  return [
    "A R1 atua como parceira de estruturação — não apenas gestora de tráfego.",
    "Reuniões de acompanhamento com leitura dos indicadores e feedback sobre qualidade dos leads.",
    "Orientação comercial e definição dos próximos testes com base no funil real.",
    params.hasCapacityConstraint
      ? "Volume de leads calibrado à capacidade de atendimento — priorizamos qualificação, não volume cego."
      : "Funil comercial mensurável desde o primeiro ciclo.",
    "Ainda não projetamos ROI financeiro detalhado — o primeiro ciclo existe para criar essa base de dados.",
  ];
}

export function buildExclusions(params: AccelerationPlaybookParams): string[] {
  const items = [
    "Produção recorrente de conteúdo em escala",
    "Gestão completa de redes sociais",
    "Remarketing avançado e campanhas PMax",
    "Múltiplas landing pages por produto (etapa posterior)",
    "Implantação de CRM robusto ou automações complexas",
    "Campanhas simultâneas para todos os produtos",
  ];
  if (!params.includeMetaNow) {
    items.splice(2, 0, "Meta Ads (Facebook/Instagram) nesta fase inicial");
  }
  return items;
}

export function buildExpansionOpportunities(params: AccelerationPlaybookParams): string[] {
  const items = [
    "Landing pages específicas por produto e intenção de busca",
    "Remarketing contextualizado por interesse",
    "CRM e automações comerciais quando o volume justificar",
    "Expansão para novos produtos prioritários identificados nos dados",
    "Conteúdo estratégico recorrente para credibilidade e autoridade",
  ];
  if (!params.includeMetaNow) {
    items.unshift("Meta Ads após validação do Google e mensagens comprovadas");
  }
  return items;
}

export function buildAccelerationFunnel(params: AccelerationPlaybookParams): ProposalFunnelStep[] {
  return [
    { title: "Surge a necessidade", description: "O cliente ideal reconhece um problema ou desejo" },
    { title: "Pesquisa no Google", description: "Busca ativa por solução na região ou categoria" },
    { title: "Clica no anúncio", description: "Captura da intenção de compra no momento certo" },
    {
      title: params.assetMode === "existing_lp" ? "Landing page existente" : "Landing de conversão",
      description:
        params.assetMode === "existing_lp"
          ? "Validação da LP como laboratório de aquisição"
          : "Proposta clara com CTA de contato",
    },
    { title: "Solicita contato", description: "WhatsApp ou formulário com origem rastreada" },
    { title: "Atendimento comercial", description: "Qualificação e proposta — gargalo frequentemente aqui" },
    { title: "Converte", description: "Nova venda registrada com produto e origem" },
  ];
}

export function buildMechanismFlow(params: AccelerationPlaybookParams): string[] {
  const lpLabel =
    params.assetMode === "existing_lp" ? "LP instrumentada" : "Landing page";
  return ["Google Ads", lpLabel, "WhatsApp / Formulário", "Registro do lead", "Atendimento comercial", "Venda"];
}

export function buildAccelerationPricing(
  params: AccelerationPlaybookParams,
  commercial?: OSCommercialDefaults,
): ProposalPricingTier[] {
  const lpItem = lpDeliverable(params.assetMode);

  return R1_ACCELERATION_PRICING.map((tier) => {
    const amountLabel =
      tier.id === "implementation"
        ? (commercial?.implementationAmount ?? tier.amountLabel)
        : tier.id === "media"
          ? (commercial?.mediaAmount ?? tier.amountLabel)
          : tier.id === "management"
            ? (commercial?.managementAmount ?? tier.amountLabel)
            : tier.amountLabel;

    if (tier.id === "implementation") {
      return {
        ...tier,
        amountLabel,
        subtitle: "Pagamento único · Setup",
        items: [
          "Planejamento estratégico e kick-off",
          lpItem,
          "Google Tag Manager + GA4 + eventos de conversão",
          "Configuração Google Ads (Search)",
          "UTMs, conversões e validação técnica",
          "Primeiro ciclo operacional (30 dias)",
        ],
        note: "Investimento de implementação — estrutura mensurável antes da mensalidade recorrente.",
      };
    }
    if (tier.id === "media") {
      return {
        ...tier,
        amountLabel,
        subtitle: "Mensal · Google (verba de mídia)",
        note: "Verba paga diretamente ao Google. Faixa ajustável conforme diagnóstico e capacidade comercial.",
      };
    }
    if (tier.id === "management") {
      return {
        ...tier,
        amountLabel,
        subtitle: "Mensal · Gestão + consultoria",
        items: [
          "Gestão e otimização das campanhas",
          "Reuniões de acompanhamento estratégico",
          "Análise de leads e recomendações comerciais",
          "Relatórios e planejamento da próxima etapa",
        ],
        note: "Continuidade após validação do primeiro ciclo — inclui mentoria, não só operação.",
      };
    }
    return { ...tier, amountLabel };
  });
}

export function buildPositioningStatement(params: AccelerationPlaybookParams): string {
  return `Não prometemos volume de leads sem base de dados. Vamos construir a infraestrutura mensurável de aquisição da ${params.companyName}, ativar o primeiro canal, medir o funil comercial real e decidir onde escalar com base nos números.`;
}

export function buildPhase1Objective(params: AccelerationPlaybookParams): string {
  return `Criar a primeira infraestrutura mensurável de aquisição da ${params.companyName} e validar a capacidade do Google de gerar oportunidades comerciais qualificadas — respeitando a capacidade real de atendimento.`;
}

/** Preenche campos do playbook em propostas antigas ou enriquecidas só via LLM. */
export function ensureAccelerationPlaybookBackfill(input: {
  content: ProposalContent;
  companyName: string;
  template: "acceleration" | "custom_solution";
}): ProposalContent {
  if (input.template !== "acceleration") return input.content;

  const params: AccelerationPlaybookParams = {
    assetMode: input.content.playbookParams?.assetMode ?? "new_lp",
    hasCapacityConstraint: input.content.playbookParams?.hasCapacityConstraint ?? false,
    hasSocialPresence: true,
    includeMetaNow: false,
    companyName: input.companyName,
  };

  return {
    ...input.content,
    positioningStatement: input.content.positioningStatement ?? buildPositioningStatement(params),
    phase1Objective: input.content.phase1Objective ?? buildPhase1Objective(params),
    movements: input.content.movements?.length ? input.content.movements : buildMovements(params),
    commercialPipeline: input.content.commercialPipeline?.length
      ? input.content.commercialPipeline
      : buildCommercialPipeline(),
    metricsToTrack: input.content.metricsToTrack?.length
      ? input.content.metricsToTrack
      : buildMetricsToTrack(params),
    strategicGuidance: input.content.strategicGuidance?.length
      ? input.content.strategicGuidance
      : buildStrategicGuidance(params),
    exclusions: input.content.exclusions?.length ? input.content.exclusions : buildExclusions(params),
    expansionOpportunities: input.content.expansionOpportunities?.length
      ? input.content.expansionOpportunities
      : buildExpansionOpportunities(params),
    funnelSteps: input.content.funnelSteps?.length
      ? input.content.funnelSteps
      : buildAccelerationFunnel(params),
    mechanismFlow: input.content.mechanismFlow?.length
      ? input.content.mechanismFlow
      : buildMechanismFlow(params),
    playbookParams: input.content.playbookParams ?? {
      assetMode: params.assetMode,
      hasCapacityConstraint: params.hasCapacityConstraint,
    },
  };
}

export function applyAccelerationPlaybook(input: {
  content: ProposalContent;
  params: AccelerationPlaybookParams;
  session: CopilotSessionSnapshot;
  artifact: CopilotMeetingArtifact;
  commercial?: OSCommercialDefaults;
}): ProposalContent {
  const { content, params, session, artifact, commercial } = input;

  return {
    ...content,
    positioningStatement: content.positioningStatement ?? buildPositioningStatement(params),
    phase1Objective: content.phase1Objective ?? buildPhase1Objective(params),
    diagnosisCards: content.diagnosisCards ?? buildDiagnosisCards({ params, session, artifact }),
    movements: content.movements ?? buildMovements(params),
    commercialPipeline: content.commercialPipeline ?? buildCommercialPipeline(),
    metricsToTrack: content.metricsToTrack ?? buildMetricsToTrack(params),
    strategicGuidance: content.strategicGuidance ?? buildStrategicGuidance(params),
    exclusions: content.exclusions ?? buildExclusions(params),
    expansionOpportunities: content.expansionOpportunities ?? buildExpansionOpportunities(params),
    funnelSteps: content.funnelSteps ?? buildAccelerationFunnel(params),
    mechanismFlow: content.mechanismFlow ?? buildMechanismFlow(params),
    pricing: content.pricing ?? buildAccelerationPricing(params, commercial),
    playbookParams: content.playbookParams ?? {
      assetMode: params.assetMode,
      hasCapacityConstraint: params.hasCapacityConstraint,
    },
  };
}

export function buildAccelerationSectionOverrides(input: {
  params: AccelerationPlaybookParams;
  diagnosis: Record<string, unknown>;
  opportunityNarrative: string;
  engagementStrategy?: string;
}): Partial<
  Record<
    string,
    { narrative: string; bullets: string[]; editorNotes?: string }
  >
> {
  const { params, diagnosis, opportunityNarrative, engagementStrategy } = input;
  const lpNarrative =
    params.assetMode === "existing_lp"
      ? "A landing page existente vira o primeiro laboratório de aquisição — instrumentamos, validamos e medimos antes de expandir o ecossistema."
      : "Sistema integrado: captura de demanda → landing → WhatsApp/formulário → registro → atendimento comercial.";

  return {
    mechanism: {
      narrative: lpNarrative,
      bullets: buildMechanismFlow(params),
    },
    strategy: {
      narrative:
        engagementStrategy ??
        `A R1 iniciará a aquisição pelos produtos prioritários definidos no diagnóstico — considerando intenção de busca, potencial comercial, rentabilidade e capacidade de atendimento. ${opportunityNarrative}`.trim(),
      bullets: buildStrategicGuidance(params),
    },
    deliverables: {
      narrative:
        "Fase 1 — Estruturação e Validação de Demanda. Escopo dividido em estrutura, aquisição, comercial e estratégia.",
      bullets: buildPhase1Deliverables(params),
      editorNotes: "Revise entregáveis após auditoria comercial — Copilot gera rascunho.",
    },
    validation: {
      narrative:
        "O primeiro ciclo (30–60 dias) existe para criar a base de dados — ainda não projetamos ROI financeiro detalhado.",
      bullets: buildMetricsToTrack(params),
    },
    implementation: {
      narrative: "Três movimentos sequenciais — escala só após validação com dados reais.",
      bullets: buildMovements(params).map((m) =>
        m.conditional ? `${m.title} (condicional): ${m.subtitle}` : `${m.title}: ${m.subtitle}`,
      ),
    },
    investment: {
      narrative:
        "Investimento desagregado: implementação (setup único), mídia Google (mensal) e continuidade (gestão + consultoria).",
      bullets: [],
      editorNotes: "Valores editáveis em Configurações OS ou na proposta.",
    },
    diagnosis: {
      narrative: String(diagnosis.situation ?? ""),
      bullets: [
        params.mainProblem ? `Principal problema: ${params.mainProblem}` : "",
        params.hasCapacityConstraint && params.capacityNote
          ? `Restrição operacional: ${params.capacityNote}`
          : diagnosis.constraint
            ? `Restrição: ${String(diagnosis.constraint)}`
            : "",
        buildPositioningStatement(params),
      ].filter(Boolean),
    },
  };
}
