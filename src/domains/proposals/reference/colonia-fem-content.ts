import type { ProposalPricingTier } from "../types";

/**
 * Proposta referência: Colônia de Férias FEM.
 * Narrativa: estrutura de captação de hóspedes (não lista de serviços).
 * Implantação: condição especial de parceria (UNIP) — R$ 3.000 → R$ 1.997.
 */

export const COLONIA_FEM_PRICING: ProposalPricingTier[] = [
  {
    id: "implementation",
    name: "Implantação",
    subtitle: "01 · Pagamento único",
    amountLabel: "R$ 1.997",
    frequency: "once",
    items: [
      "Landing page comercial",
      "Organização da presença digital",
      "Configuração inicial da mensuração",
      "Captação de imagens",
      "Produção do vídeo comercial",
      "Materiais derivados e cortes",
      "Configuração inicial do Google Ads",
    ],
    note: "Estruturação inicial da operação digital da Colônia FEM.",
  },
  {
    id: "management",
    name: "Gestão Google Ads",
    subtitle: "02 · Após a implantação",
    amountLabel: "R$ 997/mês",
    frequency: "monthly",
    items: [
      "Gestão contínua das campanhas",
      "Análise de desempenho",
      "Otimizações",
      "Direcionamento estratégico da aquisição",
      "Acompanhamento dos indicadores",
    ],
    note: "1º ciclo de gestão sem cobrança. Condição padrão de entrada da Raise One.",
  },
  {
    id: "media",
    name: "Investimento em mídia",
    subtitle: "03 · Pago ao Google",
    amountLabel: "R$ 50/dia",
    frequency: "monthly_google",
    items: [
      "R$ 50/dia como ponto de partida",
      "Ajustável conforme a disponibilidade da Colônia",
      "Redistribuição para períodos de maior oportunidade",
      "Escala conforme os resultados observados",
    ],
    note: "A verba de mídia é paga diretamente ao Google e não está incluída na mensalidade da Raise One.",
  },
];

export const COLONIA_FEM_INVESTMENT = {
  title: "Começar pelo essencial. Gestão recorrente. Escala conforme os resultados.",
  intro:
    "A estrutura inicial concentra o investimento no que é necessário para colocar a operação em funcionamento. A gestão entra no modelo recorrente da Raise One, enquanto a verba de mídia permanece separada e pode acompanhar a realidade da operação.",
  specialCondition: {
    eyebrow: "Condição especial para a Colônia FEM",
    body: "Como a Colônia FEM já faz parte da relação comercial da Raise One através do projeto UNIP, estamos aplicando uma condição especial de implantação para este segundo projeto.",
    originalLabel: "Valor originalmente apresentado",
    originalAmount: "R$ 2.997",
    offerLabel: "Implantação por",
    offerAmount: "R$ 1.497",
    paymentNote: "Pagamento único",
    badge: "Condição especial de parceria",
  },
  implementation: {
    code: "01",
    title: "Implantação",
    priceLine: "R$ 1.497 · pagamento único",
    lead: "Estruturação inicial da operação digital da Colônia FEM.",
  },
  management: {
    code: "02",
    title: "Gestão Google Ads",
    priceLine: "R$ 997/mês",
    lead: "Após a implantação, a gestão segue no modelo recorrente da Raise One.",
    firstCycleBadge: "1º ciclo de gestão sem cobrança",
    firstCycleNote: "Condição padrão de entrada da Raise One.",
  },
  media: {
    code: "03",
    title: "Investimento em mídia",
    dailyAmount: "R$ 50/dia",
    monthlyApprox: "≈ R$ 1.500/mês",
    lead: "A verba de mídia é paga diretamente ao Google e não está incluída na mensalidade da Raise One.",
    recommendLabel: "Investimento inicial recomendado",
  },
  summary: {
    title: "Resumo do investimento",
    rows: [
      { label: "Implantação — pagamento único", value: "R$ 1.497" },
      { label: "1º ciclo de gestão Google Ads", value: "R$ 0" },
      { label: "Gestão Google Ads após o 1º ciclo", value: "R$ 997/mês" },
      { label: "Mídia Google (recomendação inicial)", value: "≈ R$ 1.500/mês" },
    ],
  },
  leanTitle: "Uma estrutura sob medida para começar",
  leanBody:
    "A estrutura não precisa crescer antes da hora. Primeiro validamos o canal; depois ampliamos o investimento conforme as oportunidades identificadas.",
  footer:
    "Produções adicionais, novas campanhas, campanhas sazonais, remarketing ou novos materiais comerciais poderão ser contratados sob demanda, sempre mediante aprovação e orçamento prévio.",
};

