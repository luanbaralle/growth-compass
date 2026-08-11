import type {
  AnswerOption,
  ConversationObjective,
  RaiseOneContent,
  ResolveNextObjectiveResult,
  SaloesDiscoveries,
  SaloesObjectiveKey,
} from "./types";

export const DISCOVERY_FIELD_LABELS: Record<string, string> = {
  client_origin: "Origem",
  current_satisfaction: "Volume",
  growth_desire: "Desejo de crescer",
  limitation: "Limitação",
  willingness_to_act: "Quer resolver",
};

export const DISCOVERY_VALUE_LABELS: Record<string, Record<string, string>> = {
  client_origin: {
    instagram: "Instagram",
    referrals: "Indicação",
    google: "Google / Maps",
    paid_traffic: "Tráfego pago",
    mixed: "De tudo um pouco",
    instagram_referrals: "Instagram + indicação",
    unknown: "Não sabe / não parou para pensar",
  },
  current_satisfaction: {
    satisfied_maintain: "Volume bom — quer manter",
    wants_more: "Quer aumentar volume",
    unstable: "Oscila / varia muito",
    specific_pain: "Dor específica (ex.: dias fracos)",
  },
  growth_desire: {
    yes_grow: "Quer crescer mais",
    no_maintain: "Quer manter o nível atual",
  },
  limitation: {
    oscillation: "Oscilação / dias fracos",
    channel_dependency: "Dependência de um canal",
    instagram_no_convert: "Instagram não converte",
    google_underused: "Google fraco / subutilizado",
    ads_failed: "Anúncios não funcionaram",
    no_time: "Falta de tempo pro digital",
    no_strategy: "Falta de estratégia / clareza",
    other: "Outra limitação",
  },
  willingness_to_act: {
    yes: "Quer explorar agora",
    maybe: "Talvez — depende",
    not_now: "Agora não é prioridade",
    no: "Prefere deixar como está",
  },
};

const D1_OPTIONS: AnswerOption[] = [
  { key: "instagram", label: "Instagram" },
  { key: "referrals", label: "Indicação" },
  { key: "google", label: "Google / Maps" },
  { key: "instagram_referrals", label: "Instagram + indicação" },
  { key: "paid_traffic", label: "Tráfego pago" },
  { key: "mixed", label: "De tudo um pouco" },
  { key: "unknown", label: "Não sabe" },
];

const D2_OPTIONS: AnswerOption[] = [
  { key: "satisfied_maintain", label: "Está bom / agenda cheia" },
  { key: "wants_more", label: "Quer mais volume" },
  { key: "unstable", label: "Oscila / varia" },
  { key: "specific_pain", label: "Dor específica (dias fracos etc.)" },
];

const D4_LITE_OPTIONS: AnswerOption[] = [
  { key: "yes_grow", label: "Quer crescer mais" },
  { key: "no_maintain", label: "Foco em manter" },
];

const D3_OPTIONS: AnswerOption[] = [
  { key: "oscillation", label: "Oscilação / dias fracos" },
  { key: "channel_dependency", label: "Dependência de um canal" },
  { key: "instagram_no_convert", label: "Instagram não converte" },
  { key: "google_underused", label: "Google fraco" },
  { key: "ads_failed", label: "Anúncios não funcionaram" },
  { key: "no_time", label: "Falta de tempo" },
  { key: "no_strategy", label: "Falta de estratégia" },
  { key: "other", label: "Outra coisa" },
];

const D4_OPTIONS: AnswerOption[] = [
  { key: "yes", label: "Sim, faz sentido explorar" },
  { key: "maybe", label: "Talvez — depende" },
  { key: "not_now", label: "Agora não" },
  { key: "no", label: "Não, estamos bem" },
];

