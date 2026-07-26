export const nobreProject = {
  brand: "Raise One Soluções",
  client: "Nobre Imóveis",
  preparedFor: "Nobre Imóveis",
  preparedBy: "Raise One Soluções",
  date: "Julho 2026",
  documentVersion: "1.0",
  cta: {
    label: "Aprovar projeto",
    message:
      "Olá! Revisei a proposta do Sistema de Atualização Periódica de Proprietários para a Nobre Imóveis e gostaria de aprovar o projeto.",
    fallbackHref:
      "https://wa.me/5513999999999?text=Ola!%20Revisei%20a%20proposta%20do%20Sistema%20de%20Atualizacao%20Periodica%20de%20Proprietarios%20para%20a%20Nobre%20Imoveis%20e%20gostaria%20de%20aprovar%20o%20projeto.",
  },
} as const;

export const navSections = [
  { label: "Resumo", href: "#resumo" },
  { label: "Escopo", href: "#escopo-executivo" },
  { label: "Plano", href: "#metodo" },
  { label: "Arquitetura", href: "#arquitetura" },
  { label: "Ciclo", href: "#ciclo" },
  { label: "Casos de uso", href: "#casos" },
  { label: "Plataforma", href: "#plataforma" },
  { label: "Governança", href: "#governanca" },
  { label: "Investimento", href: "#investimento" },
] as const;

export const heroContent = {
  title: "Sistema Inteligente de Atualização de Proprietários",
  subtitle: "Projeto de desenvolvimento sob medida para a Nobre Imóveis",
  exclusive: "Solução desenvolvida sob medida para a Nobre Imóveis.",
} as const;

export const projectBrief = {
  investment: "R$ 8.900,00",
  deadline: "15 a 20 dias úteis",
  client: "Nobre Imóveis",
  status: "Projeto Sob Medida",
  version: "v1.0",
} as const;

export const solutionSummary = {
  title: "A solução em uma frase",
  text: "Será desenvolvida uma aplicação integrada ao Imoview responsável por identificar automaticamente os imóveis que precisam de atualização, realizar os contatos via WhatsApp, interpretar as respostas recebidas e encaminhar apenas exceções para a equipe operacional.",
} as const;

export const developmentPlan = {
  title: "Plano de desenvolvimento",
  intro: "Cinco fases sequenciais — Integração, Automação, Interpretação, Operação e Implantação.",
} as const;

export const executiveScope = {
  title: "Escopo executivo",
  items: [
    { item: "Integração com Imoview", included: true },
    { item: "WhatsApp Business", included: true },
    { item: "Google Cloud", included: true },
    { item: "Interpretação de respostas", included: true },
    { item: "Painel operacional", included: true },
    { item: "Histórico de interações", included: true },
    { item: "Agendamento automático", included: true },
    { item: "Implantação assistida", included: true },
    { item: "Treinamento da equipe", included: true },
    { item: "CRM próprio", included: false },
    { item: "Alteração automática no Imoview", included: false },
    { item: "Atendimento conversacional automatizado", included: false },
  ],
} as const;

export const executiveSummary = {
  title: "Resumo executivo",
  items: [
    { label: "Objetivo", value: "Automatizar o ciclo de atualização periódica dos proprietários." },
    { label: "Infraestrutura", value: "Google Cloud." },
    { label: "Integração principal", value: "Imoview (API)." },
    {
      label: "Resultado esperado",
      value:
        "Contatos automáticos a cada 60 dias, com encaminhamento apenas das exceções para a equipe.",
    },
  ],
} as const;