export const COLONIA_FEM_REFERENCE = {
  company: "Colônia de Férias FEM",
  client: "Itanhaém · Litoral Sul de SP",

  hero: {
    eyebrow: "Proposta comercial",
    headline: "Estruturação de Captação Digital",
    headlineLines: ["Estruturação de", "Captação Digital"] as const,
    lead: "Uma nova estrutura para transformar a presença digital da Colônia em oportunidades de hospedagem e reservas.",
    strategyLine: "Marketing + Tecnologia + IA",
    pillars: ["Landing Page", "Google Ads", "Conversão"],
    footnote:
      "Uma estrutura focada em aumentar a visibilidade da Colônia e criar um caminho mais eficiente até as reservas.",
  },

  diagnosis: {
    headline: "A Colônia FEM já possui o principal: uma operação pronta para receber.",
    subheadline:
      "Localizada em Itanhaém, no Litoral Sul de São Paulo, a Colônia FEM oferece hospedagem, pensão completa, lazer e convivência em um ambiente familiar e acolhedor, a uma quadra da praia.",
    strengths: [
      { label: "Localização", value: "Itanhaém · a uma quadra da praia" },
      { label: "Oferta", value: "Hospedagem + pensão completa" },
      { label: "Estrutura", value: "Piscina, lazer e convivência" },
      { label: "Público", value: "Famílias, grupos e excursões" },
    ],
    offerItems: [
      "Hospedagem",
      "Pensão completa",
      "Piscina",
      "Localização privilegiada, a uma quadra da praia",
      "Atendimento próximo e humanizado",
      "Estrutura para famílias e grupos",
      "Atendimento a excursões, empresas, associações e outros públicos",
      "Bom custo-benefício",
    ],
    capacityNote: "Hoje, a Colônia também possui capacidade disponível para receber mais hóspedes.",
    closing: "O próximo passo é fazer essa estrutura chegar às pessoas certas.",
  },

  challenge: {
    headline: "Existe estrutura. Existe oferta. Existe capacidade.",
    body: "O principal desafio identificado no briefing não está na operação da Colônia, mas na visibilidade e no alcance da divulgação atual.",
    channels: [
      "Instagram",
      "Facebook",
      "Rádio",
      "WhatsApp",
      "Parceiros e agências",
      "Sindicatos filiados e parceiros",
    ],
    pastAds:
      "A Colônia já teve experiência com anúncios no Instagram e Facebook, mas, segundo o relato da operação, a iniciativa trouxe poucos resultados.",
    gapTitle: "Canais que ainda podemos estruturar",
    gap: ["Landing Page", "Presença no Google", "Google Maps", "Aquisição por busca"],
    opportunityLine:
      "O desafio, portanto, não é criar uma nova operação. É criar um caminho para que mais pessoas encontrem a que já existe.",
  },

  opportunity: {
    headline: "Encontrar quem já está procurando.",
    lead: "Existe uma diferença entre simplesmente divulgar uma hospedagem e aparecer quando alguém está procurando onde se hospedar.",
    keywords: [
      "hospedagem em Itanhaém",
      "pousada em Itanhaém",
      "hospedagem perto da praia",
      "hospedagem com pensão completa",
      "hospedagem para grupos",
      "excursão em Itanhaém",
    ],
    insight:
      "Quem realiza esse tipo de busca já demonstra uma intenção mais próxima de uma possível reserva.",
    proposal:
      "A proposta é criar uma estrutura capaz de capturar essa demanda, em vez de depender exclusivamente do alcance das redes sociais.",
    flow: [
      "Ser encontrada",
      "Apresentar a estrutura",
      "Gerar interesse",
      "Direcionar para o atendimento/reserva",
    ],
  },

  pillars: [
    {
      number: "01",
      badge: "Estruturar",
      title: "Presença digital",
      subtitle: "Apresentar a Colônia de forma profissional em seus principais pontos de contato digitais.",
      objective:
        "Criar e organizar a estrutura necessária para que a oferta seja encontrada, compreendida e tenha um caminho claro até o contato.",
      items: [
        "Landing Page",
        "Organização do Instagram",
        "Google / Maps",
        "Canais e links de contato",
      ],
    },
    {
      number: "02",
      badge: "Apresentar",
      title: "Material comercial",
      subtitle: "Transformar a estrutura física da Colônia em materiais profissionais de apresentação.",
      objective:
        "Criar os ativos visuais necessários para comunicar a experiência, a estrutura e os diferenciais da FEM nos canais digitais.",
      items: ["Fotografias", "Vídeo comercial", "Materiais para divulgação"],
    },
    {
      number: "03",
      badge: "Atrair",
      title: "Google Ads",
      subtitle: "Colocar a Colônia diante de pessoas que já buscam hospedagem.",
      objective:
        "Capturar demanda de pesquisa e direcionar esse público para a estrutura digital da FEM.",
      items: ["Campanhas Search", "Intenção de hospedagem", "Otimização contínua"],
    },
    {
      number: "04",
      badge: "Converter",
      title: "Caminho de conversão",
      subtitle: "Conectar a aquisição digital ao processo comercial que a Colônia já opera.",
      objective:
        "O interessado é direcionado para os canais de atendimento e reserva da FEM, onde seguem as etapas comerciais até a confirmação.",
      items: [
        "Consulta de disponibilidade",
        "Valores",
        "Escolha da data",
        "Pagamento / sinal",
        "Reserva",
      ],
    },
  ],

  landingPage: {
    headline: "Uma vitrine digital construída para vender a experiência.",
    lead: "A landing page será o principal ponto de apresentação da Colônia no digital, respondendo rapidamente às principais perguntas de quem considera se hospedar.",
    answers: [
      { q: "Onde fica?", a: "Itanhaém, a uma quadra da praia." },
      { q: "O que oferece?", a: "Hospedagem, pensão completa e lazer." },
      {
        q: "Para quem?",
        a: "Famílias, casais, grupos, excursões e eventos.",
      },
      {
        q: "Quanto custa?",
        a: "Valores e condições comerciais de acordo com a data e o período da hospedagem.",
      },
      {
        q: "Como reservar?",
        a: "Acesso direto aos canais utilizados pela Colônia para consulta de disponibilidade e reserva.",
      },
    ],
    structure: [
      { title: "Hero / proposta de valor", detail: "Apresentação imediata + CTA." },
      { title: "A experiência FEM", detail: "O que é a Colônia e para quem é." },
      { title: "Localização", detail: "Itanhaém, proximidade da praia e mapa." },
      { title: "Hospedagem", detail: "Acomodações e estrutura." },
      { title: "Pensão completa", detail: "Café da manhã, almoço e jantar." },
      { title: "Piscina e lazer", detail: "Estrutura de lazer." },
      { title: "Famílias, grupos e excursões", detail: "Diferentes possibilidades de hospedagem." },
      { title: "Fotos e vídeo", detail: "Prova visual da experiência." },
      { title: "Condições e valores", detail: "Informações comerciais e condições específicas." },
      { title: "Informações importantes", detail: "Check-in, checkout, horários e regras." },
      { title: "FAQ", detail: "Objeções e dúvidas frequentes." },
      { title: "CTA de reserva", detail: "Direcionamento para consulta e reserva." },
    ],
  },

  content: {
    headline: "Mostrar é parte da estratégia.",
    lead: "A Colônia já possui algum material, mas o projeto prevê uma captação pontual para complementar e profissionalizar sua apresentação nos canais digitais.",
    photoTitle: "Captação fotográfica",
    photoAreas: [
      "Áreas de hospedagem",
      "Áreas comuns",
      "Lazer",
      "Piscina",
      "Restaurante",
      "Ambientes",
      "Localização / entorno, quando aplicável",
    ],
    videoTitle: "Vídeo comercial",
    videoFlow:
      "Localização → estrutura → hospedagem → alimentação → lazer → diferenciais → convite à reserva.",
    videoBody:
      "Produção de um vídeo comercial horizontal apresentando a Colônia, sua estrutura e a experiência oferecida.",
    derivatives:
      "A partir da mesma produção, serão gerados cortes e versões menores para utilização em redes sociais, anúncios e outros canais digitais.",
    closing:
      "O objetivo não é produzir conteúdo por produzir. É criar os ativos visuais necessários para que a Colônia seja apresentada com clareza, credibilidade e apelo comercial.",
  },

  ads: {
    headline: "Colocar a Colônia diante de quem já está procurando.",
    lead: "O Google Ads será utilizado como principal canal inicial de aquisição, construído em torno das intenções de busca relacionadas à oferta da Colônia.",
    fronts: [
      {
        title: "Hospedagem em Itanhaém",
        body: "Pessoas procurando onde se hospedar.",
      },
      {
        title: "Pensão completa",
        body: "Pessoas buscando hospedagem com alimentação incluída.",
      },
      {
        title: "Grupos e excursões",
        body: "Captação de grupos, excursões, empresas, associações e outros públicos atendidos.",
      },
      {
        title: "Baixa temporada",
        body: "Campanhas e ofertas direcionadas aos períodos com maior disponibilidade.",
      },
      {
        title: "Ofertas e pacotes",
        body: "Ações específicas conforme disponibilidade e condições comerciais.",
      },
    ],
    closing:
      "O objetivo não é simplesmente gerar cliques. É entender quais buscas geram oportunidades comerciais e reservas, e direcionar o investimento para o que demonstra resultado.",
  },

  availability: {
    headline: "Nem toda demanda precisa ser estimulada da mesma forma.",
    lead: "A Colônia informou possuir bastante disponibilidade atualmente, enquanto determinados períodos, como feriados e Réveillon, já estão esgotados.",
    body: "Por isso, a estratégia não será baseada em divulgar tudo indiscriminadamente.",
    rules: [
      { when: "Quando houver disponibilidade", then: "Aumentamos a presença nos anúncios." },
      { when: "Quando houver condição especial", then: "Criamos uma oferta." },
      {
        when: "Quando o período estiver próximo da lotação",
        then: "Reduzimos ou pausamos a campanha daquele período.",
      },
      { when: "Quando surgir oportunidade para grupos", then: "Direcionamos a comunicação." },
    ],
    closing: "Assim, o investimento acompanha a realidade da operação.",
  },

  funnel: {
    headline: "A aquisição termina onde começa o processo comercial.",
    lead: "O projeto não termina quando alguém clica no anúncio. A estrutura digital conduz o interessado até o processo comercial que a Colônia já utiliza.",
    steps: [
      "Encontra a Colônia",
      "Conhece a estrutura e a oferta",
      "Consulta disponibilidade",
      "Recebe os valores",
      "Escolhe a data",
      "Realiza o pagamento / sinal",
      "Reserva confirmada",
    ],
    opsNote:
      "A operação já conta com 3 pessoas responsáveis pelo atendimento e utiliza o Hospedin para controle de reservas e disponibilidade.",
  },

  expectations: {
    headline: "Filtrar também é converter.",
    lead: "Uma boa comunicação não deve apenas atrair. Deve alinhar expectativas.",
    schedule: [
      { label: "Check-in", value: "11h às 17h" },
      { label: "Check-out", value: "Até 10h" },
      { label: "Recepção", value: "7h30 às 20h" },
      { label: "Piscina", value: "10h às 20h" },
    ],
    rules: [
      "Horários das refeições",
      "Visitantes",
      "Estacionamento",
      "Piscina",
      "Alimentação externa",
      "Som",
      "Coolers e bolsas térmicas",
      "Tabagismo",
      "Demais regras de hospedagem",
    ],
    closing:
      "Essas informações serão organizadas na presença digital de forma clara, sem competir com a comunicação comercial. O objetivo é atrair pessoas alinhadas à experiência oferecida pela FEM.",
  },

  metrics: {
    headline: "O que não é medido não pode ser otimizado.",
    acquisition: ["Impressões", "Cliques", "Visitas à página"],
    interest: ["Contatos / consultas de disponibilidade"],
    commercial: ["Oportunidades comerciais"],
    result: ["Reservas"],
    businessLabel: "Com dados comerciais disponibilizados pela operação",
    businessLine: "Investimento → Oportunidades → Reservas → Receita",
    note: "Sempre que os dados disponíveis permitirem, acompanharemos o que o investimento em mídia está gerando para a operação, não apenas quanto foi gasto.",
    optimization:
      "Esses dados orientam as decisões de otimização das campanhas e ajudam a identificar onde estão as maiores oportunidades do funil.",
  },

  project: [
    {
      title: "Estruturação",
      items: [
        "Landing page comercial própria",
        "Organização dos canais digitais existentes",
        "Caminho de conversão para reserva",
      ],
    },
    {
      title: "Produção",
      items: [
        "1 diária de captação de imagens",
        "Vídeo comercial horizontal",
        "Materiais derivados e cortes",
      ],
    },
    {
      title: "Aquisição",
      items: [
        "Configuração e gestão contínua do Google Ads",
        "Mensuração e eventos",
        "Acompanhamento dos indicadores",
      ],
    },
  ],

  roadmap: [
    {
      period: "Fase 01",
      title: "Estruturar",
      items: ["Landing page", "Presença digital", "Mensuração"],
    },
    {
      period: "Fase 02",
      title: "Apresentar",
      items: ["Fotos", "Vídeo", "Materiais comerciais"],
    },
    {
      period: "Fase 03",
      title: "Atrair",
      items: ["Google Ads", "Campanhas", "Aquisição"],
    },
    {
      period: "Fase 04",
      title: "Otimizar",
      items: ["Análise de dados", "Ajustes", "Direcionamento do investimento"],
    },
  ],

  expansion: {
    number: "Depois",
    title: "E depois?",
    subtitle:
      "A estrutura não precisa crescer antes da hora. Conforme os dados e a operação mostrarem novas oportunidades, podemos adicionar:",
    items: [
      "Novas campanhas",
      "Campanhas sazonais",
      "Novas produções",
      "Campanhas para grupos",
      "Remarketing",
      "Novos materiais comerciais",
    ],
  },

  exclusions: {
    wont: [
      "Gestão recorrente de Instagram",
      "Calendário mensal de conteúdo",
      "Produção mensal de posts",
      "Produção audiovisual recorrente",
      "Gestão de Facebook",
      "Novas frentes de campanha não previstas no escopo inicial",
      "Investimento em mídia (pago à plataforma)",
      "Custos de plataformas ou ferramentas de terceiros, quando aplicáveis",
    ],
    will: "Construir a estrutura necessária para gerar demanda e oportunidades de reserva, sem criar uma operação maior e mais cara antes de validar o canal.",
  },

  whyRaiseOne: {
    headline: "Não queremos apenas divulgar a Colônia.",
    lead: "Queremos construir um sistema simples em que a pessoa encontra → conhece → demonstra interesse → consulta → reserva.",
    pillars: [
      {
        title: "Marketing",
        body: "Para colocar a Colônia diante de quem procura hospedagem.",
      },
      {
        title: "Tecnologia",
        body: "Para transformar essa atenção em uma experiência digital clara.",
      },
      {
        title: "Dados",
        body: "Para entender o que gera interesse e oportunidade.",
      },
      {
        title: "Estratégia",
        body: "Para direcionar o investimento para o que apresenta resultado.",
      },
    ],
  },

  outcome: {
    headline: "O objetivo",
    body: "Gerar mais oportunidades de hospedagem e criar uma estrutura sustentável para contribuir com o crescimento das reservas da Colônia FEM.",
    via: [
      "Maior visibilidade",
      "Presença digital estruturada",
      "Captura de demanda",
      "Melhor apresentação da oferta",
      "Processo de conversão claro",
      "Otimização contínua",
    ],
    caution: "Sem promessa de volume específico de reservas, ainda sem base histórica para isso.",
  },

  nextSteps: [
    {
      title: "Aprovação da proposta",
      detail: "Validação do escopo e investimento.",
    },
    {
      title: "Formalização e início do projeto",
      detail: "Documentação, alinhamentos iniciais e cronograma.",
    },
    {
      title: "Briefing técnico e organização dos materiais",
      detail: "Informações, acessos, referências e preparação da produção.",
    },
    {
      title: "Captação de fotos e vídeo",
      detail: "Produção dos novos ativos comerciais da Colônia.",
    },
    {
      title: "Desenvolvimento da landing page",
      detail: "Construção e publicação da estrutura digital.",
    },
    {
      title: "Configuração e lançamento do Google Ads",
      detail: "Estruturação das campanhas e início da aquisição.",
    },
    {
      title: "Análise e otimização contínua",
      detail: "Acompanhamento dos dados, ajustes e direcionamento do investimento.",
    },
  ],

  closing: {
    title: "A Colônia FEM já tem uma história, uma estrutura e uma experiência para oferecer.",
    body: "Agora, precisamos criar um caminho para que mais pessoas encontrem tudo isso.",
    brandLine: "Raise One · Marketing + Tecnologia + IA",
    flowLabel: "Operação planejada",
    flowSteps: [
      { label: "Busca", hint: "Intenção de hospedagem" },
      { label: "Google Ads", hint: "Captura da demanda" },
      { label: "Landing page", hint: "Apresentação da Colônia" },
      { label: "Atendimento", hint: "Equipe FEM" },
      { label: "Reserva", hint: "Confirmação" },
    ] as const,
  },

  cta: {
    label: "Quero avançar com este plano",
    message:
      "Olá! Revisei a proposta de estruturação de captação digital da Raise One para a Colônia de Férias FEM e gostaria de avançar.",
  },
} as const;

export const COLONIA_FEM_NAV = [
  { id: "partida", label: "Partida" },
  { id: "desafio", label: "Desafio" },
  { id: "oportunidade", label: "Oportunidade" },
  { id: "solucao", label: "Solução" },
  { id: "aquisicao", label: "Aquisição" },
  { id: "projeto", label: "Projeto" },
  { id: "investimento", label: "Investimento" },
  { id: "proximos-passos", label: "Próximos passos" },
];

export const COLONIA_FEM_SLUG = "colonia-fem";
