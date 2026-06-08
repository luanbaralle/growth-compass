import type { Lead, LeadStatus } from "@/lib/leads/types";
import { adminLogout, deleteLead, getLeads, updateLead } from "@/lib/api/leads.functions";
import { buildClientWhatsAppUrl } from "@/lib/whatsapp";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import {
  Copy,
  ExternalLink,
  Loader2,
  LogOut,
  MessageCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Novo",
  contacted: "Contatado",
  converted: "Convertido",
  lost: "Perdido",
};

const ALL_STATUSES: LeadStatus[] = ["new", "contacted", "converted", "lost"];

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

function LeadRow({
  lead,
  onUpdate,
  onDelete,
}: {
  lead: Lead;
  onUpdate: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const waUrl = buildClientWhatsAppUrl(
    lead.phone,
    `Olá ${lead.name}! Aqui é da Raise One. Vi sua solicitação sobre ${lead.displayLabel ?? lead.business} em ${lead.city}.`,
  );

  const copyPhone = () => {
    navigator.clipboard.writeText(lead.phone);
  };

  const handleStatusChange = async (status: LeadStatus) => {
    if (status === lead.status) return;
    setUpdating(true);
    try {
      await updateLead({ data: { id: lead.id, status } });
      onUpdate(lead.id, status);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLead({ data: { id: lead.id } });
      onDelete(lead.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{lead.name}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{formatDate(lead.createdAt)}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">{lead.phone}</span>
          <button
            type="button"
            onClick={copyPhone}
            className="rounded p-1 text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
            title="Copiar"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </TableCell>
      <TableCell>
        <div>
          {lead.city}
          {lead.cityState ? `, ${lead.cityState}` : ""}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{lead.displayLabel ?? lead.business}</div>
        {lead.negocio && lead.negocio !== lead.business && (
          <div className="text-xs text-muted-foreground">Digitou: {lead.negocio}</div>
        )}
      </TableCell>
      <TableCell>
        <div className="text-sm">{lead.segment}</div>
        <div className="text-xs text-muted-foreground">
          {lead.source} · {lead.matchLevel ?? "—"}
        </div>
        {(lead.utmSource || lead.utmCampaign) && (
          <div className="mt-1 text-[10px] text-muted-foreground">
            {[lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ")}
          </div>
        )}
      </TableCell>
      <TableCell>
        {lead.link ? (
          <a
            href={lead.link.startsWith("http") ? lead.link : `https://${lead.link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-brand hover:underline"
          >
            Ver
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        <Select
          value={lead.status}
          onValueChange={(value) => handleStatusChange(value as LeadStatus)}
          disabled={updating}
        >
          <SelectTrigger className="h-8 w-[130px] text-xs">
            {updating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <SelectValue />
            )}
          </SelectTrigger>
          <SelectContent>
            {ALL_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" variant="outline" asChild>
            <a href={waUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
                Remover
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remover lead?</AlertDialogTitle>
                <AlertDialogDescription>
                  O lead de <strong>{lead.name}</strong> ({lead.phone}) será excluído
                  permanentemente. Essa ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removendo...
                    </>
                  ) : (
                    "Remover lead"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function AdminPanel() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getLeads();
      setLeads(data);
    } catch {
      setError("Sessão expirada ou não autorizado.");
      navigate({ to: "/admin/login" });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const handleLogout = async () => {
    await adminLogout();
    navigate({ to: "/admin/login" });
  };

  const handleUpdate = (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const handleDelete = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
    lost: leads.filter((l) => l.status === "lost").length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-surface/30">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8">
          <div>
            <h1 className="text-lg font-bold">Raise One — Leads</h1>
            <p className="text-sm text-muted-foreground">
              Formulários recebidos com contexto completo
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {(["all", "new", "contacted", "converted", "lost"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                filter === key
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {key === "all" ? "Todos" : STATUS_LABELS[key]} ({counts[key]})
            </button>
          ))}
        </div>

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Carregando leads...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/50 py-16 text-center text-muted-foreground">
            Nenhum lead {filter !== "all" ? `com status "${STATUS_LABELS[filter]}"` : "ainda"}.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Negócio</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
