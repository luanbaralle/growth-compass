import type { HubSegmentCard, SegmentConfig } from "./types";
import { esteticaSegment } from "./estetica";
import {
  advogadoSegment,
  clinicaSegment,
  construcaoSegment,
  contabilidadeSegment,
  dentistaSegment,
  energiaSolarSegment,
  imobiliariaSegment,
  outroSegment,
  servicosLocaisSegment,
} from "./verticals";

export const SEGMENTS: Record<string, SegmentConfig> = {
  clinica: clinicaSegment,
  estetica: esteticaSegment,
  dentista: dentistaSegment,
  advogado: advogadoSegment,
  imobiliaria: imobiliariaSegment,
  contabilidade: contabilidadeSegment,
  "energia-solar": energiaSolarSegment,
  construcao: construcaoSegment,
  "servicos-locais": servicosLocaisSegment,
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
    slug: "outro",
    label: outroSegment.hubLabel,
    description: "Outro tipo de negócio local",
    icon: outroSegment.icon,
    accentColor: outroSegment.accentColor,
  },
];

export type { SegmentConfig, HubSegmentCard } from "./types";
