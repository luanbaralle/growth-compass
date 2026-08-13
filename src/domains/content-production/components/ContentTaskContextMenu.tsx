import type {
  ContentChannel,
  ContentTaskStatus,
  ContentTaskWithCompany,
} from "@/domains/content-production/types";
import {
  CHANNEL_LABELS,
  CONTENT_CHANNELS,
  CONTENT_PHASES,
  STATUS_ACCENT,
  STATUS_LABELS,
} from "@/domains/content-production/types";
import { TEAM_LABELS, TEAM_MEMBERS, type TeamMember } from "@/lib/auth/types";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Calendar, Copy, ExternalLink, Trash2, User } from "lucide-react";
import { useState, type ReactNode } from "react";

export type ContentTaskQuickActions = {
  onOpen?: (task: ContentTaskWithCompany) => void;
  onDuplicate?: (task: ContentTaskWithCompany) => void | Promise<void>;
  onDelete?: (task: ContentTaskWithCompany) => void | Promise<void>;
  onStatusChange?: (task: ContentTaskWithCompany, status: ContentTaskStatus) => void | Promise<void>;
  onPostDateChange?: (task: ContentTaskWithCompany, postDate: string) => void | Promise<void>;
  onClearPostDate?: (task: ContentTaskWithCompany) => void | Promise<void>;
  onAddChannel?: (task: ContentTaskWithCompany, channel: ContentChannel) => void | Promise<void>;
  onRemoveChannel?: (task: ContentTaskWithCompany, channel: ContentChannel) => void | Promise<void>;
  onOwnerChange?: (task: ContentTaskWithCompany, owner: TeamMember) => void | Promise<void>;
};

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function runAction(action?: () => void | Promise<void>) {
  if (!action) return;
  void action();
}

export function ContentTaskContextMenu({
  task,
  actions,
  children,
}: {
  task: ContentTaskWithCompany;
  actions: ContentTaskQuickActions;
  children: ReactNode;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const hasChannels = actions.onAddChannel || actions.onRemoveChannel;
  const hasDate =
    actions.onPostDateChange || actions.onClearPostDate;

  const handleConfirmDelete = async () => {
    if (!actions.onDelete) return;
    setDeleting(true);
    try {
      await actions.onDelete(task);
      setDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel className="truncate font-normal text-muted-foreground">
          {task.title}
        </ContextMenuLabel>
        <ContextMenuSeparator />

        {actions.onOpen && (
          <ContextMenuItem onSelect={() => runAction(() => actions.onOpen?.(task))}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Abrir
          </ContextMenuItem>
        )}

        {actions.onDuplicate && (
          <ContextMenuItem onSelect={() => runAction(() => actions.onDuplicate?.(task))}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicar
          </ContextMenuItem>
        )}

        {(actions.onOpen || actions.onDuplicate) &&
          (actions.onStatusChange || hasDate || hasChannels || actions.onOwnerChange) && (
            <ContextMenuSeparator />
          )}

        {actions.onStatusChange && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>Mover para status</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-52">
              {CONTENT_PHASES.map((phase) => (
                <div key={phase.id}>
                  <ContextMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    {phase.label}
                  </ContextMenuLabel>
                  {phase.statuses.map((status) => (
                    <ContextMenuItem
                      key={status}
                      disabled={task.status === status}
                      onSelect={() => runAction(() => actions.onStatusChange?.(task, status))}
                    >
                      <span className={cn("mr-2 h-2 w-2 rounded-full", STATUS_ACCENT[status])} />
                      {STATUS_LABELS[status]}
                    </ContextMenuItem>
                  ))}
                </div>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}

        {hasDate && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Calendar className="mr-2 h-4 w-4" />
              Data de postagem
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-44">
              {actions.onPostDateChange && (
                <>
                  <ContextMenuItem
                    onSelect={() =>
                      runAction(() =>
                        actions.onPostDateChange?.(task, toDateInputValue(new Date())),
                      )
                    }
                  >
                    Hoje
                  </ContextMenuItem>
                  <ContextMenuItem
                    onSelect={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      runAction(() =>
                        actions.onPostDateChange?.(task, toDateInputValue(tomorrow)),
                      );
                    }}
                  >
                    Amanhã
                  </ContextMenuItem>
                </>
              )}
              {actions.onClearPostDate && task.post_date && (
                <ContextMenuItem
                  onSelect={() => runAction(() => actions.onClearPostDate?.(task))}
                >
                  Remover data
                </ContextMenuItem>
              )}
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}

        {hasChannels && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>Canais</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-44">
              {actions.onAddChannel && (
                <>
                  <ContextMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    Adicionar
                  </ContextMenuLabel>
                  {CONTENT_CHANNELS.map((channel) => (
                    <ContextMenuItem
                      key={`add-${channel}`}
                      disabled={task.channels.includes(channel)}
                      onSelect={() => runAction(() => actions.onAddChannel?.(task, channel))}
                    >
                      + {CHANNEL_LABELS[channel]}
                    </ContextMenuItem>
                  ))}
                </>
              )}
              {actions.onAddChannel && actions.onRemoveChannel && <ContextMenuSeparator />}
              {actions.onRemoveChannel && (
                <>
                  <ContextMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    Remover
                  </ContextMenuLabel>
                  {CONTENT_CHANNELS.map((channel) => (
                    <ContextMenuItem
                      key={`remove-${channel}`}
                      disabled={!task.channels.includes(channel) || task.channels.length === 1}
                      onSelect={() => runAction(() => actions.onRemoveChannel?.(task, channel))}
                    >
                      − {CHANNEL_LABELS[channel]}
                    </ContextMenuItem>
                  ))}
                </>
              )}
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}

        {actions.onOwnerChange && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <User className="mr-2 h-4 w-4" />
              Produção
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-40">
              {TEAM_MEMBERS.map((member) => (
                <ContextMenuItem
                  key={member}
                  disabled={task.production_owner_id === member}
                  onSelect={() => runAction(() => actions.onOwnerChange?.(task, member))}
                >
                  {TEAM_LABELS[member]}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}

        {actions.onDelete && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>

    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">{task.title}</span> será removida do
            kanban, calendário e lista. Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleting}
            onClick={(event) => {
              event.preventDefault();
              void handleConfirmDelete();
            }}
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
