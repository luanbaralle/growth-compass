import type { ProjectPriority } from "../types";
import type { ChecklistItemDef, WorkflowTemplateDefinition } from "./types";

const onboardingInfoChecklist: ChecklistItemDef[] = [
  { id: "info_operacao", label: "Dados da operação", done: false, group: "INFORMAÇÕES" },
  { id: "info_horarios", label: "Horários", done: false, group: "INFORMAÇÕES" },
  { id: "info_capacidade", label: "Capacidade", done: false, group: "INFORMAÇÕES" },
  { id: "info_disponibilidade", label: "Disponibilidade", done: false, group: "INFORMAÇÕES" },
  { id: "info_comercial", label: "Condições comerciais", done: false, group: "INFORMAÇÕES" },
  { id: "info_regras", label: "Regras", done: false, group: "INFORMAÇÕES" },
  { id: "info_servicos", label: "Serviços", done: false, group: "INFORMAÇÕES" },
  { id: "info_diferenciais", label: "Diferenciais", done: false, group: "INFORMAÇÕES" },
];

const onboardingAccessChecklist: ChecklistItemDef[] = [
  { id: "access_ads", label: "Google Ads", done: false, group: "ACESSOS" },
  { id: "access_gbp", label: "Google Business Profile", done: false, group: "ACESSOS" },
  { id: "access_domain", label: "Domínio", done: false, group: "ACESSOS" },
  { id: "access_hosting", label: "Hospedagem", done: false, group: "ACESSOS" },
  { id: "access_analytics", label: "Analytics", done: false, group: "ACESSOS" },
  { id: "access_gtm", label: "Tag Manager", done: false, group: "ACESSOS" },
  { id: "access_other", label: "Outros", done: false, group: "ACESSOS" },
];

const onboardingMaterialsChecklist: ChecklistItemDef[] = [
  { id: "mat_logo", label: "Logo", done: false, group: "MATERIAIS" },
  { id: "mat_photos", label: "Fotos existentes", done: false, group: "MATERIAIS" },
  { id: "mat_videos", label: "Vídeos existentes", done: false, group: "MATERIAIS" },
  { id: "mat_texts", label: "Textos", done: false, group: "MATERIAIS" },
  { id: "mat_commercial", label: "Informações comerciais", done: false, group: "MATERIAIS" },
];

const productionChecklist: ChecklistItemDef[] = [
  { id: "prod_date", label: "Data da captação", done: false, group: "PRODUÇÃO" },
  { id: "prod_script", label: "Roteiro", done: false, group: "PRODUÇÃO" },
  { id: "prod_photos", label: "Fotos", done: false, group: "PRODUÇÃO" },
  { id: "prod_video", label: "Vídeo", done: false, group: "PRODUÇÃO" },
  { id: "prod_approval", label: "Aprovação", done: false, group: "PRODUÇÃO" },
];

function task(
  key: string,
  title: string,
  opts: {
    description?: string;
    priority?: ProjectPriority;
    assignee?: "luan" | "vini" | "caio";
    recurring?: boolean;
    waitingClient?: boolean;
    checklist?: ChecklistItemDef[];
    dependsOn?: string[];
    blocksPhase?: boolean;
  } = {},
) {
  return {
    key,
    title,
    description: opts.description ?? null,
    defaultPriority: opts.priority ?? ("medium" as ProjectPriority),
    defaultAssigneeId: opts.assignee ?? null,
    isRecurring: opts.recurring ?? false,
    blocksPhaseCompletion: opts.blocksPhase ?? true,
    waitingClientDefault: opts.waitingClient ?? false,
    checklist: opts.checklist ?? [],
    dependsOnTaskKeys: opts.dependsOn ?? [],
  };
}

