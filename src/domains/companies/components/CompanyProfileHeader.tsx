import { StageBadge } from "@/domains/companies/components/StageBadge";
import { CompanyAvatar } from "@/domains/companies/components/CompanyAvatar";
import type { CompanyStage, CompanyWithLogo } from "@/domains/companies/types";
import { COMPANY_STAGES, STAGE_LABELS } from "@/domains/companies/types";
import { TEAM_LABELS, TEAM_MEMBERS, type TeamMember } from "@/lib/auth/types";
import { buildClientWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CompanyProfileHeader({
  company,
  onEdit,
  onStageChange,
  onResponsibleChange,
  onLogoUpload,
  onLogoRemove,
  logoUploading,
}: {
  company: CompanyWithLogo;
  onEdit: () => void;
  onStageChange: (stage: CompanyStage) => void;
  onResponsibleChange: (member: TeamMember | null) => void;
  onLogoUpload?: (file: File) => Promise<void>;
  onLogoRemove?: () => Promise<void>;
  logoUploading?: boolean;
}) {
  const location = [company.city, company.city_state].filter(Boolean).join(", ");

  return (
    <div className="company-profile-header animate-fade-up space-y-4">
      <Link to="/os/empresas" className="dashboard-btn-ghost w-fit">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="dashboard-card overflow-hidden p-0">
        <div className="company-profile-header-accent" />
        <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
          <div className="flex min-w-0 gap-4">
            <CompanyAvatar
              name={company.name}
              logoUrl={company.logo_url}
              size="lg"
              editable={Boolean(onLogoUpload)}
              uploading={logoUploading}
              onUpload={onLogoUpload}
              onRemove={onLogoRemove}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  {company.name}
                </h1>
                <StageBadge stage={company.stage} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground/75">
                {location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 opacity-60" />
                    {location}
                  </span>
                )}
                {company.segment && (
                  <>
                    {location && <span className="text-border">·</span>}
                    <span>{company.segment}</span>
                  </>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {company.website && (
                  <a
                    href={
                      company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="company-contact-chip"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Site
                  </a>
                )}
                {company.email && (
                  <a href={`mailto:${company.email}`} className="company-contact-chip">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </a>
                )}
                {company.whatsapp && (
                  <a
                    href={buildClientWhatsAppUrl(
                      company.whatsapp,
                      `Olá ${company.name}! Aqui é da Raise One.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("company-contact-chip", "company-contact-chip-whatsapp")}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            <button type="button" onClick={onEdit} className="dashboard-btn-ghost">
              <Pencil className="h-4 w-4" />
              Editar cadastro
            </button>

            <div className="flex flex-col gap-2 sm:items-end">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/50">
                  Responsável
                </span>
                <Select
                  value={company.responsible_id ?? "none"}
                  onValueChange={(v) =>
                    onResponsibleChange(v === "none" ? null : (v as TeamMember))
                  }
                >
                  <SelectTrigger className="company-stage-select h-8 w-[160px] text-xs">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Nenhum —</SelectItem>
                    {TEAM_MEMBERS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {TEAM_LABELS[m]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/50">
                  Estágio
                </span>
                <Select
                  value={company.stage}
                  onValueChange={(v) => onStageChange(v as CompanyStage)}
                >
                  <SelectTrigger className="company-stage-select h-8 w-[180px] text-xs">
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
          </div>
        </div>
      </div>
    </div>
  );
}
