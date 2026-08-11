import {
  createMarketingSnapshot,
  deleteMarketingSnapshot,
  listMarketingSnapshots,
  updateMarketingSnapshot,
} from "@/domains/marketing/api.server";
import {
  formatMoney,
  formatPercent,
  MarketingChannelBadge,
} from "@/domains/marketing/components/MarketingBadges";
import {
  formToPayload,
  MarketingFormDialog,
  snapshotToFormValues,
  type MarketingFormValues,
} from "@/domains/marketing/components/MarketingFormDialog";
import type {
  MarketingChannel,
  MarketingSnapshotWithCompany,
} from "@/domains/marketing/types";
import {
  CHANNEL_LABELS,
  formatPeriod,
  MARKETING_CHANNELS,
} from "@/domains/marketing/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { EmptyState, PageHeader, PageSkeleton, StatCard, OSPage, OSRefreshButton, OSPrimaryButton, FilterToolbar, FilterRow, FilterSearch, FilterPillsRow, FilterPill, OSMetricGrid, DataTable } from "@/os/ui";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useNavigate } from "@tanstack/react-router";
import { Megaphone, Pencil, Trash2, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function MarketingListPage() {
  const navigate = useNavigate();
  const [snapshots, setSnapshots] = useState<MarketingSnapshotWithCompany[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({ all: 0 });
  const [summary, setSummary] = useState({
    investmentCents: 0,
    leads: 0,
    conversions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState<MarketingChannel | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editSnapshot, setEditSnapshot] = useState<MarketingSnapshotWithCompany | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listMarketingSnapshots({
        data: {
          search: search || undefined,
          ...(channel !== "all" ? { channel } : {}),
          sort: "period_start",
          order: "desc",
        },
      });
      setSnapshots(result.snapshots);
      setCounts(result.counts as Record<string, number>);
      setSummary(result.summary);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar marketing."));
    } finally {
      setLoading(false);
    }
  }, [search, channel, navigate]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  const handleCreate = async (form: MarketingFormValues) => {
    await createMarketingSnapshot({ data: formToPayload(form) });
    toast.success("Registro criado");
    await load();
  };

  const handleEdit = async (form: MarketingFormValues) => {
    if (!editSnapshot) return;
    await updateMarketingSnapshot({
      data: { id: editSnapshot.id, ...formToPayload(form) },
    });
    toast.success("Registro atualizado");
    setEditSnapshot(null);
    await load();
  };

  const handleDelete = async (snapshot: MarketingSnapshotWithCompany) => {
    await deleteMarketingSnapshot({
      data: { id: snapshot.id, companyId: snapshot.company_id },
    });
    toast.success("Registro excluído");
    await load();
  };

  return (
    <OSPage>
      <PageHeader
        title="Marketing"
        description="Métricas por canal — investimento, leads e conversões"
        icon={Megaphone}
        actions={
          <>
            <OSRefreshButton loading={loading} onClick={load} />
            <OSPrimaryButton label="Novo registro" onClick={() => setCreateOpen(true)} />
          </>
        }
      />

      <OSMetricGrid>
        <StatCard
          label="Investimento total"
          value={formatMoney(summary.investmentCents)}
          sub="Todos os registros"
          icon={Megaphone}
        />
        <StatCard
          label="Leads"
          value={String(summary.leads)}
          sub="Soma registrada"
          accent="brand"
          icon={Users}
        />
        <StatCard
          label="Conversões"
          value={String(summary.conversions)}
          sub="Soma registrada"
          accent="success"
          icon={Users}
        />
      </OSMetricGrid>

      {error && (
        <EmptyState title="Não foi possível carregar marketing" description={error} />
      )}

      <FilterToolbar>
        <FilterRow>
          <FilterSearch
            value={search}
            onChange={setSearch}
            placeholder="Buscar por empresa..."
          />
        </FilterRow>
      </FilterToolbar>

      <FilterPillsRow>
        <FilterPill
          active={channel === "all"}
          onClick={() => setChannel("all")}
          label={`Todos (${counts.all ?? 0})`}
        />
        {MARKETING_CHANNELS.map((c) => (
          <FilterPill
            key={c}
            active={channel === c}
            onClick={() => setChannel(c)}
            label={`${CHANNEL_LABELS[c]} (${counts[c] ?? 0})`}
          />
        ))}
      </FilterPillsRow>

      {loading ? (
        <PageSkeleton title="Marketing" metricCount={0} />
      ) : error ? null : snapshots.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="Nenhum registro encontrado"
          description="Cadastre métricas manualmente por empresa e canal. Integrações automáticas virão depois."
        />
      ) : (
        <DataTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Investimento</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Conv.</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>CPC</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {snapshots.map((snapshot) => (
                <TableRow key={snapshot.id}>
                  <TableCell>
                    <Link
                      to="/os/empresas/$id"
                      params={{ id: snapshot.company_id }}
                      className="font-medium hover:text-brand"
                    >
                      {snapshot.companies?.name ?? "—"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <MarketingChannelBadge channel={snapshot.channel} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatPeriod(snapshot.period_start, snapshot.period_end)}
                  </TableCell>
                  <TableCell>{formatMoney(snapshot.investment_cents)}</TableCell>
                  <TableCell>{snapshot.leads ?? "—"}</TableCell>
                  <TableCell>{snapshot.conversions ?? "—"}</TableCell>
                  <TableCell>{formatPercent(snapshot.ctr)}</TableCell>
                  <TableCell>{formatMoney(snapshot.cpc_cents)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setEditSnapshot(snapshot)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Métricas de {CHANNEL_LABELS[snapshot.channel]} serão removidas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => void handleDelete(snapshot)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTable>
      )}

      <MarketingFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Novo registro de marketing"
        onSubmit={handleCreate}
      />

      <MarketingFormDialog
        open={!!editSnapshot}
        onOpenChange={(open) => !open && setEditSnapshot(null)}
        title="Editar registro"
        initial={editSnapshot ? snapshotToFormValues(editSnapshot) : undefined}
        defaultCompanyId={editSnapshot?.company_id}
        onSubmit={handleEdit}
      />
    </OSPage>
  );
}
