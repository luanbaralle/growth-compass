import type { BlogArticle } from "../types";
import {
  p,
  h2,
  h3,
  ul,
  callout,
  img,
  cta,
  linkCard,
  table,
  blogFeatured,
  blogInline,
  estimateReadTime,
} from "../helpers";

const slug = "programa-crescimento-vs-agencia-trafego";

const sections = [
  p("Empresa cresce, investe R$ 12.000/mês em Google Ads via agência de tráfego e continua sem previsibilidade de receita. Leads chegam, mas ninguém sabe quantos fecham. Landing page desatualizada. CRM inexistente. Marketing e comercial em silos. A agência entrega relatório de cliques — e aponta o dedo para 'qualidade do lead'."),
  p("Cenário oposto: mesma empresa entra em programa de crescimento integrado — tráfego, landing pages, CRM, automações e estratégia comercial como sistema. Em 90 dias, CAC cai 35%, taxa de fechamento dobra, budget escala com confiança. A diferença não é budget. É modelo de parceria."),
  img(
    blogInline(slug, 0),
    "Programa de Crescimento integrado versus agência de tráfego isolada",
    "Comparativo entre abordagem fragmentada e parceiro de crescimento end-to-end.",
  ),
  h2("Dois modelos, duas lógicas de resultado"),
  p("Agência de tráfego e programa de crescimento resolvem problemas diferentes. Confundir os dois leva a expectativas desalinhadas, budget mal alocado e frustração mútua. Entender a diferença é o primeiro passo para escolher o parceiro certo."),
  {
    kind: "comparison" as const,
    left: {
      title: "Agência de tráfego",
      items: [
        "Escopo: campanhas Google/Meta, relatórios de mídia",
        "Métrica principal: CPL, CPC, ROAS de plataforma",
        "Responsabilidade: performance de anúncios",
        "Entrega: campanhas otimizadas, criativos, keywords",
        "Integração: limitada — raramente inclui CRM ou comercial",
        "Ideal para: operação madura com funil já estruturado",
      ],
    },
    right: {
      title: "Programa de Crescimento",
      items: [
        "Escopo: tráfego + LP + CRM + automação + estratégia",
        "Métrica principal: CAC, ROAS real, receita atribuída",
        "Responsabilidade: resultado comercial end-to-end",
        "Entrega: sistema de aquisição completo e iterativo",
        "Integração: nativa — marketing e comercial conectados",
        "Ideal para: empresas que precisam estruturar funil do zero",
      ],
    },
  },
  p("Agência de tráfego é peça do quebra-cabeça. Programa de crescimento é o quebra-cabeça montado — ou montado junto com você. Nenhum é 'melhor' universalmente; depende do estágio da empresa e do que já existe internamente."),
  h2("O que cada modelo entrega na prática"),
  h3("Agência de tráfego"),
  p("Contrato típico: fee mensal + percentual ou valor fixo de mídia. Agência configura campanhas, testa criativos, otimiza lances e entrega dashboard de performance. Expectativa implícita: você já tem landing page que converte, CRM funcionando e time comercial ágil. Agência otimiza topo e meio do funil — não conserta fundo."),
  h3("Programa de Crescimento"),
  p("Modelo Raise One: diagnóstico inicial, estruturação de funil, landing pages sob medida, campanhas integradas, CRM configurado, automações WhatsApp e e-mail, dashboards de receita. Iteração contínua baseada em CAC e fechamento — não apenas CPL. Parceiro assume responsabilidade pelo sistema, não por campanha isolada."),
  callout(
    "Se sua landing page converte 1% e comercial responde leads em 48h, nenhuma agência de tráfego — por melhor que seja — vai resolver seu crescimento. O gargalo está no funil, não na mídia.",
    "Diagnóstico honesto",
  ),
  h2("5 sinais de que você precisa de parceiro integrado"),
  p("Nem toda empresa precisa sair da agência de tráfego amanhã. Mas estes sinais indicam que o modelo fragmentado está limitando crescimento:"),
  h3("1. CPL baixo, mas poucas vendas"),
  p("Campanha gera leads baratos e volume alto — comercial fecha pouco. Problema não é tráfego; é qualificação, follow-up ou landing page desalinhada. Agência não tem mandato (nem ferramentas) para corrigir comercial. Programa integrado ataca o funil completo."),
  h3("2. Marketing e comercial em guerra"),
  p("'Leads são ruins' versus 'Comercial não liga'. Sem CRM integrado e SLA de atendimento, debate nunca termina. Parceiro integrado implementa tracking, automação e métricas compartilhadas — acaba com guerra de narrativas."),
  h3("3. Landing page genérica ou inexistente"),
  p("Tráfego vai para homepage ou site desatualizado. Taxa de conversão abaixo de 2% em serviços locais é sinal de LP inadequada. Agência raramente reconstrói landing pages; programa de crescimento inclui LP como entrega core."),
  h3("4. Zero visibilidade de CAC e ROAS real"),
  p("Relatório mostra ROAS de plataforma (formulário), mas ninguém sabe quanto custou cada cliente fechado. Sem conversão offline e CRM, otimização fica presa em métrica de vaidade. Parceiro integrado constrói atribuição do clique à receita."),
  h3("5. Crescimento estagnou apesar de aumentar budget"),
  p("Dobrou investimento em mídia, receita não acompanhou proporcionalmente. Lei dos retornos decrescentes indica gargalo estrutural — não falta de cliques. Escalar tráfego sem consertar funil é acelerar em direção ao muro."),
  ul([
    "CPL baixo + poucas vendas = gargalo comercial ou LP",
    "Guerra marketing vs comercial = falta de integração",
    "Homepage como destino = conversão limitada",
    "ROAS de plataforma sem CAC real = otimização cega",
    "Budget sobe, receita não = funil quebrado, não mídia",
  ]),
  h2("Quando agência de tráfego faz sentido"),
  p("Agência especializada é escolha inteligente quando:"),
  ul([
    "Funil já estruturado: LP dedicada, CRM ativo, SLA comercial definido",
    "Time interno de marketing/comercial competente que precisa de execução de mídia",
    "Objetivo específico: escalar campanha que já provou ROI",
    "Budget de mídia alto o suficiente para justificar fee + operação paralela",
  ]),
  p("Nestes casos, agência executa otimização tática enquanto sua operação cuida do restante. Relação funciona — desde que expectativas estejam alinhadas."),
  h2("Quando migrar para programa integrado"),
  p("Programa de crescimento é investimento estratégico, não tático. Faz sentido quando:"),
  ul([
    "Empresa está escalando e funil não acompanha",
    "Primeira estruturação de marketing digital com foco em receita",
    "Setores com ciclo longo (imobiliário, educação, B2B) exigem integração profunda",
    "Fundador ou diretor quer previsibilidade — não apenas relatório de cliques",
  ]),
  linkCard({
    label: "Programa de Crescimento Raise One",
    href: "/programa-de-crescimento",
    type: "solution",
    description:
      "Tráfego, landing pages, CRM e automações integrados — com foco em CAC e receita, não apenas CPL.",
  }),
  h2("Como avaliar propostas e parceiros"),
  p("Perguntas que separam agência de tráfego de parceiro de crescimento:"),
  ul([
    "'Como vocês medem sucesso?' — CPL ou CAC/receita?",
    "'Quem constrói e otimiza landing pages?' — incluso ou terceirizado?",
    "'Como leads chegam ao comercial?' — CRM, WhatsApp, SLA?",
    "'Posso ver dashboard de lead → fechamento?' — ou só métricas de plataforma?",
    "'O que acontece se CPL cair mas vendas não subirem?' — agência ajusta mídia; parceiro integrado investiga funil",
  ]),
  cta({
    title: "Descubra qual modelo serve seu estágio",
    description:
      "Diagnóstico gratuito identifica gargalos do funil e indica se você precisa de tráfego isolado ou crescimento integrado.",
    primaryLabel: "Fazer diagnóstico gratuito",
    primaryHref: "/diagnostico",
    secondaryLabel: "Conhecer o Programa",
    secondaryHref: "/programa-de-crescimento",
  }),
  p("Agência de tráfego e programa de crescimento não são concorrentes — são respostas para estágios e necessidades diferentes. Escolher errado custa meses de budget e oportunidade. Escolher certo transforma marketing em motor previsível de receita."),
  h2("Tabela comparativa rápida"),
  table(
    ["Critério", "Agência de tráfego", "Programa de Crescimento"],
    [
      ["Escopo típico", "Google/Meta Ads", "Ads + LP + CRM + automação"],
      ["KPI principal", "CPL, CPC", "CAC, ROAS real"],
      ["Prazo de valor", "2–4 semanas", "60–90 dias (funil completo)"],
      ["Ideal quando", "Funil já existe", "Funil precisa ser construído"],
      ["Risco principal", "Leads sem conversão comercial", "Investimento inicial maior"],
    ],
  ),
  h2("Transição: como migrar de agência para programa integrado"),
  p("Migração não precisa ser traumática. Passo 1: auditoria de funil — LP, CRM, SLA comercial, tracking. Passo 2: manter campanhas ativas enquanto LP e CRM são estruturados — evita gap de leads. Passo 3: migrar campanhas com histórico de conversão preservado. Passo 4: implementar conversão offline. Passo 5: desligar agência anterior apenas quando métricas de CAC no novo modelo superam baseline por 30 dias consecutivos."),
  p("Comunicação clara com agência atual evita perda de acessos e dados. Exporte histórico de keywords, negativas e criativos vencedores antes do offboarding."),
  h2("Modelo híbrido: possível no meio termo"),
  p("Algumas empresas mantêm agência de tráfego para execução de mídia e contratam consultoria ou programa para LP, CRM e automação. Modelo funciona se responsabilidades e métricas estão documentadas — agência responde por CPL, parceiro integrado responde por taxa lead → fechado. Risco: coordenação entre fornecedores gera gaps. Programa único elimina essa fricção, mas híbrido é passo de transição válido."),
  h2("Sinais de agência de tráfego excelente"),
  p("Nem toda agência é limitada. Sinais positivos: propõe negativas proativamente, questiona qualidade de landing page, pede acesso ao CRM para entender pós-clique, reporta CPL por ad group (não apenas campanha), sugere pausar campanha se lead não converte comercialmente. Agência que só pede mais budget sem questionar funil provavelmente atingiu teto do escopo dela — não do canal."),
  p("Decisão entre agência e programa integrado não é permanente. Muitas empresas começam com agência, identificam gargalo comercial e evoluem para parceiro end-to-end. O importante é reconhecer o sinal de estagnação cedo — antes de escalar budget em canal que já entregou o que podia entregar sozinho."),
  p("Independentemente do modelo escolhido, exija transparência: acesso às contas de anúncio, propriedade das landing pages, exportação de dados de CRM. Parceiro que retém ativos dificulta transição futura — e concentra risco operacional na sua empresa."),
  p("O critério final é simples: qual modelo reduz CAC e aumenta receita previsível no seu contexto? Se agência entrega CPL excelente mas comercial não converte, problema está além do escopo dela. Se programa integrado estrutura funil mas ignora otimização de mídia, também falha. Escolha pelo resultado completo — não pelo rótulo."),
];

