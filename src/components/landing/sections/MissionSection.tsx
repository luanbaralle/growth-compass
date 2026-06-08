import type { SegmentConfig } from "@/config/segments/types";
import { Logo } from "../shared/Logo";
import { Eyebrow } from "../shared/Eyebrow";
import { SectionWrap } from "../shared/SectionWrap";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}

export function MissionSection({ config }: { config: SegmentConfig }) {
  const { mission } = config;

  return (
    <SectionWrap className="bg-surface/30">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <Eyebrow>{mission.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-bold leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
            {mission.title}
            <br />
            <span className="text-brand">{mission.titleHighlight}</span>
          </h2>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>{mission.paragraphs[0]}</p>
            <div className="flex flex-wrap gap-2">
              {mission.dependencyTags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <p>
              Enquanto isso, pessoas interessadas continuam pesquisando seus serviços{" "}
              <span className="text-foreground">todos os dias no Google.</span>
            </p>
            <p className="text-foreground">{mission.paragraphs[2]}</p>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-background p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10" />
              <div>
                <div className="text-lg font-semibold">Raise One</div>
                <div className="text-xs text-muted-foreground">
                  Crescimento para negócios locais
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-y border-border py-6">
              <Stat label="Foco" value="Local" />
              <Stat label="Mercado" value="B2B" />
              <Stat label="Método" value="Dados" />
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {mission.cardDescription}
            </p>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}
