import {
  addCompanyNote,
  changeCompanyStage,
  getCompany,
  updateCompany,
} from "@/domains/companies/api.server";
import {
  CompanyFormDialog,
  companyToFormValues,
  formToPayload as companyFormToPayload,
  type CompanyFormValues,
} from "@/domains/companies/components/CompanyFormDialog";
import { CompanyFiles } from "@/domains/companies/components/CompanyFiles";
import { CompanyLinks } from "@/domains/companies/components/CompanyLinks";
import { CompanyServices } from "@/domains/companies/components/CompanyServices";
import { CompanyTimeline } from "@/domains/companies/components/CompanyTimeline";
import { StageBadge } from "@/domains/companies/components/StageBadge";
import { createProject } from "@/domains/projects/api.server";
import { CompanyProjects } from "@/domains/projects/components/CompanyProjects";
import {
  formToPayload as projectFormToPayload,
  ProjectFormDialog,
  type ProjectFormValues,
} from "@/domains/projects/components/ProjectFormDialog";
import { createFinanceEntry } from "@/domains/finance/api.server";
import { CompanyFinance } from "@/domains/finance/components/CompanyFinance";
import {
  formToPayload as financeFormToPayload,
  FinanceFormDialog,
  type FinanceFormValues,
} from "@/domains/finance/components/FinanceFormDialog";
import { uploadFinanceReceiptFiles } from "@/domains/finance/components/FinanceReceiptsField";
import { createMarketingSnapshot } from "@/domains/marketing/api.server";
import { CompanyMarketing } from "@/domains/marketing/components/CompanyMarketing";
import {
  formToPayload as marketingFormToPayload,
  MarketingFormDialog,
  type MarketingFormValues,
} from "@/domains/marketing/components/MarketingFormDialog";
import type {
  Company,
  CompanyActivity,
  CompanyFile,
  CompanyLink,
  CompanyService,
  CompanyStage,
} from "@/domains/companies/types";
import { COMPANY_STAGES, STAGE_LABELS } from "@/domains/companies/types";
import { TEAM_LABELS } from "@/lib/auth/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { buildClientWhatsAppUrl } from "@/lib/whatsapp";
import { PageHeader, PageSkeleton, Section, OSPage } from "@/os/ui";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Building2, MessageCircle, Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface CompanyDetailData {
  company: Company;
  activities: CompanyActivity[];
  files: CompanyFile[];
  links: CompanyLink[];
  services: CompanyService[];
}

