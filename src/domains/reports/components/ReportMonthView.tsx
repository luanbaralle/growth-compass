import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  Layers,
  MessageCircle,
  Minus,
  MousePointerClick,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
  Wrench,
  XCircle,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/landing/shared/Logo";
import googleAdsLogo from "@/assets/reports/studio21/google-ads-logo.png";
import dashMaio from "@/assets/reports/studio21/google-ads-dashboard.png";
import dashJunho from "@/assets/reports/studio21/Google-Ads-Junho.png";
import dashJulho from "@/assets/reports/studio21/Google-Ads-Julho.png";
import dashAgosto from "@/assets/reports/studio21/Google-Ads-Agosto.png";
import print1 from "@/assets/reports/studio21/print1.png";
import print2 from "@/assets/reports/studio21/print2.png";
import print3 from "@/assets/reports/studio21/print3.jpeg";
import type { ReportCompany, ReportMonth } from "@/data/reports/types";
import { formatBRL, formatInt, formatPct, pctChange } from "../format";
import { accentClass, fadeUp, reportIconMap } from "../report-ui";
import { ReportMetricCard } from "./ReportMetricCard";
import { ReportSection } from "./ReportSection";
import { cn } from "@/lib/utils";

const carouselImages = [print1, print2, print3];

const dashboards = {
  maio: dashMaio,
  junho: dashJunho,
  julho: dashJulho,
  agosto: dashAgosto,
} as const;

const kpiIcons = {
  Impressões: Eye,
  Cliques: MousePointerClick,
  Mensagens: MessageCircle,
  Investimento: Wallet,
} as const;

function ComparisonRow({
  label,
  prev,
  curr,
  leftLabel,
  rightLabel,
  format,
  invertGood = false,
}: {
  label: string;
  prev: number;
  curr: number;
  leftLabel: string;
  rightLabel: string;
  format: (n: number) => string;
  invertGood?: boolean;
}) {
  const delta = pctChange(curr, prev);
  const isPositive = delta > 0;
  const isGood = invertGood ? !isPositive : isPositive;
  const isNeutral = Math.abs(delta) < 0.5;

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-b border-white/[0.06] py-4 last:border-0 sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:gap-6">
      <div className="text-sm font-medium text-white/90">{label}</div>
      <div className="text-right">
        <div className="text-[10px] uppercase tracking-[0.14em] text-white/35">{leftLabel}</div>
        <div className="mt-0.5 text-sm tabular-nums text-white/45">{format(prev)}</div>
      </div>
      <div className="text-right">
        <div className="text-[10px] uppercase tracking-[0.14em] text-white/35">{rightLabel}</div>
        <div className="mt-0.5 text-sm font-semibold tabular-nums text-white">{format(curr)}</div>
      </div>
      <div
        className={cn(
          "flex items-center justify-end gap-1 text-xs font-medium",
          isNeutral ? "text-white/40" : isGood ? "text-emerald-400" : "text-rose-400",
        )}
      >
        {isNeutral ? (
          <Minus className="h-3 w-3" />
        ) : isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {formatPct(delta)}
      </div>
    </div>
  );
}

