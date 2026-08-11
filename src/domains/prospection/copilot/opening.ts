import { personalize } from "./engine";

export const CANONICAL_SALOES_OPENING = `Oi, [Nome], tudo bem?

Aqui é o Luan, da Raise One.

A gente trabalha com marketing e aquisição para empresas que já têm uma operação rodando e querem crescer de forma mais previsível.

Encontrei o [Empresa] e vocês entraram no perfil de empresas que estamos buscando conversar: [traits].

Estou entrando em contato justamente para entender se existe alguma oportunidade de ajudarmos vocês a trazer mais clientes através do digital.

Se fizer sentido, posso te explicar rapidinho o que fazemos e entender um pouco melhor o momento de vocês.`;

const TRAIT_PHRASES: Record<string, string> = {
  muitas_avaliacoes: "boa avaliação no Google",
  poucas_avaliacoes: "presença no Google ainda em construção",
  instagram_ativo: "presença ativa no Instagram",
  instagram_abandonado: "Instagram com oportunidade de retomada",
  site_moderno: "site moderno",
  sem_site: "operacao focada no presencial",
  site_antigo: "site que pode evoluir",
  gmb_incompleto: "Google Meu Negócio incompleto",
  whatsapp_pouco_visivel: "WhatsApp pouco visível no digital",
  sem_cta: "oportunidade de CTA mais claro",
  empresa_nova: "operacao recente na região",
  empresa_tradicional: "operacao tradicional bem estabelecida",
  concorrentes_antes: "mercado competitivo na região",
  perfil_profissional: "perfil digital profissional",
  perfil_amador: "perfil digital com margem de evolucao",
  especialidade_coloracao: "forte em coloração e loiro",
  link_agendamento_ausente: "agendamento ainda nao tao estruturado online",
  profissional_desbalanceado: "equipe com profissionais em ritmos diferentes",
};

export function buildTraitsFromObservations(observationKeys: string[]): string {
  const phrases = observationKeys
    .map((key) => TRAIT_PHRASES[key])
    .filter((p): p is string => Boolean(p))
    .slice(0, 3);

  if (phrases.length === 0) {
    return "presenca digital consistente e operacao estabelecida na regiao";
  }
  if (phrases.length === 1) return phrases[0]!;
  if (phrases.length === 2) return `${phrases[0]} e ${phrases[1]}`;
  return `${phrases[0]}, ${phrases[1]} e ${phrases[2]}`;
}

export function buildCanonicalSaloesOpening(
  observationKeys: string[],
  ctx: { name: string; city?: string | null },
): string {
  const traits = buildTraitsFromObservations(observationKeys);
  return personalize(CANONICAL_SALOES_OPENING, ctx).replace("[traits]", traits);
}

export const RESPECTFUL_CLOSING_TEMPLATE = `Tranquilo, [Nome]. Obrigado pelo retorno. Sucesso com o [Empresa] — se um dia fizer sentido conversar sobre crescimento, estou por aqui.`;
