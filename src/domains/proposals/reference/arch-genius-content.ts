import type { ProposalPricingTier } from "../types";

/**
 * Proposta referência: Arch Genius Arquitetura.
 * Narrativa: reestruturação digital + aquisição: site institucional,
 * landing pages por frente e Google Ads progressivo.
 * Valores comerciais: implantação R$ 3.550, 1º mês de gestão gratuito,
 * gestão R$ 997/mês a partir do 2º mês, mídia R$ 900 a R$ 1.500/mês.
 */

export const ARCH_GENIUS_PRICES_READY = true;

export const ARCH_GENIUS_PRICING: ProposalPricingTier[] = [
  {
    id: "implementation",
    name: "Implantação digital",
    subtitle: "01 · Pagamento único",
    amountLabel: "R$ 3.550,00",
    frequency: "once",
    items: [
      "Planejamento e arquitetura digital",
      "Reconstrução do site institucional",
      "Até 3 landing pages comerciais",
      "Conversões, integrações e preparação técnica",
    ],
    note: "Pagamento único. Páginas adicionais e funcionalidades especiais serão orçadas à parte.",
  },
  {
    id: "management",
    name: "Gestão Google Ads",
    subtitle: "02 · 1º mês gratuito",
    amountLabel: "R$ 997,00/mês",
    frequency: "monthly",
    items: [
      "Pesquisa e refinamento de palavras-chave",
      "Configuração e gestão das campanhas contratadas",
      "Otimização de anúncios, segmentações e orçamento",
      "Acompanhamento das conversões",
      "Análise da qualidade dos contatos e das oportunidades",
      "Relatórios e recomendações de melhoria",
      "Avaliação da expansão ou pausa das frentes de aquisição",
    ],
    note: "O primeiro mês de gestão é gratuito. A partir do segundo mês, R$ 997,00/mês. Não inclui desenvolvimento contínuo de novas páginas, manutenção ilimitada do site ou alterações irrestritas de escopo.",
  },
  {
    id: "media",
    name: "Investimento em mídia",
    subtitle: "03 · Pago ao Google",
    amountLabel: "R$ 900,00 a R$ 1.500,00/mês",
    frequency: "monthly_google",
    items: [
      "Verba paga diretamente à plataforma de anúncios",
      "Separada da remuneração da Raise One",
      "Concentrada em uma ou duas frentes prioritárias no início",
      "Expansão gradual conforme dados e capacidade de atendimento",
    ],
    note: "A verba de mídia não constitui receita da Raise One.",
  },
];