function limitationQuestion(discoveries: SaloesDiscoveries): string {
  switch (discoveries.client_origin) {
    case "instagram":
    case "instagram_referrals":
      return "O Insta traz movimento, mas vocês sentem que converte bem em agendamento ou fica mais no engajamento?";
    case "referrals":
      return "Indicação é ótima — vocês sentem que consegue prever o fluxo ou varia bastante de mês pra mês?";
    case "google":
      return "O Google traz gente, mas vocês sabem quanto e se é o perfil que vocês querem?";
    case "mixed":
      return "Entre os canais, tem algum que vocês gostariam que funcionasse melhor?";
    case "paid_traffic":
      return "Vocês já investiram em anúncio — o que funcionou e o que não funcionou?";
    default:
      return "O que você acha que mais limita hoje — é oscilação, dependência de um canal, falta de tempo pra cuidar do digital, ou outra coisa?";
  }
}

export function getObjective(
  key: SaloesObjectiveKey | "close_respectful",
  discoveries: SaloesDiscoveries = {},
): ConversationObjective {
  switch (key) {
    case "client_origin":
      return {
        key,
        title: "Entender de onde vêm os clientes novos",
        question:
          "Pra eu entender melhor o momento de vocês — hoje, de onde costuma vir a maior parte dos clientes novos?",
        answerOptions: D1_OPTIONS,
      };
    case "current_satisfaction":
      return {
        key,
        title: "Entender se o volume atual é suficiente",
        question:
          "E hoje vocês sentem que essa entrada de clientes novos está boa pro momento da empresa, ou ainda existe espaço para aumentar esse volume?",
        answerOptions: D2_OPTIONS,
      };
    case "growth_desire":
      return {
        key,
        title: "Entender se buscam crescer além do nível atual",
        question:
          "Vocês estão buscando aumentar ainda mais o volume ou o foco hoje é mais manter esse nível?",
        answerOptions: D4_LITE_OPTIONS,
      };
    case "limitation":
      return {
        key,
        title: "Entender o que limita o crescimento",
        question: limitationQuestion(discoveries),
        answerOptions: D3_OPTIONS,
      };
    case "willingness_to_act":
      return {
        key,
        title: "Confirmar se querem resolver agora",
        question: "Faz sentido pra vocês explorar isso agora ou não é prioridade no momento?",
        answerOptions: D4_OPTIONS,
      };
    case "raise_one":
      return {
        key,
        title: "Conectar oportunidade e próximo passo",
        question: "",
        answerOptions: [],
      };
    case "close_respectful":
      return {
        key,
        title: "Encerrar com respeito",
        question: "",
        answerOptions: [],
      };
  }
}

function needsD3(discoveries: SaloesDiscoveries): boolean {
  if (discoveries.current_satisfaction === "wants_more") return true;
  if (discoveries.current_satisfaction === "unstable") return true;
  if (discoveries.current_satisfaction === "specific_pain") return true;
  if (
    discoveries.current_satisfaction === "satisfied_maintain" &&
    discoveries.growth_desire === "yes_grow"
  ) {
    return true;
  }
  return false;
}

function needsD4(discoveries: SaloesDiscoveries): boolean {
  if (needsD3(discoveries)) return true;
  return false;
}

export function resolveNextObjective(discoveries: SaloesDiscoveries): ResolveNextObjectiveResult {
  if (!discoveries.client_origin) {
    return { key: "client_origin", step: "conversation" };
  }

  if (!discoveries.current_satisfaction) {
    return { key: "current_satisfaction", step: "conversation" };
  }

  if (discoveries.current_satisfaction === "satisfied_maintain") {
    if (!discoveries.growth_desire) {
      return { key: "growth_desire", step: "conversation" };
    }
    if (discoveries.growth_desire === "no_maintain") {
      return { key: "close_respectful", step: "done" };
    }
  }

  if (needsD3(discoveries) && !discoveries.limitation) {
    return { key: "limitation", step: "conversation" };
  }

  if (needsD4(discoveries) && !discoveries.willingness_to_act) {
    return { key: "willingness_to_act", step: "conversation" };
  }

  const act = discoveries.willingness_to_act;
  if (act === "yes" || act === "maybe") {
    return { key: "raise_one", step: "raise_one" };
  }
  if (act === "not_now" || act === "no") {
    return { key: "close_respectful", step: "done" };
  }

  return { key: null, step: "done" };
}

