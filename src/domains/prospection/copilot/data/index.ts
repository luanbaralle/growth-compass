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

Estava pesquisando salões em [Cidade] e achei o [Empresa].

Vi que o Instagram de vocês está bem ativo — mas no Google tem poucas avaliações.

Fiquei curioso: hoje os clientes chegam mais pelo Insta ou pelo Google?`,
    },
    {
      id: "sal-muitas-av",
      observationKeys: ["muitas_avaliacoes"],
      template: `Oi, [Nome], tudo bem?

Estava olhando salões em [Cidade] e encontrei o [Empresa].

Vi que vocês têm bastante avaliação no Google.

Fiquei curioso — isso realmente traz cliente novo ou acaba sendo mais indicação mesmo?`,
    },
    {
      id: "sal-ig-ativo",
      observationKeys: ["instagram_ativo"],
      template: `Oi, [Nome]!

Vi o Instagram de vocês — bastante movimento.

Quem manda mensagem por lá consegue marcar fácil ou vira aquele vai-e-volta de horário?`,
    },
    {
      id: "sal-poucas-av",
      observationKeys: ["poucas_avaliacoes"],
      template: `Oi, [Nome], tudo bem?

Achei o [Empresa] no Google Maps.

Reparei que vocês têm poucas avaliações ainda — normalmente família pesquisa antes de marcar.

Isso pesa aí ou indicação resolve?`,
    },
    {
      id: "sal-coloracao",
      observationKeys: ["especialidade_coloracao"],
      template: `Oi, [Nome]!

Vi que vocês trabalham bastante com coloração/loiro.

Essa parte da agenda enche sozinha ou vocês precisam empurrar?`,
    },
    {
      id: "sal-empresa-nova",
      observationKeys: ["empresa_nova"],
      template: `Oi, [Nome], tudo bem?

Vi que o [Empresa] parece recente na região.

Como tem sido captar os primeiros clientes — indicação, bairro, Insta?`,
    },
    {
      id: "sal-sem-cta",
      observationKeys: ["sem_cta", "instagram_ativo"],
      template: `Oi, [Nome]!

Instagram de vocês bonito, mas não vi link claro pra agendar.

Isso atrapalha ou quem quer marca mesmo assim?`,
    },
    {
      id: "sal-generico",
      observationKeys: [],
      template: `Oi, [Nome], tudo bem?

Estava pesquisando salões em [Cidade] e acabei encontrando o [Empresa].