const faq = [
  {
    question: "Programa de Crescimento substitui minha agência de tráfego?",
    answer:
      "Na maioria dos casos, sim — porque inclui gestão de tráfego como parte do escopo, integrada ao restante do funil. Se você já tem agência excelente e funil maduro, pode manter agência e contratar consultoria pontual. O diagnóstico indica o melhor caminho.",
  },
  {
    question: "Programa integrado é mais caro que agência de tráfego?",
    answer:
      "Investimento total tende a ser maior porque escopo é maior (LP, CRM, automação). Porém, CAC efetivo frequentemente cai — mesma receita com menos desperdício. Compare custo por cliente fechado, não apenas fee mensal.",
  },
  {
    question: "Quanto tempo leva para ver resultados no programa integrado?",
    answer:
      "Primeiros leads otimizados em 2–4 semanas. Melhora consistente de CAC e taxa de fechamento em 60–90 dias, conforme integrações amadurecem e dados acumulam para otimização de conversão offline.",
  },
  {
    question: "Posso começar só com tráfego e integrar depois?",
    answer:
      "Sim, mas é caminho mais caro. Leads gerados sem CRM e LP adequada esfriam ou se perdem. Se budget é limitado, priorize LP + CRM básico antes de escalar mídia — ou escolha programa que construa fundação primeiro.",
  },
];

