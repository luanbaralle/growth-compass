import type { CompanyActivity } from "@/domains/companies/types";
import { TEAM_LABELS } from "@/lib/auth/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

const typeIcons: Record<string, string> = {
  note: "📝",
  stage_change: "↔️",
  file_added: "📎",
  system: "⚙️",
  project_created: "📋",
  payment: "💰",
  meeting: "📅",
};

export function CompanyTimeline({
  activities,
  onAddNote,
}: {
  activities: CompanyActivity[];
  onAddNote: (body: string) => Promise<void>;
}) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    try {
      await onAddNote(note.trim());
      setNote("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="Adicionar anotação na timeline..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
        <Button type="submit" size="sm" disabled={loading || !note.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar nota"}
        </Button>
      </form>

      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma atividade registrada.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="relative border-l-2 border-border/60 pl-4 pb-1"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{typeIcons[activity.type] ?? "•"}</span>
                <span className="font-medium text-foreground">{activity.title}</span>
                <span>·</span>
                <time>{formatDateTime(activity.created_at)}</time>
                {activity.author_id && (
                  <>
                    <span>·</span>
                    <span>
                      {TEAM_LABELS[activity.author_id as keyof typeof TEAM_LABELS] ??
                        activity.author_id}
                    </span>
                  </>
                )}
              </div>
              {activity.body && (
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {activity.body}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
