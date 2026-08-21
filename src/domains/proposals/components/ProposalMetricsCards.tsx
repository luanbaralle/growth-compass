import {
  BarChart3,
  Clock,
  DollarSign,
  Eye,
  Filter,
  Handshake,
  Heart,
  LineChart,
  Megaphone,
  MousePointerClick,
  Percent,
  Play,
  Share2,
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
  Conteúdo: {
    icon: Play,
    accent: "text-violet-400",
    bar: "from-violet-500/70 to-violet-500/10",
    glow: "bg-violet-500/10",
    description: "Alcance e engajamento orgânico",
  },
  Conversão: {
    icon: Target,
    accent: "text-sky-400",
    bar: "from-sky-500/80 to-sky-500/20",
    glow: "bg-sky-500/10",
    description: "Jornada digital e origem dos leads",
  },
  Negócio: {
    icon: LineChart,
    accent: "text-amber-400/90",
    bar: "from-amber-500/70 to-amber-500/15",
    glow: "bg-amber-500/10",
    description: "Resultados informados pela operação",
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
  "Taxa de conversão": Percent,
  CAC: LineChart,
  "CAC estimado": LineChart,
  Receita: DollarSign,
  Alcance: Share2,
  Visualizações: Eye,
  Retenção: Clock,
  Interações: Heart,
  "Crescimento orgânico": TrendingUp,
  "Conversões da LP": Target,
  "Cliques no WhatsApp": Megaphone,
  Formulários: Filter,
  "Origem dos leads": Megaphone,
  "Vendas informadas": Handshake,
};

function MetricTag({ label }: { label: string }) {
  const Icon = METRIC_ICONS[label] ?? BarChart3;
  return (
    <li className="flex min-h-[2.25rem] items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-2 transition-colors hover:border-white/10 hover:bg-white/[0.05]">
      <Icon className="h-3.5 w-3.5 shrink-0 text-white/40" strokeWidth={2} />
      <span className="text-[12px] font-medium leading-tight text-white/70">{label}</span>
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
      <div className="grid gap-5 md:grid-cols-2">
        {categories.map((category) => {
          const meta = CATEGORY_META[category.title] ?? CATEGORY_META.Aquisição;
          const Icon = meta.icon;

          return (
            <article
              key={category.title}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
            >
              <div className={cn("h-1 shrink-0 bg-gradient-to-r", meta.bar)} />

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10",
                      meta.glow,
                    )}
                  >
                    <Icon className={cn("h-4 w-4", meta.accent)} strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                      {category.title}
                    </p>
                    <p className="mt-1 text-sm leading-snug text-white/50">{meta.description}</p>
                  </div>
                </div>

                <ul className="mt-5 grid flex-1 gap-2 sm:grid-cols-2">
                  {category.items.map((item) => (
                    <MetricTag key={item} label={item} />
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      {note && (
        <p className="mt-8 max-w-3xl rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3.5 text-sm leading-relaxed text-white/45">
          {note}
        </p>
      )}
    </div>
  );
}