Fiquei curioso com uma coisa — hoje os clientes novos chegam mais por indicação ou pelo digital?`,
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

Estava pesquisando escritórios em [Cidade] e encontrei o [Empresa].

Pela apresentação, a atuação parece bem focada.

Hoje os casos novos entram mais por indicação ou consulta direta também?`,
    },
    {
      id: "adv-muitas-av",
      observationKeys: ["muitas_avaliacoes"],
      template: `Dr(a). [Nome], boa tarde.

Vi o [Empresa] no Google — boa avaliação.

Família ou empresa que chega pelo Google costuma converter ou ainda é indicação?`,
    },
    {
      id: "adv-site-moderno",
      observationKeys: ["site_moderno"],
      template: `Dr(a). [Nome], tudo bem?

Passei pelo site do [Empresa] — apresentação clara.

Quem preenche formulário aí — vocês sentem que converte?`,
    },
    {
      id: "adv-generico",
      observationKeys: [],
      template: `Dr(a). [Nome], tudo bem?

Estava pesquisando escritórios em [Cidade] e achei o [Empresa].

Fiquei curioso — indicação ainda concentra quase tudo aí?`,
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

Estava pesquisando clínicas em [Cidade] e encontrei a [Empresa].

Bastante avaliação no Google — transmite confiança.

Paciente novo chega mais por indicação ou pelo Google?`,
    },
    {
      id: "cli-especialidade",
      observationKeys: ["especialidade_forte"],
      template: `Oi, [Nome]!

Vi que vocês atuam em [especialidade visível no perfil].

Essa agenda enche sozinha ou tem horário que sobra?`,
    },
    {
      id: "cli-sem-site",
      observationKeys: ["sem_site", "instagram_ativo"],
      template: `Oi, [Nome], tudo bem?

Vi o Instagram da [Empresa] ativo, mas site discreto.

Paciente marca por mensagem ou prefere ligar?`,
    },
    {
      id: "cli-generico",
      observationKeys: [],
      template: `Oi, [Nome], tudo bem?

Achei a [Empresa] pesquisando clínicas em [Cidade].

Como pacientes novos costumam chegar aí?`,
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

Estava olhando imobiliárias em [Cidade] e vi a [Empresa] nos portais.

A maior parte dos leads vem de portal ou canal próprio também?`,
    },
    {
      id: "imo-lancamento",
      observationKeys: ["lancamento_ativo"],
      template: `Oi, [Nome]!

Vi que vocês estão com empreendimento na região.

Como captam interessados — plantão, portal, indicação?`,
    },
    {
      id: "imo-generico",
      observationKeys: [],
      template: `Oi, [Nome], tudo bem?

Pesquisando imobiliárias em [Cidade], achei a [Empresa].

Quando lead chega, em quanto tempo alguém responde aí, em média?`,
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

Estava pesquisando escolas em [Cidade] e encontrei a [Empresa].

Bastante avaliação — família leva isso a sério.

Matrícula nova vem mais por indicação ou Google?`,
    },
    {
      id: "esc-proposta",
      observationKeys: ["proposta_clara"],
      template: `Oi, [Nome]!

Site de vocês deixa a proposta clara.

Como famílias novas costumam encontrar a [Empresa]?`,
    },
    {
      id: "esc-generico",
      observationKeys: [],
      template: `Oi, [Nome], tudo bem?

Achei a [Empresa] pesquisando escolas em [Cidade].

Fora de janeiro, vocês sentem vaga ociosa ou matrícula vem o ano todo?`,
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

Estava pesquisando escritórios em [Cidade] e encontrei o [Empresa].

Empresas novas chegam mais por indicação ou consulta direta?`,
    },
    {
      id: "cont-mei",
      observationKeys: ["segmento_mei"],
      template: `Oi, [Nome]!

Vi que vocês atuam com MEI/Simples.

Esse perfil vocês captam como — indicação, parceria, busca no Google?`,
    },
    {
      id: "cont-generico",
      observationKeys: [],
      template: `Oi, [Nome], tudo bem?

Achei o [Empresa] pesquisando contadores em [Cidade].

Carteira de vocês tem espaço ou está no limite?`,
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

Estava pesquisando restaurantes em [Cidade] e encontrei o [Empresa].

Boa avaliação no Google.

Movimento vem mais do salão ou delivery?`,
    },
    {
      id: "rest-delivery",
      observationKeys: ["delivery_app"],
      template: `Oi, [Nome]!

Vi que vocês estão nos apps de delivery.

Canal próprio existe ou concentra no app?`,
    },
    {
      id: "rest-ig",
      observationKeys: ["instagram_ativo"],
      template: `Oi, [Nome]!

Fotos de prato no Insta chamam atenção.

Quem vê e quer ir — encontra cardápio fácil?`,
    },
    {
      id: "rest-generico",
      observationKeys: [],
      template: `Oi, [Nome], tudo bem?

Achei o [Empresa] no Maps.

Tem dia da semana que costuma sobrar mesa?`,
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

Estava pesquisando academias em [Cidade] e encontrei a [Empresa].

Boa estrutura pelo que vi.

Aluno novo chega mais por indicação ou Google?`,
    },
    {
      id: "acad-modalidade",
      observationKeys: ["modalidade_destaque"],
      template: `Oi, [Nome]!

Vi que vocês destacam [modalidade].

Essa parte enche fácil ou precisa divulgar?`,
    },
    {
      id: "acad-ig",
      observationKeys: ["instagram_ativo"],
      template: `Oi, [Nome]!

Instagram com bastante conteúdo de treino.

Isso traz matrícula ou é mais engajamento?`,
    },
    {
      id: "acad-generico",
      observationKeys: [],
      template: `Oi, [Nome], tudo bem?

Achei a [Empresa] pesquisando academias em [Cidade].

Experimental vira matrícula aí — vocês sabem a taxa?`,
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
