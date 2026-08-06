import {
  createCompanyService,
  deleteCompanyService,
  updateCompanyService,
} from "@/domains/companies/api.server";
import type { CompanyService, ServiceStatus } from "@/domains/companies/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_LABELS: Record<ServiceStatus, string> = {
  active: "Ativo",
  paused: "Pausado",
  completed: "Concluído",
};

export function CompanyServices({
  companyId,
  services,
  onRefresh,
}: {
  companyId: string;
  services: CompanyService[];
  onRefresh: () => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    try {
      await createCompanyService({
        data: {
          companyId,
          name: name.trim(),
          description: description.trim() || undefined,
        },
      });
      setName("");
      setDescription("");
      toast.success("Serviço adicionado");
      await onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar serviço");
    } finally {
      setAdding(false);
    }
  };

  const handleStatusChange = async (id: string, status: ServiceStatus) => {
    await updateCompanyService({ data: { id, companyId, status } });
    await onRefresh();
  };

  const handleDelete = async (id: string) => {
    await deleteCompanyService({ data: { id, companyId } });
    toast.success("Serviço removido");
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="space-y-3 rounded-lg border border-border/60 p-4">
        <div className="space-y-1.5">
          <Label>Serviço contratado</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Google Ads, Landing Page..."
          />
        </div>
        <div className="space-y-1.5">
          <Label>Descrição</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Detalhes do escopo..."
          />
        </div>
        <Button type="submit" size="sm" disabled={adding}>
          <Plus className="h-4 w-4" />
          Adicionar serviço
        </Button>
      </form>

      {services.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum serviço contratado.</p>
      ) : (
        <ul className="space-y-2">
          {services.map((service) => (
            <li
              key={service.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border/60 p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">{service.name}</p>
                {service.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={service.status}
                  onValueChange={(v) => handleStatusChange(service.id, v as ServiceStatus)}
                >
                  <SelectTrigger className="h-8 w-[120px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(STATUS_LABELS) as ServiceStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
