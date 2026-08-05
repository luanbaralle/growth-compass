import type { BlogArticle } from "../types";
import {
  p,
  h2,
  h3,
  ul,
  callout,
  cta,
  linkCard,
  blogFeatured,
  blogInline,
  estimateReadTime,
} from "../helpers";

const slug = "automacoes-ia-follow-up";

const sections = [
  p(
    "Automação tradicional segue regras fixas: 'se preencheu formulário, envie e-mail X'. Funciona para confirmações e lembretes simples. Mas falha quando contexto importa — qual serviço interessou, qual objeção surgiu, quantas vezes o lead interagiu, em qual horário prefere ser contactado. Automação com IA entende contexto, adapta mensagem e decide próximo passo — como um SDR virtual que nunca dorme, nunca esquece e nunca perde a paciência.",
  ),
  p(
    "Empresas que implementam automações inteligentes de follow-up reportam aumento de 40–65% na taxa de resposta de leads e redução de 50–70% no tempo comercial gasto em tarefas repetitivas. O ganho não está em enviar mais mensagens — está em enviar a mensagem certa, na hora certa, pelo canal certo.",
  ),
  h2("Atendimento inicial com IA"),
  p(
    "Agente de IA responde WhatsApp e chat do site 24/7, qualifica interesse, coleta informações essenciais e agenda reunião — ou encaminha para humano quando necessário. Diferente de chatbot com árvore de decisão rígida, IA conversacional entende variações de pergunta, mantém contexto da conversa e adapta tom ao perfil do lead.",
  ),
  h3("Exemplo — clínica estética"),
  p(
    "Lead: 'Quanto custa harmonização facial?' — IA responde com faixa de preço, explica que valor depende de avaliação presencial, pergunta região de preferência e oferece agendamento. Se lead aceita, IA confirma horário e registra no CRM. Se hesita, IA envia depoimento em vídeo e pergunta principal preocupação.",
  ),
  ul([
    "Mensagem IA: 'Olá! Harmonização facial na nossa clínica parte de R$ 1.200, dependendo da avaliação. Posso agendar uma consulta gratuita para você receber orçamento personalizado. Qual região prefere: unidade Moema ou Pinheiros?'",
    "Follow-up se não responde em 2h: 'Vi que você se interessou por harmonização facial. Separei um vídeo de antes/depois de uma paciente com perfil similar ao seu. Posso te enviar?'",
    "Encaminhamento humano: 'Entendi que você tem alergia a ácido hialurônico — vou conectar você com nossa biomédica Dra. Ana para uma orientação personalizada. Ela retorna em até 15 minutos.'",
  ]),
  h2("Follow-up inteligente por comportamento"),
  p(
    "Lead não respondeu em 24h? IA envia mensagem personalizada baseada no serviço de interesse — não um template genérico. Não abriu e-mail? WhatsApp com case relevante. Visitou página de preços? Oferta de condição especial com deadline. Comportamento guia a automação, não calendário fixo.",
  ),
  h3("Exemplo — incorporadora imobiliária"),
  ul([
    "D+0 (formulário): 'Olá, [nome]! Recebi seu interesse no [empreendimento]. O apartamento de 3 quartos que você visualizou tem apenas 4 unidades disponíveis na torre A. Quer agendar uma visita ao decorado este sábado?'",
    "D+1 (sem resposta): 'Preparei um comparativo de valorização do [bairro] nos últimos 3 anos — dados mostram +18% no período. Posso enviar junto com a tabela atualizada de preços?'",
    "D+3 (visitou planta online): 'Vi que você explorou a planta de 85m². Essa é nossa unidade mais procurada por famílias — sacada gourmet e 2 vagas. Restam 2 unidades nessa metragem. Posso reservar uma visita?'",
    "D+7 (última tentativa): 'Última mensagem sobre o [empreendimento] — condição especial de entrada reduzida válida até sexta. Se o timing não é agora, sem problemas — posso te avisar quando abrirmos nova fase?'",
  ]),
  h3("Exemplo — escola/educação"),
  ul([
    "D+0: 'Olá, [nome]! Vi que você se interessou pelo curso de [área]. Turma de março tem 8 vagas restantes. Quer agendar uma visita ao campus ou prefere conversar com um coordenador por videochamada?'",
    "D+2 (abriu e-mail mas não respondeu): 'Separei o depoimento da [aluna], que estava na mesma situação que você — em transição de carreira. Ela hoje atua como [profissão]. Posso te enviar o vídeo completo?'",
    "D+5: 'Nossa próxima turma começa dia [data]. Inscrições com desconto de 15% encerram sexta. Se quiser, posso reservar sua vaga por 48h sem compromisso.'",
  ]),
  h2("Análise e priorização com IA"),
  p(
    "IA analisa histórico de interações — mensagens trocadas, páginas visitadas, tempo de resposta, perguntas feitas — e atribui score de propensão a compra. Time comercial recebe lista priorizada: leads quentes no topo, mornos no meio, frios na base de nutrição. Gestor enxerga pipeline com probabilidade de fechamento, não apenas volume.",
  ),
  ul([
    "Score 80–100 (quente): respondeu rápido, pediu preço/prazo, visitou página de checkout — ligar em 15 min",
    "Score 50–79 (morno): interagiu mas não avançou — automação de nutrição + ligação em D+3",
    "Score 0–49 (frio): curioso, perfil fora do fit — nutrição longa ou descarte com registro",
  ]),
  callout(
    "Regra Raise One: automação IA nunca substitui humano em negociação e fechamento. Ela qualifica, nutre e prepara — corretor/vendedor fecha.",
    "Princípio Raise One",
  ),
  h2("Implementação prática: do zero ao follow-up automatizado"),
  p(
    "Automações IA eficientes dependem de três pilares: CRM integrado (lead entra automaticamente), dados de comportamento (páginas visitadas, interações) e templates de mensagem adaptáveis por segmento. Sem CRM, automação vira spam. Com CRM integrado, cada mensagem é contextual e relevante.",
  ),
  ul([
    "Semana 1: mapear jornada do lead — touchpoints, objeções, tempo médio de resposta",
    "Semana 2: configurar CRM + integrações (formulário, WhatsApp, campanhas)",
    "Semana 3: criar sequências de follow-up por segmento (serviço, persona, temperatura)",
    "Semana 4: ativar IA para atendimento inicial + scoring + testes A/B de mensagens",
  ]),
  linkCard({
    label: "IA no marketing imobiliário",
    href: "/blog/ia-marketing-imobiliario",
    type: "article",
    description: "Qualificação automática, Atlas e follow-up inteligente no setor imobiliário.",
  }),
  linkCard({
    label: "CRM para negócios em crescimento",
    href: "/blog/crm-para-negocios-em-crescimento",
    type: "article",
    description: "Por que CRM integrado é pré-requisito para automações eficientes.",
  }),
  cta({
    title: "Quer automações IA no seu follow-up?",
    description:
      "No Programa Raise One, implementamos automações integradas ao CRM e campanhas — com templates personalizados por segmento.",
    primaryLabel: "Fazer diagnóstico gratuito",
    primaryHref: "/diagnostico",
    secondaryLabel: "Ver tecnologia Raise One",
    secondaryHref: "/tecnologia",
  }),
];