export const methodPhases = [
  {
    phase: "Fase 1",
    title: "Integração",
    objective: "Estabelecer conexão estável com o Imoview como fonte oficial de dados.",
    activities: [
      "Configuração da integração via API",
      "Mapeamento de imóveis, proprietários e campos operacionais",
      "Validação de consultas com dados reais da carteira",
    ],
    deliverable: "Integração Imoview operacional em ambiente de homologação.",
    expectedResult:
      "A solução passará a consultar imóveis e proprietários diretamente no Imoview, sem cadastro paralelo.",
  },
  {
    phase: "Fase 2",
    title: "Automação",
    objective: "Implementar o ciclo automático de identificação e envio de contatos.",
    activities: [
      "Motor de agendamento com ciclo de 60 dias",
      "Fila diária de contatos elegíveis",
      "Integração com WhatsApp Business para envio e recebimento",
      "Distribuição controlada durante horário comercial",
    ],
    deliverable: "Rotina de envio automático funcionando em ambiente de testes.",
    expectedResult:
      "O sistema identificará automaticamente quais imóveis devem ser atualizados diariamente e executará os contatos sem intervenção manual.",
  },
  {
    phase: "Fase 3",
    title: "Interpretação",
    objective: "Interpretar respostas e classificar automaticamente cada interação.",
    activities: [
      "Recebimento e registro de respostas",
      "Interpretação de conteúdo em linguagem natural",
      "Classificação operacional das respostas",
      "Registro de histórico por imóvel e proprietário",
      "Validação da interpretação com cenários representativos da operação",
    ],
    deliverable:
      "Interpretação das respostas validada utilizando cenários representativos da operação da Nobre Imóveis.",
    expectedResult:
      "Cada resposta recebida será classificada automaticamente e registrada no histórico do imóvel.",
  },
  {
    phase: "Fase 4",
    title: "Operação",
    objective: "Definir ações automáticas, gerenciar pendências e entregar exceções à equipe.",
    activities: [
      "Núcleo de decisão pós-interpretação",
      "Reagendamento automático do próximo ciclo",
      "Geração e gestão de pendências",
      "Painel operacional para acompanhamento",
    ],
    deliverable: "Painel operacional publicado com fluxo completo de exceções.",
    expectedResult:
      "A equipe receberá apenas pendências que exigem ação humana — não o volume completo de mensagens.",
  },
  {
    phase: "Fase 5",
    title: "Implantação",
    objective: "Publicar em produção, treinar a equipe e homologar a operação.",
    activities: [
      "Publicação do ambiente de produção",
      "Configuração final das rotinas automáticas",
      "Treinamento da equipe responsável",
      "Acompanhamento da entrada em operação",
    ],
    deliverable: "Sistema homologado e documentado em produção.",
    expectedResult:
      "Operação em produção com equipe treinada e critérios de aceite validados.",
  },
] as const;

export const useCases = [
  {
    id: "disponivel",
    title: "Confirmação de disponibilidade",
    event: 'Proprietário responde: "Continua disponível."',
    processing: "Sistema registra confirmação e classifica como disponível.",
    action: "Reagenda próximo ciclo em 60 dias. Encerra sem pendência.",
    responsible: "Nenhuma ação da equipe.",
  },
  {
    id: "alugado",
    title: "Imóvel comercializado",
    event: 'Proprietário responde: "Aluguei."',
    processing: "Sistema identifica comercialização e gera pendência.",
    action: "Suspende novos contatos até resolução.",
    responsible: "Equipe confirma e atualiza status no Imoview.",
  },
  {
    id: "preco",
    title: "Alteração de preço",
    event: 'Proprietário responde: "Mudei o preço para R$ 420 mil."',
    processing: "Sistema extrai novo valor e registra alteração.",
    action: "Gera pendência para validação.",
    responsible: "Equipe valida e atualiza o Imoview manualmente.",
  },
] as const;

export const architectureNote = {
  label: "Fonte única da verdade",
  value: "Imoview",
  detail: "Todos os dados de imóveis e proprietários são consultados via API. Nenhum cadastro paralelo.",
} as const;

export const operationalArchitecture = [
  {
    layer: "Imoview",
    shortLabel: "IMOVIEW",
    role: "Fonte oficial dos imóveis",
    responsibility: "Consulta via API · sem cadastro paralelo",
    icon: "database" as const,
    highlight: "Fonte única da verdade",
  },
  {
    layer: "Motor de Agendamento",
    shortLabel: "MOTOR DE AGENDAMENTO",
    role: "Seleciona imóveis elegíveis",
    responsibility: "Identifica ciclo completo · monta fila diária",
    icon: "calendar" as const,
  },
  {
    layer: "Comunicação WhatsApp",
    shortLabel: "COMUNICAÇÃO",
    role: "Executa envios e recebe respostas",
    responsibility: "Mensagens personalizadas por imóvel",
    icon: "message" as const,
  },
  {
    layer: "Registro das Interações",
    shortLabel: "REGISTRO",
    role: "Recebe e registra respostas",
    responsibility: "Persistência · preparação para interpretação",
    icon: "inbox" as const,
  },
  {
    layer: "Interpretação",
    shortLabel: "INTERPRETAÇÃO",
    role: "Interpreta conteúdo das respostas",
    responsibility: "Classificação operacional automática",
    icon: "sparkles" as const,
  },
  {
    layer: "Núcleo de Decisão",
    shortLabel: "NÚCLEO DE DECISÃO",
    role: "Define a próxima ação de cada interação",
    responsibility: "Reagenda · gera pendência · encerra ciclo",
    icon: "workflow" as const,
  },
  {
    layer: "Painel da Equipe",
    shortLabel: "PAINEL",
    role: "Entrega somente exceções",
    responsibility: "Pendências · histórico · indicadores",
    icon: "dashboard" as const,
  },
] as const;

