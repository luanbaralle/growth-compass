import type { CopilotOpening, SegmentCopilot } from "../types";
import {
  SHARED_CLOSINGS,
  SHARED_NO_REPLY,
  SHARED_OBSERVATIONS,
  SHARED_RAISE_ONE,
  SHARED_RESPONSE_STATES,
  sharedContinuations,
} from "./shared";

const EXTRA: CopilotOpening[] = [];

function seg(
  slug: string,
  name: string,
  extraObs: { key: string; label: string }[],
  openings: CopilotOpening[],
  businessWord: string,
): SegmentCopilot {
  return {
    slug,
    name,
    observations: [...SHARED_OBSERVATIONS, ...extraObs],
    openings: [...openings, ...EXTRA],
    responseStates: SHARED_RESPONSE_STATES,
    continuations: sharedContinuations(businessWord),
    noReplyActions: SHARED_NO_REPLY,
    raiseOneReplies: SHARED_RAISE_ONE,
    closings: SHARED_CLOSINGS,
  };
}

export const saloesCopilot = seg(
  "saloes",
  "Salões",
  [
    { key: "especialidade_coloracao", label: "Trabalham bastante com coloração/loiro" },
    { key: "link_agendamento_ausente", label: "Sem link de agendamento" },
    { key: "profissional_desbalanceado", label: "Um profissional lota mais que outros" },
  ],
  [
    {
      id: "sal-ig-ativo-poucas-av",
      observationKeys: ["instagram_ativo", "poucas_avaliacoes"],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — trabalhamos com crescimento de empresas por estratégia e marketing digital.

Estamos selecionando salões consolidados em [Cidade] que querem captar clientes com mais previsibilidade. Analisando o [Empresa]: Instagram forte, mas presença no Google ainda não acompanha — gap comum que costumamos resolver.

Vale uma conversa rápida de 15 min essa semana?`,
    },
    {
      id: "sal-muitas-av",
      observationKeys: ["muitas_avaliacoes"],
      template: `Oi, [Nome], tudo bem?

Aqui é da Raise One. A gente estrutura marketing para salões que já têm operação rodando e querem transformar reputação em clientes novos todo mês — não só indicação.

O [Empresa] se encaixou no perfil: boa avaliação no Google, operação visível. Queremos entender se faz sentido conversar sobre previsibilidade na captação.

Topa 15 min para eu te mostrar como enxergamos isso?`,
    },
    {
      id: "sal-ig-ativo",
      observationKeys: ["instagram_ativo"],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — crescimento de empresas por estratégia e marketing.

Vimos o [Empresa] em [Cidade]: Instagram ativo, movimento claro. Estamos falando com salões nesse estágio que querem converter visibilidade em agenda cheia com previsibilidade.

Faz sentido trocar uma ideia de 15 min?`,
    },
    {
      id: "sal-poucas-av",
      observationKeys: ["poucas_avaliacoes"],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One. Trabalhamos com salões que já operam bem, mas precisam de marketing para crescer com previsibilidade.

O [Empresa] chamou atenção em [Cidade] — operação sólida, mas ainda com espaço para fortalecer reputação online e captação. É exatamente o tipo de empresa que buscamos.

Posso te mostrar em 15 min onde enxergamos oportunidade?`,
    },
    {
      id: "sal-coloracao",
      observationKeys: ["especialidade_coloracao"],
      template: `Oi, [Nome], tudo bem?

Aqui é da Raise One — estratégia e marketing para empresas que querem crescer com previsibilidade.

Estamos conversando com salões em [Cidade] com operação consolidada. O [Empresa] se destacou pela especialidade em coloração/loiro — perfil ideal para escalar demanda além da indicação.

Vale 15 min para alinhar se faz sentido para vocês?`,
    },
    {
      id: "sal-empresa-nova",
      observationKeys: ["empresa_nova"],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One. Ajudamos empresas a estruturar captação desde cedo — para não depender só de indicação quando a operação estabilizar.

Vimos o [Empresa] em [Cidade] — negócio promissor na região. Estamos selecionando salões nessa fase que querem construir base de clientes com previsibilidade.

Topa uma conversa rápida essa semana?`,
    },
    {
      id: "sal-sem-cta",
      observationKeys: ["sem_cta", "instagram_ativo"],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — crescimento por estratégia e marketing digital.

Analisamos o [Empresa]: boa presença no Insta, mas o caminho para agendar ainda não está claro. Isso costuma limitar quanto da visibilidade vira cliente — e é o que resolvemos.

Faz sentido 15 min para eu te mostrar o que enxergamos?`,
    },
    {
      id: "sal-generico",
      observationKeys: [],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — trabalhamos com crescimento de empresas por estratégia e marketing digital.

Estamos selecionando salões consolidados em [Cidade] que já têm operação rodando, mas querem captar clientes com mais previsibilidade. Pelo perfil, o [Empresa] se encaixou no que buscamos.

Vale uma conversa de 15 min essa semana?`,
    },
  ],
  "clientes",
);

