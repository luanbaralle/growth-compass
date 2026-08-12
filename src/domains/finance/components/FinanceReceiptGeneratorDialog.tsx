import {
  generateFinanceReceipt,
  getFinanceReceiptPreview,
} from "@/domains/finance/api.server";
import { formatMoney } from "@/domains/finance/types";
import { formatCnpj } from "@/domains/finance/receipt-utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { ExternalLink, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PreviewData = Awaited<ReturnType<typeof getFinanceReceiptPreview>>;

export function FinanceReceiptGeneratorDialog({
  open,
  onOpenChange,
  financeEntryId,
  companyId,
  onGenerated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  financeEntryId: string;
  companyId: string;
  onGenerated?: () => void;
}) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPreview(null);
      setError("");
      setGeneratedUrl(null);
      return;
    }

    setLoadingPreview(true);
    setError("");
    getFinanceReceiptPreview({ data: { id: financeEntryId, companyId } })
      .then((data) => {
        setPreview(data);
        setReceiptNumber(data.defaults.receiptNumber);
        setIssueDate(data.defaults.issueDate);
        setCompanyCode(data.defaults.companyCode);
        setServiceDescription(data.defaults.serviceDescription);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados do recibo.");
      })
      .finally(() => setLoadingPreview(false));
  }, [open, financeEntryId, companyId]);

  const handleGenerate = async () => {
    if (!receiptNumber.trim()) {
      setError("Informe o número do recibo.");
      return;
    }
    if (!issueDate) {
      setError("Informe a data de emissão.");
      return;
    }
    if (serviceDescription.trim().length < 10) {
      setError("A descrição dos serviços deve ter pelo menos 10 caracteres.");
      return;
    }

    setGenerating(true);
    setError("");
    try {
      const result = await generateFinanceReceipt({
        data: {
          id: financeEntryId,
          companyId,
          receiptNumber: receiptNumber.trim(),
          issueDate,
          companyCode: companyCode.trim() || "CL",
          serviceDescription: serviceDescription.trim(),
        },
      });
      setGeneratedUrl(result.url);
      toast.success("Recibo gerado e anexado ao lançamento");
      onGenerated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar recibo.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Gerar recibo
          </DialogTitle>
        </DialogHeader>

        {loadingPreview ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando dados...
          </div>
        ) : preview ? (
          <div className="space-y-4">
            {!preview.issuerConfigured && (
              <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
                Configure nome, CPF e contato do emissor em{" "}
                <Link to="/os/configuracoes" className="underline hover:text-amber-50">
                  Configurações
                </Link>{" "}
                antes de gerar.
              </div>
            )}

            <div className="rounded-lg border border-border/60 bg-surface-elevated/20 p-3 text-sm">
              <p className="font-medium">{preview.company.legalName}</p>
              <p className="text-muted-foreground">
                CNPJ {formatCnpj(preview.company.cnpj)}
              </p>
              <p className="mt-2 font-medium text-brand">
                {formatMoney(preview.entry.amountCents)}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Número do recibo</Label>
                <Input
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="R1-2026-UC-001"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Data de emissão</Label>
                <Input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Código da empresa</Label>
              <Input
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                placeholder="UC"
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">
                Usado na numeração do recibo (ex.: R1-2026-UC-001).
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Descrição dos serviços</Label>
              <Textarea
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                rows={5}
                placeholder="Gestão mensal de Tráfego Pago (Google Ads), referente ao ciclo operacional..."
              />
            </div>

            {generatedUrl && (
              <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm">
                <p className="font-medium text-emerald-200">Recibo gerado com sucesso.</p>
                <Button
                  type="button"
                  size="sm"
                  variant="link"
                  className="h-auto px-0 text-emerald-200"
                  onClick={() => window.open(generatedUrl, "_blank")}
                >
                  <ExternalLink className="mr-1 h-3.5 w-3.5" />
                  Abrir PDF
                </Button>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        ) : (
          error && <p className="text-sm text-destructive">{error}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {generatedUrl ? "Fechar" : "Cancelar"}
          </Button>
          {!generatedUrl && (
            <Button
              onClick={() => void handleGenerate()}
              disabled={loadingPreview || generating || !preview?.issuerConfigured}
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Gerar PDF
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