export const ARCH_GENIUS_INVESTMENT = {
  title: "Investimento para reconstruir a presença digital e operar a aquisição.",
  intro:
    "A implantação remunera o planejamento, o novo site, até três landing pages e a preparação técnica. O primeiro mês de gestão de Google Ads é gratuito. A partir do segundo mês, a gestão é R$ 997,00. A verba de mídia é paga ao Google.",
  implementation: {
    code: "01",
    title: "Implantação digital",
    priceLine: "R$ 3.550,00",
    priceNote: "Pagamento único",
    lead: "Quatro frentes integradas: planejamento, site institucional, landing pages comerciais e preparação técnica para aquisição.",
    boundary:
      "O site será reconstruído no escopo institucional aprovado. Estão incluídas até três landing pages. A identidade visual existente será aproveitada; rebranding completo não está incluído.",
    breakdownTitle: "Composição da implantação",
    breakdown: [
      {
        title: "Planejamento e arquitetura digital",
        amount: "R$ 700,00",
        items: [
          "Definição das prioridades comerciais",
          "Organização da arquitetura do site",
          "Estruturação das categorias de serviços",
          "Definição das primeiras frentes de aquisição",
        ],
      },
      {
        title: "Reconstrução do site institucional",
        amount: "R$ 1.500,00",
        items: [
          "Reconstrução da presença digital institucional",
          "Aproveitamento da identidade visual existente",
          "Organização da apresentação do escritório, serviços e portfólio",
          "Navegação responsiva",
          "Integração de contatos e chamadas para ação",
        ],
      },
      {
        title: "Até 3 landing pages comerciais",
        amount: "R$ 750,00",
        items: [
          "Criação de até três páginas específicas por serviço",
          "Conteúdo comercial orientado à conversão",
          "Apresentação dos diferenciais e materiais fornecidos",
          "Formulários, CTAs e integração com WhatsApp, quando aplicável",
          "Integração visual e de navegação com o site institucional",
        ],
      },
      {
        title: "Conversões, integrações e preparação técnica",
        amount: "R$ 600,00",
        items: [
          "Configuração inicial dos eventos de conversão acordados",
          "Integração dos pontos de contato previstos",
          "Validação técnica do rastreamento",
          "Preparação da estrutura para as campanhas iniciais de Google Ads",
        ],
      },
    ],
    totalLabel: "Total da implantação",
    totalAmount: "R$ 3.550,00",
  },
  management: {
    code: "02",
    title: "Gestão mensal de Google Ads",
    priceLine: "R$ 997,00/mês",
    lead: "Operação contínua das campanhas contratadas, com análise de desempenho e recomendações de evolução.",
    firstCycleBadge: "1º mês de gestão gratuito",
    firstCycleNote: "A cobrança de R$ 997,00/mês começa a partir do segundo mês.",
    scopeNote:
      "A gestão mensal não inclui desenvolvimento contínuo de novas páginas, manutenção ilimitada do site ou alterações irrestritas de escopo.",
  },
  media: {
    code: "03",
    title: "Investimento em mídia",
    dailyAmount: "R$ 900,00 a R$ 1.500,00/mês",
    monthlyApprox: "Pago diretamente ao Google",
    lead: "Referência inicial de verba. O orçamento começa em uma ou duas frentes prioritárias, definidas conforme demanda, região, concorrência, margem e capacidade operacional.",
    recommendLabel: "Princípios para a verba inicial",
  },
  summary: {
    title: "Resumo do investimento",
    rows: [
      { label: "Implantação digital, pagamento único", value: "R$ 3.550,00", tone: "default" },
      { label: "1º mês de gestão de Google Ads", value: "R$ 0,00", tone: "highlight" },
      { label: "Gestão de Google Ads a partir do 2º mês", value: "R$ 997,00/mês", tone: "default" },
      { label: "Verba de mídia, paga diretamente ao Google", value: "R$ 900,00 a R$ 1.500,00/mês", tone: "media" },
      { label: "Investimento total estimado no primeiro mês, incluindo mídia", value: "R$ 4.450,00 a R$ 5.050,00", tone: "range" },
    ],
    note: "O primeiro mês de gestão é gratuito. A verba de mídia é paga diretamente ao Google e permanece separada da remuneração da Raise One.",
  },
  conditions: [
    "A implantação é cobrada uma única vez.",
    "O primeiro mês de gestão de Google Ads é gratuito.",
    "A partir do segundo mês, a gestão de Google Ads é cobrada em R$ 997,00 por mês, conforme as condições do contrato.",
    "O site será reconstruído dentro do escopo institucional aprovado.",
    "Estão incluídas até três landing pages comerciais.",
    "Páginas adicionais, funcionalidades especiais e integrações complexas serão orçadas separadamente.",
    "A identidade visual existente será aproveitada; um projeto completo de rebranding não está incluído.",
    "Fotografias, projetos, informações técnicas e autorizações de divulgação serão fornecidos pela Arch Genius.",
    "Produção audiovisual, gestão de redes sociais, Meta Ads, automações avançadas, sistemas próprios, licenças de terceiros e verba de mídia não estão incluídos na implantação.",
    "O prazo será definido após a aprovação do escopo, a disponibilização dos materiais e a liberação dos acessos.",
  ],
  direction: {
    title: "Direcionamento estratégico",
    body: "A proposta combina uma base institucional reconstruída, páginas comerciais específicas e aquisição digital mensurável. O objetivo é apresentar melhor as competências da Arch Genius, conectar cada serviço à demanda correspondente e criar uma estrutura que possa crescer progressivamente, sem anunciar todas as frentes ao mesmo tempo.",
    caution:
      "Não há promessa de volume específico de leads ou contratos. O compromisso é entregar a estrutura definida, preparar a mensuração e otimizar as campanhas contratadas com base nos dados disponíveis.",
  },
  leanTitle: "Base institucional reconstruída. Aquisição progressiva.",
  leanBody:
    "A implantação entrega o site, até três landing pages e a preparação técnica. O primeiro mês de gestão é gratuito. A partir do segundo mês, a gestão opera as campanhas por R$ 997,00. Novas páginas e novas frentes entram como expansão, com escopo e aprovação próprios.",
  materialsNote:
    "Fotografias, projetos e autorizações de divulgação são fornecidos pela Arch Genius. A Raise One organiza a apresentação comercial desses materiais na nova estrutura.",
  timelineNote:
    "O prazo de implantação é definido após a aprovação do escopo, a disponibilização dos materiais e a liberação dos acessos.",
  footer:
    "Produções audiovisuais, gestão de redes sociais, Meta Ads, páginas ou campanhas adicionais, automações avançadas ou soluções de IA poderão ser contratados separadamente, mediante definição e aprovação de escopo.",
};

