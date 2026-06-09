import type { SegmentConfig } from "@/config/segments/types";
import { submitLead } from "@/lib/api/leads.functions";
import { buildLeadConfirmationSummary, saveLeadSummary } from "@/lib/lead-summary";
import { formOpportunityTitle } from "@/lib/personalization";
import type { LeadSource } from "@/lib/leads/types";
import { readPersistedUtm } from "@/lib/utm";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Eyebrow } from "../shared/Eyebrow";

function Field({
  label,
  name,
  type = "text",
  required,
  optional,
  defaultValue,
  readOnly,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  defaultValue?: string;
  readOnly?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {label}
        {optional && (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            opcional
          </span>
        )}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        readOnly={readOnly}
        maxLength={120}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors read-only:cursor-default read-only:opacity-80 focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}

export interface LeadFormContext {
  city?: string;
  cityState?: string;
  defaultBusiness?: string;
  templateSlug: string;
  negocio?: string;
  displayLabel?: string;
  microverticalId?: string;
  matchLevel?: "exact" | "related" | "dynamic";
  source: LeadSource;
  fromHub?: boolean;
  searchExamples?: string[];
  yourBusinessLabel?: string;
}

interface CTAFormProps {
  config: SegmentConfig;
  leadContext: LeadFormContext;
}

export function CTAForm({ config, leadContext }: CTAFormProps) {
  const navigate = useNavigate();
  const { form } = config;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const compact = leadContext.fromHub && !!leadContext.city && !!leadContext.defaultBusiness;

  const formHeadline = leadContext.yourBusinessLabel
    ? formOpportunityTitle(leadContext.yourBusinessLabel)
    : { title: form.title, titleHighlight: form.titleHighlight };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const utm = readPersistedUtm();
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const city = String(fd.get("city") ?? leadContext.city ?? "").trim();
    const business = String(
      fd.get("business") ?? leadContext.defaultBusiness ?? config.name,
    ).trim();
    const link = String(fd.get("link") ?? "").trim() || undefined;

    try {
      const result = await submitLead({
        data: {
          name,
          phone,
          city,
          cityState: leadContext.cityState,
          business,
          segment: config.slug,
          templateSlug: leadContext.templateSlug,
          negocio: leadContext.negocio,
          displayLabel: leadContext.displayLabel ?? leadContext.defaultBusiness,
          microverticalId: leadContext.microverticalId,
          matchLevel: leadContext.matchLevel,
          source: leadContext.source,
          link,
          ...utm,
        },
      });

      saveLeadSummary(
        buildLeadConfirmationSummary({
          name,
          business: leadContext.displayLabel ?? business,
          city,
          cityState: leadContext.cityState,
          link,
          searchExamples: leadContext.searchExamples?.slice(0, 4),
        }),
      );

      if (result.whatsappUrl) {
        sessionStorage.setItem("raise_whatsapp_url", result.whatsappUrl);
      }

      navigate({
        to: "/obrigado",
        search: {
          segment: config.slug,
          negocio: leadContext.negocio,
          cidade: leadContext.city,
          uf: leadContext.cityState,
        },
      });
    } catch {
      setError("Não foi possível enviar. Tente novamente ou fale conosco pelo WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="diagnostico"
      className="relative overflow-hidden border-t border-border/60 bg-surface/30"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      <div className="absolute inset-0 radial-glow opacity-60" />
      <div className="relative mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{form.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-bold leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
            {formHeadline.title}{" "}
            <span className="text-brand">{formHeadline.titleHighlight}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground text-balance sm:text-lg">
            {compact
              ? "Confirme seu WhatsApp e, se quiser, informe site ou Instagram — isso ajuda a personalizar sua análise."
              : form.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          {compact && (
            <div className="mb-4 rounded-xl border border-brand/20 bg-brand-soft/50 px-4 py-3 text-center text-sm">
              <span className="font-medium text-foreground">{leadContext.displayLabel}</span>
              <span className="text-muted-foreground"> · </span>
              <span className="text-foreground">
                {leadContext.city}
                {leadContext.cityState ? `, ${leadContext.cityState}` : ""}
              </span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-background/80 p-6 backdrop-blur-xl sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome" name="name" required />
              <Field label="WhatsApp" name="phone" type="tel" required />

              {compact ? (
                <>
                  <input type="hidden" name="city" value={leadContext.city ?? ""} />
                  <input type="hidden" name="business" value={leadContext.defaultBusiness ?? ""} />
                </>
              ) : (
                <>
                  <Field
                    label="Cidade"
                    name="city"
                    required
                    defaultValue={leadContext.city}
                  />
                  <Field
                    label={form.businessFieldLabel}
                    name="business"
                    required
                    defaultValue={leadContext.defaultBusiness ?? config.name}
                  />
                </>
              )}

              <div className="sm:col-span-2">
                <Field
                  label="Site ou Instagram"
                  name="link"
                  optional
                  placeholder="instagram.com/seunegocio ou www.seusite.com.br"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-center text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-sm font-semibold text-primary-foreground shadow-brand transition-all hover:scale-[1.01] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  {form.submitLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
            <p className="mt-4 text-center text-xs text-muted-foreground">{form.footerNote}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