export const operationalScale = {
  title: "Escala operacional",
  steps: [
    { value: "1.400", label: "imóveis" },
    { value: "~23", label: "contatos/dia" },
    { value: "60", label: "dias" },
    { value: "100%", label: "da carteira atualizada" },
  ],
} as const;

export const cycleDemonstration = {
  title: "Demonstração do ciclo",
  subtitle: "Segunda-feira — um dia de operação",
  beats: [
    {
      time: "09:00",
      title: "Sistema consulta o Imoview",
      detail: "23 imóveis entram no ciclo do dia.",
    },
    {
      time: "09:15",
      title: "Distribuição de mensagens",
      detail: "23 mensagens começam a ser enviadas via WhatsApp.",
    },
    {
      time: "10:30",
      title: "Respostas recebidas",
      detail: "17 respostas registradas no sistema.",
    },
    {
      time: "11:05",
      title: "Interpretação concluída",
      detail: null,
      breakdown: [
        { label: "15 continuam disponíveis", tone: "neutral" as const },
        { label: "1 alterou preço", tone: "warning" as const },
        { label: "1 alugado", tone: "alert" as const },
      ],
    },
    {
      time: "11:06",
      title: "Painel da equipe",
      detail: null,
      alerts: ["Alteração de preço", "Imóvel alugado"],
    },
    {
      time: "11:08",
      title: "Colaboradora resolve as pendências",
      detail: "Fim do ciclo operacional do dia.",
    },
  ],
} as const;

export const postCycleRules = [
  "Todo ciclo concluído gera registro permanente no histórico.",
  "Após confirmação de disponibilidade, o próximo contato é reagendado automaticamente.",
  "Pendências permanecem abertas até resolução explícita pela equipe.",
  "Alterações no Imoview exigem validação humana — o sistema não altera o CRM automaticamente.",
] as const;

export const operationalRules = [
  "Cada imóvel possui um ciclo próprio de atualização.",
  "O próximo contato é reagendado automaticamente após cada atualização concluída.",
  "O sistema impede duplicidade de envios para o mesmo imóvel no mesmo ciclo.",
  "Todas as interações ficam registradas com data, conteúdo e classificação.",
  "Toda alteração relevante identificada gera registro no histórico.",
  "Toda exceção gera pendência operacional.",
  "Toda pendência permanece aberta até resolução pela equipe.",
  "Nenhuma alteração é aplicada no Imoview sem validação humana.",
] as const;

export const outOfScope = [
  "Alterações automáticas no Imoview sem validação humana.",
  "Atendimento automático conversacional ao proprietário.",
  "CRM próprio ou cadastro paralelo de imóveis.",
  "Automações comerciais ou de captação de leads.",
  "Integrações além das descritas nesta proposta.",
  "Customizações não previstas no escopo acordado.",
] as const;

export const premises = [
  "API do Imoview disponível e acessível para integração.",
  "Credenciais de acesso ao Imoview fornecidas pela Nobre Imóveis.",
  "Conta Google Cloud criada ou autorizada pela Nobre Imóveis.",
  "Conta WhatsApp Business disponível e configurada.",
  "Ambiente homologado e validado pela equipe da Nobre antes da entrada em produção.",
  "Informações necessárias para configuração fornecidas no prazo acordado.",
] as const;

export const dependencies = [
  "Disponibilidade e estabilidade da API do Imoview.",
  "Disponibilidade dos serviços do WhatsApp Business.",
  "Aprovação e liberação das credenciais necessárias.",
  "Fornecimento das informações operacionais pela Nobre Imóveis.",
  "Participação da equipe no processo de homologação.",
] as const;

