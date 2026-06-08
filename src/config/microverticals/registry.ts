import type { MicroverticalDefinition } from "./types";

function cityExamples(base: string[], city?: string): string[] {
  if (!city) return base;
  const c = city.toLowerCase();
  return base.map((q) => (q.includes("{city}") ? q.replace("{city}", c) : q));
}

function termSearch(term: string, city?: string): string[] {
  const t = term.toLowerCase();
  const c = city?.toLowerCase() ?? "{city}";
  return [
    `${t} perto de mim`,
    `${t} ${c}`,
    `melhor ${t} ${c}`,
    `${t} preço`,
    `${t} agendar`,
  ];
}

/** Registry de microverticais — expandível sem nova LP */
export const MICROVERTICALS: MicroverticalDefinition[] = [
  // ── Beleza (cluster alta prioridade) ──
  {
    id: "estetica",
    label: "Clínica de Estética",
    keywords: [
      "estetica",
      "estética",
      "clinica estetica",
      "clínica estética",
      "botox",
      "harmonizacao",
      "harmonização",
      "peeling",
      "esteticista",
    ],
    macroCategory: "beleza",
    templateSlug: "estetica",
    priority: "high",
    heroHighlight: "recebendo mais contatos.",
    businessType: "clínica",
    yourBusinessLabel: "Sua clínica",
    suggestedServices: [
      "Botox",
      "Harmonização Facial",
      "Limpeza de Pele",
      "Preenchimento",
      "Depilação a Laser",
    ],
    searchExamples: (_, city) =>
      cityExamples(
        [
          "botox {city}",
          "harmonização facial {city}",
          "clínica estética perto de mim",
          "limpeza de pele {city}",
        ],
        city,
      ),
  },
  {
    id: "barbearia",
    label: "Barbearia",
    keywords: ["barbearia", "barbeiro", "barba", "corte masculino", "barbershop"],
    macroCategory: "beleza",
    templateSlug: "estetica",
    priority: "high",
    heroHighlight: "recebendo mais agendamentos.",
    businessType: "barbearia",
    yourBusinessLabel: "Sua barbearia",
    suggestedServices: [
      "Corte masculino",
      "Barba",
      "Sobrancelha",
      "Pacote corte + barba",
      "Design de barba",
    ],
    searchExamples: (_, city) =>
      cityExamples(
        [
          "barbearia perto de mim",
          "corte masculino {city}",
          "barbeiro {city}",
          "barba e cabelo {city}",
        ],
        city,
      ),
  },
  {
    id: "salao",
    label: "Salão de Beleza",
    keywords: [
      "salao",
      "salão",
      "cabeleireiro",
      "cabeleireira",
      "hair",
      "progressiva",
      "manicure",
      "nail designer",
    ],
    macroCategory: "beleza",
    templateSlug: "estetica",
    priority: "high",
    heroHighlight: "recebendo mais agendamentos.",
    businessType: "salão",
    yourBusinessLabel: "Seu salão",
    suggestedServices: [
      "Corte feminino",
      "Coloração",
      "Progressiva",
      "Manicure",
      "Escova",
    ],
    searchExamples: (_, city) =>
      cityExamples(
        [
          "salão de beleza {city}",
          "cabeleireiro perto de mim",
          "manicure {city}",
          "progressiva {city}",
        ],
        city,
      ),
  },
  {
    id: "lash",
    label: "Lash Designer",
    keywords: ["lash", "cilios", "cílios", "extensao de cilios", "extensão de cílios"],
    macroCategory: "beleza",
    templateSlug: "estetica",
    priority: "medium",
    heroHighlight: "recebendo mais agendamentos.",
    businessType: "estúdio",
    yourBusinessLabel: "Seu estúdio",
    suggestedServices: [
      "Extensão de cílios",
      "Volume russo",
      "Manutenção",
      "Lash lifting",
    ],
    searchExamples: (_, city) =>
      cityExamples(["extensão de cílios {city}", "lash designer {city}"], city),
  },
  {
    id: "micropigmentacao",
    label: "Micropigmentação",
    keywords: ["micropigmentacao", "micropigmentação", "sobrancelha", "microblading"],
    macroCategory: "beleza",
    templateSlug: "estetica",
    priority: "medium",
    heroHighlight: "recebendo mais agendamentos.",
    businessType: "estúdio",
    yourBusinessLabel: "Seu estúdio",
    suggestedServices: ["Micropigmentação", "Microblading", "Design de sobrancelha"],
    searchExamples: (_, city) =>
      cityExamples(["micropigmentação {city}", "microblading {city}"], city),
  },
  {
    id: "depilacao",
    label: "Depilação",
    keywords: ["depilacao", "depilação", "depiladora", "laser"],
    macroCategory: "beleza",
    templateSlug: "estetica",
    priority: "medium",
    heroHighlight: "recebendo mais clientes.",
    businessType: "clínica",
    yourBusinessLabel: "Sua clínica",
    suggestedServices: ["Depilação a laser", "Depilação definitiva", "Depilação com cera"],
    searchExamples: (_, city) =>
      cityExamples(["depilação a laser {city}", "depilação definitiva {city}"], city),
  },

  // ── Saúde ──
  {
    id: "dentista",
    label: "Dentista",
    keywords: [
      "dentista",
      "odonto",
      "odontologia",
      "ortodontista",
      "ortodontia",
      "implante dentario",
      "implante dentário",
    ],
    macroCategory: "saude",
    templateSlug: "dentista",
    priority: "high",
    heroHighlight: "recebendo mais pacientes.",
    businessType: "consultório",
    yourBusinessLabel: "Seu consultório",
    suggestedServices: ["Implante", "Clareamento", "Ortodontia", "Limpeza dental", "Canal"],
    searchExamples: (_, city) =>
      cityExamples(
        ["dentista {city}", "implante dentário {city}", "clareamento dental {city}"],
        city,
      ),
  },
  {
    id: "clinica-medica",
    label: "Clínica Médica",
    keywords: [
      "clinica medica",
      "clínica médica",
      "dermatologista",
      "dermatologia",
      "medico",
      "médico",
      "consultorio medico",
      "consultório médico",
      "check-up",
    ],
    macroCategory: "saude",
    templateSlug: "clinica",
    priority: "high",
    heroHighlight: "recebendo mais pacientes.",
    businessType: "clínica",
    yourBusinessLabel: "Sua clínica",
    suggestedServices: ["Consultas", "Exames", "Check-up", "Dermatologia"],
    searchExamples: (_, city) =>
      cityExamples(
        ["clínica médica {city}", "dermatologista {city}", "consultório médico perto de mim"],
        city,
      ),
  },
  {
    id: "fisioterapia",
    label: "Fisioterapia",
    keywords: ["fisioterapia", "fisioterapeuta", "fisio", "rpg", "pilates clinico"],
    macroCategory: "saude",
    templateSlug: "clinica",
    priority: "high",
    heroHighlight: "recebendo mais pacientes.",
    businessType: "clínica",
    yourBusinessLabel: "Sua clínica",
    suggestedServices: ["Fisioterapia", "RPG", "Pilates", "Reabilitação"],
    searchExamples: (_, city) =>
      cityExamples(["fisioterapia {city}", "fisioterapeuta perto de mim"], city),
  },
  {
    id: "psicologo",
    label: "Psicólogo",
    keywords: ["psicologo", "psicólogo", "psicologia", "terapia", "terapeuta"],
    macroCategory: "saude",
    templateSlug: "clinica",
    priority: "high",
    heroHighlight: "recebendo mais pacientes.",
    businessType: "consultório",
    yourBusinessLabel: "Seu consultório",
    suggestedServices: ["Terapia individual", "Terapia de casal", "Psicologia online"],
    searchExamples: (_, city) =>
      cityExamples(["psicólogo {city}", "terapia perto de mim"], city),
  },
  {
    id: "nutricionista",
    label: "Nutricionista",
    keywords: ["nutricionista", "nutricao", "nutrição", "nutricionismo"],
    macroCategory: "saude",
    templateSlug: "clinica",
    priority: "medium",
    heroHighlight: "recebendo mais pacientes.",
    businessType: "consultório",
    yourBusinessLabel: "Seu consultório",
    suggestedServices: ["Consulta nutricional", "Reeducação alimentar", "Emagrecimento"],
    searchExamples: (_, city) =>
      cityExamples(["nutricionista {city}", "nutri perto de mim"], city),
  },
  {
    id: "pet-shop",
    label: "Pet Shop",
    keywords: ["pet shop", "petshop", "loja de pets", "pet store", "aquarismo"],
    macroCategory: "saude",
    templateSlug: "clinica",
    priority: "high",
    heroHighlight: "recebendo mais clientes.",
    businessType: "pet shop",
    yourBusinessLabel: "Seu pet shop",
    suggestedServices: [
      "Banho e tosa",
      "Rações e acessórios",
      "Consulta veterinária",
      "Vacinas",
    ],
    searchExamples: (_, city) =>
      cityExamples(
        [
          "pet shop perto de mim",
          "veterinário {city}",
          "banho e tosa {city}",
          "clínica veterinária {city}",
        ],
        city,
      ),
  },
  {
    id: "veterinario",
    label: "Veterinário",
    keywords: ["veterinario", "veterinário", "clinica veterinaria", "clínica veterinária"],
    macroCategory: "saude",
    templateSlug: "clinica",
    priority: "high",
    heroHighlight: "recebendo mais clientes.",
    businessType: "clínica",
    yourBusinessLabel: "Sua clínica",
    suggestedServices: ["Consulta veterinária", "Vacinas", "Banho e tosa", "Pet shop"],
    searchExamples: (_, city) =>
      cityExamples(["veterinário {city}", "pet shop {city}", "clínica veterinária perto de mim"], city),
  },

  // ── Jurídico ──
  {
    id: "advogado",
    label: "Advogado",
    keywords: [
      "advogado",
      "advocacia",
      "juridico",
      "jurídico",
      "escritorio advocacia",
      "criminalista",
      "trabalhista",
      "previdenciario",
    ],
    macroCategory: "juridico",
    templateSlug: "advogado",
    priority: "high",
    heroHighlight: "recebendo mais clientes.",
    businessType: "escritório",
    yourBusinessLabel: "Seu escritório",
    suggestedServices: ["Trabalhista", "Criminal", "Família", "Cível", "Previdenciário"],
    searchExamples: (_, city) =>
      cityExamples(["advogado {city}", "advogado trabalhista {city}"], city),
  },

  // ── Imóveis ──
  {
    id: "imobiliaria",
    label: "Imobiliária",
    keywords: [
      "imobiliaria",
      "imobiliária",
      "corretor",
      "corretora",
      "imovel",
      "imóvel",
      "apartamento",
    ],
    macroCategory: "imoveis",
    templateSlug: "imobiliaria",
    priority: "high",
    heroHighlight: "recebendo mais leads.",
    businessType: "imobiliária",
    yourBusinessLabel: "Sua imobiliária",
    suggestedServices: ["Venda", "Aluguel", "Lançamentos", "Comercial"],
    searchExamples: (_, city) =>
      cityExamples(
        ["imobiliária {city}", "apartamento à venda {city}", "corretor de imóveis {city}"],
        city,
      ),
  },

  // ── Financeiro ──
  {
    id: "contabilidade",
    label: "Contabilidade",
    keywords: ["contador", "contabilidade", "contábil", "mei", "escritorio contabil"],
    macroCategory: "financeiro",
    templateSlug: "contabilidade",
    priority: "high",
    heroHighlight: "recebendo mais clientes.",
    businessType: "escritório",
    yourBusinessLabel: "Seu escritório",
    suggestedServices: ["MEI", "Abertura de empresa", "Fiscal", "Folha de pagamento"],
    searchExamples: (_, city) =>
      cityExamples(["contador {city}", "contabilidade MEI {city}"], city),
  },

  // ── Construção & Casa ──
  {
    id: "construcao",
    label: "Construção e Reformas",
    keywords: ["construcao", "construção", "reforma", "obra", "pedreiro", "engenheiro"],
    macroCategory: "construcao",
    templateSlug: "construcao",
    priority: "medium",
    heroHighlight: "recebendo mais clientes.",
    businessType: "empresa",
    yourBusinessLabel: "Sua empresa",
    suggestedServices: ["Reformas", "Construção", "Acabamento", "Manutenção"],
    searchExamples: (_, city) =>
      cityExamples(["reforma apartamento {city}", "construção {city}"], city),
  },
  {
    id: "energia-solar",
    label: "Energia Solar",
    keywords: ["energia solar", "solar", "fotovoltaica", "painel solar"],
    macroCategory: "casa",
    templateSlug: "energia-solar",
    priority: "medium",
    heroHighlight: "recebendo mais clientes.",
    businessType: "empresa",
    yourBusinessLabel: "Sua empresa",
    suggestedServices: ["Instalação residencial", "Comercial", "Manutenção"],
    searchExamples: (_, city) =>
      cityExamples(["energia solar {city}", "painel solar {city}"], city),
  },
  {
    id: "marcenaria",
    label: "Marcenaria",
    keywords: ["marcenaria", "marceneiro", "moveis planejados", "móveis planejados"],
    macroCategory: "casa",
    templateSlug: "construcao",
    priority: "medium",
    heroHighlight: "recebendo mais clientes.",
    businessType: "marcenaria",
    yourBusinessLabel: "Sua marcenaria",
    suggestedServices: ["Móveis planejados", "Armários", "Cozinhas", "Closets"],
    searchExamples: (_, city) =>
      cityExamples(["marcenaria {city}", "móveis planejados {city}"], city),
  },
  {
    id: "vidracaria",
    label: "Vidraçaria",
    keywords: ["vidracaria", "vidraçaria", "box", "espelho", "vidro temperado"],
    macroCategory: "casa",
    templateSlug: "construcao",
    priority: "medium",
    heroHighlight: "recebendo mais clientes.",
    businessType: "vidraçaria",
    yourBusinessLabel: "Sua vidraçaria",
    suggestedServices: ["Box blindex", "Espelhos", "Vidro temperado", "Janelas"],
    searchExamples: (_, city) =>
      cityExamples(["vidraçaria {city}", "box blindex {city}"], city),
  },

  // ── Serviços locais ──
  {
    id: "desentupidora",
    label: "Desentupidora",
    keywords: ["desentupidora", "desentupimento", "entupido", "esgoto"],
    macroCategory: "servicos",
    templateSlug: "servicos-locais",
    priority: "medium",
    heroHighlight: "recebendo mais chamados.",
    businessType: "empresa",
    yourBusinessLabel: "Sua empresa",
    suggestedServices: ["Desentupimento", "Limpeza de caixa", "Hidrojateamento"],
    searchExamples: (_, city) =>
      cityExamples(["desentupidora {city}", "desentupidora 24 horas {city}"], city),
  },
  {
    id: "eletricista",
    label: "Eletricista",
    keywords: ["eletricista", "eletrica", "elétrica", "instalacao eletrica"],
    macroCategory: "servicos",
    templateSlug: "servicos-locais",
    priority: "medium",
    heroHighlight: "recebendo mais chamados.",
    businessType: "negócio",
    yourBusinessLabel: "Seu negócio",
    suggestedServices: ["Instalação", "Manutenção", "Emergência 24h", "Quadro elétrico"],
    searchExamples: (_, city) =>
      cityExamples(["eletricista {city}", "eletricista 24 horas {city}"], city),
  },
  {
    id: "encanador",
    label: "Encanador",
    keywords: ["encanador", "hidraulica", "hidráulica", "vazamento"],
    macroCategory: "servicos",
    templateSlug: "servicos-locais",
    priority: "medium",
    heroHighlight: "recebendo mais chamados.",
    businessType: "negócio",
    yourBusinessLabel: "Seu negócio",
    suggestedServices: ["Vazamentos", "Instalação", "Manutenção", "Emergência"],
    searchExamples: (_, city) =>
      cityExamples(["encanador {city}", "encanador perto de mim"], city),
  },
  {
    id: "dedetizacao",
    label: "Dedetização",
    keywords: ["dedetizacao", "dedetização", "pragas", "cupim", "desinsetizacao"],
    macroCategory: "servicos",
    templateSlug: "servicos-locais",
    priority: "medium",
    heroHighlight: "recebendo mais clientes.",
    businessType: "empresa",
    yourBusinessLabel: "Sua empresa",
    suggestedServices: ["Dedetização", "Descupinização", "Controle de pragas"],
    searchExamples: (_, city) =>
      cityExamples(["dedetização {city}", "dedetizadora {city}"], city),
  },
  {
    id: "chaveiro",
    label: "Chaveiro",
    keywords: ["chaveiro", "chave", "fechadura", "abrir porta"],
    macroCategory: "servicos",
    templateSlug: "servicos-locais",
    priority: "medium",
    heroHighlight: "recebendo mais chamados.",
    businessType: "negócio",
    yourBusinessLabel: "Seu negócio",
    suggestedServices: ["Abertura de portas", "Cópia de chaves", "Troca de fechadura"],
    searchExamples: (_, city) =>
      cityExamples(["chaveiro {city}", "chaveiro 24 horas {city}"], city),
  },
  {
    id: "lava-rapido",
    label: "Lava Rápido",
    keywords: ["lava rapido", "lava rápido", "lavagem automotiva", "estetica automotiva"],
    macroCategory: "automotivo",
    templateSlug: "servicos-locais",
    priority: "medium",
    heroHighlight: "recebendo mais clientes.",
    businessType: "lava rápido",
    yourBusinessLabel: "Seu lava rápido",
    suggestedServices: ["Lavagem simples", "Lavagem completa", "Polimento", "Higienização"],
    searchExamples: (_, city) =>
      cityExamples(["lava rápido {city}", "lavagem automotiva {city}"], city),
  },

  // ── Educação ──
  {
    id: "escola-idiomas",
    label: "Escola de Idiomas",
    keywords: [
      "escola de ingles",
      "escola de inglês",
      "curso de ingles",
      "curso de inglês",
      "idiomas",
      "escola de idiomas",
    ],
    macroCategory: "educacao",
    templateSlug: "outro",
    priority: "medium",
    heroHighlight: "recebendo mais matrículas.",
    businessType: "escola",
    yourBusinessLabel: "Sua escola",
    suggestedServices: ["Inglês", "Espanhol", "Aulas particulares", "Preparatório"],
    searchExamples: (_, city) =>
      cityExamples(["escola de inglês {city}", "curso de inglês {city}"], city),
  },

  // ── Automotivo ──
  {
    id: "oficina",
    label: "Oficina Mecânica",
    keywords: [
      "oficina",
      "mecanica",
      "mecânica",
      "mecanico",
      "mecânico",
      "auto center",
      "autocenter",
    ],
    macroCategory: "automotivo",
    templateSlug: "servicos-locais",
    priority: "high",
    heroHighlight: "recebendo mais clientes.",
    businessType: "oficina",
    yourBusinessLabel: "Sua oficina",
    suggestedServices: ["Revisão", "Freios", "Suspensão", "Troca de óleo", "Diagnóstico"],
    searchExamples: (_, city) =>
      cityExamples(["oficina mecânica {city}", "mecânico perto de mim"], city),
  },

  // ── Fitness ──
  {
    id: "academia",
    label: "Academia",
    keywords: ["academia", "musculacao", "musculação", "crossfit", "personal trainer", "personal"],
    macroCategory: "servicos",
    templateSlug: "outro",
    priority: "high",
    heroHighlight: "recebendo mais matrículas.",
    businessType: "academia",
    yourBusinessLabel: "Sua academia",
    suggestedServices: ["Musculação", "Personal trainer", "Aulas em grupo", "Avaliação física"],
    searchExamples: (_, city) =>
      cityExamples(["academia {city}", "academia perto de mim", "personal trainer {city}"], city),
  },

  // ── Pets ──
  {
    id: "banho-e-tosa",
    label: "Banho e Tosa",
    keywords: ["banho e tosa", "tosa", "pet grooming", "estetica pet"],
    macroCategory: "saude",
    templateSlug: "clinica",
    priority: "medium",
    heroHighlight: "recebendo mais agendamentos.",
    businessType: "pet shop",
    yourBusinessLabel: "Seu pet shop",
    suggestedServices: ["Banho", "Tosa", "Hidratação", "Pacotes mensais"],
    searchExamples: (_, city) =>
      cityExamples(["banho e tosa {city}", "tosa de cachorro {city}"], city),
  },

  // ── Alimentação (alto volume local) ──
  {
    id: "restaurante",
    label: "Restaurante",
    keywords: ["restaurante", "comida", "almoco", "almoço", "jantar", "delivery"],
    macroCategory: "geral",
    templateSlug: "outro",
    priority: "high",
    heroHighlight: "recebendo mais pedidos.",
    businessType: "restaurante",
    yourBusinessLabel: "Seu restaurante",
    suggestedServices: ["Delivery", "Almoço executivo", "Reservas", "Cardápio digital"],
    searchExamples: (_, city) =>
      cityExamples(["restaurante {city}", "restaurante perto de mim", "delivery {city}"], city),
  },
  {
    id: "pizzaria",
    label: "Pizzaria",
    keywords: ["pizzaria", "pizza", "pizzaria delivery"],
    macroCategory: "geral",
    templateSlug: "outro",
    priority: "high",
    heroHighlight: "recebendo mais pedidos.",
    businessType: "pizzaria",
    yourBusinessLabel: "Sua pizzaria",
    suggestedServices: ["Delivery", "Rodízio", "Pizza artesanal", "Promoções"],
    searchExamples: (_, city) =>
      cityExamples(["pizzaria {city}", "pizza delivery {city}"], city),
  },

  // ── Tier C — ouro escondido ──
  {
    id: "guincho",
    label: "Guincho",
    keywords: ["guincho", "reboque", "socorro mecanico", "socorro mecânico"],
    macroCategory: "automotivo",
    templateSlug: "servicos-locais",
    priority: "medium",
    heroHighlight: "recebendo mais chamados.",
    businessType: "guincho",
    yourBusinessLabel: "Seu guincho",
    suggestedServices: ["Guincho 24h", "Reboque", "Socorro mecânico", "Pane seca"],
    searchExamples: (_, city) =>
      cityExamples(["guincho {city}", "guincho 24 horas {city}"], city),
  },
  {
    id: "mudancas",
    label: "Mudanças",
    keywords: ["mudanca", "mudança", "mudancas", "mudanças", "carreto", "frete"],
    macroCategory: "servicos",
    templateSlug: "servicos-locais",
    priority: "medium",
    heroHighlight: "recebendo mais orçamentos.",
    businessType: "empresa",
    yourBusinessLabel: "Sua empresa",
    suggestedServices: ["Mudança residencial", "Mudança comercial", "Carreto", "Embalagem"],
    searchExamples: (_, city) =>
      cityExamples(["mudanças {city}", "empresa de mudança {city}"], city),
  },
  {
    id: "pintor",
    label: "Pintor",
    keywords: ["pintor", "pintura", "pintura residencial", "pintura apartamento"],
    macroCategory: "construcao",
    templateSlug: "construcao",
    priority: "medium",
    heroHighlight: "recebendo mais orçamentos.",
    businessType: "pintor",
    yourBusinessLabel: "Seu negócio",
    suggestedServices: ["Pintura interna", "Pintura externa", "Textura", "Impermeabilização"],
    searchExamples: (_, city) =>
      cityExamples(["pintor {city}", "pintura apartamento {city}"], city),
  },
];

/** Gera definição dinâmica para termos desconhecidos */
export function createDynamicMicrovertical(userTerm: string): MicroverticalDefinition {
  const label = capitalizeBusinessTerm(userTerm);
  return {
    id: "dynamic",
    label,
    keywords: [],
    macroCategory: "geral",
    templateSlug: "outro",
    priority: "low",
    heroHighlight: "recebendo mais clientes.",
    businessType: label.toLowerCase(),
    yourBusinessLabel: `Sua ${label.toLowerCase()}`,
    suggestedServices: [
      "Serviço principal",
      "Atendimento local",
      "Orçamento",
      "Emergência",
    ],
    searchExamples: (term, city) => termSearch(term || label.toLowerCase(), city),
  };
}

export function capitalizeBusinessTerm(term: string): string {
  const trimmed = term.trim();
  if (!trimmed) return "Negócio Local";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