function CampaignCard({
  campaign,
  totalCost,
  index,
}: {
  campaign: NonNullable<ReportMonth["campaigns"]>[number];
  totalCost: number;
  index: number;
}) {
  const a = accentClass[campaign.accent];
  const Icon = reportIconMap[campaign.iconKey];
  const m = campaign.metrics;
  const share = Math.round((m.cost / totalCost) * 100);

  return (
    <motion.div
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: index * 0.1 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", a.soft, a.text)}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{campaign.name}</h3>
            <p className="mt-0.5 text-xs text-white/45">{campaign.subtitle}</p>
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white/45">
          {share}% do investimento
        </span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { l: "Impressões", v: formatInt(m.impressions) },
          { l: "Cliques", v: formatInt(m.clicks) },
          { l: "WhatsApp", v: String(m.conversions) },
          { l: "Investimento", v: formatBRL(m.cost) },
          { l: "CPC médio", v: formatBRL(m.cpc) },
          { l: "Custo / msg", v: formatBRL(m.costPerConv ?? 0) },
        ].map((item) => (
          <div key={item.l} className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <div className="text-[10px] uppercase tracking-[0.14em] text-white/35">{item.l}</div>
            <div className="mt-1.5 text-xl font-semibold tabular-nums text-white">{item.v}</div>
          </div>
        ))}
      </div>

      {m.convRate != null && (
        <div className="mt-6">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-white/45">Taxa de conversão</span>
            <span className="font-semibold tabular-nums text-white">
              {m.convRate.toFixed(2).replace(".", ",")}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min((m.convRate / 10) * 100, 100)}%` }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={cn("h-full rounded-full", a.bar)}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function Soft({ children }: { children: ReactNode }) {
  return <span className="text-white/45">{children}</span>;
}

export function ReportMonthView({
  company,
  month,
}: {
  company: ReportCompany;
  month: ReportMonth;
}) {
  const [slide, setSlide] = useState(0);
  const totalCost = month.comparison?.current.cost ?? month.campaigns?.[0]?.metrics.cost ?? 1;

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % carouselImages.length), 8000);
    return () => clearInterval(id);
  }, []);

  let section = 1;
  const next = () => String(section++).padStart(2, "0");

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#090909]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <div className="flex items-center gap-3">
            <Link to="/relatorios/$empresa" params={{ empresa: company.slug }} className="shrink-0">
              <Logo size="nav" />
            </Link>
            <span className="hidden h-4 w-px bg-white/15 sm:block" />
            <img src={company.logo} alt={company.name} className="hidden h-7 w-auto opacity-90 sm:block" />
          </div>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/45">
            <span className="hidden sm:inline">Relatório · {month.cycleShort}</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:inline-block" />
            <span>{month.headerPeriod}</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-brand/[0.12] blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-[320px] w-[320px] rounded-full bg-[#4285F4]/[0.08] blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 pb-20 pt-16 md:grid-cols-12 md:px-8 md:pb-28 md:pt-24">
          <div className="z-10 md:col-span-7">
            <motion.div
              {...fadeUp}
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/40"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
              Relatório de Performance
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              className="mt-6 font-display text-[42px] leading-[0.95] tracking-tight text-white md:text-[72px]"
            >
              Google Ads
              <br />
              <Soft>{company.name}</Soft>
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="mt-8 max-w-xl text-lg leading-relaxed text-white/55"
            >
              {month.heroEmphasis
                ? month.heroSubtitle.replace(
                    month.heroEmphasis,
                    `__EMP__${month.heroEmphasis}__EMP__`,
                  )
                    .split(/__EMP__/)
                    .map((part, i) =>
                      part === month.heroEmphasis ? (
                        <span key={i} className="text-white">
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      ),
                    )
                : month.heroSubtitle}
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.18 }}
              className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {month.metaChips.map((it) => (
                <div
                  key={it.k}
                  className="flex min-h-[96px] flex-col justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] p-4"
                >
                  <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                    {it.k}
                  </div>
                  <div className="mt-2.5 flex min-h-[32px] items-center">
                    {it.k === "Plataforma" ? (
                      <img
                        src={googleAdsLogo}
                        alt="Google Ads"
                        className="h-7 w-auto object-contain opacity-90"
                      />
                    ) : (
                      <div className="text-[13px] font-semibold leading-snug tracking-tight text-white">
                        {it.v}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            className="flex w-full items-center justify-center md:col-span-5"
          >
            <div className="relative w-full max-w-[280px] overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-2.5 shadow-2xl shadow-black/40 backdrop-blur-sm">
              <div className="relative flex min-h-[540px] w-full items-center justify-center md:min-h-[580px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={slide}
                    src={carouselImages[slide]}
                    alt={`Anúncio ${company.name}`}
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02, y: -10 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 h-full w-full rounded-[22px] object-cover"
                  />
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visão geral */}
      <ReportSection
        eyebrow={`${next()} · Visão Geral`}
        title={
          <>
            Resumo do período <Soft>em números</Soft>
          </>
        }
        intro={month.overviewIntro}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {month.kpis.map((kpi, i) => {
            const Icon = kpiIcons[kpi.label as keyof typeof kpiIcons] ?? Eye;
            return (
              <ReportMetricCard
                key={kpi.label}
                value={kpi.value}
                label={kpi.label}
                description={kpi.description}
                icon={<Icon className="h-5 w-5" />}
                accent={kpi.accent}
                index={i}
              />
            );
          })}
        </div>

        {month.campaignsNote ? (
          <motion.div
            {...fadeUp}
            className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 md:p-6"
          >
            <Layers className="mt-0.5 h-5 w-5 shrink-0 text-[#8ab4f8]" />
            <p className="text-sm leading-relaxed text-white/55">
              <span className="font-medium text-white">Duas campanhas ativas:</span>{" "}
              {month.campaignsNote.replace(/^Duas campanhas ativas:\s*/i, "")}
            </p>
          </motion.div>
        ) : null}

        {month.overviewHighlight ? (
          <motion.div
            {...fadeUp}
            className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 md:p-6"
          >
            <p className="text-sm leading-relaxed text-white/55">{month.overviewHighlight}</p>
          </motion.div>
        ) : null}

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="mt-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03]"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
            <div className="flex items-center gap-2 text-xs text-white/45">
              <img src={googleAdsLogo} alt="" className="h-4 w-auto" />
              <span>Painel oficial · Google Ads</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
              {month.dashboardPeriodLabel}
            </span>
          </div>
          <img
            src={dashboards[month.dashboardImage]}
            alt={`Painel Google Ads — ${month.monthLabel}`}
            className="w-full"
          />
        </motion.div>
      </ReportSection>

      {/* Trabalho da agência */}
      {month.agencyWork ? (
        <ReportSection
          eyebrow={`${next()} · Gestão`}
          title={
            <>
              O que foi feito <Soft>neste ciclo</Soft>
            </>
          }
          intro={month.agencyWork.intro}
          elevated
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {month.agencyWork.items.map((item, i) => (
              <motion.div
                key={item}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <Wrench className="h-4 w-4" />
                </div>
                <p className="text-sm leading-relaxed text-white/70">{item}</p>
              </motion.div>
            ))}
          </div>
        </ReportSection>
      ) : null}

      {/* Campanhas */}
      {month.campaigns && month.campaigns.length > 0 ? (
        <ReportSection
          eyebrow={`${next()} · Campanhas`}
          title={
            <>
              Resultados <Soft>por campanha</Soft>
            </>
          }
          intro={month.campaignsIntro}
          elevated={!month.agencyWork}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {month.campaigns.map((c, i) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                totalCost={month.comparison?.current.cost ?? totalCost}
                index={i}
              />
            ))}
          </div>
          {month.campaignsInsight ? (
            <motion.div
              {...fadeUp}
              className="mt-8 rounded-2xl border border-brand/25 bg-brand/[0.08] p-6 md:p-8"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-brand">
                <Sparkles className="h-3.5 w-3.5" />
                Insight
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
                {month.campaignsInsight}
              </p>
            </motion.div>
          ) : null}
        </ReportSection>
      ) : null}

      {/* Comparativo */}
      {month.comparison ? (
        <ReportSection
          eyebrow={`${next()} · Comparativo`}
          title={
            <>
              {month.comparison.leftLabel} <Soft>vs. {month.comparison.rightLabel}</Soft>
            </>
          }
          intro={month.comparison.intro}
        >
          <motion.div
            {...fadeUp}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8"
          >
            <div className="hidden border-b border-white/[0.06] pb-3 sm:grid sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:gap-6">
              <div className="text-[10px] uppercase tracking-[0.14em] text-white/35">Métrica</div>
              <div className="text-right text-[10px] uppercase tracking-[0.14em] text-white/35">
                {month.comparison.leftLabel}
              </div>
              <div className="text-right text-[10px] uppercase tracking-[0.14em] text-white/35">
                {month.comparison.rightLabel}
              </div>
              <div className="text-right text-[10px] uppercase tracking-[0.14em] text-white/35">
                Variação
              </div>
            </div>
            <ComparisonRow
              label="Impressões"
              prev={month.comparison.prev.impressions}
              curr={month.comparison.current.impressions}
              leftLabel={month.comparison.leftLabel}
              rightLabel={month.comparison.rightLabel}
              format={formatInt}
            />
            <ComparisonRow
              label="Cliques"
              prev={month.comparison.prev.clicks}
              curr={month.comparison.current.clicks}
              leftLabel={month.comparison.leftLabel}
              rightLabel={month.comparison.rightLabel}
              format={formatInt}
            />
            <ComparisonRow
              label="Mensagens WhatsApp"
              prev={month.comparison.prev.conversions}
              curr={month.comparison.current.conversions}
              leftLabel={month.comparison.leftLabel}
              rightLabel={month.comparison.rightLabel}
              format={(n) => String(n)}
            />
            <ComparisonRow
              label="Investimento em mídia"
              prev={month.comparison.prev.cost}
              curr={month.comparison.current.cost}
              leftLabel={month.comparison.leftLabel}
              rightLabel={month.comparison.rightLabel}
              format={formatBRL}
            />
            <ComparisonRow
              label="CPC médio"
              prev={month.comparison.prev.cpc}
              curr={month.comparison.current.cpc}
              leftLabel={month.comparison.leftLabel}
              rightLabel={month.comparison.rightLabel}
              format={formatBRL}
              invertGood
            />
            {month.comparison.prev.costPerConv != null &&
              month.comparison.current.costPerConv != null && (
                <ComparisonRow
                  label="Custo por mensagem"
                  prev={month.comparison.prev.costPerConv}
                  curr={month.comparison.current.costPerConv}
                  leftLabel={month.comparison.leftLabel}
                  rightLabel={month.comparison.rightLabel}
                  format={formatBRL}
                  invertGood
                />
              )}
          </motion.div>
          {month.comparison.warning ? (
            <motion.div
              {...fadeUp}
              className="mt-6 flex items-start gap-4 rounded-2xl border border-brand/30 bg-brand/[0.08] p-5 md:p-6"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <p className="text-sm leading-relaxed text-white/80">{month.comparison.warning}</p>
            </motion.div>
          ) : null}
        </ReportSection>
      ) : null}

      {/* Investimento */}
      <ReportSection
        eyebrow={`${next()} · Investimento`}
        title={
          <>
            Como o investimento <Soft>foi feito</Soft>
          </>
        }
        intro={month.investment.intro}
        elevated
      >
        <div className="grid gap-8 lg:grid-cols-5">
          <motion.div
            {...fadeUp}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8 lg:col-span-3"
          >
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                  Custo em mídia
                </div>
                <div className="font-display text-5xl tracking-tight text-white md:text-6xl">
                  {month.investment.mediaCostDisplay}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">Período</div>
                <div className="text-sm text-white/80">{month.investment.daysLabel}</div>
              </div>
            </div>
            <div className="mt-10 space-y-7">
              {month.investment.bars.map((bar) => (
                <div key={bar.label}>
                  <div className="flex items-baseline justify-between">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        bar.muted ? "text-white/45" : "text-white",
                      )}
                    >
                      {bar.label}
                    </div>
                    <div
                      className={cn(
                        "text-sm font-semibold tabular-nums",
                        bar.muted ? "text-white/45" : "text-white",
                      )}
                    >
                      {bar.value}
                    </div>
                  </div>
                  <div className="mt-3 h-3 w-full rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      style={{ width: `${bar.pct}%`, transformOrigin: "left" }}
                      className={cn(
                        "h-full rounded-full",
                        bar.muted ? "bg-emerald-500/40" : "bg-[#4285F4]",
                      )}
                    />
                  </div>
                  <div className="mt-2 text-xs text-white/40">{bar.note}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-4 lg:col-span-2">
            {month.investment.sideNotes.map((note, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6"
              >
                <p className="text-sm leading-relaxed text-white/55">{note}</p>
              </motion.div>
            ))}
            {month.investment.proofText ? (
              <motion.div
                {...fadeUp}
                className="rounded-2xl border border-white/15 bg-white p-6 text-[#090909]"
              >
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-black/50">
                  <Sparkles className="h-3.5 w-3.5" />
                  {month.investment.proofTitle ?? "Insight"}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-black/75">
                  {month.investment.proofText}
                </p>
              </motion.div>
            ) : null}
          </div>
        </div>
      </ReportSection>

      {/* Alcance */}
      <ReportSection
        eyebrow={`${next()} · Alcance`}
        title={
          <>
            O {company.name} apareceu{" "}
            <span className="tabular-nums text-[#8ab4f8]">{month.reach.highlightNumber}</span> vezes
            no Google
          </>
        }
        intro={month.reach.intro}
      >
        <div className="grid gap-5 md:grid-cols-3">
          {month.reach.cards.map((c, i) => {
            const Icon = reportIconMap[c.iconKey];
            return (
              <motion.div
                key={c.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4285F4]/15 text-[#8ab4f8]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{c.text}</p>
              </motion.div>
            );
          })}
        </div>
      </ReportSection>

      {/* Cliques */}
      <ReportSection
        eyebrow={`${next()} · Cliques e Resultados`}
        title={
          <>
            <span className="tabular-nums text-[#f28b82]">{month.clicks.highlightNumber}</span>{" "}
            {month.clicks.titleAfter}
          </>
        }
        intro={month.clicks.intro}
        elevated
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            {...fadeUp}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8"
          >
            <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-white/40">
              Caminho percorrido
            </h3>
            <div className="mt-8 space-y-5">
              {month.clicks.funnel.map((step, i) => {
                const pct =
                  step.value === step.max ? 100 : Math.max((step.value / step.max) * 100, 4);
                const a = accentClass[step.accent];
                return (
                  <div key={step.label}>
                    <div className="flex items-baseline justify-between">
                      <div className="text-sm text-white/80">{step.label}</div>
                      <div className="text-sm font-semibold tabular-nums text-white">
                        {formatInt(step.value)}
                      </div>
                    </div>
                    <div className="mt-2 h-10 w-full overflow-hidden rounded-lg bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className={cn("h-full rounded-lg", a.bar)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                Custo por clique
              </div>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <div className="font-display text-5xl tracking-tight text-white md:text-6xl">
                  {month.clicks.cpcDisplay}
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                  {month.clicks.cpcBadge}
                </span>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-white/50">{month.clicks.cpcNote}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {month.clicks.miniStats.map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-center"
                >
                  <div className="font-display text-2xl text-white">{s.v}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/35">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </ReportSection>

      {/* Público */}
      <ReportSection
        eyebrow={`${next()} · Público`}
        title={
          <>
            Quem está vendo <Soft>os anúncios</Soft>
          </>
        }
        intro={month.audience.intro}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {month.audience.cards.map((c, i) => {
            const Icon = reportIconMap[c.iconKey];
            return (
              <motion.div
                key={c.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-white/80">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                    {c.title}
                  </div>
                </div>
                <div className="font-display mt-6 text-3xl text-white md:text-4xl">{c.big}</div>
                <p className="mt-4 text-sm leading-relaxed text-white/50">{c.text}</p>
              </motion.div>
            );
          })}
        </div>
      </ReportSection>

      {/* Funil */}
      <ReportSection
        eyebrow={`${next()} · Funil de Conversão`}
        title={
          <>
            Do anúncio <Soft>ao contato</Soft>
          </>
        }
        intro={month.funnel.intro}
        elevated
      >
        <motion.div
          {...fadeUp}
          className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-10"
        >
          <div
            className={cn(
              "grid grid-cols-1 items-stretch gap-3",
              month.funnel.steps.length === 4
                ? "md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]"
                : "md:grid-cols-[1fr_auto_1fr_auto_1fr]",
            )}
          >
            {month.funnel.steps.flatMap((step, i, arr) => {
              const node = (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex flex-col items-center rounded-2xl border border-white/[0.06] bg-black/25 p-5 text-center"
                >
                  <div className="font-display text-2xl tabular-nums text-white">{step.value}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/40">
                    {step.label}
                  </div>
                </motion.div>
              );
              if (i < arr.length - 1) {
                return [
                  node,
                  <div key={`arr-${i}`} className="flex items-center justify-center text-white/30">
                    <ArrowRight className="hidden h-5 w-5 md:block" />
                    <div className="h-6 w-px bg-white/10 md:hidden" />
                  </div>,
                ];
              }
              return [node];
            })}
          </div>
          <motion.div
            {...fadeUp}
            className="mt-10 rounded-2xl border border-white/[0.06] bg-black/25 p-5 md:p-6"
          >
            <h3 className="text-sm font-semibold text-white">{month.funnel.afterTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">{month.funnel.afterText}</p>
          </motion.div>
        </motion.div>
      </ReportSection>

      {/* Estratégia */}
      <ReportSection
        eyebrow={`${next()} · Estratégia`}
        title={
          <>
            {month.strategy.title} <Soft>{month.strategy.titleSoft}</Soft>
          </>
        }
        intro={month.strategy.intro}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-2xl border border-rose-500/20 bg-white/[0.03] p-6 md:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                  O que aconteceu
                </div>
                <h3 className="text-base font-semibold text-white">{month.strategy.badTitle}</h3>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {month.strategy.badItems.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-white/55">
                  <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.08 }}
            className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-white/[0.03] p-6 md:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                  O que funciona
                </div>
                <h3 className="text-base font-semibold text-white">{month.strategy.goodTitle}</h3>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {month.strategy.goodItems.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-white/55">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {month.strategy.extraText ? (
          <motion.div
            {...fadeUp}
            className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8"
          >
            {month.strategy.extraTitle ? (
              <h3 className="text-base font-semibold text-white">{month.strategy.extraTitle}</h3>
            ) : null}
            <p
              className={cn(
                "text-sm leading-relaxed text-white/55",
                month.strategy.extraTitle && "mt-3",
              )}
            >
              {month.strategy.extraText}
            </p>
          </motion.div>
        ) : null}
      </ReportSection>

      {/* Orçamento */}
      <ReportSection
        eyebrow={`${next()} · Orçamento`}
        title={
          <>
            Orçamento <Soft>e recomendação</Soft>
          </>
        }
        elevated
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {month.budget.cards.map((card, i) => (
            <motion.div
              key={card.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className={cn(
                "rounded-2xl border p-6 md:p-8",
                card.highlight
                  ? "border-white/15 bg-white text-[#090909]"
                  : "border-white/[0.06] bg-white/[0.03]",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-between text-[11px] uppercase tracking-[0.18em]",
                  card.highlight ? "text-black/50" : "text-white/35",
                )}
              >
                <span>{card.label}</span>
                {!card.highlight && card.suffix === "/sem" ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                ) : null}
              </div>
              <div
                className={cn(
                  "font-display mt-3 text-5xl tracking-tight",
                  card.highlight ? "text-[#090909]" : "text-white",
                )}
              >
                {card.value}
                {card.suffix ? (
                  <span
                    className={cn(
                      "text-2xl",
                      card.highlight ? "text-black/45" : "text-white/40",
                    )}
                  >
                    {card.suffix}
                  </span>
                ) : null}
              </div>
              <p
                className={cn(
                  "mt-4 text-sm leading-relaxed",
                  card.highlight ? "text-black/60" : "text-white/50",
                )}
              >
                {card.note}
              </p>
            </motion.div>
          ))}
        </div>
      </ReportSection>

      {/* Oportunidade (maio) */}
      {month.opportunity ? (
        <ReportSection
          eyebrow={`${next()} · Oportunidade`}
          title={
            <>
              <span className="text-emerald-400">{month.opportunity.highlight}</span>{" "}
              {month.opportunity.titleAfter}
            </>
          }
          intro={month.opportunity.intro}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              {...fadeUp}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                Meta de investimento
              </div>
              <div className="font-display mt-2 text-5xl text-white">
                {month.opportunity.investTarget}
              </div>
              <div className="mt-2 text-sm text-white/45">{month.opportunity.deadline}</div>
              <div className="mt-8 text-[11px] uppercase tracking-[0.18em] text-white/35">
                Recompensa
              </div>
              <div className="font-display mt-2 text-3xl text-emerald-400">
                {month.opportunity.bonus}
              </div>
              <div className="mt-8">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-white/45">Progresso</span>
                  <span className="font-semibold text-white">
                    {month.opportunity.progressDisplay}
                  </span>
                </div>
                <div className="mt-3 h-3 w-full rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      width: `${month.opportunity.progressPct}%`,
                      transformOrigin: "left",
                    }}
                    className="h-full rounded-full bg-emerald-500"
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-white/40">
                  <span>Já investido</span>
                  <span>
                    Faltam: <span className="text-rose-400">{month.opportunity.remaining}</span>
                  </span>
                </div>
              </div>
            </motion.div>
            <div className="grid gap-4">
              {month.opportunity.cards.map((c, i) => (
                <motion.div
                  key={c.label}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5"
                >
                  <div className="text-[11px] uppercase tracking-[0.14em] text-white/35">
                    {c.label}
                  </div>
                  <div className="mt-1 font-display text-2xl text-white">{c.value}</div>
                  <p className="mt-1 text-sm text-white/45">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <motion.div
              {...fadeUp}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6"
            >
              <h3 className="text-sm font-semibold text-white">{month.opportunity.howToTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {month.opportunity.howToText}
              </p>
            </motion.div>
            <motion.div
              {...fadeUp}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6"
            >
              <h3 className="text-sm font-semibold text-white">{month.opportunity.creditsTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {month.opportunity.creditsText}
              </p>
            </motion.div>
          </div>
        </ReportSection>
      ) : null}

      {/* Conclusão */}
      <ReportSection
        eyebrow={`${next()} · Conclusão`}
        title={
          <>
            {month.conclusion.title} <Soft>{month.conclusion.titleSoft}</Soft>
          </>
        }
        intro={month.conclusion.intro}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {month.conclusion.items.map((s, i) => (
            <motion.div
              key={s.n}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-3xl text-white/25">{s.n}</span>
                <ArrowUpRight className="h-4 w-4 text-white/35 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">{s.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.blockquote
          {...fadeUp}
          className="mt-14 rounded-3xl border border-white/15 bg-white p-8 text-[#090909] md:p-14"
        >
          <Sparkles className="h-6 w-6 text-black/40" />
          <p className="font-display mt-6 text-2xl leading-[1.15] md:text-4xl">
            “{month.conclusion.quote.replace(/^["“]|["”]$/g, "")}”
          </p>
        </motion.blockquote>
      </ReportSection>

      <footer className="border-t border-white/[0.06] bg-black/40">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 md:flex-row md:items-center md:px-8">
          <div className="flex items-center gap-4">
            <Logo size="compact" />
            <span className="h-4 w-px bg-white/15" />
            <img src={company.logo} alt={company.name} className="h-6 w-auto opacity-80" />
            <span className="h-4 w-px bg-white/15" />
            <img
              src={googleAdsLogo}
              alt="Google Ads"
              className="h-4 w-auto opacity-50 grayscale"
            />
          </div>
          <div className="text-xs tracking-wide text-white/40">{month.footerLabel}</div>
        </div>
      </footer>
    </main>
  );
}
