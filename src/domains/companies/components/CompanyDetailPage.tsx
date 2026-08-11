import {
  addCompanyNote,
  changeCompanyStage,
  getCompany,
  removeCompanyLogo,
  updateCompany,
  uploadCompanyLogo,
} from "@/domains/companies/api.server";
import {
  fileToBase64,
  resolveLogoMimeType,
} from "@/domains/companies/components/CompanyAvatar";
import {
  CompanyFormDialog,
  companyToFormValues,
  formToPayload as companyFormToPayload,
  type CompanyFormValues,
} from "@/domains/companies/components/CompanyFormDialog";
import { CompanyFiles } from "@/domains/companies/components/CompanyFiles";
import { CompanyLinks } from "@/domains/companies/components/CompanyLinks";
import { CompanyOverview } from "@/domains/companies/components/CompanyOverview";
import { CompanyProfileHeader } from "@/domains/companies/components/CompanyProfileHeader";
import { CompanyTimeline } from "@/domains/companies/components/CompanyTimeline";
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
  CompanyActivity,
  CompanyFile,
  CompanyLink,
  CompanyStage,
  CompanyWithLogo,
} from "@/domains/companies/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { cn } from "@/lib/utils";
import { PageSkeleton, Section, OSPage } from "@/os/ui";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  StickyNote,
  Tag,
  User,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface CompanyDetailData {
  company: CompanyWithLogo;
  activities: CompanyActivity[];
  files: CompanyFile[];
  links: CompanyLink[];
  services: unknown[];
}

type CompanyTab = "panel" | "projects" | "finance" | "marketing" | "cadastro" | "history";

const TABS: { id: CompanyTab; label: string }[] = [
  { id: "panel", label: "Painel" },
  { id: "projects", label: "Projetos" },
  { id: "finance", label: "Financeiro" },
  { id: "marketing", label: "Marketing" },
  { id: "cadastro", label: "Cadastro" },
  { id: "history", label: "Histórico" },
];