export const programaCrescimentoVsAgenciaTrafego: BlogArticle = {
  slug,
  title: "Programa de Crescimento vs agência de tráfego: qual escolher?",
  excerpt:
    "Comparativo entre agência de tráfego isolada e programa de crescimento integrado — com 5 sinais de que você precisa de parceiro end-to-end, não apenas campanhas.",
  category: "growth",
  type: "comparativo",
  readTime: estimateReadTime(sections, faq),
  publishedAt: "2026-06-25",
  modifiedAt: "2026-08-05",
  author: "Raise One",
  pillar: "funil",
  featuredImage: blogFeatured(slug),
  seo: {
    title: "Programa de Crescimento vs agência de tráfego | Raise One",
    description:
      "Compare programa de crescimento integrado e agência de tráfego: escopo, métricas, entregas e 5 sinais de que você precisa de parceiro end-to-end.",
  },
  targetKeywords: [
    "programa de crescimento vs agência",
    "agência tráfego ou growth",
    "parceiro marketing integrado",
    "agência google ads limitações",
    "crescimento previsível marketing",
  ],
  relatedSlugs: [
    "funil-de-aquisicao-guia",
    "integrar-google-ads-crm-whatsapp",
    "5-erros-trafego-pago",
  ],
  relatedLinks: [
    { label: "Programa de Crescimento", href: "/programa-de-crescimento", type: "solution" },
    { label: "Diagnóstico", href: "/diagnostico", type: "solution" },
  ],
  sections,
  faq,
};
