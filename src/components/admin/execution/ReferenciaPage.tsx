import { useExecutionState } from "@/components/admin/execution/use-execution-state";
import { PersonBadge } from "@/components/admin/execution/shared";
import { PageHeader, PageSkeleton, Section } from "@/components/admin/ui-kit";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Check, BookOpen, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SCOPE_SCRIPT =
  '"A gente não está diminuindo entrega — está melhorando a qualidade. Para isso, precisamos de processo claro. A partir de agora, tudo que está no contrato segue o calendário. Demandas extras passam por orçamento. Isso protege o tempo de vocês e o nosso."';

const SCOPE_CLAUSE = `SERVIÇOS NÃO INCLUSOS NO CONTRATO:
- Desenvolvimento de CRM, sistemas ou dashboards
- Gestão de redes sociais (salvo add-on contratado)
- Produção de conteúdo avulso (fora do pacote mensal)
- Legendas, tarjas ou ajustes pontuais de terceiros
- Campanhas não previstas no escopo original
- Urgências com prazo inferior ao mínimo acordado

Demandas extras serão analisadas quanto a viabilidade, prazo e orçamento antes de execução. Aprovação prévia obrigatória.`;

export function ReferenciaPage() {
  const { state, loading, toggleSopCheck, resetSopChecklist, downloadNotionExport } =
    useExecutionState();
  const [copied, setCopied] = useState<string | null>(null);

  if (loading || !state) {
    return <PageSkeleton title="Referência" metricCount={0} />;
  }

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success("Copiado");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Referência"
        description="Conhecimento estático + SOPs executáveis. Notion = arquivo; aqui = execução."
        icon={BookOpen}
      />

      <Section title="Diagnóstico — problema raiz" noPadding className="p-5">
        <p className="mt-2 text-sm text-muted-foreground">
          Capacidade operacional estrangulada — não aquisição. A equipe fecha clientes, mas não
          absorve +2 empresas grandes sem perder qualidade.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Gargalo #1: edição + escopo/favorzinhos</li>
          <li>Ordem: processo → delegação → automação → IA</li>
          <li>Eventos, SaaS, RE/MAX: não agora</li>
        </ul>
      </Section>

      <section className="rounded-xl border border-border bg-surface/20 p-5">
        <h2 className="font-medium">Papéis (RACI resumido)</h2>
        <div className="mt-3 space-y-2 text-sm">
          <p>
            <strong>Luan:</strong> produto, processos, contratos, tráfego
          </p>
          <p>
            <strong>Vini:</strong> comercial imobiliário, gravação, relação cliente
          </p>
          <p>
            <strong>Caio:</strong> operação, esteira, briefing editor, Notion
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Escopo — scripts copiáveis</h2>
        <CopyBlock
          label="Script alinhamento (Vini)"
          text={SCOPE_SCRIPT}
          copied={copied === "script"}
          onCopy={() => copyText(SCOPE_SCRIPT, "script")}
        />
        <CopyBlock
          label="Cláusula padrão de contrato"
          text={SCOPE_CLAUSE}
          copied={copied === "clause"}
          onCopy={() => copyText(SCOPE_CLAUSE, "clause")}
        />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand" />
            <h2 className="font-display text-lg font-semibold">Playbooks (SOPs)</h2>
          </div>
          <Button size="sm" variant="outline" onClick={() => downloadNotionExport()}>
            <Download className="h-4 w-4" />
            Exportar todos (.md)
          </Button>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Marque itens durante a execução. Resetar quando rodar de novo para outro cliente.
        </p>
        <Accordion type="multiple" className="space-y-2">
          {state.sops.map((sop) => {
            const done = sop.items.filter((i) => i.done).length;
            return (
              <AccordionItem
                key={sop.id}
                value={sop.id}
                className="rounded-xl border border-border px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-1 flex-wrap items-center justify-between gap-2 pr-4 text-left">
                    <span className="font-medium">{sop.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {done}/{sop.items.length} · Dono:{" "}
                      <PersonBadge person={sop.owner} />
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Trigger: {sop.trigger}
                  </p>
                  <ul className="space-y-2">
                    {sop.items.map((item) => (
                      <li key={item.id}>
                        <label className="flex cursor-pointer items-start gap-2">
                          <Checkbox
                            checked={item.done}
                            onCheckedChange={() => toggleSopCheck(sop.id, item.id)}
                            className="mt-0.5"
                          />
                          <span
                            className={`text-sm ${item.done ? "text-muted-foreground line-through" : ""}`}
                          >
                            {item.text}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => resetSopChecklist(sop.id)}
                    >
                      Resetar checklist
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadNotionExport(sop.id)}
                    >
                      <Download className="h-4 w-4" />
                      Exportar Notion
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>
    </div>
  );
}

function CopyBlock({
  label,
  text,
  copied,
  onCopy,
}: {
  label: string;
  text: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/20 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <Button size="sm" variant="outline" onClick={onCopy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          Copiar
        </Button>
      </div>
      <pre className="whitespace-pre-wrap text-xs text-muted-foreground">{text}</pre>
    </div>
  );
}