export const acceptanceCriteria = [
  "Integração com Imoview operacional e validada.",
  "Envio automático de contatos funcionando conforme ciclo de 60 dias.",
  "Interpretação das respostas validada utilizando cenários representativos da operação da Nobre Imóveis.",
  "Painel operacional disponível com gestão de pendências.",
  "Histórico de interações consultável por imóvel.",
  "Homologação realizada com a equipe da Nobre Imóveis.",
  "Documentação da arquitetura, implantação, integrações, operação e configuração entregue.",
] as const;

export const systemResponsibilities = [
  "Consultar imóveis e proprietários no Imoview via API",
  "Identificar imóveis elegíveis para contato",
  "Distribuir envios ao longo do expediente",
  "Enviar mensagens personalizadas via WhatsApp",
  "Registrar histórico de todas as interações",
  "Interpretar e classificar respostas recebidas",
  "Reagendar automaticamente o próximo ciclo",
  "Gerar pendências para exceções",
  "Manter histórico consultável por imóvel e proprietário",
] as const;

export const teamResponsibilities = [
  "Revisar pendências geradas pelo sistema",
  "Validar alterações identificadas antes de aplicar no Imoview",
  "Atualizar informações no Imoview manualmente",
  "Resolver pendências abertas",
  "Atender solicitações de contato encaminhadas",
  "Participar da homologação e treinamento",
] as const;

export const deliverables = [
  "Aplicação desenvolvida sob medida para a Nobre Imóveis",
  "Integração com Imoview via API",
  "Integração com WhatsApp Business",
  "Motor de agendamento e registro de interações",
  "Camada de interpretação de respostas",
  "Núcleo de decisão operacional",
  "Painel operacional",
  "Ambiente de produção no Google Cloud",
  "Rotinas automáticas configuradas",
  "Treinamento da equipe",
  "Implantação assistida",
  "Documentação da arquitetura da solução",
  "Guia de instalação e implantação",
  "Documentação das integrações",
  "Manual operacional",
  "Guia de configuração",
] as const;

export const technologyPlatform = {
  title: "Plataforma tecnológica",
  groups: [
    {
      label: "Infraestrutura",
      items: ["Google Cloud"],
    },
    {
      label: "Integrações",
      items: ["Imoview API", "WhatsApp Business", "Google Workspace"],
    },
    {
      label: "Inteligência artificial",
      items: ["Google Gemini"],
    },
  ],
} as const;

export const ownershipContent = {
  title: "Propriedade da solução",
  points: [
    "A aplicação será desenvolvida sob medida para a Nobre Imóveis e implantada em infraestrutura própria da empresa.",
    "As credenciais dos serviços utilizados permanecerão sob propriedade da Nobre Imóveis.",
  ],
} as const;

export const futureEvolution = {
  title: "Evolução futura",
  intro: "A arquitetura será preparada para permitir futuras expansões, como:",
  items: [
    "Atualização automática de cadastros",
    "Novas rotinas operacionais",
    "Integrações adicionais",
    "Novos fluxos automatizados",
    "Novos painéis",
  ],
} as const;

export const timeline = [
  { phase: "Kickoff técnico", desc: "Alinhamento de requisitos, premissas e preparação do ambiente." },
  { phase: "Desenvolvimento", desc: "Execução das cinco fases do plano de desenvolvimento." },
  { phase: "Testes", desc: "Validação do fluxo completo com dados reais." },
  { phase: "Implantação", desc: "Publicação do ambiente de produção." },
  { phase: "Homologação", desc: "Treinamento, critérios de aceite e entrada em operação." },
] as const;

