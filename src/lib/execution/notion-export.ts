import type { ExecutionState, SopDefinition } from "./types";
import { TEAM_LABELS } from "./types";

export function formatSopForNotion(sop: SopDefinition): string {
  const lines = [
    `# ${sop.title}`,
    "",
    `**Trigger:** ${sop.trigger}`,
    `**Dono:** ${TEAM_LABELS[sop.owner]}`,
    `**Exportado em:** ${new Date().toLocaleDateString("pt-BR")}`,
    "",
    "## Checklist",
    "",
    ...sop.items.map((item, i) => `- [${item.done ? "x" : " "}] ${i + 1}. ${item.text}`),
    "",
    "---",
    "_Copiar para o Notion → Knowledge Base R1_",
  ];
  return lines.join("\n");
}

export function formatAllSopsForNotion(state: ExecutionState): string {
  const header = [
    "# Raise One — Playbooks (SOPs)",
    "",
    `Exportado em ${new Date().toLocaleString("pt-BR")}`,
    "",
    "---",
    "",
  ].join("\n");

  return header + state.sops.map((sop) => formatSopForNotion(sop)).join("\n\n");
}

export function formatSingleSopForNotion(state: ExecutionState, sopId: string): string | null {
  const sop = state.sops.find((s) => s.id === sopId);
  if (!sop) return null;
  return formatSopForNotion(sop);
}
