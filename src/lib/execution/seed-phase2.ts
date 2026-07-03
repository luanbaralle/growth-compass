import type {
  CheckinSession,
  ClientRecord,
  ProductionCard,
  ReviewSession,
  SopDefinition,
  TeamCapacityEntry,
} from "./types";

export function seedProductions(): ProductionCard[] {
  const base = "2026-06-10T10:00:00.000Z";
  return [
    {
      id: "prod-1",
      title: "Tour apartamento Nobre — Corretor A",
      clientId: "cli-nobre",
      type: "imovel",
      stage: "editando",
      owner: "caio",
      dueDate: "2026-06-18",
      daysInStage: 4,
      stageEnteredAt: base,
      briefing: "Referência: último tour aprovado. Música livre. Legenda sim.",
    },
    {
      id: "prod-2",
      title: "Prova social Nobre — depoimento",
      clientId: "cli-nobre",
      type: "prova_social",
      stage: "briefing",
      owner: "caio",
      dueDate: "2026-06-20",
      daysInStage: 2,
      stageEnteredAt: "2026-06-13T10:00:00.000Z",
    },
    {
      id: "prod-3",
      title: "Lançamento AMF — vídeo 1/4",
      clientId: "cli-amf",
      type: "imovel",
      stage: "revisao",
      owner: "vini",
      dueDate: "2026-06-17",
      daysInStage: 1,
      stageEnteredAt: "2026-06-14T10:00:00.000Z",
      briefing: "Campanha 08/07. Urgência moderada.",
    },
    {
      id: "prod-4",
      title: "Lançamento AMF — vídeo 2/4",
      clientId: "cli-amf",
      type: "imovel",
      stage: "editando",
      owner: "caio",
      dueDate: "2026-06-19",
      daysInStage: 3,
      stageEnteredAt: "2026-06-12T10:00:00.000Z",
    },
    {
      id: "prod-5",
      title: "Contato — imóvel semana",
      clientId: "cli-contato",
      type: "imovel",
      stage: "aprovado",
      owner: "caio",
      dueDate: "2026-06-16",
      daysInStage: 1,
      stageEnteredAt: "2026-06-14T15:00:00.000Z",
    },
    {
      id: "prod-6",
      title: "Nobre — tarja corretor B (avulso?)",
      clientId: "cli-nobre",
      type: "prova_social",
      stage: "briefing",
      owner: "vini",
      dueDate: "2026-06-15",
      daysInStage: 6,
      stageEnteredAt: "2026-06-09T10:00:00.000Z",
      notes: "Verificar escopo — possível add-on",
    },
    {
      id: "prod-7",
      title: "AMF — arte campanha WhatsApp",
      clientId: "cli-amf",
      type: "autoridade",
      stage: "agendado",
      owner: "caio",
      dueDate: "2026-06-16",
      daysInStage: 0,
      stageEnteredAt: "2026-06-15T10:00:00.000Z",
      publishDate: "2026-06-17",
    },
    {
      id: "prod-8",
      title: "Nobre — tour publicado ref.",
      clientId: "cli-nobre",
      type: "imovel",
      stage: "publicado",
      owner: "caio",
      dueDate: "2026-06-10",
      daysInStage: 5,
      stageEnteredAt: "2026-06-10T10:00:00.000Z",
      publishDate: "2026-06-10",
    },
  ];
}

export function seedClients(): ClientRecord[] {
  return [
    {
      id: "cli-nobre",
      name: "Nobre Imóveis",
      owners: ["vini", "caio"],
      type: "Conteúdo + tráfego",
      status: "active",
      observation: "Demandas extras dos corretores (tarja, legenda)",
      nextAction: "Reunião Jasa — renegociar escopo corretores",
      dependencyToday: { vini: 80, caio: 20, sistema: 0 },
      dependencyTarget: { vini: 40, caio: 30, sistema: 30 },
    },
    {
      id: "cli-amf",
      name: "AMF Imobiliária",
      owners: ["vini", "caio"],
      type: "Conteúdo + tráfego",
      status: "active",
      observation: "Campanha lançamento 08/07",
      nextAction: "Alinhar escopo fechado da campanha",
      dependencyToday: { vini: 70, caio: 25, sistema: 5 },
      dependencyTarget: { vini: 35, caio: 35, sistema: 30 },
    },
    {
      id: "cli-contato",
      name: "Contato",
      owners: ["vini", "caio"],
      type: "Conteúdo",
      status: "active",
      observation: "R$2,5k fechado (1,5 Caio / 1 Vini)",
      nextAction: "Formalizar pacote (quantos vídeos/mês?)",
      dependencyToday: { vini: 60, caio: 40, sistema: 0 },
      dependencyTarget: { vini: 30, caio: 40, sistema: 30 },
    },
    {
      id: "cli-unip",
      name: "Unip (Caraguá)",
      owners: ["luan"],
      type: "Tráfego pago",
      status: "active",
      observation: "Contrato com escopo fechado ✓",
      nextAction: "Modelo referência — replicar cláusulas",
      dependencyToday: { vini: 0, caio: 0, sistema: 20, luan: 80 },
      dependencyTarget: { vini: 0, caio: 0, sistema: 40, luan: 60 },
    },
    {
      id: "cli-remax",
      name: "RE/MAX (Sibeli)",
      owners: ["luan"],
      type: "Prospect",
      status: "paused",
      observation: "Não fechar agora — sem capacidade",
      nextAction: "Reavaliar após editor validado + fila ≤3 dias",
      dependencyToday: { vini: 0, caio: 0, sistema: 0, luan: 100 },
      dependencyTarget: { vini: 40, caio: 20, sistema: 40, luan: 0 },
    },
  ];
}

