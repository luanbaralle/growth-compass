import { deleteCompanyFile, getCompanyFileUrl } from "@/domains/companies/api.server";
import type { CompanyFile } from "@/domains/companies/types";
import { listFinanceEntryFiles, uploadFinanceReceipt } from "@/domains/finance/api.server";
import { FinanceReceiptGeneratorDialog } from "@/domains/finance/components/FinanceReceiptGeneratorDialog";
import { fileToBase64, formatFileBytes, validateUploadFile } from "@/lib/file-upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Download, FileText, Loader2, Paperclip, Trash2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function FinanceReceiptsField({
  companyId,
  financeEntryId,
  pendingFiles,
  onPendingFilesChange,
}: {
  companyId: string;
  financeEntryId?: string;
  pendingFiles: File[];
  onPendingFilesChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [existingFiles, setExistingFiles] = useState<CompanyFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CompanyFile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reloadFiles = useCallback(() => {
    if (!financeEntryId || !companyId) {
      setExistingFiles([]);
      return;
    }
    setLoadingFiles(true);
    listFinanceEntryFiles({ data: { financeEntryId, companyId } })
      .then(setExistingFiles)
      .catch(() => setExistingFiles([]))
      .finally(() => setLoadingFiles(false));
  }, [financeEntryId, companyId]);

  useEffect(() => {
    reloadFiles();
  }, [reloadFiles]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;

    const valid: File[] = [];
    for (const file of selected) {
      const error = validateUploadFile(file);
      if (error) {
        toast.error(`${file.name}: ${error}`);
        continue;
      }
      valid.push(file);
    }

    if (valid.length > 0) {
      onPendingFilesChange([...pendingFiles, ...valid]);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const removePending = (index: number) => {
    onPendingFilesChange(pendingFiles.filter((_, i) => i !== index));
  };

  const handleDownload = async (file: CompanyFile) => {
    try {
      const { url } = await getCompanyFileUrl({ data: { id: file.id, companyId } });
      window.open(url, "_blank");
    } catch {
      toast.error("Erro ao abrir arquivo");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await deleteCompanyFile({ data: { id: deleteTarget.id, companyId } });
      setExistingFiles((files) => files.filter((file) => file.id !== deleteTarget.id));
      toast.success("Comprovante removido");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover comprovante");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="space-y-2 rounded-lg border border-border/60 bg-surface-elevated/20 p-4">
        <div className="flex items-center justify-between gap-2">
          <Label className="flex items-center gap-1.5">
            <Paperclip className="h-3.5 w-3.5" />
            Comprovantes e recibos
          </Label>
          <span className="text-xs text-muted-foreground">PDF, PNG, JPG — máx. 10 MB</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp,image/*,application/pdf"
          multiple
          onChange={handleSelect}
        />
        <div className="flex flex-wrap gap-2">
          {financeEntryId && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setGeneratorOpen(true)}
            >
              <FileText className="h-4 w-4" />
              Gerar recibo
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Anexar arquivo
          </Button>
        </div>

        {loadingFiles && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Carregando anexos...
          </p>
        )}

        {existingFiles.length > 0 && (
          <ul className="space-y-1.5">
            {existingFiles.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between gap-2 rounded-md border border-border/40 px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileBytes(file.size_bytes)}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => void handleDownload(file)}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => setDeleteTarget(file)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {pendingFiles.length > 0 && (
          <ul className="space-y-1.5">
            {pendingFiles.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-2 rounded-md border border-dashed border-brand/30 bg-brand-soft/20 px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileBytes(file.size)}</p>
                </div>
                <Button type="button" size="sm" variant="ghost" onClick={() => removePending(index)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {financeEntryId && (
        <FinanceReceiptGeneratorDialog
          open={generatorOpen}
          onOpenChange={setGeneratorOpen}
          financeEntryId={financeEntryId}
          companyId={companyId}
          onGenerated={reloadFiles}
        />
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover comprovante?</AlertDialogTitle>
            <AlertDialogDescription>{deleteTarget?.name}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={() => void handleConfirmDelete()}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remover"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export async function uploadFinanceReceiptFiles(
  companyId: string,
  financeEntryId: string,
  files: File[],
) {
  for (const file of files) {
    const base64 = await fileToBase64(file);
    await uploadFinanceReceipt({
      data: {
        companyId,
        financeEntryId,
        name: file.name,
        mimeType: file.type || "application/octet-stream",
        base64,
      },
    });
  }
}
