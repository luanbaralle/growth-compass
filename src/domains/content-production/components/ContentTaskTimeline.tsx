import {
  addContentTaskNote,
  listContentTaskEvents,
} from "@/domains/content-production/api.server";
import type { ContentTaskEvent, ContentTaskEventType } from "@/domains/content-production/types";
import {
  CONTENT_TASK_EVENT_LABELS,
  formatTaskTimestamp,
  STATUS_ACCENT,
  STATUS_LABELS,
  type ContentTaskStatus,
} from "@/domains/content-production/types";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Building2,
  Calendar,
  Clapperboard,
  FileText,
  History,
  Loader2,
  MessageSquarePlus,
  PenLine,
  Sparkles,
  User,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const EVENT_ACCENT: Partial<Record<ContentTaskEventType, string>> = {
  created: "border-emerald-400/50 bg-emerald-400/20",
  status_changed: "border-brand/50 bg-brand/20",
  title_changed: "border-sky-400/50 bg-sky-400/20",
  channels_changed: "border-fuchsia-400/50 bg-fuchsia-400/20",
  theme_changed: "border-violet-400/50 bg-violet-400/20",
  content_type_changed: "border-amber-400/50 bg-amber-400/20",
  post_date_changed: "border-cyan-400/50 bg-cyan-400/20",
  production_owner_changed: "border-indigo-400/50 bg-indigo-400/20",
  notes_changed: "border-zinc-400/50 bg-zinc-400/20",
  company_changed: "border-sky-400/50 bg-sky-400/20",
  note: "border-violet-400/50 bg-violet-400/20",
};

function EventIcon({ type }: { type: ContentTaskEventType }) {
  const className = "h-3.5 w-3.5";
  switch (type) {
    case "created":
      return <Sparkles className={className} />;
    case "status_changed":
      return <Clapperboard className={className} />;
    case "post_date_changed":
      return <Calendar className={className} />;
    case "production_owner_changed":
      return <User className={className} />;
    case "note":
      return <MessageSquarePlus className={className} />;
    case "notes_changed":
      return <FileText className={className} />;
    case "company_changed":
      return <Building2 className={className} />;
    default:
      return <PenLine className={className} />;
  }
}

function StatusChangeBody({ event }: { event: ContentTaskEvent }) {
  const from = event.metadata.from as ContentTaskStatus | undefined;
  const to = event.metadata.to as ContentTaskStatus | undefined;
  if (!from || !to) return event.body ? <p className="mt-2 text-[13px] text-muted-foreground/80">{event.body}</p> : null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
      <span className="inline-flex items-center gap-1.5 rounded-md bg-surface/50 px-2 py-1 ring-1 ring-border/30">
        <span className={cn("h-2 w-2 rounded-full", STATUS_ACCENT[from])} />
        {STATUS_LABELS[from]}
      </span>
      <span className="text-muted-foreground/50">→</span>
      <span className="inline-flex items-center gap-1.5 rounded-md bg-surface/50 px-2 py-1 ring-1 ring-border/30">
        <span className={cn("h-2 w-2 rounded-full", STATUS_ACCENT[to])} />
        {STATUS_LABELS[to]}
      </span>
    </div>
  );
}

export function ContentTaskTimeline({ taskId }: { taskId: string }) {
  const [events, setEvents] = useState<ContentTaskEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [error, setError] = useState("");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listContentTaskEvents({ data: { id: taskId } });
      setEvents(result.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar timeline.");
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setAddingNote(true);
    setError("");
    try {
      const created = await addContentTaskNote({
        data: { taskId, body: note.trim() },
      });
      setEvents((prev) => [created, ...prev]);
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar nota.");
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={(e) => void handleAddNote(e)} className="space-y-3">
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Adicionar nota na timeline..."
          rows={3}
          className="resize-y border-border/40 bg-surface/20 text-sm leading-relaxed"
        />
        <Button type="submit" size="sm" disabled={addingNote || !note.trim()}>
          {addingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar nota"}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/40 py-12 text-center">
          <History className="mb-3 h-8 w-8 text-muted-foreground/30" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground/70">Nenhum evento registrado ainda.</p>
        </div>
      ) : (
        <div className="relative space-y-0 pb-2">
          <div className="absolute bottom-3 left-[5px] top-3 w-px bg-border/30" />
          {events.map((event) => (
            <div key={event.id} className="relative flex gap-3.5 pb-5 pl-0 last:pb-0">
              <div
                className={cn(
                  "relative z-10 mt-1 flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full border-2 bg-background text-muted-foreground/70",
                  EVENT_ACCENT[event.type] ?? "border-border/50 bg-muted/30",
                )}
              >
                <span className="sr-only">{CONTENT_TASK_EVENT_LABELS[event.type]}</span>
              </div>
              <div className="min-w-0 flex-1 rounded-lg border border-border/20 bg-surface-elevated/30 px-3.5 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-muted-foreground/60">
                      <EventIcon type={event.type} />
                    </span>
                    <p className="text-[13px] font-medium text-foreground/90">{event.title}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground/60">
                    {formatTaskTimestamp(event.created_at)}
                  </span>
                </div>

                {event.type === "status_changed" ? (
                  <StatusChangeBody event={event} />
                ) : (
                  event.body && (
                    <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-muted-foreground/80">
                      {event.body}
                    </p>
                  )
                )}

                {event.author_id && (
                  <p className="mt-2 text-[10px] text-muted-foreground/50">
                    {TEAM_LABELS[event.author_id as TeamMember] ?? event.author_id}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
