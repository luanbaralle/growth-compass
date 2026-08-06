import { createCompanyLink, deleteCompanyLink } from "@/domains/companies/api.server";
import type { CompanyLink, LinkType } from "@/domains/companies/types";
import { LINK_TYPE_LABELS } from "@/domains/companies/types";
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
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CompanyLinks({
  companyId,
  links,
  onRefresh,
}: {
  companyId: string;
  links: CompanyLink[];
  onRefresh: () => Promise<void>;
}) {
  const [type, setType] = useState<LinkType>("google_ads");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;
    setAdding(true);
    try {
      await createCompanyLink({
        data: { companyId, type, label: label.trim(), url: url.trim() },
      });
      setLabel("");
      setUrl("");
      toast.success("Link adicionado");
      await onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar link");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCompanyLink({ data: { id, companyId } });
    toast.success("Link removido");
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="grid gap-3 rounded-lg border border-border/60 p-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Tipo</Label>
          <Select value={type} onValueChange={(v) => setType(v as LinkType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(LINK_TYPE_LABELS) as LinkType[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {LINK_TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Rótulo</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex: Campanha principal" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>URL</Label>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
          />
        </div>
        <Button type="submit" size="sm" disabled={adding} className="sm:col-span-2 w-fit">
          <Plus className="h-4 w-4" />
          Adicionar link
        </Button>
      </form>

      {links.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum link cadastrado.</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{link.label}</p>
                <p className="text-xs text-muted-foreground">{LINK_TYPE_LABELS[link.type]}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button size="sm" variant="ghost" asChild>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => handleDelete(link.id)}
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
