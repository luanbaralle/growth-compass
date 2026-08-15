import { moveContentTask } from "./service.server";
import * as repo from "./repository.server";

const BRAZIL_TZ = "America/Sao_Paulo";
const AUTO_PUBLISH_HOUR = 22;

type BrazilDateParts = {
  date: string;
  hour: number;
};

function readBrazilDateParts(now: Date): BrazilDateParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: BRAZIL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");

  return {
    date: `${year}-${month}-${day}`,
    hour,
  };
}

export function isContentDueForAutoPublish(postDate: string, now = new Date()): boolean {
  const { date: today, hour } = readBrazilDateParts(now);
  if (postDate < today) return true;
  if (postDate === today && hour >= AUTO_PUBLISH_HOUR) return true;
  return false;
}

export type PublishScheduledContentResult = {
  checkedAt: string;
  publishedCount: number;
  tasks: Array<{
    id: string;
    title: string;
    postDate: string;
    ok: boolean;
    error?: string;
  }>;
};

export async function publishDueScheduledContentTasks(
  now = new Date(),
): Promise<PublishScheduledContentResult> {
  const scheduled = await repo.findScheduledContentTasks();
  const due = scheduled.filter(
    (task) => task.post_date && isContentDueForAutoPublish(task.post_date, now),
  );

  const tasks: PublishScheduledContentResult["tasks"] = [];

  for (const task of due) {
    try {
      const updated = await moveContentTask(task.id, "publicado", null);
      tasks.push({
        id: task.id,
        title: task.title,
        postDate: task.post_date!,
        ok: Boolean(updated),
        ...(updated ? {} : { error: "Tarefa não encontrada." }),
      });
    } catch (error) {
      tasks.push({
        id: task.id,
        title: task.title,
        postDate: task.post_date!,
        ok: false,
        error: error instanceof Error ? error.message : "Erro desconhecido.",
      });
    }
  }

  return {
    checkedAt: now.toISOString(),
    publishedCount: tasks.filter((task) => task.ok).length,
    tasks,
  };
}