export const advogadosCopilot = seg(
  "advogados",
  "Advogados",
  [{ key: "area_definida", label: "Área de atuação bem definida" }],
  [
    {
      id: "adv-area",
      observationKeys: ["area_definida", "perfil_profissional"],
      template: `Dr(a). [Nome], tudo bem?

Sou da Raise One — crescimento de empresas por estratégia e marketing digital.

Estamos selecionando escritórios consolidados em [Cidade] com atuação definida que querem captar casos com mais previsibilidade. O [Empresa] se encaixou nesse perfil.

Vale uma conversa de 15 min essa semana?`,
    },
    {
      id: "adv-muitas-av",
      observationKeys: ["muitas_avaliacoes"],
      template: `Dr(a). [Nome], boa tarde.

Aqui é da Raise One. Estruturamos marketing para escritórios que já têm reputação, mas querem transformar isso em consultas novas todo mês.

O [Empresa] tem boa avaliação no Google — exatamente o tipo de operação que buscamos em [Cidade].

Topa 15 min para alinhar se faz sentido?`,
    },
    {
      id: "adv-site-moderno",
      observationKeys: ["site_moderno"],
      template: `Dr(a). [Nome], tudo bem?

Sou da Raise One — estratégia e marketing para empresas que querem crescer com previsibilidade.

Vimos o [Empresa]: site profissional, apresentação clara. Estamos conversando com escritórios nesse estágio que querem mais volume qualificado de consultas.

Faz sentido trocar uma ideia de 15 min?`,
    },
    {
      id: "adv-generico",
      observationKeys: [],
      template: `Dr(a). [Nome], tudo bem?

Sou da Raise One — trabalhamos com crescimento de empresas por estratégia e marketing.

Estamos selecionando escritórios consolidados em [Cidade] que querem captar casos com previsibilidade, não só indicação. O [Empresa] entrou no nosso radar por esse perfil.

Vale uma conversa rápida essa semana?`,
    },
  ],
  "casos",
);