/** Template padrão — fonte da verdade tipada (seed via ensureTemplate). */
export const AQUISICAO_DIGITAL_TEMPLATE: WorkflowTemplateDefinition = {
  slug: "projeto-aquisicao-digital",
  name: "Projeto de Aquisição Digital",
  description:
    "Workflow operacional completo: formalização → onboarding → produção → estrutura digital → mensuração → aquisição → gestão → otimização.",
  phases: [
    {
      key: "formalization",
      name: "Formalização",
      objective: "Transformar o aceite comercial em projeto oficialmente iniciado.",
      isRecurring: false,
      completionCriteria: "Contrato formalizado + implantação confirmada.",
      projectStatusOnEnter: "formalization",
      deliverables: ["Contrato formalizado", "Implantação confirmada"],
      tasks: [
        task("confirm_acceptance", "Confirmar aceite"),
        task("send_contract", "Enviar contrato", { dependsOn: ["confirm_acceptance"] }),
        task("formalize_project", "Formalizar projeto", { dependsOn: ["send_contract"] }),
        task("confirm_setup_payment", "Confirmar pagamento da implantação", {
          waitingClient: true,
          dependsOn: ["formalize_project"],
        }),
        task("register_project_start", "Registrar início do projeto", {
          dependsOn: ["confirm_setup_payment"],
        }),
      ],
    },
    {
      key: "onboarding",
      name: "Onboarding",
      objective: "Coletar informações, acessos e materiais necessários.",
      isRecurring: false,
      completionCriteria: "Briefing aprovado.",
      projectStatusOnEnter: "onboarding",
      deliverables: ["Briefing aprovado"],
      tasks: [
        task("send_briefing", "Enviar briefing"),
        task("receive_briefing", "Receber briefing", {
          waitingClient: true,
          dependsOn: ["send_briefing"],
          checklist: onboardingInfoChecklist,
        }),
        task("request_accesses", "Solicitar acessos", {
          checklist: onboardingAccessChecklist,
        }),
        task("receive_accesses", "Receber acessos", {
          waitingClient: true,
          dependsOn: ["request_accesses"],
        }),
        task("organize_materials", "Organizar materiais existentes", {
          checklist: onboardingMaterialsChecklist,
        }),
        task("identify_pendencies", "Identificar pendências", {
          dependsOn: ["receive_briefing", "receive_accesses", "organize_materials"],
        }),
      ],
    },
    {
      key: "content_production",
      name: "Produção de conteúdo",
      objective: "Criar os materiais comerciais necessários.",
      isRecurring: false,
      completionCriteria: "Fotos, vídeo e materiais derivados aprovados.",
      projectStatusOnEnter: "in_progress",
      deliverables: ["Fotos", "Vídeo", "Materiais derivados"],
      tasks: [
        task("define_capture_script", "Definir roteiro de captação", {
          checklist: productionChecklist.filter((c) => c.id === "prod_script"),
        }),
        task("schedule_capture", "Agendar captação", {
          dependsOn: ["define_capture_script"],
          checklist: productionChecklist.filter((c) => c.id === "prod_date"),
        }),
        task("capture_photos", "Captar fotos", { dependsOn: ["schedule_capture"] }),
        task("capture_video", "Captar vídeo", { dependsOn: ["schedule_capture"] }),
        task("select_materials", "Selecionar materiais", {
          dependsOn: ["capture_photos", "capture_video"],
        }),
        task("approve_materials", "Aprovar materiais", {
          waitingClient: true,
          dependsOn: ["select_materials"],
        }),
        task("organize_final_files", "Organizar arquivos finais", {
          dependsOn: ["approve_materials"],
        }),
      ],
    },
    {
      key: "digital_structure",
      name: "Estrutura digital",
      objective: "Construir a presença digital necessária para aquisição.",
      isRecurring: false,
      completionCriteria: "Landing page publicada.",
      projectStatusOnEnter: "in_progress",
      deliverables: ["Landing page publicada"],
      tasks: [
        task("define_lp_architecture", "Definir arquitetura da landing page"),
        task("create_copy", "Criar copy", { dependsOn: ["define_lp_architecture"] }),
        task("develop_landing_page", "Desenvolver landing page", {
          dependsOn: ["create_copy", "organize_final_files"],
        }),
        task("configure_domain", "Configurar domínio"),
        task("configure_cta", "Configurar CTA", { dependsOn: ["develop_landing_page"] }),
        task("configure_conversion_path", "Configurar caminho de conversão", {
          dependsOn: ["configure_cta"],
        }),
        task("review_page", "Revisar página", {
          dependsOn: ["develop_landing_page", "configure_conversion_path"],
        }),
        task("approve_page", "Aprovar página", {
          waitingClient: true,
          dependsOn: ["review_page"],
        }),
        task("publish_page", "Publicar", {
          dependsOn: ["approve_page", "configure_domain"],
        }),
      ],
    },
    {
      key: "measurement",
      name: "Mensuração",
      objective: "Garantir que as ações possam ser medidas.",
      isRecurring: false,
      completionCriteria: "Mensuração validada.",
      projectStatusOnEnter: "in_progress",
      deliverables: ["Mensuração validada"],
      tasks: [
        task("configure_analytics", "Configurar Google Analytics, se aplicável"),
        task("configure_gtm", "Configurar Google Tag Manager, se aplicável"),
        task("configure_events", "Configurar eventos", {
          dependsOn: ["configure_analytics", "configure_gtm"],
        }),
        task("configure_conversions", "Configurar conversões", {
          dependsOn: ["configure_events"],
        }),
        task("validate_tracking", "Validar tracking", {
          dependsOn: ["configure_conversions", "publish_page"],
        }),
        task("test_conversions", "Testar conversões", {
          dependsOn: ["validate_tracking"],
        }),
      ],
    },
    {
      key: "acquisition",
      name: "Aquisição",
      objective: "Colocar a oferta diante de pessoas com intenção.",
      isRecurring: false,
      completionCriteria: "Campanha ativa.",
      projectStatusOnEnter: "in_progress",
      deliverables: ["Campanha ativa"],
      tasks: [
        task("keyword_research", "Pesquisa de palavras-chave"),
        task("campaign_structure", "Definição de estrutura de campanha", {
          dependsOn: ["keyword_research"],
        }),
        task("create_ads", "Criação dos anúncios", {
          dependsOn: ["campaign_structure"],
        }),
        task("configure_google_ads", "Configuração Google Ads", {
          dependsOn: ["campaign_structure"],
        }),
        task("configure_budget", "Configuração orçamento", {
          dependsOn: ["configure_google_ads"],
        }),
        task("review_campaign", "Revisão", {
          dependsOn: ["create_ads", "configure_budget", "test_conversions"],
        }),
        task("publish_campaign", "Publicação", { dependsOn: ["review_campaign"] }),
        task("initial_validation", "Validação inicial", {
          dependsOn: ["publish_campaign"],
        }),
      ],
    },
    {
      key: "management",
      name: "Gestão",
      objective: "Gerenciar a aquisição continuamente.",
      isRecurring: true,
      completionCriteria: null,
      projectStatusOnEnter: "in_progress",
      deliverables: ["Gestão contínua ativa"],
      tasks: [
        task("analyze_performance", "Analisar desempenho", { recurring: true, blocksPhase: false }),
        task("analyze_search_terms", "Analisar termos de pesquisa", {
          recurring: true,
          blocksPhase: false,
        }),
        task("adjust_campaigns", "Ajustar campanhas", { recurring: true, blocksPhase: false }),
        task("adjust_keywords", "Ajustar palavras-chave", { recurring: true, blocksPhase: false }),
        task("adjust_ads", "Ajustar anúncios", { recurring: true, blocksPhase: false }),
        task("track_conversions", "Acompanhar conversões", {
          recurring: true,
          blocksPhase: false,
        }),
        task("track_opportunities", "Acompanhar oportunidades", {
          recurring: true,
          blocksPhase: false,
        }),
        task("register_learnings", "Registrar aprendizados", {
          recurring: true,
          blocksPhase: false,
        }),
      ],
    },
    {
      key: "optimization",
      name: "Otimização",
      objective: "Transformar dados em decisões.",
      isRecurring: true,
      completionCriteria: null,
      projectStatusOnEnter: "in_progress",
      deliverables: ["Ciclo de otimização ativo"],
      tasks: [
        task("review_investment", "Revisar investimento", { recurring: true, blocksPhase: false }),
        task("review_impressions", "Revisar impressões", { recurring: true, blocksPhase: false }),
        task("review_clicks_ctr", "Revisar cliques e CTR", { recurring: true, blocksPhase: false }),
        task("review_cpc", "Revisar CPC", { recurring: true, blocksPhase: false }),
        task("review_conversions_cpa", "Revisar conversões e custo por conversão", {
          recurring: true,
          blocksPhase: false,
        }),
        task("review_opportunities_revenue", "Revisar oportunidades, reservas e receita", {
          recurring: true,
          blocksPhase: false,
        }),
      ],
    },
  ],
};
