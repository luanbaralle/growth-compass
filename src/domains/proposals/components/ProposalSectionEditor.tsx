import type { CreativeBriefSection } from "@/domains/copilot/types";
import type { ProposalContent, ProposalTemplate } from "../types";
import { ProposalEnhancementsEditor } from "./ProposalEnhancementsEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function ProposalSectionEditor({
  content,
  title,
  slug,
  template,
  onSave,
  onEnrich,
  saving,
  enriching,
}: {
  content: ProposalContent;
  title: string;
  slug: string;
  template: ProposalTemplate;
  onSave: (patch: { title?: string; slug?: string; content: ProposalContent }) => Promise<void>;
  onEnrich?: () => Promise<void>;
  saving?: boolean;
  enriching?: boolean;
}) {
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftSlug, setDraftSlug] = useState(slug);
  const [draftContent, setDraftContent] = useState(content);
  const sections = draftContent.sections;

  useEffect(() => {
    setDraftContent(content);
    setDraftTitle(title);
    setDraftSlug(slug);
  }, [content, title, slug]);

  const updateSection = (key: string, patch: Partial<CreativeBriefSection>) => {
    setDraftContent((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.key === key ? { ...s, ...patch } : s)),
    }));
  };

  const handleSave = async () => {
    await onSave({
      title: draftTitle,
      slug: draftSlug,
      content: {
        ...draftContent,
        hero: {
          ...draftContent.hero,
          title: draftContent.hero.title,
          subtitle: draftContent.hero.subtitle,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/50 bg-card p-5">
        <h2 className="text-sm font-semibold">Metadados</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="proposal-title">Título interno</Label>
            <Input id="proposal-title" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proposal-slug">Slug (URL)</Label>
            <Input id="proposal-slug" value={draftSlug} onChange={(e) => setDraftSlug(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card p-5">
        <h2 className="text-sm font-semibold">Hero & CTA</h2>
        <div className="mt-4 space-y-3">
          <div className="space-y-2">
            <Label>Título da proposta</Label>
            <Input
              value={draftContent.hero.title}
              onChange={(e) =>
                setDraftContent((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Subtítulo</Label>
            <Textarea
              value={draftContent.hero.subtitle}
              onChange={(e) =>
                setDraftContent((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))
              }
              rows={2}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Texto do botão</Label>
              <Input
                value={draftContent.cta.label}
                onChange={(e) =>
                  setDraftContent((p) => ({ ...p, cta: { ...p.cta, label: e.target.value } }))
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Mensagem WhatsApp</Label>
              <Textarea
                value={draftContent.cta.whatsappMessage}
                onChange={(e) =>
                  setDraftContent((p) => ({
                    ...p,
                    cta: { ...p.cta, whatsappMessage: e.target.value },
                  }))
                }
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.key} className="rounded-xl border border-border/50 bg-card p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {section.number} — {section.title}
          </p>
          <div className="mt-3 space-y-3">
            <div className="space-y-2">
              <Label>Narrativa</Label>
              <Textarea
                value={section.narrative}
                onChange={(e) => updateSection(section.key, { narrative: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Bullets (um por linha)</Label>
              <Textarea
                value={section.bullets.join("\n")}
                onChange={(e) =>
                  updateSection(section.key, {
                    bullets: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean),
                  })
                }
                rows={5}
              />
            </div>
            {section.editorNotes !== undefined && (
              <div className="space-y-2">
                <Label>Nota interna (não aparece na página pública)</Label>
                <Textarea
                  value={section.editorNotes ?? ""}
                  onChange={(e) => updateSection(section.key, { editorNotes: e.target.value })}
                  rows={2}
                />
              </div>
            )}
          </div>
        </div>
      ))}

      <ProposalEnhancementsEditor
        enabled={template === "acceleration"}
        content={draftContent}
        onChange={setDraftContent}
      />

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => void handleSave()} disabled={saving || enriching}>
          {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
          Salvar alterações
        </Button>
        {onEnrich && (
          <Button variant="outline" onClick={() => void onEnrich()} disabled={saving || enriching}>
            {enriching ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-1.5 h-4 w-4" />
            )}
            Enriquecer com IA
          </Button>
        )}
      </div>
    </div>
  );
}
