import type { HomeFaqItem } from "@/lib/home/content";
import type { NextStepLink } from "@/components/marketing/shared/NextSteps";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Clapperboard,
  Code2,
  Globe,
  LineChart,
  Megaphone,
  Share2,
  Target,
  TrendingUp,
} from "lucide-react";

export interface SolutionCatalogItem {
  slug: string;
  title: string;
  benefit: string;
  description: string;
  icon: LucideIcon;
  href: string;
  available: boolean;
}

export interface SolutionCategory {
  title: string;
  description: string;
  items: SolutionCatalogItem[];
}

export interface SolutionPageContent {
  slug: string;
  seo: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    benefitFocus: string;
  };
  problem: {
    title: string;
    description: string;
    points: string[];
  };
  approach: {
    title: string;
    description: string;
    items: { title: string; description: string }[];
  };
  process: {
    title: string;
    steps: { number: string; title: string; description: string }[];
  };
  cases: {
    title: string;
    items: { name: string; description: string; tag: string }[];
  };
  faq: HomeFaqItem[];
  cta: {
    title: string;
    description: string;
    whatsappMessage: string;
  };
  nextSteps: NextStepLink[];
}

export const solucoesSeo = {
  title: "Soluções — Raise One",
  description:
    "Ecossistema completo de crescimento: aquisição, conteúdo, tecnologia, IA e growth. Cada solução focada em benefício, não em ferramenta.",
};

export const solutionCategories: SolutionCategory[] = [
  {
    title: "Aquisição",
    description: "Geramos demanda qualificada nos canais certos para o seu mercado.",
    items: [
      {
        slug: "google-ads",
        title: "Google Ads",
        benefit: "Aquisição",
        description: "Apareça quando seu cliente está buscando. Campanhas estratégicas de busca e display.",
        icon: TrendingUp,
        href: "/solucoes/google-ads",
        available: true,
      },
      {
        slug: "meta-ads",
        title: "Meta Ads",
        benefit: "Geração de demanda",
        description: "Alcance e converta no Instagram e Facebook com funis de demanda.",
        icon: Share2,
        href: "/solucoes/meta-ads",
        available: true,
      },
      {
        slug: "landing-pages",
        title: "Landing Pages",
        benefit: "Conversão",
        description: "Páginas projetadas para transformar visitantes em leads qualificados.",
        icon: Target,
        href: "/solucoes/landing-pages",
        available: true,
      },
    ],
  },
  {
    title: "Conteúdo",
    description: "Conteúdo estratégico que conecta, engaja e converte.",
    items: [
      {
        slug: "producao-de-conteudo",
        title: "Produção de Conteúdo",
        benefit: "Autoridade & engajamento",
        description: "Social media, vídeos, fotografia e conteúdo institucional alinhado ao funil.",
        icon: Clapperboard,
        href: "/solucoes/producao-de-conteudo",
        available: true,
      },
      {
        slug: "social-media",
        title: "Social Media",
        benefit: "Presença digital",
        description: "Gestão estratégica de redes sociais com foco em conversão.",
        icon: Megaphone,
        href: "/solucoes",
        available: false,
      },
    ],
  },
  {
    title: "Tecnologia",
    description: "Plataformas, sistemas e integrações que sustentam o crescimento.",
    items: [
      {
        slug: "websites",
        title: "Websites",
        benefit: "Presença digital",
        description: "Sites institucionais e comerciais com performance e conversão.",
        icon: Globe,
        href: "/solucoes",
        available: false,
      },
      {
        slug: "sistemas-web",
        title: "Sistemas Web",
        benefit: "Operação digital",
        description: "Plataformas sob medida para processos e operações comerciais.",
        icon: Code2,
        href: "/solucoes",
        available: false,
      },
      {
        slug: "crm",
        title: "CRM",
        benefit: "Organização comercial",
        description: "Gestão de leads, pipeline e relacionamento com automações.",
        icon: LineChart,
        href: "/solucoes",
        available: false,
      },
    ],
  },
  {
    title: "Growth",
    description: "Estratégia, consultoria e o programa que une tudo.",
    items: [
      {
        slug: "programa-de-crescimento",
        title: "Programa de Crescimento",
        benefit: "Crescimento integrado",
        description: "O programa de 6 meses que une marketing, conteúdo e tecnologia.",
        icon: LineChart,
        href: "/programa-de-crescimento",
        available: true,
      },
      {
        slug: "consultoria-growth",
        title: "Consultoria Growth",
        benefit: "Estratégia",
        description: "Diagnóstico, posicionamento e plano de crescimento sob medida.",
        icon: TrendingUp,
        href: "/solucoes",
        available: false,
      },
    ],
  },
  {
    title: "Mercado Imobiliário",
    description: "Soluções especializadas para incorporadoras, imobiliárias e lançamentos.",
    items: [
      {
        slug: "mercado-imobiliario",
        title: "Mercado Imobiliário",
        benefit: "Vendas imobiliárias",
        description: "Campanhas, portais, CRM e automação para o setor imobiliário.",
        icon: Building2,
        href: "/solucoes",
        available: false,
      },
    ],
  },
];

