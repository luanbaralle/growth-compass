import { overrideCopilotEvidence } from "@/domains/copilot/api.server";
import { QUALIFICATION_V1_OBJECTIVES } from "@/domains/copilot/knowledge/objectives/qualification-v1";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getErrorMessage } from "@/lib/api/client-errors";
import { Loader2, PenLine } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function EvidenceOverridePanel({
  sessionId,
  onUpdated,
}: {
  sessionId: string;
  onUpdated?: () => void;
}) {
  const [objectiveKey, setObjectiveKey] = useState("");
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!objectiveKey || !value.trim()) return;
    setSaving(true);
    try {
      await overrideCopilotEvidence({
        data: { sessionId, objectiveKey, value: value.trim() },
      });
      setValue("");
      toast.success("Evidência corrigida.");
      onUpdated?.();
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao corrigir evidência."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <PenLine className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Correção manual</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Human override — marcar objective como verificado
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={objectiveKey} onValueChange={setObjectiveKey}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="Selecione o objective" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {QUALIFICATION_V1_OBJECTIVES.map((obj) => (
              <SelectItem key={obj.key} value={obj.key} className="text-xs">
                {obj.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Valor correto"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-9 text-sm"
        />
        <Button
          size="sm"
          className="w-full"
          onClick={() => void handleSave()}
          disabled={saving || !objectiveKey || !value.trim()}
        >
          {saving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
          Verificar evidência
        </Button>
      </CardContent>
    </Card>
  );
}