export const clinicasCopilot = seg(
  "clinicas",
  "Clínicas",
  [{ key: "especialidade_forte", label: "Especialidade específica em destaque" }],
  [
    {
      id: "cli-avaliacoes",
      observationKeys: ["muitas_avaliacoes"],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — crescimento de empresas por estratégia e marketing digital.

Estamos selecionando clínicas consolidadas em [Cidade] que querem transformar reputação em pacientes novos com previsibilidade. A [Empresa] se encaixou — boa avaliação, operação visível.

Vale 15 min para conversarmos?`,
    },
    {
      id: "cli-especialidade",
      observationKeys: ["especialidade_forte"],
      template: `Oi, [Nome], tudo bem?

Aqui é da Raise One. Estruturamos marketing para clínicas com especialidade clara que querem escalar captação além da indicação.

A [Empresa] se destacou em [Cidade] — perfil ideal para conversarmos sobre previsibilidade na agenda.

Topa uma conversa rápida essa semana?`,
    },
    {
      id: "cli-sem-site",
      observationKeys: ["sem_site", "instagram_ativo"],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — estratégia e marketing para empresas de saúde.

Vimos a [Empresa]: presença ativa no Instagram, mas estrutura digital ainda pode evoluir para captar pacientes com previsibilidade. É o que fazemos.

Faz sentido 15 min para eu te mostrar onde enxergamos oportunidade?`,
    },
    {
      id: "cli-generico",
      observationKeys: [],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — trabalhamos com crescimento de clínicas por estratégia e marketing.

Estamos selecionando operações consolidadas em [Cidade] que querem captar pacientes com previsibilidade. A [Empresa] entrou no perfil que buscamos.

Vale uma conversa de 15 min?`,
    },
  ],
  "pacientes",
);

export const imobiliariasCopilot = seg(
  "imobiliarias",
  "Imobiliárias",
  [{ key: "lancamento_ativo", label: "Lançamento ou empreendimento ativo" }],
  [
    {
      id: "imo-portal",
      observationKeys: ["perfil_profissional"],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — crescimento de empresas por estratégia e marketing digital.

Estamos selecionando imobiliárias consolidadas em [Cidade] que querem captar leads com previsibilidade — não depender só de portal e indicação. A [Empresa] se encaixou no perfil.

Vale 15 min essa semana?`,
    },
    {
      id: "imo-lancamento",
      observationKeys: ["lancamento_ativo"],
      template: `Oi, [Nome], tudo bem?

Aqui é da Raise One. Estruturamos marketing para imobiliárias com empreendimento ativo que precisam de captação previsível de interessados.

A [Empresa] chamou atenção em [Cidade] — perfil alinhado com o que buscamos.

Topa uma conversa rápida?`,
    },
    {
      id: "imo-generico",
      observationKeys: [],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — estratégia e marketing para empresas que querem crescer com previsibilidade.

Estamos conversando com imobiliárias consolidadas em [Cidade]. A [Empresa] entrou no radar pelo perfil de operação.

Faz sentido 15 min para alinhar?`,
    },
  ],
  "leads",
);

export const escolasCopilot = seg(
  "escolas",
  "Escolas",
  [{ key: "proposta_clara", label: "Proposta pedagógica clara no site" }],
  [
    {
      id: "esc-avaliacoes",
      observationKeys: ["muitas_avaliacoes"],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — crescimento de empresas por estratégia e marketing digital.

Estamos selecionando escolas consolidadas em [Cidade] que querem matrículas novas com previsibilidade o ano todo. A [Empresa] se encaixou — boa reputação online.

Vale 15 min para conversarmos?`,
    },
    {
      id: "esc-proposta",
      observationKeys: ["proposta_clara"],
      template: `Oi, [Nome], tudo bem?

Aqui é da Raise One. Estruturamos marketing para escolas com proposta clara que querem escalar captação além da indicação.

A [Empresa] se destacou em [Cidade] — perfil ideal para uma conversa sobre previsibilidade de matrículas.

Topa 15 min essa semana?`,
    },
    {
      id: "esc-generico",
      observationKeys: [],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — estratégia e marketing para instituições de ensino.

Estamos conversando com escolas consolidadas em [Cidade] que querem crescer com previsibilidade. A [Empresa] entrou no perfil que buscamos.

Faz sentido uma conversa rápida?`,
    },
  ],
  "matrículas",
);

export const contabilidadeCopilot = seg(
  "contabilidade",
  "Contabilidade",
  [{ key: "segmento_mei", label: "Atuação clara com MEI/Simples" }],
  [
    {
      id: "cont-regiao",
      observationKeys: ["perfil_profissional"],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — crescimento de empresas por estratégia e marketing digital.

Estamos selecionando escritórios contábeis consolidados em [Cidade] que querem captar empresas clientes com previsibilidade. O [Empresa] se encaixou nesse perfil.

Vale 15 min essa semana?`,
    },
    {
      id: "cont-mei",
      observationKeys: ["segmento_mei"],
      template: `Oi, [Nome], tudo bem?

Aqui é da Raise One. Estruturamos marketing para contadores com foco em MEI/Simples que querem escalar captação de forma previsível.

O [Empresa] chamou atenção em [Cidade] — perfil alinhado com o que buscamos.

Topa uma conversa rápida?`,
    },
    {
      id: "cont-generico",
      observationKeys: [],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — estratégia e marketing para empresas de serviços.

Estamos conversando com escritórios consolidados em [Cidade] que querem crescer a carteira com previsibilidade. O [Empresa] entrou no nosso radar.

Faz sentido 15 min para alinhar?`,
    },
  ],
  "empresas",
);

export const restaurantesCopilot = seg(
  "restaurantes",
  "Restaurantes",
  [{ key: "delivery_app", label: "Delivery via iFood/Rappi visível" }],
  [
    {
      id: "rest-avaliacoes",
      observationKeys: ["muitas_avaliacoes"],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — crescimento de empresas por estratégia e marketing digital.

Estamos selecionando restaurantes consolidados em [Cidade] que querem movimento previsível — salão e delivery. O [Empresa] se encaixou pelo perfil e reputação.

Vale 15 min para conversarmos?`,
    },
    {
      id: "rest-delivery",
      observationKeys: ["delivery_app"],
      template: `Oi, [Nome], tudo bem?

Aqui é da Raise One. Estruturamos marketing para restaurantes que operam delivery e querem canal próprio com previsibilidade — não depender só de app.

O [Empresa] em [Cidade] entrou no perfil que buscamos.

Topa uma conversa rápida?`,
    },
    {
      id: "rest-ig",
      observationKeys: ["instagram_ativo"],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — estratégia e marketing para food service.

Vimos o [Empresa]: Instagram forte, operação visível. Estamos falando com restaurantes nesse estágio que querem converter visibilidade em mesa cheia com previsibilidade.

Faz sentido 15 min essa semana?`,
    },
    {
      id: "rest-generico",
      observationKeys: [],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — trabalhamos com crescimento de restaurantes por estratégia e marketing.

Estamos selecionando operações consolidadas em [Cidade] que querem movimento previsível. O [Empresa] se encaixou no que buscamos.

Vale uma conversa de 15 min?`,
    },
  ],
  "clientes",
);