export const investmentContent = {
  title: "Investimento do projeto",
  badge: {
    title: "Projeto sob medida",
    description: "Desenvolvimento dedicado à Nobre Imóveis. Não se trata de software pronto ou licença.",
  },
  price: "R$ 8.900,00",
  description: "Desenvolvimento da solução completa conforme escopo apresentado nesta proposta.",
  includes: [
    "Desenvolvimento completo",
    "Integração Imoview",
    "Integração WhatsApp",
    "Interpretação de respostas",
    "Painel operacional",
    "Implantação",
    "Treinamento",
    "Documentação da arquitetura da solução",
    "Guia de instalação e implantação",
    "Documentação das integrações",
    "Manual operacional",
    "Guia de configuração",
  ],
  deadline: {
    title: "Prazo estimado",
    value: "15 a 20 dias úteis",
    note: "O cronograma terá início após a aprovação da proposta e disponibilização dos acessos e informações necessárias para o desenvolvimento.",
    startNote:
      "A contagem do prazo considera a definição dos requisitos finais e a liberação das credenciais do Imoview, WhatsApp Business e Google Cloud.",
  },
  operationalCosts: {
    title: "Custos operacionais",
    note: "Contratados diretamente pela Nobre Imóveis, conforme utilização:",
    items: ["Google Cloud", "WhatsApp Business", "Google Gemini"],
  },
  evolutionPlan: {
    title: "Plano de evolução",
    optionalLabel: "Opcional",
    intro:
      "Caso a Nobre Imóveis deseje acompanhar a evolução da solução após a implantação, poderá ser contratado um plano mensal contemplando:",
    items: [
      "Monitoramento",
      "Suporte técnico",
      "Melhorias",
      "Novas funcionalidades",
      "Acompanhamento operacional",
    ],
    suggestedInvestment: "Investimento sugerido: R$ 490,00/mês",
  },
  guarantees: {
    title: "Garantias do projeto",
    items: [
      "Escopo fechado",
      "Implantação assistida",
      "Código desenvolvido sob medida para a Nobre Imóveis",
      "Ambiente em infraestrutura própria",
      "Documentação completa entregue ao final",
    ],
  },
  packageSummary: {
    title: "O investimento contempla",
    items: [
      "Desenvolvimento",
      "Implantação",
      "Homologação",
      "Documentação completa",
      "Treinamento",
      "Entrada em produção",
    ],
  },
  nextStep: {
    title: "Próximo passo",
    text: "Após a aprovação, será iniciado o kickoff técnico e a configuração dos ambientes.",
  },
} as const;

export const platformMockups = {
  disclaimer:
    "Representação conceitual da interface. O layout final poderá sofrer ajustes durante o desenvolvimento.",
  section: {
    title: "Visualização da plataforma",
    intro:
      "Representações conceituais da interface operacional — para ilustrar como a equipe acompanhará contatos, pendências e histórico antes do início do desenvolvimento.",
  },
  dashboard: {
    title: "Dashboard Operacional",
    subtitle: "Visão geral das atualizações periódicas de proprietários.",
    stats: [
      { label: "Proprietários contatados hoje", value: "23" },
      { label: "Pendências abertas", value: "4" },
      { label: "Atualizações confirmadas", value: "15" },
      { label: "Imóveis elegíveis hoje", value: "23" },
    ],
    tableHeaders: ["Proprietário", "Imóvel", "Status", "Último contato", "Próxima ação"],
    rows: [
      {
        owner: "João da Silva",
        property: "Apt. Centro — #1042",
        status: "Disponível",
        lastContact: "02/08 · 09:14",
        nextAction: "Reagendar ciclo",
      },
      {
        owner: "Maria Oliveira",
        property: "Casa Jardim — #887",
        status: "Preço alterado",
        lastContact: "02/08 · 10:02",
        nextAction: "Validar pendência",
      },
      {
        owner: "Carlos Souza",
        property: "Cobertura — #331",
        status: "Em análise",
        lastContact: "02/08 · 10:45",
        nextAction: "Revisar resposta",
      },
      {
        owner: "Ana Ferreira",
        property: "Sala Comercial — #556",
        status: "Sem resposta",
        lastContact: "01/08 · 09:30",
        nextAction: "Follow-up em 5 dias",
      },
      {
        owner: "Pedro Santos",
        property: "Lote Residencial — #219",
        status: "Contato solicitado",
        lastContact: "02/08 · 11:08",
        nextAction: "Assumir atendimento",
      },
    ],
    activities: [
      "João confirmou disponibilidade",
      "Pendência criada — alteração de preço",
      "Próximo ciclo agendado",
      "Histórico atualizado",
    ],
  },
  pendencies: {
    title: "Pendências Operacionais",
    subtitle: "Situações que necessitam validação da equipe.",
    items: [
      {
        owner: "João da Silva",
        property: "Apartamento Centro",
        type: "Preço identificado",
        detail: "R$ 420.000",
        message: "Pode atualizar para R$420 mil.",
        actions: ["Validar", "Descartar"],
      },
      {
        owner: "Maria Oliveira",
        property: "Casa Jardim",
        type: "Solicitou contato",
        detail: null,
        message: "Prefiro conversar por telefone.",
        actions: ["Assumir atendimento", "Concluir"],
      },
      {
        owner: "Carlos Souza",
        property: "Cobertura",
        type: "Resposta ambígua",
        detail: null,
        message: "Depois conversamos.",
        actions: ["Analisar"],
      },
    ],
  },
  ownerTimeline: {
    title: "Histórico do Proprietário",
    owner: "João da Silva",
    events: [
      { date: "02/08", label: "Mensagem enviada" },
      { date: "02/08", label: "Resposta recebida" },
      { date: "02/08", label: "IA interpretou alteração de preço" },
      { date: "02/08", label: "Pendência criada" },
      { date: "02/08", label: "Operador validou" },
      { date: "02/08", label: "Histórico atualizado" },
      { date: "01/10", label: "Próximo contato agendado" },
    ],
  },
  propertyRecord: {
    title: "Histórico do Imóvel",
    fields: [
      { label: "Imóvel", value: "Apartamento Centro — 3 dorm." },
      { label: "Código", value: "#1042" },
      { label: "Proprietário", value: "João da Silva" },
      { label: "Últimos contatos", value: "02/08 · 01/06 · 03/04" },
      { label: "Últimas alterações", value: "Preço · Status" },
      { label: "Preço anterior", value: "R$ 450.000" },
      { label: "Preço atual", value: "R$ 420.000" },
      { label: "Status", value: "Disponível" },
      { label: "Última atualização", value: "02/08/2026 · 11:22" },
    ],
    timeline: [
      { date: "02/08", label: "Contato realizado via WhatsApp" },
      { date: "02/08", label: "Proprietário confirmou disponibilidade" },
      { date: "01/06", label: "Atualização periódica concluída" },
    ],
  },
  settings: {
    title: "Configurações",
    integrations: {
      title: "Integrações",
      items: ["Imoview", "WhatsApp", "Google Gemini"],
    },
    operational: {
      title: "Configuração operacional",
      fields: [
        { label: "Intervalo entre contatos", value: "60 dias" },
        { label: "Horário permitido", value: "09h às 18h" },
        { label: "Dias úteis", value: "Segunda a Sexta" },
        { label: "Follow-up", value: "5 dias após ausência de resposta" },
        { label: "Limite diário", value: "30 contatos" },
      ],
    },
  },
} as const;

