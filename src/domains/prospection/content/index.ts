import type { SegmentPlaybook } from "./types";
import { academiasPlaybook } from "./academias";
import { advogadosPlaybook } from "./advogados";
import { clinicasPlaybook } from "./clinicas";
import { contabilidadePlaybook } from "./contabilidade";
import { escolasPlaybook } from "./escolas";
import { imobiliariasPlaybook } from "./imobiliarias";
import { restaurantesPlaybook } from "./restaurantes";
import { saloesPlaybook } from "./saloes";

export const COMMERCIAL_PLAYBOOKS: SegmentPlaybook[] = [
  saloesPlaybook,
  advogadosPlaybook,
  clinicasPlaybook,
  imobiliariasPlaybook,
  escolasPlaybook,
  contabilidadePlaybook,
  restaurantesPlaybook,
  academiasPlaybook,
];

export function getPlaybookBySlug(slug: string): SegmentPlaybook | undefined {
  return COMMERCIAL_PLAYBOOKS.find((p) => p.slug === slug);
}