export function CompanyDetailPage({ companyId }: { companyId: string }) {
  const navigate = useNavigate();
  const [data, setData] = useState<CompanyDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CompanyTab>("panel");
  const [editOpen, setEditOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [marketingOpen, setMarketingOpen] = useState(false);
  const [overviewRefresh, setOverviewRefresh] = useState(0);
  const [projectsRefresh, setProjectsRefresh] = useState(0);
  const [financeRefresh, setFinanceRefresh] = useState(0);
  const [marketingRefresh, setMarketingRefresh] = useState(0);
  const [logoUploading, setLogoUploading] = useState(false);
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

  const bumpOverview = () => setOverviewRefresh((k) => k + 1);

  const handleStageChange = async (stage: CompanyStage) => {
    await changeCompanyStage({ data: { companyId, stage } });
    toast.success("Estágio atualizado");
    await load();
    bumpOverview();
  };

  const handleLogoUpload = async (file: File) => {
    const mimeType = resolveLogoMimeType(file);
    if (!mimeType) {
      toast.error("Use JPG, PNG, WebP ou GIF.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo máximo: 2 MB.");
      return;
    }

    setLogoUploading(true);
    try {
      const base64 = await fileToBase64(file);
      await uploadCompanyLogo({
        data: { companyId, mimeType, base64 },
      });
      toast.success("Logo atualizado");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar logo.");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleLogoRemove = async () => {
    setLogoUploading(true);
    try {
      await removeCompanyLogo({ data: { companyId } });
      toast.success("Logo removido");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover logo.");
    } finally {
      setLogoUploading(false);
    }
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
    bumpOverview();
  };

  const handleCreateProject = async (form: ProjectFormValues) => {
    await createProject({ data: { ...projectFormToPayload(form), companyId } });
    toast.success("Projeto criado");
    setProjectsRefresh((k) => k + 1);
    bumpOverview();
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
    bumpOverview();
    await load();
  };

  const handleCreateMarketing = async (form: MarketingFormValues) => {
    await createMarketingSnapshot({
      data: { ...marketingFormToPayload(form), companyId },
    });
    toast.success("Registro de marketing criado");
    setMarketingRefresh((k) => k + 1);
    bumpOverview();
  };

  if (loading) {
    return <PageSkeleton title="Empresa" metricCount={4} />;
  }

  if (error || !data) {
    return (
      <OSPage>
        <Link to="/os/empresas" className="dashboard-btn-ghost w-fit">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <p className="text-sm text-destructive">{error || "Empresa não encontrada."}</p>
      </OSPage>
    );
  }

  const { company, activities, files, links } = data;

  return (
    <OSPage className="company-detail-page space-y-6">
      <CompanyProfileHeader
        company={company}
        onEdit={() => setEditOpen(true)}
        onStageChange={handleStageChange}
        onLogoUpload={handleLogoUpload}
        onLogoRemove={company.logo_url ? handleLogoRemove : undefined}
        logoUploading={logoUploading}
      />

      <nav className="company-tab-nav" aria-label="Seções do cliente">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn("company-tab-nav-item", activeTab === tab.id && "company-tab-nav-item-active")}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "panel" && (
        <CompanyOverview
          company={company}
          activities={activities}
          links={links}
          filesCount={files.length}
          refreshKey={overviewRefresh}
          onGoToTab={(tab) => setActiveTab(tab as CompanyTab)}
          onCreateProject={() => setProjectOpen(true)}
          onCreateFinance={() => setFinanceOpen(true)}
          onCreateMarketing={() => setMarketingOpen(true)}
          onAddNote={handleAddNote}
        />
      )}

      {activeTab === "projects" && (
        <Section title="Projetos" description="Entregas e operações deste cliente">
          <CompanyProjects
            companyId={companyId}
            companyName={company.name}
            onCreateClick={() => setProjectOpen(true)}
            refreshKey={projectsRefresh}
          />
        </Section>
      )}

      {activeTab === "finance" && (
        <Section title="Financeiro" description="Cobranças, mensalidades e recebimentos">
          <CompanyFinance
            companyId={companyId}
            companyName={company.name}
            onCreateClick={() => setFinanceOpen(true)}
            refreshKey={financeRefresh}
          />
        </Section>
      )}

      {activeTab === "marketing" && (
        <Section title="Marketing" description="Investimento, leads e conversões por período">
          <CompanyMarketing
            companyId={companyId}
            companyName={company.name}
            onCreateClick={() => setMarketingOpen(true)}
            refreshKey={marketingRefresh}
          />
        </Section>
      )}

      {activeTab === "cadastro" && (
        <div className="space-y-5">
          <Section title="Dados cadastrais" description="Informações comerciais e de contato">
            <dl className="grid gap-3 sm:grid-cols-2">
              <CadastroField icon={Building2} label="Razão social" value={company.legal_name} />
              <CadastroField icon={FileText} label="CNPJ" value={company.cnpj} />
              <CadastroField icon={Phone} label="WhatsApp" value={company.whatsapp} />
              <CadastroField icon={Mail} label="Email" value={company.email} />
              <CadastroField icon={Globe} label="Site" value={company.website} href={company.website} />
              <CadastroField icon={Tag} label="Origem" value={company.origin} />
              <CadastroField icon={MapPin} label="Cidade" value={[company.city, company.city_state].filter(Boolean).join(" — ") || null} />
              <CadastroField icon={Tag} label="Segmento" value={company.segment} />
              <CadastroField
                icon={User}
                label="Responsável"
                value={company.responsible_name}
              />
              {company.notes?.trim() && (
                <div className="cadastro-field sm:col-span-2">
                  <dt className="cadastro-field-label">
                    <StickyNote className="h-3.5 w-3.5" />
                    Observações
                  </dt>
                  <dd className="cadastro-field-value mt-2 whitespace-pre-wrap">{company.notes}</dd>
                </div>
              )}
            </dl>
          </Section>

          <Section
            title="Links operacionais"
            description="Google Ads, LP, Analytics e outros acessos"
          >
            <CompanyLinks companyId={companyId} links={links} onRefresh={load} />
          </Section>

          <Section title="Arquivos" description="Contratos, recibos e notas fiscais">
            <CompanyFiles companyId={companyId} files={files} onRefresh={load} />
          </Section>
        </div>
      )}

      {activeTab === "history" && (
        <Section title="Histórico completo" description="Notas, pagamentos e mudanças de estágio">
          <CompanyTimeline activities={activities} onAddNote={handleAddNote} />
        </Section>
      )}

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

function CadastroField({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Building2;
  label: string;
  value: string | null | undefined;
  href?: string | null;
}) {
  const display = value?.trim() || "—";
  const linkHref =
    href?.trim() &&
    (href.startsWith("http") ? href : `https://${href}`);

  return (
    <div className="cadastro-field">
      <dt className="cadastro-field-label">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className="cadastro-field-value">
        {linkHref ? (
          <a
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            {display}
          </a>
        ) : (
          display
        )}
      </dd>
    </div>
  );
}
