import {
  createCompanyCredential,
  deleteCompanyCredential,
  revealCompanyCredential,
} from "@/domains/companies/api.server";
import type { CompanyCredential, CredentialPlatform } from "@/domains/companies/types";
import {
  CREDENTIAL_PLATFORM_LABELS,
  CREDENTIAL_PLATFORMS,
} from "@/domains/companies/types";
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
import { Textarea } from "@/components/ui/textarea";
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
import { Copy, Eye, EyeOff, ExternalLink, KeyRound, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CompanyCredentials({
  companyId,
  credentials,
  onRefresh,
}: {
  companyId: string;
  credentials: CompanyCredential[];
  onRefresh: () => Promise<void>;
}) {
  const [platform, setPlatform] = useState<CredentialPlatform>("google");
  const [label, setLabel] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [adding, setAdding] = useState(false);
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [revealingId, setRevealingId] = useState<string | null>(null);

  const resetForm = () => {
    setLabel("");
    setUsername("");
    setPassword("");
    setUrl("");
    setNotes("");
    setPlatform("google");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    setAdding(true);
    try {
      await createCompanyCredential({
        data: {
          companyId,
          platform,
          label: label.trim(),
          username: username.trim() || undefined,
          password: password.trim() || undefined,
          url: url.trim() || undefined,
          notes: notes.trim() || undefined,
        },
      });
      resetForm();
      toast.success("Acesso adicionado");
      await onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar acesso");
    } finally {
      setAdding(false);
    }
  };

  const handleReveal = async (id: string) => {
    if (revealed[id]) {
      setRevealed((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    setRevealingId(id);
    try {
      const { secret } = await revealCompanyCredential({ data: { id, companyId } });
      setRevealed((prev) => ({ ...prev, [id]: secret }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao revelar senha");
    } finally {
      setRevealingId(null);
    }
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copiado");
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCompanyCredential({ data: { id, companyId } });
    setRevealed((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    toast.success("Acesso removido");
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="grid gap-3 rounded-lg border border-border/60 p-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Plataforma</Label>
          <Select value={platform} onValueChange={(v) => setPlatform(v as CredentialPlatform)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CREDENTIAL_PLATFORMS.map((p) => (
                <SelectItem key={p} value={p}>
                  {CREDENTIAL_PLATFORM_LABELS[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Rótulo</Label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ex: Conta principal, Ads secundário"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>Usuário / e-mail</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="usuario@empresa.com"
            autoComplete="off"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Senha</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>URL</Label>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Notas</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Observações sobre o acesso..."
          />
        </div>
        <Button type="submit" size="sm" disabled={adding} className="sm:col-span-2 w-fit">
          <Plus className="h-4 w-4" />
          Adicionar acesso
        </Button>
      </form>

      {credentials.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum acesso cadastrado.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {credentials.map((cred) => {
            const secret = revealed[cred.id];
            const isRevealed = secret !== undefined;
            return (
              <li
                key={cred.id}
                className="flex flex-col gap-2 rounded-lg border border-border/60 px-3 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{cred.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {CREDENTIAL_PLATFORM_LABELS[cred.platform]}
                    </p>
                  </div>
                  <KeyRound className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>

                {cred.username && (
                  <p className="truncate text-sm text-muted-foreground">{cred.username}</p>
                )}

                <div className="flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate rounded bg-muted/40 px-2 py-1 text-xs">
                    {isRevealed ? secret : cred.has_secret ? "••••••••" : "Sem senha"}
                  </code>
                  {cred.has_secret && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={revealingId === cred.id}
                        onClick={() => handleReveal(cred.id)}
                        title={isRevealed ? "Ocultar senha" : "Revelar senha"}
                      >
                        {isRevealed ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      {isRevealed && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(secret)}
                          title="Copiar senha"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {cred.url && (
                  <a
                    href={cred.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 truncate text-xs text-brand hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    {cred.url}
                  </a>
                )}

                {cred.notes?.trim() && (
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap">{cred.notes}</p>
                )}

                <div className="flex justify-end pt-1">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover acesso?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {cred.label} ({CREDENTIAL_PLATFORM_LABELS[cred.platform]})
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(cred.id)}>
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
