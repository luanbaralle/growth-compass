import {
  addCommercialObjection,
  getCommercialLibrary,
  updateCommercialCase,
  updateCommercialObjection,
  updateCommercialQualification,
  updateCommercialScript,
} from "@/domains/prospection/api.server";
import type {
  CommercialObjection,
  CommercialQualification,
  CommercialScript,
} from "@/domains/prospection/types";
import { SCRIPT_TYPE_LABELS } from "@/domains/prospection/types";
import { EmptyState, PageHeader, PageSkeleton, Section } from "@/os/ui";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type LibraryData = Awaited<ReturnType<typeof getCommercialLibrary>>;

export function CommercialLibraryPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<LibraryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [segmentId, setSegmentId] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const result = await getCommercialLibrary();
      setData(result);
      setSegmentId((prev) => prev || result[0]?.segment.id || "");
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar biblioteca."));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <PageSkeleton title="Biblioteca Comercial" />;
  if (error || !data) {
    return <EmptyState title="Erro" description={error ?? "Biblioteca indisponível."} />;
  }

  const current = data.find((d) => d.segment.id === segmentId) ?? data[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Biblioteca Comercial"
        description="Scripts, objeções e qualificação por segmento"
        icon={BookOpen}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to="/os/prospeccao">
              <ArrowLeft className="h-4 w-4" />
              Pipeline
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Label>Segmento</Label>
        <Select value={current.segment.id} onValueChange={setSegmentId}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {data.map((d) => (
              <SelectItem key={d.segment.id} value={d.segment.id}>
                {d.segment.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Section title="Scripts">
        <div className="space-y-4">
          {current.scripts.map((script) => (
            <ScriptCard key={script.id} script={script} onSaved={load} />
          ))}
        </div>
      </Section>

      <Section title="Objeções">
        <div className="space-y-4">
          {current.objections.map((obj) => (
            <ObjectionCard key={obj.id} objection={obj} onSaved={load} />
          ))}
          <AddObjectionForm segmentId={current.segment.id} onAdded={load} />
        </div>
      </Section>

      <Section title="Perguntas de qualificação">
        <div className="space-y-3">
          {current.qualifications.map((q) => (
            <QualificationCard key={q.id} qualification={q} onSaved={load} />
          ))}
        </div>
      </Section>

      <Section title="Case correspondente">
        <CaseEditor
          segmentId={current.segment.id}
          caseSlug={current.case?.case_slug ?? ""}
          title={current.case?.title ?? ""}
          onSaved={load}
        />
      </Section>
    </div>
  );
}

function ScriptCard({
  script,
  onSaved,
}: {
  script: CommercialScript;
  onSaved: () => void;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [content, setContent] = useState(script.content);

  useEffect(() => setContent(script.content), [script.content]);

  const save = (value: string) => {
    setContent(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await updateCommercialScript({ data: { id: script.id, content: value } });
      onSaved();
    }, 600);
  };

  return (
    <div className="rounded-lg border border-border/50 p-4">
      <p className="text-sm font-medium">{SCRIPT_TYPE_LABELS[script.script_type]}</p>
      <Textarea
        className="mt-2 min-h-[100px] text-sm"
        value={content}
        onChange={(e) => save(e.target.value)}
      />
    </div>
  );
}

function ObjectionCard({
  objection,
  onSaved,
}: {
  objection: CommercialObjection;
  onSaved: () => void;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [form, setForm] = useState({
    objection: objection.objection,
    response: objection.response,
    objective: objection.objective,
  });

  useEffect(() => {
    setForm({
      objection: objection.objection,
      response: objection.response,
      objective: objection.objective,
    });
  }, [objection]);

  const save = (patch: Partial<typeof form>) => {
    const next = { ...form, ...patch };
    setForm(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await updateCommercialObjection({
        data: { id: objection.id, ...next },
      });
      onSaved();
    }, 600);
  };

  return (
    <div className="rounded-lg border border-border/50 p-4 space-y-2">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Objeção</Label>
        <Input value={form.objection} onChange={(e) => save({ objection: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Resposta</Label>
        <Textarea
          value={form.response}
          onChange={(e) => save({ response: e.target.value })}
          rows={3}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Objetivo</Label>
        <Input value={form.objective} onChange={(e) => save({ objective: e.target.value })} />
      </div>
    </div>
  );
}

function AddObjectionForm({
  segmentId,
  onAdded,
}: {
  segmentId: string;
  onAdded: () => void;
}) {
  const [objection, setObjection] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!objection.trim()) return;
    setLoading(true);
    try {
      await addCommercialObjection({
        data: { segmentId, objection: objection.trim() },
      });
      setObjection("");
      onAdded();
      toast.success("Objeção adicionada.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao adicionar."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Nova objeção..."
        value={objection}
        onChange={(e) => setObjection(e.target.value)}
      />
      <Button size="sm" onClick={() => void handleAdd()} disabled={loading}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

function QualificationCard({
  qualification,
  onSaved,
}: {
  qualification: CommercialQualification;
  onSaved: () => void;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [question, setQuestion] = useState(qualification.question);

  useEffect(() => setQuestion(qualification.question), [qualification.question]);

  const save = (value: string) => {
    setQuestion(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await updateCommercialQualification({
        data: { id: qualification.id, question: value },
      });
      onSaved();
    }, 600);
  };

  return (
    <Input
      value={question}
      onChange={(e) => save(e.target.value)}
      placeholder="Pergunta de qualificação"
    />
  );
}

function CaseEditor({
  segmentId,
  caseSlug,
  title,
  onSaved,
}: {
  segmentId: string;
  caseSlug: string;
  title: string;
  onSaved: () => void;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [form, setForm] = useState({ caseSlug, title });

  useEffect(() => setForm({ caseSlug, title }), [caseSlug, title]);

  const save = (patch: Partial<typeof form>) => {
    const next = { ...form, ...patch };
    setForm(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await updateCommercialCase({
        data: {
          segmentId,
          caseSlug: next.caseSlug,
          title: next.title,
        },
      });
      onSaved();
    }, 600);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Slug do case</Label>
        <Input
          value={form.caseSlug}
          onChange={(e) => save({ caseSlug: e.target.value })}
          placeholder="ex: unip"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Título</Label>
        <Input
          value={form.title}
          onChange={(e) => save({ title: e.target.value })}
          placeholder="Nome do case"
        />
      </div>
    </div>
  );
}