export const ARCH_GENIUS_REFERENCE = {
  company: "Arch Genius Arquitetura",
  client: "Arquitetura · Engenharia · Serviços técnicos",

  hero: {
    eyebrow: "Proposta comercial",
    headline: "Reestruturação Digital e Aquisição de Clientes",
    headlineLines: ["Reestruturação Digital", "e Aquisição de Clientes"] as const,
    lead: "Uma nova estrutura digital para conectar a identidade, o portfólio e os serviços da Arch Genius a uma estratégia de aquisição de clientes orientada por intenção de busca.",
    strategyLine: "Marketing + Tecnologia + IA",
    pillars: ["Site institucional", "Landing pages", "Google Ads", "Conversão e mensuração"],
    footnote:
      "Uma presença digital integrada, não uma atualização visual isolada nem um conjunto de páginas soltas ao lado do site atual.",
    cta: "Conhecer o projeto",
  },

  diagnosis: {
    headline: "Uma operação com diferentes competências e oportunidades de crescimento.",
    subheadline:
      "O escritório já possui identidade visual, site, portfólio e experiência em frentes da arquitetura e da engenharia. A aquisição ocorre predominantemente por indicação. O próximo passo é reconstruir a presença digital para apresentar essas competências com consistência e gerar oportunidades comerciais mensuráveis.",
    findings: [
      {
        title: "Identidade e presença",
        body: "Identidade visual estabelecida, site e portfólio existentes, uma base aproveitável para uma reconstrução orientada à conversão.",
      },
      {
        title: "Competências amplas",
        body: "Experiência em diferentes frentes de arquitetura, engenharia e serviços técnicos relacionados.",
      },
      {
        title: "Aquisição por relacionamento",
        body: "Clientes chegam principalmente por indicação e networking profissional, com interesse em ampliar a captação digital.",
      },
      {
        title: "Materiais aproveitáveis",
        body: "Projetos e materiais existentes que podem fortalecer a apresentação comercial quando bem organizados.",
      },
    ],
    practiceAreas: [
      "Arquitetura e urbanismo",
      "Projetos residenciais e comerciais",
      "Reformas e construção",
      "Design de interiores",
      "Gestão e acompanhamento de obras",
      "Regularização imobiliária",
      "Vistorias e avaliações",
      "Segurança contra incêndio e serviços técnicos",
    ],
    practiceNote:
      "Síntese inicial do diagnóstico. Não significa que todas as frentes serão anunciadas ou desenvolvidas como landing page na primeira implantação.",
    closing:
      "O desafio não é a ausência de capacidade técnica. É organizar o que já existe em uma estrutura digital consistente.",
  },

  challenge: {
    headline: "Um portfólio amplo precisa de uma estratégia comercial igualmente organizada.",
    items: [
      {
        title: "Comunicação",
        body: "Muitos serviços competem pela mesma mensagem. O visitante precisa interpretar o portfólio, em vez de reconhecer a solução para o próprio problema.",
      },
      {
        title: "Aquisição",
        body: "A captação depende de indicações. Sem um canal digital organizado, novas oportunidades não têm previsibilidade.",
      },
      {
        title: "Conversão",
        body: "O site apresenta competências, mas ainda não conduz cada perfil a um caminho claro de contato.",
      },
      {
        title: "Capacidade operacional",
        body: "Mais contatos sem filtro aumentam visitas e orçamentos sem garantir margem. A aquisição precisa respeitar o que o escritório consegue atender bem.",
      },
    ],
    closing:
      "O objetivo não é simplesmente gerar mais contatos. É criar uma presença digital capaz de atrair oportunidades compatíveis com o negócio.",
  },

  opportunity: {
    headline: "Existem diferentes demandas. Precisamos escolher onde competir primeiro.",
    lead: "Pessoas e empresas procuram soluções específicas. Cada demanda pode exigir uma oferta, uma comunicação e uma página próprias, em vez de concentrar tudo em uma mensagem genérica.",
    isolatedLp:
      "Uma landing page isolada pode atender a uma campanha específica, mas não resolve a necessidade de uma presença digital institucional consistente. Por isso, a proposta contempla a reconstrução do site e a criação de páginas comerciais conectadas, mantendo uma experiência uniforme para quem conhece a Arch Genius por diferentes canais.",
    fronts: [
      {
        title: "Projetos e reformas residenciais",
        body: "Demanda com intenção de busca relevante; combina com crescimento via Google. Ainda precisamos validar ticket, região e capacidade.",
      },
      {
        title: "Projetos comerciais e industriais",
        body: "Frente com potencial de trabalhos de maior porte; exige clareza sobre o que se entrega diretamente e o que depende de parceiros.",
      },
      {
        title: "Regularização imobiliária",
        body: "Serviço específico, com público e jornada próprios. Pode ser candidato a página e campanha dedicadas se houver prioridade.",
      },
      {
        title: "Segurança contra incêndio e serviços técnicos",
        body: "Operação mencionada com tração e rede de parceiros; antes de anunciar, confirmar quem contrata, executa e responde tecnicamente.",
      },
    ],
    frontsNote:
      "Hipóteses de arquitetura comercial. Nem todas precisam ser desenvolvidas ou anunciadas na primeira implantação.",
    recommendation: {
      eyebrow: "Direcionamento recomendado",
      headline: "Base digital integrada. Aquisição progressiva.",
      body: "Reconstruímos o site institucional e as páginas comerciais previstas no contrato. A aquisição começa por uma ou duas frentes de Google Ads e evolui conforme a demanda, a capacidade operacional e os dados justificarem.",
      method:
        "A arquitetura pode comportar outras frentes. A ativação das campanhas não precisa, e não deve, acontecer toda de uma vez.",
    },
    criteriaTitle: "A escolha das primeiras frentes de aquisição deverá considerar",
    criteria: [
      "Demanda de pesquisa",
      "Valor e margem dos serviços",
      "Concorrência",
      "Região atendida",
      "Capacidade de entrega",
      "Disponibilidade de profissionais e parceiros",
    ],
    flowLabel: "Jornada comercial integrada",
    flow: [
      { label: "Site institucional", hint: "Marca e credibilidade" },
      { label: "Página do serviço", hint: "Oferta específica" },
      { label: "Google Ads", hint: "Intenção de busca" },
      { label: "Contato", hint: "Formulário ou WhatsApp" },
      { label: "Oportunidade", hint: "Orçamento e contrato" },
    ] as const,
  },

  architecture: {
    headline: "Uma estrutura. Diferentes frentes de aquisição.",
    lead: "O projeto é composto por três camadas integradas. A identidade visual existente é preservada e aplicada de forma consistente em toda a experiência.",
    layers: [
      {
        number: "01",
        title: "Site institucional",
        subtitle: "Base do projeto",
        body: "Reconstrução da presença institucional da Arch Genius: marca, credibilidade, portfólio e visão geral.",
        items: [
          "Página inicial com posicionamento claro",
          "Apresentação institucional e equipe",
          "Organização das categorias de serviços",
          "Portfólio de projetos",
          "Contato, orçamento e CTAs",
          "Navegação e experiência responsiva",
        ],
        note: "As páginas institucionais definitivas serão delimitadas no escopo comercial final.",
      },
      {
        number: "02",
        title: "Landing pages por serviço",
        subtitle: "Expansão comercial",
        body: "Páginas específicas para apresentar ofertas e receber tráfego das campanhas relacionadas.",
        items: [
          "Projetos e reformas residenciais",
          "Projetos comerciais e industriais",
          "Regularização imobiliária",
          "Segurança contra incêndio e serviços técnicos",
        ],
        note: "A implantação inclui até três landing pages. As demais frentes da arquitetura podem ser desenvolvidas depois, com escopo próprio.",
      },
      {
        number: "03",
        title: "Aquisição e conversão",
        subtitle: "Operação recorrente",
        body: "Campanhas de Google Ads conectadas às páginas correspondentes, com mensuração e otimização contínua.",
        items: [
          "Campanhas direcionadas às páginas relevantes",
          "CTAs, formulários e WhatsApp",
          "Rastreamento dos eventos previstos",
          "Registro básico de oportunidades",
        ],
        note: "As campanhas serão ativadas progressivamente, conforme prioridades e capacidade de atendimento.",
      },
    ],
    diagramLabel: "Como as camadas se conectam",
    diagram: [
      { label: "Institucional", hint: "Marca e portfólio" },
      { label: "Landing page", hint: "Serviço específico" },
      { label: "Google Ads", hint: "Intenção de busca" },
      { label: "Contato", hint: "Qualificação" },
      { label: "Contrato", hint: "Resultado comercial" },
    ] as const,
  },

  pillars: [
    {
      number: "01",
      badge: "Estratégia",
      title: "Estratégia e arquitetura digital",
      subtitle: "Organizar a oferta, a navegação e as categorias comerciais.",
      objective:
        "Definir prioridades e transformar o diagnóstico em uma arquitetura de informação compreensível.",
      items: [
        "Validação das prioridades",
        "Arquitetura do site",
        "Organização do portfólio",
        "Definição das frentes comerciais",
      ],
    },
    {
      number: "02",
      badge: "Site",
      title: "Reconstrução do site institucional",
      subtitle: "Nova estrutura institucional, aproveitando a identidade visual existente.",
      objective:
        "Substituir o site atual por uma experiência consistente, não apenas ajustar o que já existe.",
      items: [
        "Novo layout e navegação",
        "Apresentação institucional revisada",
        "Organização dos serviços",
        "Portfólio, contato e responsividade",
      ],
    },
    {
      number: "03",
      badge: "Landing pages",
      title: "Landing pages comerciais",
      subtitle: "Páginas por serviço, conectadas ao site institucional.",
      objective:
        "Cada frente contratada ganha uma página com proposta de valor, provas e CTA adequados àquela demanda.",
      items: [
        "Estrutura orientada à conversão",
        "Copy comercial e diferenciais",
        "Projetos e materiais disponíveis",
        "Formulários, CTAs e WhatsApp",
      ],
    },
    {
      number: "04",
      badge: "Aquisição",
      title: "Aquisição e mensuração",
      subtitle: "Campanhas de Google Ads previstas no contrato, ligadas às páginas correspondentes.",
      objective:
        "Ativar a aquisição nas frentes prioritárias e medir o caminho até a oportunidade, sem anunciar tudo no primeiro dia.",
      items: [
        "Pesquisa de palavras-chave",
        "Campanhas das frentes contratadas",
        "Direcionamento para a página relacionada",
        "Conversões e otimização contínua",
      ],
    },
  ],

  ads: {
    headline: "Construímos a base. Ativamos a aquisição por frentes.",
    lead: "A estrutura digital poderá comportar outras páginas conforme o escopo. As campanhas começam pelas frentes prioritárias e evoluem conforme a demanda, a capacidade operacional e os dados justificarem.",
    logic: [
      "Validação das frentes iniciais",
      "Pesquisa de palavras-chave",
      "Campanhas ligadas às páginas correspondentes",
      "Mensuração dos contatos",
      "Otimização com os primeiros dados",
      "Ativação gradual de novas frentes",
    ],
    principle:
      "Nem todas as landing pages receberão investimento de mídia no lançamento. Publicar a estrutura não é o mesmo que anunciar todas as frentes.",
    closing:
      "Não projetamos volume de pesquisas, custo por lead ou número de clientes. O investimento acompanha a validação e a capacidade de atendimento.",
  },

  funnel: {
    headline: "Do clique à oportunidade",
    lead: "A aquisição não termina no contato. Distinguimos clique, oportunidade, proposta e contrato.",
    steps: [
      "Pesquisa o serviço",
      "Encontra a Arch Genius",
      "Acessa a página da necessidade",
      "Entra em contato",
      "A equipe qualifica",
      "Segue para orçamento",
      "O resultado é registrado",
    ],
    distinctionTitle: "O que realmente importa",
    distinctions: [
      { label: "Contatos", detail: "Quem chegou pelos canais digitais" },
      { label: "Oportunidades", detail: "Demandas compatíveis com o negócio" },
      { label: "Propostas", detail: "Orçamentos enviados" },
      { label: "Contratos", detail: "Negócios fechados" },
    ],
    opsNote:
      "Organização comercial básica entra nesta etapa. CRM completo, automações ou sistemas próprios só entram com escopo próprio.",
  },

  metrics: {
    headline: "Decisões orientadas por dados comerciais.",
    acquisition: ["Impressões", "Cliques", "Custo de mídia"],
    interest: ["Visitas às páginas", "Cliques no WhatsApp", "Formulários enviados"],
    qualification: [
      "Contatos relacionados aos serviços",
      "Oportunidades qualificadas",
      "Solicitações de orçamento",
    ],
    result: ["Propostas enviadas", "Contratos fechados", "Receita informada pelo cliente"],
    note: "O acompanhamento depende da disponibilidade dos dados comerciais e das integrações viáveis. Não atribuímos vendas à mídia sem evidência suficiente.",
    businessLabel: "Leitura comercial do funil",
    businessLine: "Investimento → Interesse → Qualificação → Resultado",
    optimization:
      "Esses indicadores orientam ajustes de campanha, priorização de frentes e decisões sobre onde ampliar ou pausar o investimento.",
  },

  roadmap: [
    {
      period: "Fase 01",
      title: "Planejamento",
      items: [
        "Validação dos serviços prioritários",
        "Público e região",
        "Arquitetura de informação",
        "Landing pages incluídas",
        "Organização dos materiais",
      ],
    },
    {
      period: "Fase 02",
      title: "Site institucional",
      items: [
        "Desenvolvimento do novo site",
        "Identidade visual existente",
        "Serviços e portfólio",
        "Navegação, CTAs e contato",
      ],
    },
    {
      period: "Fase 03",
      title: "Landing pages",
      items: [
        "Páginas comerciais contratadas",
        "Conteúdo de conversão",
        "Integração com o institucional",
        "Formulários e eventos",
      ],
    },
    {
      period: "Fase 04",
      title: "Aquisição",
      items: [
        "Campanhas iniciais de Google Ads",
        "Direcionamento às páginas",
        "Validação das conversões",
        "Publicação aprovada",
      ],
    },
    {
      period: "Fase 05",
      title: "Gestão",
      items: [
        "Acompanhamento dos indicadores",
        "Otimização das campanhas",
        "Análise das oportunidades",
        "Recomendações de expansão",
      ],
    },
  ],

  project: [
    {
      title: "Estratégia",
      items: [
        "Diagnóstico de prioridades e serviços",
        "Arquitetura da presença digital",
        "Definição das primeiras frentes de aquisição",
      ],
    },
    {
      title: "Site institucional",
      items: [
        "Reconstrução no escopo aprovado",
        "Identidade visual existente aplicada",
        "Portfólio, serviços, contato e CTAs",
      ],
    },
    {
      title: "Landing pages",
      items: [
        "Até 3 landing pages comerciais",
        "Conteúdo e prova por frente",
        "Integração com o site institucional",
      ],
    },
    {
      title: "Aquisição",
      items: [
        "Campanhas iniciais de Google Ads",
        "Rastreamento de contatos e oportunidades",
        "Relatório e acompanhamento",
      ],
    },
  ],

  expansion: {
    number: "Depois",
    title: "A estrutura pode evoluir conforme o negócio amadurece.",
    subtitle:
      "Possibilidades futuras, sem incorporá-las automaticamente ao investimento inicial:",
    items: [
      "Landing pages adicionais",
      "Novas campanhas por segmento",
      "Produção audiovisual dos projetos",
      "Conteúdo técnico e institucional",
      "Automação do acompanhamento comercial",
      "Ferramentas internas e soluções com IA para processos técnicos",
    ],
    aiNote:
      "O interesse em IA aplicada à arquitetura, engenharia e processos técnicos é uma oportunidade de diagnóstico futuro. Não é uma entrega já contratada nesta proposta.",
  },

  exclusions: {
    included: [
      "Reconstrução do site institucional no escopo aprovado",
      "Até 3 landing pages comerciais",
      "Aplicação da identidade visual existente",
      "Organização do portfólio e das categorias de serviços",
      "CTAs e formulários previstos",
      "Configuração inicial de mensuração",
      "Preparação das campanhas contratadas",
    ],
    wont: [
      "Gestão recorrente de redes sociais",
      "Calendário mensal de conteúdo",
      "Produção mensal de posts",
      "Captação audiovisual",
      "Gestão de Meta Ads",
      "Landing pages além das 3 incluídas",
      "Campanhas adicionais não previstas",
      "Manutenção ilimitada do site",
      "Desenvolvimento de sistemas próprios",
      "Automações avançadas e soluções de IA",
      "Licenças de softwares de terceiros",
      "Verba de mídia (paga à plataforma)",
    ],
    will: "Reconstruir a presença digital da Arch Genius e operar a aquisição nas frentes contratadas, com identidade consistente e limites comerciais explícitos.",
  },

  whyRaiseOne: {
    headline: "Marketing, tecnologia e estratégia trabalhando juntos.",
    lead: "A Raise One conduz a recomendação e entrega a estrutura. O cliente confirma as decisões sobre a própria operação: prioridades, capacidade e quais frentes ativar primeiro.",
    pillars: [
      {
        title: "Estratégia",
        body: "Organizar as prioridades e transformar o diagnóstico em arquitetura digital.",
      },
      {
        title: "Marketing",
        body: "Conectar a oferta às pessoas que procuram os serviços selecionados.",
      },
      {
        title: "Tecnologia",
        body: "Reconstruir o site e as páginas comerciais em uma experiência integrada.",
      },
      {
        title: "Dados",
        body: "Mensurar o desempenho e orientar as próximas decisões.",
      },
    ],
  },

  outcome: {
    headline: "O objetivo",
    body: "Uma presença digital integrada, preparada para apresentar os serviços da Arch Genius e transformar intenção de busca em oportunidades comerciais.",
    via: [
      "Site institucional reconstruído",
      "Landing pages conectadas",
      "Identidade visual consistente",
      "Aquisição por intenção de busca",
      "Contatos mais qualificados",
      "Mensuração de oportunidades",
    ],
    caution:
      "Sem promessa de volume específico de clientes ou contratos. O compromisso é uma estrutura definida, rastreável e expansível.",
  },

  nextSteps: [
    {
      title: "Aprovação da proposta",
      detail: "Validação do investimento, das até 3 landing pages e das primeiras frentes de aquisição.",
    },
    {
      title: "Formalização e alinhamento",
      detail: "Contrato, cronograma e definição das frentes iniciais de Google Ads.",
    },
    {
      title: "Organização dos materiais e acessos",
      detail: "Conteúdos, projetos, acessos digitais e referências da identidade visual.",
    },
    {
      title: "Desenvolvimento da estrutura",
      detail: "Site institucional, até 3 landing pages, conversões e preparação das campanhas.",
    },
    {
      title: "Validação e lançamento",
      detail: "Publicação da estrutura e ativação das frentes de mídia aprovadas.",
    },
    {
      title: "Acompanhamento e otimização",
      detail: "Indicadores, ajustes e recomendações de expansão.",
    },
  ],

  closing: {
    title: "Uma presença digital única: institucional, comercial e preparada para crescer.",
    body: "A Arch Genius já tem competência técnica e um portfólio amplo. O projeto reconstruirá a forma de apresentar isso e ligará cada página à aquisição, sem anunciar tudo no primeiro dia.",
    brandLine: "Raise One · Marketing + Tecnologia + IA",
    flowLabel: "Operação planejada",
    flowSteps: [
      { label: "Institucional", hint: "Credibilidade" },
      { label: "Landing page", hint: "Oferta específica" },
      { label: "Google Ads", hint: "Intenção de busca" },
      { label: "Contato", hint: "Qualificação" },
      { label: "Contrato", hint: "Resultado" },
    ] as const,
  },

  cta: {
    label: "Quero avançar com este plano",
    message:
      "Olá! Revisei a proposta de reestruturação digital e aquisição de clientes da Raise One para a Arch Genius Arquitetura e gostaria de avançar.",
    pendingLabel: "Validar o direcionamento",
    pendingMessage:
      "Olá! Revisei a proposta da Raise One para a Arch Genius e gostaria de validar o direcionamento e avançar.",
  },
} as const;

export const ARCH_GENIUS_NAV = [
  { id: "partida", label: "Partida" },
  { id: "desafio", label: "Desafio" },
  { id: "oportunidade", label: "Oportunidade" },
  { id: "arquitetura", label: "Arquitetura" },
  { id: "solucao", label: "Solução" },
  { id: "projeto", label: "Projeto" },
  { id: "investimento", label: "Investimento" },
  { id: "proximos-passos", label: "Próximos passos" },
];

export const ARCH_GENIUS_SLUG = "arch-genius";