export function seedTeamCapacity(): TeamCapacityEntry[] {
  return [
    { member: "luan", totalHours: 40, committedHours: 28, freeHours: 12 },
    { member: "vini", totalHours: 40, committedHours: 38, freeHours: 2 },
    { member: "caio", totalHours: 40, committedHours: 35, freeHours: 5 },
  ];
}

export function seedSops(): SopDefinition[] {
  return [
    {
      id: "sop-01",
      title: "SOP 01 — Onboarding (30 dias)",
      trigger: "Contrato assinado + pagamento confirmado",
      owner: "vini",
      items: [
        { id: "s01-1", text: "Criar pasta do cliente (acessos, contratos, contatos)", done: false },
        { id: "s01-2", text: "Coletar todos os acessos (Meta, Google, Instagram, site)", done: false },
        { id: "s01-3", text: "Diagnóstico de maturidade digital (marco zero)", done: false },
        { id: "s01-4", text: "Documentar estado atual: seguidores, engajamento, anúncios", done: false },
        { id: "s01-5", text: "Call de alinhamento: expectativas + escopo", done: false },
        { id: "s01-6", text: "Brand core básico (público, tom, tipos de conteúdo)", done: false },
        { id: "s01-7", text: "Otimizar perfil: bio, destaques, foto, vitrine", done: false },
        { id: "s01-8", text: "Definir padrão de edição (3 vídeos referência)", done: false },
        { id: "s01-9", text: "Meta Business: portfólio, pixels, contas", done: false },
        { id: "s01-10", text: "Google Ads / Analytics: tags, conversões", done: false },
        { id: "s01-11", text: "Verificar pixels duplicados", done: false },
        { id: "s01-12", text: "Definir linha editorial + calendário mês 1", done: false },
        { id: "s01-13", text: "Primeira gravação + 1º vídeo publicado", done: false },
      ],
    },
    {
      id: "sop-02",
      title: "SOP 02 — Fluxo de produção de vídeo",
      trigger: "Gravação concluída",
      owner: "caio",
      items: [
        { id: "s02-1", text: "Upload footage na pasta do cliente", done: false },
        { id: "s02-2", text: "Preencher briefing (tipo, referência, música, legenda)", done: false },
        { id: "s02-3", text: "Mover card para Editando", done: false },
        { id: "s02-4", text: "Editor entrega versão 1 (1–2 dias)", done: false },
        { id: "s02-5", text: "Revisão Vini (máx. 1 rodada)", done: false },
        { id: "s02-6", text: "Aprovar → Agendado", done: false },
        { id: "s02-7", text: "Publicar + mover para Publicado", done: false },
      ],
    },
    {
      id: "sop-03",
      title: "SOP 03 — Gestão de comentários",
      trigger: "Diário, 1x por manhã",
      owner: "caio",
      items: [
        { id: "s03-1", text: "Abrir Meta Business de cada cliente", done: false },
        { id: "s03-2", text: "Comentário irrelevante → curtir", done: false },
        { id: "s03-3", text: "Comentário relevante → responder + DM/WhatsApp", done: false },
        { id: "s03-4", text: "Lead identificado → encaminhar comercial", done: false },
        { id: "s03-5", text: "Marcar como feito", done: false },
      ],
    },
    {
      id: "sop-04",
      title: "SOP 04 — Demanda fora de escopo",
      trigger: "Cliente pede algo não previsto",
      owner: "vini",
      items: [
        { id: "s04-1", text: "Não executar imediatamente", done: false },
        { id: "s04-2", text: 'Responder: "Vou verificar viabilidade e retorno com prazo e valor."', done: false },
        { id: "s04-3", text: "Consultar catálogo de add-ons", done: false },
        { id: "s04-4", text: "Enviar orçamento ou recusar com justificativa", done: false },
        { id: "s04-5", text: "Só executar após aprovação explícita", done: false },
        { id: "s04-6", text: "Registrar como add-on faturado", done: false },
      ],
    },
    {
      id: "sop-06",
      title: "SOP 06 — Protocolo anti-interrupção",
      trigger: "Demanda via WhatsApp fora do planejado",
      owner: "caio",
      items: [
        { id: "s06-1", text: "Demanda <10 min: só no bloco operacional", done: false },
        { id: "s06-2", text: "Fora de escopo: acionar SOP 04", done: false },
        { id: "s06-3", text: "Durante edição/gravação: anotar e retornar no bloco", done: false },
        { id: "s06-4", text: "Urgência real: Vini decide (add-on urgência)", done: false },
      ],
    },
    {
      id: "sop-07",
      title: "SOP 07 — Esteira de produção",
      trigger: "Card na esteira",
      owner: "caio",
      items: [
        { id: "s07-1", text: "Nenhum card >5 dias na mesma coluna", done: false },
        { id: "s07-2", text: "Briefing completo antes de Editando", done: false },
        { id: "s07-3", text: "Prazo total: 5 dias úteis gravação → publicação", done: false },
      ],
    },
  ];
}

export type Phase2Seed = {
  productions: ProductionCard[];
  clients: ClientRecord[];
  teamCapacity: TeamCapacityEntry[];
  sops: SopDefinition[];
  checkinSession?: CheckinSession;
  reviewSession?: ReviewSession;
};

export function seedPhase2Data(): Phase2Seed {
  return {
    productions: seedProductions(),
    clients: seedClients(),
    teamCapacity: seedTeamCapacity(),
    sops: seedSops(),
  };
}
