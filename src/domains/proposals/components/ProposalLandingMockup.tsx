import type { ProposalLandingMockup } from "../types";

export function ProposalLandingMockup({
  mockup,
  companyName,
}: {
  mockup: ProposalLandingMockup;
  companyName: string;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 border-b border-white/10 bg-black/30 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <div className="mx-auto max-w-[70%] truncate rounded-md bg-white/8 px-3 py-1 text-[10px] text-white/45">
          {companyName.toLowerCase().replace(/\s+/g, "")}.com.br
        </div>
      </div>

      <div className="px-6 py-10 sm:px-10 sm:py-12">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/80">
          {companyName}
        </p>
        <h3 className="mt-3 max-w-lg text-2xl font-semibold leading-tight text-white sm:text-3xl">
          {mockup.headline}
        </h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">{mockup.subheadline}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black">
            {mockup.ctaLabel}
          </div>
          <div className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/60">
            Saiba mais
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {["Atendimento rápido", "Especialistas locais", "Resultado comprovado"].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center text-xs text-white/50"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