export const solucoesNextSteps: NextStepLink[] = [
  {
    label: "Programa de Crescimento",
    description: "A forma completa de trabalhar com a Raise One.",
    href: "/programa-de-crescimento",
    internal: true,
  },
  {
    label: "Metodologia",
    description: "O framework que guia cada projeto.",
    href: "/metodologia",
    internal: true,
  },
  {
    label: "Fazer diagnóstico",
    description: "Descubra suas oportunidades de crescimento.",
    href: "/diagnostico",
    internal: true,
  },
];

const defaultNextSteps = (_slug: string): NextStepLink[] => [
  {
    label: "Programa de Crescimento",
    description: "Veja como tudo se conecta em um único programa.",
    href: "/programa-de-crescimento",
    internal: true,
  },
  {
    label: "Cases",
    description: "Resultados reais com essa solução.",
    href: "/cases",
    internal: true,
  },
  {
    label: "Fazer diagnóstico",
    description: "Análise gratuita do seu mercado.",
    href: "/diagnostico",
    internal: true,
  },
];

export const solutionPages: Record<string, SolutionPageContent> = {
  "google-ads": {
    slug: "google-ads",
    seo: {
      title: "Google Ads — Aquisição de Clientes | Raise One",
      description:
        "Campanhas estratégicas de Google Ads focadas em aquisição qualificada. Não vendemos tráfego — construímos máquinas de geração de demanda.",
    },
    hero: {
      eyebrow: "Aquisição",
      title: "Aquisição de clientes via Google Ads",
      description:
        "Apareça exatamente quando seu cliente está buscando. Campanhas estruturadas com tracking, landing pages e CRM integrados — para leads que convertem.",
      benefitFocus: "Aquisição",
    },
    problem: {
      title: "Investir em Google Ads sem estratégia é queimar dinheiro",
      description:
        "A maioria das empresas configura campanhas genéricas, direciona para o site institucional e espera resultados. O problema não é a plataforma — é a falta de sistema.",
      points: [
        "Campanhas sem segmentação de intenção de busca",
        "Landing pages que não convertem visitantes",
        "Tracking incompleto — impossível medir ROI real",
        "Leads desqualificados chegando ao comercial",
        "Orçamento crescendo, CAC estagnado",
      ],
    },
    approach: {
      title: "Como fazemos",
      description:
        "Google Ads é uma peça do funil — não o funil inteiro. Integramos campanhas com landing pages, CRM e automações para aquisição previsível.",
      items: [
        {
          title: "Pesquisa de mercado e keywords",
          description: "Mapeamos intenções de busca, concorrência e oportunidades no seu segmento.",
        },
        {
          title: "Estrutura de campanhas estratégica",
          description: "Segmentação por intenção, geolocalização, horários e dispositivos.",
        },
        {
          title: "Landing pages de conversão",
          description: "Páginas dedicadas com copy, design e CTA otimizados para cada campanha.",
        },
        {
          title: "Tracking e atribuição",
          description: "Conversões rastreadas do clique ao fechamento — dados reais, não estimativas.",
        },
        {
          title: "Otimização contínua",
          description: "Testes A/B de anúncios, lances inteligentes e refinamento semanal.",
        },
      ],
    },
    process: {
      title: "Processo",
      steps: [
        { number: "01", title: "Diagnóstico", description: "Análise de mercado, concorrência e oportunidades de busca." },
        { number: "02", title: "Estrutura", description: "Campanhas, grupos de anúncios e keywords estratégicas." },
        { number: "03", title: "Landing Pages", description: "Páginas de conversão alinhadas a cada campanha." },
        { number: "04", title: "Ativação", description: "Go-live com monitoramento e ajustes em tempo real." },
        { number: "05", title: "Otimização", description: "Análise de dados, testes e melhoria contínua de performance." },
      ],
    },
    cases: {
      title: "Cases de aquisição",
      items: [
        { name: "UNIP", description: "Captação de alunos com Google Ads, landing pages e SEO.", tag: "Educação" },
        { name: "Studio 21", description: "Posicionamento e aquisição com campanhas estratégicas.", tag: "Serviços" },
        { name: "Nobre Imóveis", description: "Campanhas e landing pages para geração de leads imobiliários.", tag: "Imobiliário" },
      ],
    },
    faq: [
      {
        question: "Vocês gerenciam campanhas ou constroem o funil completo?",
        answer: "O funil completo. Campanhas, landing pages, tracking, CRM e automações de follow-up — porque Google Ads sem página de conversão e processo comercial é dinheiro queimado.",
      },
      {
        question: "Quanto preciso investir em mídia?",
        answer: "Depende do segmento e ticket médio. Após o diagnóstico, indicamos o mínimo viável para gerar dados estatísticos — geralmente a partir de R$ 3.000/mês em mídia, além da gestão.",
      },
      {
        question: "Em quanto tempo aparecem leads qualificados?",
        answer: "Primeiros leads em dias após ativação. CAC estável e volume previsível costumam consolidar entre 60 e 90 dias, com otimização contínua de campanhas, páginas e qualificação comercial.",
      },
    ],
    cta: {
      title: "Pronto para aquisição previsível?",
      description: "Agende uma conversa. Analisamos seu mercado e mostramos o potencial de Google Ads para seu negócio.",
      whatsappMessage: "Olá! Tenho interesse em Google Ads / Aquisição de clientes com a Raise One.",
    },
    nextSteps: defaultNextSteps("google-ads"),
  },

  "meta-ads": {
    slug: "meta-ads",
    seo: {
      title: "Meta Ads — Geração de Demanda | Raise One",
      description:
        "Campanhas de Meta Ads (Instagram e Facebook) focadas em geração de demanda qualificada. Funis estratégicos, não apenas alcance.",
    },
    hero: {
      eyebrow: "Geração de demanda",
      title: "Geração de demanda via Meta Ads",
      description:
        "Alcance quem ainda não sabe que precisa de você. Campanhas de demanda no Instagram e Facebook com criativos, funis e automações que convertem.",
      benefitFocus: "Geração de demanda",
    },
    problem: {
      title: "Boost de post não é estratégia de marketing",
      description:
        "Muitas empresas investem em alcance sem funil, sem segmentação e sem integração comercial. O resultado: likes, não leads.",
      points: [
        "Campanhas de alcance sem objetivo de conversão",
        "Criativos genéricos que não param o scroll",
        "Públicos mal definidos — dinheiro jogado fora",
        "Leads que ninguém acompanha no comercial",
        "Sem mensuração real de retorno sobre investimento",
      ],
    },
    approach: {
      title: "Como fazemos",
      description:
        "Meta Ads é geração de demanda — criamos interesse onde ainda não existe. Funis completos do anúncio ao CRM.",
      items: [
        {
          title: "Estratégia de funil",
          description: "Topo (awareness), meio (consideração) e fundo (conversão) — cada etapa com objetivo claro.",
        },
        {
          title: "Criativos que convertem",
          description: "Vídeos, carrosséis e stories produzidos com foco em performance, não apenas estética.",
        },
        {
          title: "Segmentação avançada",
          description: "Públicos personalizados, lookalike e remarketing estratégico.",
        },
        {
          title: "Integração com landing pages",
          description: "Cada campanha direciona para página otimizada com formulário e tracking.",
        },
        {
          title: "Automação de follow-up",
          description: "Leads entram no CRM com automações de qualificação e nurturing.",
        },
      ],
    },
    process: {
      title: "Processo",
      steps: [
        { number: "01", title: "Diagnóstico", description: "Análise de público, concorrência e oportunidades no Meta." },
        { number: "02", title: "Funil", description: "Desenho do funil de demanda com etapas e criativos." },
        { number: "03", title: "Produção", description: "Criativos, copy e landing pages alinhados ao funil." },
        { number: "04", title: "Ativação", description: "Campanhas no ar com testes de público e criativo." },
        { number: "05", title: "Escala", description: "Otimização e expansão do que gera demanda qualificada." },
      ],
    },
    cases: {
      title: "Cases de demanda",
      items: [
        { name: "Studio 21", description: "Posicionamento de marca e geração de demanda via Meta.", tag: "Serviços" },
        { name: "Nobre Imóveis", description: "Campanhas de captação de leads para imóveis.", tag: "Imobiliário" },
      ],
    },
    faq: [
      {
        question: "Meta Ads funciona para o meu segmento?",
        answer: "Funciona especialmente bem para serviços locais, saúde, educação, imobiliário e negócios com ticket médio acessível. B2B complexo exige estratégia diferente — o diagnóstico define se Meta é o canal certo ou complementar.",
      },
      {
        question: "Vocês produzem criativos ou só gerenciam campanhas?",
        answer: "Produzimos. Vídeos, carrosséis, stories e copy otimizados para performance — criativos genéricos não param scroll nem geram demanda qualificada.",
      },
      {
        question: "Preciso de Google Ads junto com Meta?",
        answer: "Depende. Meta gera demanda (quem ainda não busca); Google captura intenção (quem já está procurando). Nos segmentos certos, os dois juntos aceleram o funil — mas nem todo negócio precisa dos dois desde o início.",
      },
    ],
    cta: {
      title: "Pronto para gerar demanda qualificada?",
      description: "Converse conosco sobre como Meta Ads pode acelerar seu funil de aquisição.",
      whatsappMessage: "Olá! Tenho interesse em Meta Ads / Geração de demanda com a Raise One.",
    },
    nextSteps: defaultNextSteps("meta-ads"),
  },

  "landing-pages": {
    slug: "landing-pages",
    seo: {
      title: "Landing Pages — Conversão | Raise One",
      description:
        "Landing pages projetadas para converter visitantes em leads qualificados. Foco em conversão, não em design bonito.",
    },
    hero: {
      eyebrow: "Conversão",
      title: "Páginas que convertem visitantes em clientes",
      description:
        "Uma landing page não é um site bonito — é uma máquina de conversão. Copy, design, velocidade e tracking integrados para transformar tráfego em oportunidades.",
      benefitFocus: "Conversão",
    },
    problem: {
      title: "Direcionar tráfego para o site institucional é desperdício",
      description:
        "Sites institucionais informam. Landing pages convertem. Sem página dedicada, cada clique pago perde potencial de conversão.",
      points: [
        "Site institucional com dezenas de distrações e links",
        "Formulários genéricos que não qualificam o lead",
        "Páginas lentas que aumentam taxa de rejeição",
        "Sem testes A/B — impossível melhorar conversão",
        "Campanhas pagas direcionando para páginas erradas",
      ],
    },
    approach: {
      title: "Como fazemos",
      description:
        "Cada landing page é projetada para um objetivo: converter. Copy persuasivo, design focado, velocidade e integração com CRM.",
      items: [
        {
          title: "Copy estratégico",
          description: "Headlines, benefícios e CTAs baseados em pesquisa de mercado e ICP.",
        },
        {
          title: "Design orientado à conversão",
          description: "Layout limpo, hierarquia visual clara e mobile-first.",
        },
        {
          title: "Performance e velocidade",
          description: "Páginas rápidas — cada segundo a mais reduz conversão em até 7%.",
        },
        {
          title: "Tracking completo",
          description: "Pixels, conversões e eventos configurados para mensuração precisa.",
        },
        {
          title: "Testes A/B contínuos",
          description: "Variações de headline, CTA e layout testadas para maximizar conversão.",
        },
      ],
    },
    process: {
      title: "Processo",
      steps: [
        { number: "01", title: "Briefing", description: "Objetivo, público, oferta e diferencial competitivo." },
        { number: "02", title: "Copy & Wireframe", description: "Estrutura de conteúdo e layout focado em conversão." },
        { number: "03", title: "Design & Dev", description: "Página responsiva, rápida e integrada ao tracking." },
        { number: "04", title: "Integração", description: "CRM, automações e campanhas conectadas." },
        { number: "05", title: "Otimização", description: "Testes A/B e melhoria contínua de taxa de conversão." },
      ],
    },
    cases: {
      title: "Cases de conversão",
      items: [
        { name: "UNIP", description: "Landing pages de captação de alunos com alta taxa de conversão.", tag: "Educação" },
        { name: "Nobre Imóveis", description: "Páginas de empreendimentos com formulário e WhatsApp integrados.", tag: "Imobiliário" },
      ],
    },
    faq: [
      {
        question: "Por que não usar meu site institucional?",
        answer: "Site institucional informa; landing page converte. Múltiplos links, navegação e conteúdo genérico diluem a taxa de conversão — cada clique pago direcionado para a página errada é investimento perdido.",
      },
      {
        question: "Quantas landing pages preciso?",
        answer: "Uma por campanha ou oferta distinta. Isso permite mensurar conversão individualmente, testar copy e escalar o que funciona — uma LP genérica para tudo impede otimização real.",
      },
      {
        question: "As páginas vêm integradas ao funil?",
        answer: "Sim. Hospedagem, tracking (pixel, conversões, GA4), formulário conectado ao CRM e automações de follow-up — a LP não é entrega isolada, é peça do sistema comercial.",
      },
    ],
    cta: {
      title: "Sua próxima landing page pode converter 3x mais",
      description: "Converse conosco sobre landing pages estratégicas para suas campanhas.",
      whatsappMessage: "Olá! Tenho interesse em Landing Pages / Conversão com a Raise One.",
    },
    nextSteps: defaultNextSteps("landing-pages"),
  },

  "producao-de-conteudo": {
    slug: "producao-de-conteudo",
    seo: {
      title: "Produção de Conteúdo — Autoridade & Engajamento | Raise One",
      description:
        "Conteúdo estratégico que conecta, engaja e converte. Social media, vídeos, fotografia e institucional alinhados ao funil de crescimento.",
    },
    hero: {
      eyebrow: "Conteúdo",
      title: "Conteúdo que conecta e converte",
      description:
        "Conteúdo sem estratégia é barulho. Produzimos social media, vídeos, fotografia e material institucional alinhados ao seu funil — para construir autoridade e gerar demanda.",
      benefitFocus: "Autoridade & engajamento",
    },
    problem: {
      title: "Postar por postar não gera resultado",
      description:
        "A maioria das empresas produz conteúdo genérico, desconectado do funil comercial e sem mensuração de impacto nas vendas.",
      points: [
        "Calendário editorial sem estratégia de conversão",
        "Conteúdo genérico que não diferencia a marca",
        "Produção cara sem retorno mensurável",
        "Redes sociais desconectadas das campanhas pagas",
        "Sem reaproveitamento — cada peça é descartável",
      ],
    },
    approach: {
      title: "Como fazemos",
      description:
        "Conteúdo é combustível do funil. Produzimos com estratégia, reaproveitamos entre canais e medimos impacto na aquisição.",
      items: [
        {
          title: "Calendário editorial estratégico",
          description: "Conteúdo planejado por etapa do funil — awareness, consideração e conversão.",
        },
        {
          title: "Produção multiformato",
          description: "Vídeos, fotos, carrosséis, stories e material institucional.",
        },
        {
          title: "Integração com campanhas",
          description: "Criativos produzidos alimentam Google Ads, Meta Ads e landing pages.",
        },
        {
          title: "Gestão de redes sociais",
          description: "Publicação, community management e análise de engajamento.",
        },
        {
          title: "Reaproveitamento inteligente",
          description: "Uma produção vira dezenas de peças — maximizando ROI de conteúdo.",
        },
      ],
    },
    process: {
      title: "Processo",
      steps: [
        { number: "01", title: "Estratégia", description: "Definição de tom, pilares de conteúdo e calendário." },
        { number: "02", title: "Produção", description: "Gravações, fotos e criação de peças multiformato." },
        { number: "03", title: "Distribuição", description: "Publicação orgânica e adaptação para campanhas pagas." },
        { number: "04", title: "Engajamento", description: "Community management e interação com audiência." },
        { number: "05", title: "Análise", description: "Métricas de engajamento, alcance e impacto no funil." },
      ],
    },
    cases: {
      title: "Cases de conteúdo",
      items: [
        { name: "Studio 21", description: "Posicionamento de marca com conteúdo estratégico e campanhas.", tag: "Serviços" },
        { name: "Pousada (case interno)", description: "Produção completa: fotos, vídeos e conteúdo para funil de reservas.", tag: "Hospitalidade" },
      ],
    },
    faq: [
      {
        question: "Conteúdo orgânico gera vendas ou só engajamento?",
        answer: "Depende da estratégia. Conteúdo sem funil gera likes; conteúdo alinhado ao funil gera demanda, alimenta campanhas pagas e reduz CAC. Medimos impacto em leads e conversões — não apenas alcance.",
      },
      {
        question: "Vocês fazem social media ou produção completa?",
        answer: "Produção completa: vídeos, fotografia, carrosséis, stories, institucional e peças para campanhas. Social media é uma frente — o foco é conteúdo estratégico que move o funil.",
      },
      {
        question: "Preciso de equipe interna de conteúdo?",
        answer: "Não. Podemos ser seu braço completo ou complementar quem você já tem. O importante é que o conteúdo converse com campanhas, landing pages e processo comercial — não rode em paralelo.",
      },
    ],
    cta: {
      title: "Conteúdo estratégico para o seu funil",
      description: "Converse conosco sobre produção de conteúdo alinhada ao seu crescimento.",
      whatsappMessage: "Olá! Tenho interesse em Produção de Conteúdo com a Raise One.",
    },
    nextSteps: defaultNextSteps("producao-de-conteudo"),
  },
};

export function getSolutionPage(slug: string): SolutionPageContent | undefined {
  return solutionPages[slug];
}
