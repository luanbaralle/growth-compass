import {
  BarChart3,
  Clock,
  DollarSign,
  Eye,
  Filter,
  Handshake,
  LineChart,
  Megaphone,
  MousePointerClick,
  Percent,
  Receipt,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCategory {
  title: string;
  items: readonly string[];
}

const CATEGORY_META: Record<
  string,
  { icon: LucideIcon; accent: string; bar: string; glow: string; description: string }
> = {
  Aquisição: {
    icon: Megaphone,
    accent: "text-emerald-400",
    bar: "from-emerald-500/80 to-emerald-500/20",
    glow: "bg-emerald-500/10",
    description: "Volume e eficiência do tráfego pago",
  },
  Qualidade: {
    icon: Target,
    accent: "text-sky-400",
    bar: "from-sky-500/80 to-sky-500/20",
    glow: "bg-sky-500/10",
    description: "Perfil e tratamento dos contatos",
  },
  Comercial: {
    icon: TrendingUp,
    accent: "text-amber-400/90",
    bar: "from-amber-500/70 to-amber-500/15",
    glow: "bg-amber-500/10",
    description: "Conversão e retorno do funil",
  },
};

const METRIC_ICONS: Record<string, LucideIcon> = {
  Impressões: Eye,
  Cliques: MousePointerClick,
  CTR: Percent,
  CPC: DollarSign,
  Investimento: Wallet,
  Leads: Users,
  CPL: BarChart3,
  "Produto procurado": Filter,
  Origem: Megaphone,
  "Lead qualificado": Target,
  "Atendimento realizado": Handshake,
  "Tempo de resposta": Clock,
  Propostas: Receipt,
  Vendas: TrendingUp,
  "Taxa de conversão": Percent,
  CAC: LineChart,
  "Receita gerada": DollarSign,
};

function MetricChip({ label }: { label: string }) {
  const Icon = METRIC_ICONS[label] ?? BarChart3;
  return (
    <li className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 transition-colors hover:border-white/10 hover:bg-white/[0.05]">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04]">
        <Icon className="h-3.5 w-3.5 text-white/45" strokeWidth={2} />
      </span>
      <span className="text-[13px] font-medium leading-snug text-white/75">{label}</span>
    </li>
  );
}

export function ProposalMetricsCards({
  categories,
  note,
}: {
  categories: readonly MetricCategory[];
  note?: string;
}) {
  return (
    <div>
      <div className="grid gap-5 lg:grid-cols-3">
        {categories.map((category) => {
          const meta = CATEGORY_META[category.title] ?? CATEGORY_META.Aquisição;
          const Icon = meta.icon;

          return (
            <article
              key={category.title}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
            >
              <div className={cn("h-1 bg-gradient-to-r", meta.bar)} />

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10",
                        meta.glow,
                      )}
                    >
                      <Icon className={cn("h-5 w-5", meta.accent)} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                        {category.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-white/45">{meta.description}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] font-semibold text-white/35">
                    {category.items.length}
                  </span>
                </div>

                <ul className="mt-5 space-y-2">
                  {category.items.map((item) => (
                    <MetricChip key={item} label={item} />
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      {note && (
        <p className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 text-sm leading-relaxed text-white/45">
          {note}
        </p>
      )}
    </div>
  );
}