export function buildRaiseOneContent(discoveries: SaloesDiscoveries): RaiseOneContent {
  const origin = discoveries.client_origin;
  const limitation = discoveries.limitation;

  let opportunity = "Oportunidade de estruturar aquisição digital com previsibilidade.";
  let connection =
    "A Raise One estrutura marketing e aquisição para salões — tráfego, presença digital e processo comercial — pra vocês saberem de onde vem cliente e crescer com previsibilidade.";

  if (limitation === "oscillation" || discoveries.current_satisfaction === "unstable") {
    opportunity = "Base forte + falta de previsibilidade nos dias mais fracos.";
    connection =
      "Previsibilidade é exatamente o que buscamos — saber de onde vem cliente e equilibrar agenda.";
  } else if (limitation === "channel_dependency" || origin === "referrals") {
    opportunity = "Dependência de indicação + desejo de aumentar aquisição.";
    connection =
      "A gente ajuda salões a construir um segundo canal previsível além da indicação — sem parar o que já funciona.";
  } else if (limitation === "instagram_no_convert" || origin === "instagram") {
    opportunity = "Visibilidade no Instagram sem conversão consistente em agenda.";
    connection =
      "Muito salão tem visibilidade mas perde cliente no caminho até agendar — estruturamos isso.";
  } else if (limitation === "google_underused" || origin === "google") {
    opportunity = "Demanda na região com Google ainda subutilizado.";
    connection =
      "Tem demanda na região; quem aparece bem no Google captura. É um dos pontos que trabalhamos.";
  } else if (limitation === "ads_failed" || origin === "paid_traffic") {
    opportunity = "Experiência anterior com anúncios sem resultado claro.";
    connection =
      "A gente entra onde a maioria erra: estratégia e operação, não só 'impulsionar post'.";
  } else if (discoveries.current_satisfaction === "specific_pain") {
    opportunity = "Operação saudável com gargalo em dias ou horários específicos.";
    connection =
      "Trabalhamos previsibilidade na agenda — trazer demanda nos dias certos sem depender só do que já funciona.";
  }

  return {
    opportunity,
    connection,
    transition: "Pelo que você me contou, acho que existe uma oportunidade interessante aqui.",
    nextStep:
      "Pelo que você me contou, vale uma conversa rápida de 15 min — eu te mostro o que enxergamos e você me conta como funciona a operação aí. Qual dia funciona melhor, terça ou quinta?",
  };
}

export function formatDiscoverySummary(discoveries: SaloesDiscoveries): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [field, value] of Object.entries(discoveries)) {
    if (!value) continue;
    const labels = DISCOVERY_VALUE_LABELS[field];
    out[field] = labels?.[value] ?? value;
  }
  return out;
}

export const SALOES_FOLLOWUP_TEMPLATES = {
  first: `Oi, [Nome] — passando de novo porque vi que o [Empresa] se encaixa no perfil de salões que estamos conversando em [Cidade]. Se fizer sentido, fico à disposição pra trocar uma ideia rápida.`,
  last: `[Nome], última mensagem minha — se não for o momento, sem problema. Sucesso com o [Empresa].`,
  resume: `Oi, [Nome] — você comentou sobre [contexto]. Fiquei pensando se faz sentido retomar aquele papo sobre previsibilidade. Ainda é um tema pra vocês?`,
  satisfied_later: `Oi, [Nome], tudo bem? Passando pra saber como estão as coisas no [Empresa]. Se um dia quiserem conversar sobre crescimento, estou por aqui.`,
};

export function buildResumeContext(discoveries: SaloesDiscoveries): string {
  const origin = discoveries.client_origin;
  if (origin === "referrals") return "a maior parte vem de indicação";
  if (origin === "instagram") return "a maior parte vem do Instagram";
  if (origin === "instagram_referrals") return "Instagram e indicação";
  if (origin === "google") return "a maior parte vem do Google";
  return "como vocês captam clientes hoje";
}
