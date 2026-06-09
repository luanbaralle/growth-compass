import type { HubSegmentCard, SegmentConfig } from "./types";
import { esteticaSegment } from "./estetica";
import {
  advogadoSegment,
  alimentacaoSegment,
  automotivoSegment,
  clinicaSegment,
  construcaoSegment,
  contabilidadeSegment,
  dentistaSegment,
  educacaoSegment,
  energiaSolarSegment,
  financeiroSegment,
  imobiliariaSegment,
  outroSegment,
  petsSegment,
  servicosLocaisSegment,
} from "./verticals";

export const SEGMENTS: Record<string, SegmentConfig> = {
  clinica: clinicaSegment,
  estetica: esteticaSegment,
  dentista: dentistaSegment,
  advogado: advogadoSegment,
  imobiliaria: imobiliariaSegment,
  contabilidade: contabilidadeSegment,
  financeiro: financeiroSegment,
  "energia-solar": energiaSolarSegment,
  construcao: construcaoSegment,
  "servicos-locais": servicosLocaisSegment,
  automotivo: automotivoSegment,
  educacao: educacaoSegment,
  alimentacao: alimentacaoSegment,
  pets: petsSegment,
  outro: outroSegment,
};

export const SEGMENT_SLUGS = Object.keys(SEGMENTS);

export function getSegment(slug: string): SegmentConfig | undefined {
  return SEGMENTS[slug];
}

export function isValidSegment(slug: string): boolean {
  return slug in SEGMENTS;
}

/** Cards exibidos na página hub — ordem intencional para UX de diagnóstico */
export const HUB_SEGMENTS: HubSegmentCard[] = [
  {
    slug: "clinica",
    label: clinicaSegment.hubLabel,
    description: "Consultórios, clínicas médicas e saúde",
    icon: clinicaSegment.icon,
    accentColor: clinicaSegment.accentColor,
  },
  {
    slug: "estetica",
    label: esteticaSegment.hubLabel,
    description: "Estética, beleza e bem-estar",
    icon: esteticaSegment.icon,
    accentColor: esteticaSegment.accentColor,
  },
  {
    slug: "dentista",
    label: dentistaSegment.hubLabel,
    description: "Odontologia e clínicas dentárias",
    icon: dentistaSegment.icon,
    accentColor: dentistaSegment.accentColor,
  },
  {
    slug: "advogado",
    label: advogadoSegment.hubLabel,
    description: "Escritórios de advocacia",
    icon: advogadoSegment.icon,
    accentColor: advogadoSegment.accentColor,
  },
  {
    slug: "imobiliaria",
    label: imobiliariaSegment.hubLabel,
    description: "Imobiliárias e corretores",
    icon: imobiliariaSegment.icon,
    accentColor: imobiliariaSegment.accentColor,
  },
  {
    slug: "contabilidade",
    label: contabilidadeSegment.hubLabel,
    description: "Contadores e escritórios contábeis",
    icon: contabilidadeSegment.icon,
    accentColor: contabilidadeSegment.accentColor,
  },
  {
    slug: "financeiro",
    label: financeiroSegment.hubLabel,
    description: "Seguros, crédito e planejamento financeiro",
    icon: financeiroSegment.icon,
    accentColor: financeiroSegment.accentColor,
  },
  {
    slug: "energia-solar",
    label: energiaSolarSegment.hubLabel,
    description: "Energia solar e fotovoltaica",
    icon: energiaSolarSegment.icon,
    accentColor: energiaSolarSegment.accentColor,
  },
  {
    slug: "construcao",
    label: construcaoSegment.hubLabel,
    description: "Construção, reformas e obras",
    icon: construcaoSegment.icon,
    accentColor: construcaoSegment.accentColor,
  },
  {
    slug: "servicos-locais",
    label: servicosLocaisSegment.hubLabel,
    description: "Prestadores de serviços locais",
    icon: servicosLocaisSegment.icon,
    accentColor: servicosLocaisSegment.accentColor,
  },
  {
    slug: "automotivo",
    label: automotivoSegment.hubLabel,
    description: "Oficinas, auto centers e serviços automotivos",
    icon: automotivoSegment.icon,
    accentColor: automotivoSegment.accentColor,
  },
  {
    slug: "educacao",
    label: educacaoSegment.hubLabel,
    description: "Escolas, cursos e autoescolas",
    icon: educacaoSegment.icon,
    accentColor: educacaoSegment.accentColor,
  },
  {
    slug: "alimentacao",
    label: alimentacaoSegment.hubLabel,
    description: "Restaurantes, delivery e food service",
    icon: alimentacaoSegment.icon,
    accentColor: alimentacaoSegment.accentColor,
  },
  {
    slug: "pets",
    label: petsSegment.hubLabel,
    description: "Pet shops, veterinários e banho e tosa",
    icon: petsSegment.icon,
    accentColor: petsSegment.accentColor,
  },
  {
    slug: "outro",
    label: outroSegment.hubLabel,
    description: "Outro tipo de negócio local",
    icon: outroSegment.icon,
    accentColor: outroSegment.accentColor,
  },
];

export type { SegmentConfig, HubSegmentCard } from "./types";
