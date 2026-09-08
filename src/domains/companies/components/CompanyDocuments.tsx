import { CompanyFiles } from "@/domains/companies/components/CompanyFiles";
import { CompanyLinks } from "@/domains/companies/components/CompanyLinks";
import { CompanyProposals } from "@/domains/companies/components/CompanyProposals";
import type { CompanyFile, CompanyLink } from "@/domains/companies/types";
import { Section } from "@/os/ui";

export function CompanyDocuments({
  companyId,
  companyName,
  links,
  files,
  onRefresh,
  refreshKey = 0,
}: {
  companyId: string;
  companyName: string;
  links: CompanyLink[];
  files: CompanyFile[];
  onRefresh: () => Promise<void>;
  refreshKey?: number;
}) {
  return (
    <div className="space-y-5">
      <Section title="Propostas" description="Propostas comerciais vinculadas a esta empresa">
        <CompanyProposals
          companyId={companyId}
          companyName={companyName}
          refreshKey={refreshKey}
        />
      </Section>

      <Section
        title="Links e documentos"
        description="Sites, redes, Drive, contratos e outros links do cliente"
      >
        <CompanyLinks companyId={companyId} links={links} onRefresh={onRefresh} />
      </Section>

      <Section title="Arquivos" description="Contratos, recibos, propostas e documentos anexados">
        <CompanyFiles companyId={companyId} files={files} onRefresh={onRefresh} />
      </Section>
    </div>
  );
}
