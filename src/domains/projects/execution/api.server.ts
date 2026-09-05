import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import {
  applyWorkflowTemplateSchema,
  completeDeliverableSchema,
  completeWorkflowTaskSchema,
  createWorkflowTemplateSchema,
  duplicateWorkflowTemplateSchema,
  projectWorkflowIdSchema,
  resumeWorkflowTaskSchema,
  saveWorkflowTemplateStructureSchema,
  setWaitingClientSchema,
  templateIdSchema,
  updateWorkflowTaskSchema,
  updateWorkflowTemplateMetaSchema,
  upsertBriefingSchema,
} from "./schema";

export const listWorkflowTemplates = createServerFn({ method: "GET" }).handler(async () => {
  return withAuth(async () => {
    const execution = await import("./service.server");
    return execution.listWorkflowTemplates();
  });
});

export const listTemplatesForStudio = createServerFn({ method: "GET" }).handler(async () => {
  return withAuth(async () => {
    const execution = await import("./service.server");
    return execution.listTemplatesForStudio();
  });
});

export const getWorkflowTemplateDetail = createServerFn({ method: "GET" })
  .validator(templateIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const execution = await import("./service.server");
      return execution.getWorkflowTemplateDetail(data.templateId);
    });
  });

export const createWorkflowTemplate = createServerFn({ method: "POST" })
  .validator(createWorkflowTemplateSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const execution = await import("./service.server");
      return execution.createWorkflowTemplate(data);
    });
  });

export const updateWorkflowTemplateMeta = createServerFn({ method: "POST" })
  .validator(updateWorkflowTemplateMetaSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const execution = await import("./service.server");
      return execution.updateWorkflowTemplateMeta(data);
    });
  });

export const saveWorkflowTemplateStructure = createServerFn({ method: "POST" })
  .validator(saveWorkflowTemplateStructureSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const execution = await import("./service.server");
      return execution.saveWorkflowTemplateStructure(data);
    });
  });

export const duplicateWorkflowTemplate = createServerFn({ method: "POST" })
  .validator(duplicateWorkflowTemplateSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const execution = await import("./service.server");
      return execution.duplicateWorkflowTemplate(data);
    });
  });

export const deactivateWorkflowTemplate = createServerFn({ method: "POST" })
  .validator(templateIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const execution = await import("./service.server");
      return execution.deactivateWorkflowTemplate(data.templateId);
    });
  });

export const deleteWorkflowTemplate = createServerFn({ method: "POST" })
  .validator(templateIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const execution = await import("./service.server");
      return execution.deleteWorkflowTemplate(data.templateId);
    });
  });

export const getProjectExecution = createServerFn({ method: "GET" })
  .validator(projectWorkflowIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const execution = await import("./service.server");
      return execution.getProjectExecution(data.projectId);
    });
  });

export const applyWorkflowTemplate = createServerFn({ method: "POST" })
  .validator(applyWorkflowTemplateSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const execution = await import("./service.server");
      return execution.applyWorkflowTemplate(data.projectId, data.templateSlug, author);
    });
  });

export const updateWorkflowTask = createServerFn({ method: "POST" })
  .validator(updateWorkflowTaskSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const execution = await import("./service.server");
      const { projectId, taskId, ...patch } = data;
      return execution.updateWorkflowTask(
        projectId,
        taskId,
        {
          status: patch.status as
            | "todo"
            | "in_progress"
            | "blocked"
            | "waiting_client"
            | "done"
            | undefined,
          priority: patch.priority as "low" | "medium" | "high" | "urgent" | undefined,
          assigneeId: patch.assigneeId,
          dueDate: patch.dueDate === "" ? null : patch.dueDate,
          notes: patch.notes,
          checklistJson: patch.checklistJson,
          dependencyOverride: patch.dependencyOverride,
          waitingClientName: patch.waitingClientName,
          waitingClientDue: patch.waitingClientDue === "" ? null : patch.waitingClientDue,
        },
        author,
      );
    });
  });

export const completeWorkflowTask = createServerFn({ method: "POST" })
  .validator(completeWorkflowTaskSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const execution = await import("./service.server");
      return execution.completeWorkflowTask(
        data.projectId,
        data.taskId,
        author,
        data.overrideDependencies,
      );
    });
  });

export const setWaitingClient = createServerFn({ method: "POST" })
  .validator(setWaitingClientSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const execution = await import("./service.server");
      return execution.setWaitingClient(
        data.projectId,
        data.taskId,
        {
          clientName: data.clientName,
          dueDate: data.dueDate || undefined,
          notes: data.notes,
        },
        author,
      );
    });
  });

export const resumeWorkflowTask = createServerFn({ method: "POST" })
  .validator(resumeWorkflowTaskSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const execution = await import("./service.server");
      return execution.resumeWorkflowTask(
        data.projectId,
        data.taskId,
        author,
        data.status ?? "in_progress",
      );
    });
  });

export const completeDeliverable = createServerFn({ method: "POST" })
  .validator(completeDeliverableSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const execution = await import("./service.server");
      return execution.completeDeliverable(data.projectId, data.deliverableId);
    });
  });

export const upsertProjectBriefing = createServerFn({ method: "POST" })
  .validator(upsertBriefingSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const execution = await import("./service.server");
      const { projectId, ...rest } = data;
      return execution.upsertBriefing(projectId, rest);
    });
  });

export const getExecutionDashboard = createServerFn({ method: "GET" }).handler(async () => {
  return withAuth(async () => {
    const execution = await import("./service.server");
    return execution.getExecutionDashboard();
  });
});
