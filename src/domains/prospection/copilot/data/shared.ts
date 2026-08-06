import type {
  CopilotContinuation,
  CopilotNoReplyAction,
  CopilotObservation,
  CopilotRaiseOneReply,
  CopilotResponseState,
} from "../types";

export const SHARED_OBSERVATIONS: CopilotObservation[] = [
  { key: "instagram_ativo", label: "Instagram muito ativo" },
  { key: "instagram_abandonado", label: "Instagram abandonado" },
  { key: "muitas_avaliacoes", label: "Muitas avaliações no Google" },
  { key: "poucas_avaliacoes", label: "Poucas avaliações" },
  { key: "site_moderno", label: "Site moderno" },
  { key: "sem_site", label: "Sem site" },
  { key: "site_antigo", label: "Site antigo" },
  { key: "gmb_incompleto", label: "Google Meu Negócio incompleto" },
  { key: "whatsapp_pouco_visivel", label: "WhatsApp pouco visível" },
  { key: "sem_cta", label: "Não possui CTA claro" },
  { key: "empresa_nova", label: "Empresa recém inaugurada" },
  { key: "empresa_tradicional", label: "Empresa tradicional" },
  { key: "concorrentes_antes", label: "Concorrentes aparecem antes" },
  { key: "perfil_profissional", label: "Perfil muito profissional" },
  { key: "perfil_amador", label: "Perfil amador" },
];

export const SHARED_RESPONSE_STATES: CopilotResponseState[] = [
  { key: "indicacao", label: "Vive de indicação", group: "business" },
  { key: "instagram_gera", label: "Instagram gera clientes", group: "business" },
  { key: "google_gera", label: "Google gera clientes", group: "business" },
  { key: "agenda_cheia", label: "Agenda cheia", group: "business" },
  { key: "agenda_vazia", label: "Agenda vazia / dias parados", group: "business" },
  { key: "tem_agencia", label: "Tem agência", group: "objection" },
  { key: "ja_anunciou", label: "Já tentou anúncios", group: "objection" },
  { key: "sem_tempo", label: "Não possui tempo", group: "objection" },
  { key: "sem_interesse", label: "Não demonstrou interesse", group: "objection" },
  { key: "curioso", label: "Ficou curioso", group: "business" },
  { key: "perguntou_quem", label: "Perguntou quem somos", group: "raise_one" },
  { key: "perguntou_o_que", label: "Perguntou o que fazemos", group: "raise_one" },
  { key: "outro", label: "Outro", group: "other" },
];

export const SHARED_NO_REPLY: CopilotNoReplyAction[] = [
  {
    key: "wait",
    label: "Aguarde mais um pouco",
    hint: "Espere 2–3 dias. Muitos empresários respondem fora do horário comercial.",
  },
  {
    key: "followup_3d",
    label: "Follow-up em 3 dias",
    hint: "Agende retorno em 3 dias com uma nova observação — nunca a mesma mensagem.",
    followUpDays: 3,
  },
  {
    key: "close",
    label: "Encerrar tentativa",
    hint: "Agradeça e encerre. Duas tentativas sem resposta já bastam.",
  },
];

export const SHARED_RAISE_ONE: CopilotRaiseOneReply[] = [
  {
    responseStateKey: "perguntou_quem",
    template: "Trabalho na Raise One.",
  },
  {
    responseStateKey: "perguntou_o_que",
    template:
      "A Raise One trabalha com crescimento digital — captar cliente, estruturar comercial, presença online. Depende muito do negócio.",
  },
];

export function sharedContinuations(business: string): CopilotContinuation[] {
  return [
    {
      responseStateKey: "indicacao",
      template: `Indicação é o melhor canal. Vocês sentem que isso é estável ou varia de mês pra mês?`,
    },
    {
      responseStateKey: "indicacao",
      template: `Faz sentido. E vocês conseguem perceber de onde veio o último cliente novo?`,
    },
    {
      responseStateKey: "instagram_gera",
      template: `Interessante. Vocês sabem quantos ${business} vieram do Insta no último mês?`,
    },
    {
      responseStateKey: "google_gera",
      template: `Boa. O Google costuma trazer perfil diferente do Instagram — vocês percebem isso aí?`,
    },
    {
      responseStateKey: "agenda_cheia",
      template: `Ótimo. Tem algum dia ou horário que ainda sobra?`,
    },
    {
      responseStateKey: "agenda_vazia",
      template: `Converso com bastante gente do setor e isso é comum. Vocês já tentaram alguma coisa ou deixaram natural?`,
    },
    {
      responseStateKey: "tem_agencia",
      template: `Faz sentido. Como tem sido — vocês sentem que sabem o que a agência entrega de resultado?`,
    },
    {
      responseStateKey: "ja_anunciou",
      template: `Infelizmente ouço isso bastante. O que vocês fizeram na época?`,
    },
    {
      responseStateKey: "sem_tempo",
      template: `Entendo, rotina corrida. Obrigado por responder.`,
    },
    {
      responseStateKey: "sem_interesse",
      template: `Tranquilo, [Nome]. Obrigado pelo retorno.`,
    },
    {
      responseStateKey: "curioso",
      template: `Boa. Me conta mais — o que te chamou atenção?`,
    },
    {
      responseStateKey: "outro",
      template: `Entendi. E como vocês preferem conduzir isso aí hoje?`,
    },
  ];
}

export const SHARED_CLOSINGS = [
  "Boa, [Nome]. Valeu por abrir isso. Qualquer coisa, estou por aqui.",
  "Obrigado pelo papo, [Nome].",
  "Tranquilo. Sucesso com a [Empresa]!",
];