const faq = [
  {
    question: "Automação IA parece robótica para o lead?",
    answer:
      "Depende da implementação. IA bem configurada com templates personalizados por segmento e tom de marca soa natural. Lead percebe robótico quando mensagens são genéricas e fora de contexto — exatamente o que IA contextual evita.",
  },
  {
    question: "Funciona no WhatsApp Business?",
    answer:
      "Sim — WhatsApp é o canal principal no Brasil. Automações via API oficial WhatsApp Business respeitam janela de 24h e templates aprovados. Mensagens proativas seguem regras da Meta; respostas dentro da janela são livres.",
  },
  {
    question: "Preciso de CRM antes das automações?",
    answer:
      "Sim. CRM é a base — sem ele, automações não sabem quem contactar, com qual contexto e em qual etapa do pipeline. CRM integrado + automações IA é a combinação que gera resultados.",
  },
  {
    question: "Quantas mensagens automatizadas são aceitáveis?",
    answer:
      "Sequência padrão Raise One: 4–6 touchpoints em 7–10 dias (D+0, D+1, D+3, D+7). Mais que isso aumenta taxa de bloqueio. Menos que isso perde leads que precisam de nutrição. Ajuste por ciclo de venda do negócio.",
  },
  {
    question: "IA substitui equipe comercial?",
    answer:
      "Não. IA elimina 60–70% do trabalho repetitivo (primeiro contato, qualificação, follow-up inicial). Equipe comercial foca em leads quentes, negociação e fechamento. Empresas tipicamente redimensionam time para conversão, não para prospecção.",
  },
];

export const automacoesIaFollowUp: BlogArticle = {
  slug,
  title: "Automações com IA: do atendimento ao follow-up comercial",
  excerpt:
    "IA no marketing não é chatbot genérico — é automação inteligente que qualifica, nutre e acelera o ciclo comercial. Exemplos práticos de mensagens.",
  category: "ia",
  type: "artigo",
  readTime: estimateReadTime(sections, faq),
  publishedAt: "2026-01-20",
  modifiedAt: "2026-08-05",
  author: "Raise One",
  featuredImage: blogFeatured(slug),
  seo: {
    title: "Automações com IA para follow-up comercial | Raise One",
    description:
      "Como usar IA para automatizar atendimento, qualificação de leads e follow-up comercial — com exemplos práticos de mensagens por segmento.",
  },
  targetKeywords: [
    "automação ia follow-up",
    "chatbot ia whatsapp",
    "automação comercial ia",
    "follow-up automatizado leads",
  ],
  pillar: "funil",
  relatedSlugs: [
    "ia-marketing-imobiliario",
    "crm-para-negocios-em-crescimento",
    "5-erros-trafego-pago",
    "como-medir-roi-meta-ads",
  ],
  relatedLinks: [
    {
      label: "Tecnologia Raise One",
      href: "/tecnologia",
      type: "solution",
      description: "Automações IA, CRM e dashboards integrados.",
    },
  ],
  sections,
  faq,
};
