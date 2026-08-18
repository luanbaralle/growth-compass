import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

export function CopilotProcessingView({ mode }: { mode: "end" | "reprocess" }) {
  const label =
    mode === "reprocess"
      ? "Reprocessando transcript e gerando diagnóstico…"
      : "Encerrando reunião e gerando diagnóstico…";

  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent shadow-sm">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-6">
          <Sparkles className="h-10 w-10 text-amber-500/70" />
          <Loader2 className="absolute -bottom-1 -right-1 h-5 w-5 animate-spin text-amber-600" />
        </div>
        <p className="text-sm font-medium text-foreground/90">{label}</p>
        <p className="mt-2 max-w-sm text-xs text-muted-foreground">
          Refinando transcript, extraindo evidências e montando o briefing. Isso pode levar até 1
          minuto.
        </p>
      </CardContent>
    </Card>
  );
}
