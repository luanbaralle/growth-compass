import type { TeamMember } from "@/lib/auth/types";

export type ContentTaskStatus =
  | "ideia"
  | "definicao"
  | "agendamento"
  | "gravacao"
  | "edicao"
  | "aprovacao"
  | "correcao"
  | "aprovado"
  | "programado"
  | "publicado";

export type ContentChannel = "instagram" | "facebook" | "youtube" | "tiktok";

export type ContentType =
  | "video_curto"
  | "video_medio"
  | "video_longo"
  | "imagem"
  | "carrossel";

export interface ContentTask {
  id: string;
  company_id: string;
  title: string;
  status: ContentTaskStatus;
  channels: ContentChannel[];
  theme_objective: string | null;
  content_type: ContentType;
  post_date: string | null;
  production_owner_id: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContentTaskWithCompany extends ContentTask {
  companies: { name: string } | null;
}

export type ContentTaskEventType =
  | "created"
  | "status_changed"
  | "title_changed"
  | "channels_changed"
  | "theme_changed"
  | "content_type_changed"
  | "post_date_changed"
  | "production_owner_changed"
  | "notes_changed"
  | "company_changed"
  | "note";

export interface ContentTaskEvent {
  id: string;
  content_task_id: string;
  type: ContentTaskEventType;
  title: string;
  body: string | null;
  metadata: Record<string, unknown>;
  author_id: string | null;
  created_at: string;
}

export const CONTENT_TASK_EVENT_LABELS: Record<ContentTaskEventType, string> = {
  created: "Criação",
  status_changed: "Status",
  title_changed: "Título",
  channels_changed: "Canais",
  theme_changed: "Tema",
  content_type_changed: "Tipo",
  post_date_changed: "Data",
  production_owner_changed: "Produção",
  notes_changed: "Observações",
  company_changed: "Cliente",
  note: "Nota",
};

export interface ContentTaskListFilters {
  search?: string;
  status?: ContentTaskStatus | "all";
  channel?: ContentChannel | "all";
  companyId?: string;
  productionOwnerId?: TeamMember | "all";
  postDateFrom?: string;
  postDateTo?: string;
}

export const CONTENT_PHASES = [
  {
    id: "pre",
    label: "Pré-Produção",
    statuses: ["ideia", "definicao", "agendamento"] as ContentTaskStatus[],
  },
  {
    id: "prod",
    label: "Produção",
    statuses: ["gravacao", "edicao", "aprovacao", "correcao"] as ContentTaskStatus[],
  },
  {
    id: "final",
    label: "Finalização",
    statuses: ["aprovado", "programado", "publicado"] as ContentTaskStatus[],
  },
] as const;

export const CONTENT_STATUSES: ContentTaskStatus[] = CONTENT_PHASES.flatMap(
  (phase) => phase.statuses,
);

export const CONTENT_CHANNELS: ContentChannel[] = [
  "instagram",
  "facebook",
  "youtube",
  "tiktok",
];

export const CONTENT_TYPES: ContentType[] = [
  "video_curto",
  "video_medio",
  "video_longo",
  "imagem",
  "carrossel",
];

export const STATUS_LABELS: Record<ContentTaskStatus, string> = {
  ideia: "Ideia",
  definicao: "Definição",
  agendamento: "Agendamento",
  gravacao: "Gravação",
  edicao: "Edição",
  aprovacao: "Aprovação",
  correcao: "Correção",
  aprovado: "Aprovado",
  programado: "Programado",
  publicado: "Publicado",
};

export const CHANNEL_LABELS: Record<ContentChannel, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
};

export const TYPE_LABELS: Record<ContentType, string> = {
  video_curto: "Vídeo curto",
  video_medio: "Vídeo médio",
  video_longo: "Vídeo longo",
  imagem: "Imagem",
  carrossel: "Carrossel",
};

export const STATUS_ACCENT: Record<ContentTaskStatus, string> = {
  ideia: "bg-sky-400",
  definicao: "bg-indigo-400",
  agendamento: "bg-violet-400",
  gravacao: "bg-brand",
  edicao: "bg-amber-400",
  aprovacao: "bg-orange-400",
  correcao: "bg-red-400/70",
  aprovado: "bg-emerald-400",
  programado: "bg-cyan-400",
  publicado: "bg-green-500",
};

export const CHANNEL_ACCENT: Record<ContentChannel, string> = {
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  facebook: "bg-blue-500",
  youtube: "bg-red-500",
  tiktok: "bg-foreground/80",
};

export const CHANNEL_BADGE: Record<ContentChannel, string> = {
  instagram: "bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-500/30",
  facebook: "bg-blue-500/15 text-blue-300 ring-blue-500/30",
  youtube: "bg-red-500/15 text-red-300 ring-red-500/30",
  tiktok: "bg-zinc-400/15 text-zinc-200 ring-zinc-400/25",
};

export const CHANNEL_DOT: Record<ContentChannel, string> = {
  instagram: "bg-fuchsia-400",
  facebook: "bg-blue-400",
  youtube: "bg-red-400",
  tiktok: "bg-zinc-300",
};

export function formatPostDate(date: string | null): string {
  if (!date) return "Sem data";
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

export function formatChannels(channels: ContentChannel[]): string {
  if (channels.length === 0) return "Sem canal";
  return channels.map((c) => CHANNEL_LABELS[c]).join(", ");
}

export function getStatusIndex(status: ContentTaskStatus): number {
  return CONTENT_STATUSES.indexOf(status);
}

export function getAdjacentStatus(
  status: ContentTaskStatus,
  direction: "prev" | "next",
): ContentTaskStatus | null {
  const index = getStatusIndex(status);
  if (index < 0) return null;
  if (direction === "prev") {
    return index > 0 ? CONTENT_STATUSES[index - 1] : null;
  }
  return index < CONTENT_STATUSES.length - 1 ? CONTENT_STATUSES[index + 1] : null;
}

export function isStatusBeforeProgramado(status: ContentTaskStatus): boolean {
  const programadoIndex = getStatusIndex("programado");
  return getStatusIndex(status) < programadoIndex;
}

export function formatTaskTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function normalizeChannels(value: unknown): ContentChannel[] {
  if (Array.isArray(value)) {
    return value.filter((c): c is ContentChannel =>
      CONTENT_CHANNELS.includes(c as ContentChannel),
    );
  }
  if (typeof value === "string" && CONTENT_CHANNELS.includes(value as ContentChannel)) {
    return [value as ContentChannel];
  }
  return ["instagram"];
}
