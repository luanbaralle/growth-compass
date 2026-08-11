import {
  createCompany,
  deleteCompany,
  listCompanies,
} from "@/domains/companies/api.server";
import {
  CompanyFormDialog,
  formToPayload,
  type CompanyFormValues,
} from "@/domains/companies/components/CompanyFormDialog";
import { StageBadge } from "@/domains/companies/components/StageBadge";
import { CompanyAvatar } from "@/domains/companies/components/CompanyAvatar";
import type { CompanyStage, CompanyWithLogo } from "@/domains/companies/types";
import { COMPANY_STAGES, STAGE_LABELS } from "@/domains/companies/types";
import { TEAM_LABELS } from "@/lib/auth/types";
import { buildClientWhatsAppUrl } from "@/lib/whatsapp";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { EmptyState, PageHeader, PageSkeleton, OSPage, OSRefreshButton, OSPrimaryButton, FilterToolbar, FilterPill, DataTable } from "@/os/ui";
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
import { Input } from "@/components/ui/input";
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
import { Link, useNavigate } from "@tanstack/react-router";
import { Building2, MessageCircle, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function CompanyListPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyWithLogo[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({ all: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<CompanyStage | "all">("all");
  const [sort, setSort] = useState<"name" | "created_at" | "stage">("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [createOpen, setCreateOpen] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listCompanies({
        data: {
          search: search || undefined,
          ...(stage !== "all" ? { stage } : {}),
          sort,
          order,
        },
      });
      setCompanies(result.companies);
      setCounts(result.counts as Record<string, number>);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar empresas."));
    } finally {
      setLoading(false);
    }
  }, [search, stage, sort, order, navigate]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  const handleCreate = async (form: CompanyFormValues) => {
    await createCompany({ data: formToPayload(form) });
    await load();
  };

  const handleDelete = async (id: string) => {
    await deleteCompany({ data: { id } });
    await load();
  };

  return (
    <OSPage>
      <PageHeader
        title="Empresas"
        description="Coração do sistema — leads, prospects e clientes em um só lugar"
        icon={Building2}
        actions={
          <>
            <OSRefreshButton loading={loading} onClick={load} />
            <OSPrimaryButton label="Nova empresa" onClick={() => setCreateOpen(true)} />
          </>
        }
      />

      <FilterToolbar>
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            className="pl-9"
            placeholder="Buscar por nome, cidade, segmento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Data</SelectItem>
            <SelectItem value="name">Nome</SelectItem>
            <SelectItem value="stage">Estágio</SelectItem>
          </SelectContent>
        </Select>
        <Select value={order} onValueChange={(v) => setOrder(v as typeof order)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Desc</SelectItem>
            <SelectItem value="asc">Asc</SelectItem>
          </SelectContent>
        </Select>
      </FilterToolbar>

      <div className="flex flex-wrap gap-2">
        <FilterPill
          active={stage === "all"}
          onClick={() => setStage("all")}
          label={`Todos (${counts.all ?? 0})`}
        />
        {COMPANY_STAGES.map((s) => (
          <FilterPill
            key={s}
            active={stage === s}
            onClick={() => setStage(s)}
            label={`${STAGE_LABELS[s]} (${counts[s] ?? 0})`}
          />
        ))}
      </div>

      {error && (
        <EmptyState
          title="Não foi possível carregar as empresas"
          description={error}
        />
      )}

      {loading ? (
        <PageSkeleton title="Empresas" metricCount={0} />
      ) : error ? null : companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Nenhuma empresa encontrada"
          description={
            stage !== "all" || search
              ? "Tente outros filtros ou cadastre uma nova empresa."
              : "Cadastre a primeira empresa ou aguarde leads do site."
          }
        />
      ) : (
        <DataTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Segmento</TableHead>
                <TableHead>Estágio</TableHead>
                <TableHead className="w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <CompanyAvatar name={company.name} logoUrl={company.logo_url} size="sm" />
                      <div className="min-w-0">
                        <Link
                          to="/os/empresas/$id"
                          params={{ id: company.id }}
                          className="font-medium hover:text-brand"
                        >
                          {company.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(company.created_at)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {company.responsible_id ? (
                      <span className="text-sm">
                        {TEAM_LABELS[company.responsible_id as keyof typeof TEAM_LABELS]}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {company.whatsapp ? (
                      <span className="font-mono text-sm">{company.whatsapp}</span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {company.city}
                    {company.city_state ? `, ${company.city_state}` : ""}
                  </TableCell>
                  <TableCell>{company.segment ?? "—"}</TableCell>
                  <TableCell>
                    <StageBadge stage={company.stage} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {company.whatsapp && (
                        <Button size="sm" variant="ghost" asChild>
                          <a
                            href={buildClientWhatsAppUrl(
                              company.whatsapp,
                              `Olá ${company.name}! Aqui é da Raise One.`,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir empresa?</AlertDialogTitle>
                            <AlertDialogDescription>
                              <strong>{company.name}</strong> e todo o histórico serão removidos
                              permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => handleDelete(company.id)}
                            >
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

      <CompanyFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Nova empresa"
        onSubmit={handleCreate}
      />
    </OSPage>
  );
}
