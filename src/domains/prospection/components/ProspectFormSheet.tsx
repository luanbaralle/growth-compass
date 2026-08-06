import { createProspect } from "@/domains/prospection/api.server";
import { TEAM_LABELS, TEAM_MEMBERS, type TeamMember } from "@/lib/auth/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export interface ProspectFormValues {
  name: string;
  category: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  website: string;
  googleMapsUrl: string;
  ownerId: TeamMember | "";
  source: string;
  notes: string;
}

const emptyForm: ProspectFormValues = {
  name: "",
  category: "",
  city: "",
  state: "",
  phone: "",
  whatsapp: "",
  instagram: "",
  website: "",
  googleMapsUrl: "",
  ownerId: "",
  source: "",
  notes: "",
};

export function ProspectFormSheet({
  open,
  onOpenChange,
  onCreated,
  defaultOwnerId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (id: string) => void;
  defaultOwnerId?: TeamMember;
}) {
  const [form, setForm] = useState<ProspectFormValues>({
    ...emptyForm,
    ownerId: defaultOwnerId ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof ProspectFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Informe o nome da empresa.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const prospect = await createProspect({
        data: {
          name: form.name.trim(),
          category: form.category || undefined,
          city: form.city || undefined,
          state: form.state || undefined,
          phone: form.phone || undefined,
          whatsapp: form.whatsapp || undefined,
          instagram: form.instagram || undefined,
          website: form.website || undefined,
          googleMapsUrl: form.googleMapsUrl || undefined,
          ownerId: form.ownerId || undefined,
          source: form.source || undefined,
          notes: form.notes || undefined,
        },
      });
      setForm({ ...emptyForm, ownerId: defaultOwnerId ?? "" });
      onOpenChange(false);
      onCreated(prospect.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Adicionar prospect</SheetTitle>
          <SheetDescription>Cadastro rápido — apenas o nome é obrigatório.</SheetDescription>
        </SheetHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="prospect-name">Nome da empresa *</Label>
            <Input
              id="prospect-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Ex: Clínica Saúde Total"
              autoFocus
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="prospect-category">Categoria</Label>
              <Input
                id="prospect-category"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="Ex: Clínica"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prospect-source">Origem</Label>
              <Input
                id="prospect-source"
                value={form.source}
                onChange={(e) => set("source", e.target.value)}
                placeholder="Ex: Google Maps"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="prospect-city">Cidade</Label>
              <Input
                id="prospect-city"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prospect-state">UF</Label>
              <Input
                id="prospect-state"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                maxLength={2}
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="prospect-phone">Telefone</Label>
              <Input
                id="prospect-phone"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prospect-whatsapp">WhatsApp</Label>
              <Input
                id="prospect-whatsapp"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prospect-instagram">Instagram</Label>
            <Input
              id="prospect-instagram"
              value={form.instagram}
              onChange={(e) => set("instagram", e.target.value)}
              placeholder="@empresa"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prospect-website">Website</Label>
            <Input
              id="prospect-website"
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prospect-maps">Google Maps</Label>
            <Input
              id="prospect-maps"
              value={form.googleMapsUrl}
              onChange={(e) => set("googleMapsUrl", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Responsável</Label>
            <Select
              value={form.ownerId || "none"}
              onValueChange={(v) => set("ownerId", v === "none" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem responsável</SelectItem>
                {TEAM_MEMBERS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {TEAM_LABELS[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prospect-notes">Observações</Label>
            <Textarea
              id="prospect-notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Cadastrar prospect
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
