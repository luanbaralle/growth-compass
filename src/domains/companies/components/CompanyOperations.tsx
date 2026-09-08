import {
  createCompanyOperationItem,
  deleteCompanyOperationItem,
} from "@/domains/companies/api.server";
import type { CompanyOperationItem, OperationItemType } from "@/domains/companies/types";
import {
  OPERATION_ITEM_TYPE_LABELS,
  OPERATION_ITEM_TYPES,
} from "@/domains/companies/types";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = iso.slice(0, 10);
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return "—";
  return `${day}/${m}/${y}`;
}

function sortChronological(items: CompanyOperationItem[]): CompanyOperationItem[] {
  return [...items].sort((a, b) => {
    const da = a.occurred_at ?? a.created_at;
    const db = b.occurred_at ?? b.created_at;
    return db.localeCompare(da);
  });
}

export function CompanyOperations({
  companyId,
  items,
  onRefresh,
}: {
  companyId: string;
  items: CompanyOperationItem[];
  onRefresh: () => Promise<void>;
}) {
  const [itemType, setItemType] = useState<OperationItemType>("report");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [adding, setAdding] = useState(false);

  const resetForm = () => {
    setTitle("");
    setBody("");
    setUrl("");
    setOccurredAt("");
    setItemType("report");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    try {
      await createCompanyOperationItem({
        data: {
          companyId,
          item_type: itemType,
          title: title.trim(),
          body: body.trim() || undefined,
          url: url.trim() || undefined,
          occurred_at: occurredAt.trim() || undefined,
        },
      });
      resetForm();
      toast.success("Item de operação adicionado");
      await onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar item");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCompanyOperationItem({ data: { id, companyId } });
    toast.success("Item removido");
    await onRefresh();
  };

  const sorted = sortChronological(items);

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="grid gap-3 rounded-lg border border-border/60 p-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Tipo</Label>
          <Select
            value={itemType}
            onValueChange={(v) => setItemType(v as OperationItemType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPERATION_ITEM_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {OPERATION_ITEM_TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Data</Label>
          <Input
            type="date"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Título</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Relatório mensal de performance"
            required
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Descrição</Label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Detalhes, decisões, próximos passos..."
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>URL (opcional)</Label>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
          />
        </div>
        <Button type="submit" size="sm" disabled={adding} className="sm:col-span-2 w-fit">
          <Plus className="h-4 w-4" />
          Adicionar item
        </Button>
      </form>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum item de operação registrado.</p>
      ) : (
        <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
          {sorted.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-border/60 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                    {OPERATION_ITEM_TYPE_LABELS[item.item_type]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.occurred_at ?? item.created_at)}
                  </span>
                </div>
                <p className="text-sm font-medium">{item.title}</p>
                {item.body?.trim() && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.body}</p>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Abrir link
                  </a>
                )}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="shrink-0 text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover item?</AlertDialogTitle>
                    <AlertDialogDescription>{item.title}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(item.id)}>
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