export const mockups = platformMockups;

export const solutionArchitectureDiagram = {
  title: "Arquitetura da solução",
  caption:
    "A aplicação centraliza toda a operação, integrando o Imoview, o WhatsApp Business e os serviços de Inteligência Artificial em uma única plataforma operacional.",
} as const;

export const operationalFlowDiagram = {
  title: "Fluxo operacional",
  caption:
    "Apenas situações que exigem decisão humana são encaminhadas para análise da equipe.",
  steps: [
    "Consultar imóveis",
    "Selecionar imóveis elegíveis",
    "Enviar mensagem",
    "Receber resposta",
    "Interpretar resposta",
  ],
  decision: "Necessita ação humana?",
  yesAction: "Criar pendência",
  noPath: ["Atualizar histórico", "Agendar próximo ciclo"],
} as const;

export const aiFlowDiagram = {
  title: "Fluxo da inteligência artificial",
  caption:
    "A interpretação considera o contexto completo da mensagem, e não apenas palavras isoladas.",
  steps: [
    "Mensagem do proprietário",
    "Interpretação do contexto",
    "Extração das informações relevantes",
    "Classificação da intenção",
    "Decisão operacional",
  ],
  outcomes: ["Atualizar histórico", "Gerar pendência"],
} as const;

export const cloudIntegrationDiagram = {
  title: "Integração Google Cloud",
  layers: ["Usuário", "Aplicação", "Google Cloud", "Banco de Dados"],
  integrationsLabel: "Integrações",
  integrations: ["Imoview", "WhatsApp", "Gemini"],
} as const;

export const footerContent = {
  summary:
    "Solução desenvolvida sob medida para atualização periódica de proprietários, integrada ao Imoview, com comunicação via WhatsApp, interpretação de respostas e painel operacional para gestão de exceções.",
  projectLead: {
    title: "Responsável pela execução",
    name: "Luan Baralle",
    role: "Responsável pela arquitetura, desenvolvimento, implantação e acompanhamento técnico deste projeto.",
  },
  signature: "Nobre Imóveis × Raise One Soluções",
} as const;