export const academiasCopilot = seg(
  "academias",
  "Academias",
  [{ key: "modalidade_destaque", label: "Modalidade específica em destaque" }],
  [
    {
      id: "acad-estrutura",
      observationKeys: ["perfil_profissional"],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — crescimento de empresas por estratégia e marketing digital.

Estamos selecionando academias consolidadas em [Cidade] que querem matrículas novas com previsibilidade. A [Empresa] se encaixou — operação sólida, perfil profissional.

Vale 15 min essa semana?`,
    },
    {
      id: "acad-modalidade",
      observationKeys: ["modalidade_destaque"],
      template: `Oi, [Nome], tudo bem?

Aqui é da Raise One. Estruturamos marketing para academias com modalidade forte que querem escalar captação além da indicação.

A [Empresa] se destacou em [Cidade] — perfil ideal para conversarmos.

Topa 15 min?`,
    },
    {
      id: "acad-ig",
      observationKeys: ["instagram_ativo"],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — estratégia e marketing para fitness.

Vimos a [Empresa]: conteúdo ativo no Instagram, operação visível. Estamos falando com academias nesse estágio que querem converter visibilidade em matrícula com previsibilidade.

Faz sentido uma conversa rápida?`,
    },
    {
      id: "acad-generico",
      observationKeys: [],
      template: `Oi, [Nome], tudo bem?

Sou da Raise One — trabalhamos com crescimento de academias por estratégia e marketing.

Estamos selecionando operações consolidadas em [Cidade] que querem alunos novos com previsibilidade. A [Empresa] entrou no perfil que buscamos.

Vale 15 min para alinhar?`,
    },
  ],
  "alunos",
);

export const COPILOT_BY_SLUG: Record<string, SegmentCopilot> = {
  saloes: saloesCopilot,
  advogados: advogadosCopilot,
  clinicas: clinicasCopilot,
  imobiliarias: imobiliariasCopilot,
  escolas: escolasCopilot,
  contabilidade: contabilidadeCopilot,
  restaurantes: restaurantesCopilot,
  academias: academiasCopilot,
};

export function getSegmentCopilot(slug: string): SegmentCopilot {
  return COPILOT_BY_SLUG[slug] ?? saloesCopilot;
}
