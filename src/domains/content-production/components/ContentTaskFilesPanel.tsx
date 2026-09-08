import {
  addContentTaskDriveLink,
  deleteContentTaskFile,
  getContentTaskFileUrl,
  listContentTaskFiles,
  uploadContentTaskFile,
} from "@/domains/content-production/api.server";
import type { ContentTaskFile, ContentTaskFileType } from "@/domains/content-production/types";
import { CONTENT_TASK_FILE_TYPE_LABELS, CONTENT_TASK_FILE_TYPES } from "@/domains/content-production/types";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, ExternalLink, Loader2, Link2, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ContentTaskFilesPanel({
  taskId,
  onChanged,
}: {
  taskId: string;
  onChanged?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<ContentTaskFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileType, setFileType] = useState<ContentTaskFileType>("raw_video");
  const [uploading, setUploading] = useState(false);
  const [driveUrl, setDriveUrl] = useState("");
  const [driveName, setDriveName] = useState("");
  const [addingDrive, setAddingDrive] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listContentTaskFiles({ data: { id: taskId } });
      setFiles(result.files);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar arquivos");
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Arquivo máximo: 50 MB. Para vídeos maiores, use o link do Drive.");
      return;
    }

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      await uploadContentTaskFile({
        data: {
          taskId,
          name: file.name,
          fileType,
          mimeType: file.type || "application/octet-stream",
          base64,
        },
      });
      toast.success("Arquivo enviado");
      await refresh();
      onChanged?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleAddDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUrl.trim()) return;
    setAddingDrive(true);
    try {
      await addContentTaskDriveLink({
        data: {
          taskId,
          name: driveName.trim() || "Material no Drive",
          fileType,
          url: driveUrl.trim(),
        },
      });
      setDriveUrl("");
      setDriveName("");
      toast.success("Link do Drive adicionado");
      await refresh();
      onChanged?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar link");
    } finally {
      setAddingDrive(false);
    }
  };

  const handleDownload = async (file: ContentTaskFile) => {
    try {
      const { url } = await getContentTaskFileUrl({
        data: { taskId, fileId: file.id },
      });
      window.open(url, "_blank");
    } catch {
      toast.error("Erro ao gerar link de download");
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteContentTaskFile({ data: { taskId, fileId } });
      toast.success("Arquivo removido");
      await refresh();
      onChanged?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border/40 bg-surface/20 p-4">
        <div className="space-y-1.5">
          <Label>Tipo de arquivo</Label>
          <Select value={fileType} onValueChange={(v) => setFileType(v as ContentTaskFileType)}>
            <SelectTrigger className="w-[180px] bg-surface/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TASK_FILE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {CONTENT_TASK_FILE_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <input ref={inputRef} type="file" className="hidden" onChange={handleFile} />
        <Button
          type="button"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Enviar arquivo (máx. 50 MB)
        </Button>
      </div>

      <form
        onSubmit={handleAddDrive}
        className="space-y-3 rounded-lg border border-border/40 bg-surface/20 p-4"
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          Link do Drive (vídeos 100MB+)
        </div>
        <p className="text-xs text-muted-foreground">
          Compartilhe o arquivo no Drive com “qualquer pessoa com o link” para a prévia carregar.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Nome</Label>
            <Input
              value={driveName}
              onChange={(e) => setDriveName(e.target.value)}
              placeholder="Ex: Bruto reel 12/03"
              className="bg-surface/40"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>URL do Drive</Label>
            <Input
              type="url"
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="bg-surface/40"
              required
            />
          </div>
        </div>
        <Button type="submit" size="sm" disabled={addingDrive || !driveUrl.trim()}>
          {addingDrive ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
          Adicionar link
        </Button>
      </form>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando arquivos...
        </div>
      ) : files.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum arquivo anexado. Envie até 50 MB ou cole o link do Drive para vídeos maiores.
        </p>
      ) : (
        <ul className="divide-y divide-border/40 rounded-lg border border-border/40">
          {files.map((file) => (
            <li key={file.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {CONTENT_TASK_FILE_TYPE_LABELS[file.file_type]}
                  {file.external_url ? " · Drive" : ` · ${formatBytes(file.size_bytes)}`}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => void handleDownload(file)}
                >
                  {file.external_url ? (
                    <ExternalLink className="h-3.5 w-3.5" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" size="sm" variant="ghost" className="text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover arquivo?</AlertDialogTitle>
                      <AlertDialogDescription>{file.name}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => void handleDelete(file.id)}>
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
