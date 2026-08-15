import type { TeamMember } from "@/lib/auth/types";
import * as repo from "./repository.server";
import { groupAgendaTasks } from "./types";

export async function getMyAgenda(assigneeId: TeamMember) {
  const tasks = await repo.findTasksForAssignee(assigneeId, { includeDone: true });
  return groupAgendaTasks(tasks);
}

export async function createManualTask(
  assigneeId: TeamMember,
  input: {
    title: string;
    dueDate?: string;
    companyId?: string;
    projectId?: string;
  },
) {
  const task = await repo.insertManualTask({
    title: input.title.trim(),
    assigneeId,
    dueDate: input.dueDate || null,
    companyId: input.companyId ?? null,
    projectId: input.projectId ?? null,
  });
  return task;
}

export async function setTaskDone(assigneeId: TeamMember, id: string, done: boolean) {
  const task = await repo.updateTaskDone(id, assigneeId, done);
  if (!task) {
    throw new Error("Tarefa não encontrada.");
  }
  return task;
}
