import type { ContentChannel, ContentTaskWithCompany } from "@/domains/content-production/types";
import {
  CHANNEL_LABELS,
  formatPostDate,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/domains/content-production/types";
import { createContentTask } from "@/domains/content-production/api.server";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";

const COPY_SUFFIX = / \(cópia(?: \d+)?\)$/;

export function duplicateContentTitle(title: string): string {
  const base = title.replace(COPY_SUFFIX, "").trim();
  return `${base} (cópia)`;
}

export function buildDuplicateCreatePayload(task: ContentTaskWithCompany) {
  return {
    companyId: task.company_id,
    title: duplicateContentTitle(task.title),
    status: task.status,
    channels: task.channels,
    themeObjective: task.theme_objective ?? "",
    contentType: task.content_type,
    postDate: task.post_date ?? "",
    productionOwnerId: (task.production_owner_id as TeamMember) || undefined,
    notes: task.notes ?? "",
    briefingHook: task.briefing_hook ?? "",
    briefingScript: task.briefing_script ?? "",
    briefingCta: task.briefing_cta ?? "",
    briefingReferences: task.briefing_references ?? "",
  };
}

export function addChannel(
  channels: ContentChannel[],
  channel: ContentChannel,
): ContentChannel[] {
  if (channels.includes(channel)) return channels;
  return [...channels, channel];
}

export function removeChannel(
  channels: ContentChannel[],
  channel: ContentChannel,
): ContentChannel[] | null {
  if (!channels.includes(channel)) return channels;
  if (channels.length === 1) return null;
  return channels.filter((c) => c !== channel);
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadContentTasksCsv(
  tasks: ContentTaskWithCompany[],
  filenamePrefix = "conteudo",
) {
  const headers = [
    "Título",
    "Status",
    "Cliente",
    "Canais",
    "Tipo",
    "Data de postagem",
    "Produção",
    "Tema | Objetivo",
    "Observações",
    "Criado em",
    "Atualizado em",
  ];

  const rows = tasks.map((task) => [
    task.title,
    STATUS_LABELS[task.status],
    task.companies?.name ?? "",
    task.channels.map((c) => CHANNEL_LABELS[c]).join(", "),
    TYPE_LABELS[task.content_type],
    formatPostDate(task.post_date),
    task.production_owner_id
      ? (TEAM_LABELS[task.production_owner_id as TeamMember] ?? task.production_owner_id)
      : "",
    task.theme_objective ?? "",
    task.notes ?? "",
    task.created_at,
    task.updated_at,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(String(cell))).join(","))
    .join("\r\n");

  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function duplicateContentTask(task: ContentTaskWithCompany) {
  return createContentTask({ data: buildDuplicateCreatePayload(task) });
}

export async function duplicateContentTasks(tasks: ContentTaskWithCompany[]) {
  return Promise.all(tasks.map((task) => duplicateContentTask(task)));
}