export function CompanyDetailPage({ companyId }: { companyId: string }) {
  const navigate = useNavigate();
  const [data, setData] = useState<CompanyDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [marketingOpen, setMarketingOpen] = useState(false);
  const [projectsRefresh, setProjectsRefresh] = useState(0);
  const [financeRefresh, setFinanceRefresh] = useState(0);
  const [marketingRefresh, setMarketingRefresh] = useState(0);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getCompany({ data: { id: companyId } });
      setData(result);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar empresa."));
    } finally {
      setLoading(false);
    }
  }, [companyId, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStageChange = async (stage: CompanyStage) => {
    if (!data) return;
    await changeCompanyStage({ data: { companyId, stage } });
    toast.success(`Estágio: ${STAGE_LABELS[stage]}`);
    await load();
  };

  const handleEdit = async (form: CompanyFormValues) => {
    await updateCompany({ data: { id: companyId, ...companyFormToPayload(form) } });
    toast.success("Empresa atualizada");
    await load();
  };

  const handleAddNote = async (body: string) => {
    await addCompanyNote({ data: { companyId, body } });
    toast.success("Nota adicionada");
    await load();
  };

  const handleCreateProject = async (form: ProjectFormValues) => {
    await createProject({ data: { ...projectFormToPayload(form), companyId } });
    toast.success("Projeto criado");
    setProjectsRefresh((k) => k + 1);
    await load();
  };

  const handleCreateFinance = async (form: FinanceFormValues, receipts: File[]) => {
    const entry = await createFinanceEntry({
      data: { ...financeFormToPayload(form), companyId },
    });
    if (receipts.length > 0) {
      await uploadFinanceReceiptFiles(companyId, entry.id, receipts);
    }
    toast.success("Lançamento criado");
    setFinanceRefresh((k) => k + 1);
    await load();
  };

  const handleCreateMarketing = async (form: MarketingFormValues) => {
    await createMarketingSnapshot({
      data: { ...marketingFormToPayload(form), companyId },
    });
    toast.success("Registro de marketing criado");
    setMarketingRefresh((k) => k + 1);
  };

  if (loading) {
    return <PageSkeleton title="Empresa" metricCount={0} />;
  }

  if (error || !data) {
    return (
      <OSPage>
        <Link to="/os/empresas" className="dashboard-btn-ghost w-fit">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <p className="text-sm text-destructive">
          {error || "Empresa não encontrada."}
        </p>
      </OSPage>
    );
  }

  const { company, activities, files, links, services } = data;

  return (
    <OSPage>
      <Link to="/os/empresas" className="dashboard-btn-ghost w-fit">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <PageHeader
        title={company.name}
        description={[company.city, company.segment].filter(Boolean).join(" · ")}
        icon={Building2}
        actions={
          <>
            {company.whatsapp && (
              <a
                href={buildClientWhatsAppUrl(
                  company.whatsapp,
                  `Olá ${company.name}! Aqui é da Raise One.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="dashboard-btn-ghost"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            )}
            <button type="button" onClick={() => setEditOpen(true)} className="dashboard-btn-ghost">
              <Pencil className="h-4 w-4" />
              Editar
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-4">
        <StageBadge stage={company.stage} />
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Alterar estágio</Label>
          <Select value={company.stage} onValueChange={(v) => handleStageChange(v as CompanyStage)}>
            <SelectTrigger className="h-8 w-[200px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STAGE_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex h-auto w-full flex-wrap gap-1">
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="timeline">Histórico</TabsTrigger>
          <TabsTrigger value="files">Arquivos ({files.length})</TabsTrigger>
          <TabsTrigger value="links">Links ({links.length})</TabsTrigger>
          <TabsTrigger value="services">Serviços ({services.length})</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="finance">Financeiro</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Section title="Dados cadastrais">
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Razão social" value={company.legal_name} />
              <Field label="CNPJ" value={company.cnpj} />
              <Field label="WhatsApp" value={company.whatsapp} />
              <Field label="Email" value={company.email} />
              <Field label="Site" value={company.website} />
              <Field label="Origem" value={company.origin} />
              <Field label="Segmento" value={company.segment} />
              <Field
                label="Responsável"
                value={
                  company.responsible_id
                    ? TEAM_LABELS[company.responsible_id as keyof typeof TEAM_LABELS]
                    : null
                }
              />
              <Field label="Observações" value={company.notes} className="sm:col-span-2" />
            </dl>
          </Section>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Section title="Linha do tempo">
            <CompanyTimeline activities={activities} onAddNote={handleAddNote} />
          </Section>
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <Section title="Contratos, recibos e notas fiscais">
            <CompanyFiles companyId={companyId} files={files} onRefresh={load} />
          </Section>
        </TabsContent>

        <TabsContent value="links" className="mt-6">
          <Section title="Links rápidos">
            <CompanyLinks companyId={companyId} links={links} onRefresh={load} />
          </Section>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <Section title="Serviços contratados">
            <CompanyServices companyId={companyId} services={services} onRefresh={load} />
          </Section>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <Section title="Projetos">
            <CompanyProjects
              companyId={companyId}
              companyName={company.name}
              onCreateClick={() => setProjectOpen(true)}
              refreshKey={projectsRefresh}
            />
          </Section>
        </TabsContent>

        <TabsContent value="finance" className="mt-6">
          <Section title="Financeiro">
            <CompanyFinance
              companyId={companyId}
              companyName={company.name}
              onCreateClick={() => setFinanceOpen(true)}
              refreshKey={financeRefresh}
            />
          </Section>
        </TabsContent>

        <TabsContent value="marketing" className="mt-6">
          <Section title="Marketing">
            <CompanyMarketing
              companyId={companyId}
              companyName={company.name}
              onCreateClick={() => setMarketingOpen(true)}
              refreshKey={marketingRefresh}
            />
          </Section>
        </TabsContent>
      </Tabs>

      <CompanyFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Editar empresa"
        initial={companyToFormValues(company)}
        onSubmit={handleEdit}
      />

      <ProjectFormDialog
        open={projectOpen}
        onOpenChange={setProjectOpen}
        title="Novo projeto"
        defaultCompanyId={companyId}
        onSubmit={handleCreateProject}
      />

      <FinanceFormDialog
        open={financeOpen}
        onOpenChange={setFinanceOpen}
        title="Novo lançamento"
        defaultCompanyId={companyId}
        onSubmit={handleCreateFinance}
      />

      <MarketingFormDialog
        open={marketingOpen}
        onOpenChange={setMarketingOpen}
        title="Novo registro de marketing"
        defaultCompanyId={companyId}
        onSubmit={handleCreateMarketing}
      />
    </OSPage>
  );
}

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: string | null | undefined;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm">{value?.trim() ? value : "—"}</dd>
    </div>
  );
}
