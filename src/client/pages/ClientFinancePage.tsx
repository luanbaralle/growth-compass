import { ClientEmptyState } from "@/client/components/ClientEmptyState";
import { ClientPageHeader } from "@/client/components/ClientPageHeader";
import { ClientPageSkeleton } from "@/client/components/ClientPageSkeleton";
import { ClientSection } from "@/client/components/ClientSection";
import { getClientFinanceOverview } from "@/client/finance.functions";
import { formatMoney } from "@/domains/finance/types";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { CreditCard, History, TrendingUp, Wallet } from "lucide-react";

const STATUS_STYLES = {
  ok: "client-status-chip-emerald",
  warning: "client-status-chip-amber",
  critical: "client-status-chip-amber",
} as const;

export function ClientFinanceiroPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["client-finance"],
    queryFn: () => getClientFinanceOverview(),
  });

  if (isLoading) {
    return <ClientPageSkeleton />;
  }

  if (!data) {
    return (
      <ClientEmptyState
        icon={Wallet}
        title="Não foi possível carregar"
        description="Tente atualizar a página. Se o problema persistir, fale com a Raise One."
      />
    );
  }

  return (
    <div className="client-page space-y-6">
      <ClientPageHeader
        eyebrow="Transparência financeira"
        title="Financeiro"
        description="Sua assinatura, investimento em mídia e histórico de pagamentos."
      />

      <ClientSection title="Minha assinatura" icon={CreditCard}>
        {data.subscription ? (
          <div className="space-y-4">
            <div>
              <p className="text-base font-semibold">{data.subscription.label}</p>
              <p className="client-kpi-value mt-1">
                {formatMoney(data.subscription.amountCents)}
                <span className="ml-1 text-sm font-normal text-muted-foreground">/ mês</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {data.subscription.nextDueDateLabel && (
                <span className="text-muted-foreground">
                  Próxima cobrança:{" "}
                  <strong className="text-foreground">{data.subscription.nextDueDateLabel}</strong>
                </span>
              )}
              <span className={cn("client-status-chip", STATUS_STYLES[data.subscription.statusTone])}>
                {data.subscription.statusLabel}
              </span>
            </div>
          </div>
        ) : (
          <ClientEmptyState
            compact
            icon={CreditCard}
            title="Assinatura em preparação"
            description="A Raise One atualiza assim que houver dados de mensalidade cadastrados."
          />
        )}
      </ClientSection>

      <ClientSection title="Investimento em mídia" icon={TrendingUp}>
        <p className="-mt-2 mb-3 text-xs capitalize text-muted-foreground">
          {data.mediaInvestment.periodLabel}
        </p>

        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between gap-3 border-b border-border/40 py-2.5">
            <span className="text-muted-foreground">Google Ads</span>
            <span className="font-semibold tabular-nums">
              {data.mediaInvestment.googleAdsCents > 0
                ? formatMoney(data.mediaInvestment.googleAdsCents)
                : "—"}
            </span>
          </li>
          <li className="flex items-center justify-between gap-3 border-b border-border/40 py-2.5">
            <span className="text-muted-foreground">Meta Ads</span>
            <span className="font-semibold tabular-nums">
              {data.mediaInvestment.metaAdsCents > 0
                ? formatMoney(data.mediaInvestment.metaAdsCents)
                : "—"}
            </span>
          </li>
          <li className="flex items-center justify-between gap-3 pt-1">
            <span className="font-medium">Total</span>
            <span className="client-work-value text-base">
              {data.mediaInvestment.totalCents > 0
                ? formatMoney(data.mediaInvestment.totalCents)
                : "—"}
            </span>
          </li>
        </ul>

        {data.mediaInvestment.totalCents === 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            Investimentos de mídia aparecem aqui quando registrados no painel de marketing.
          </p>
        )}
      </ClientSection>

      <ClientSection title="Histórico" icon={History}>
        {data.history.length === 0 ? (
          <ClientEmptyState
            compact
            icon={History}
            title="Nenhum pagamento registrado"
            description="Quando houver cobranças processadas, elas aparecem nesta lista."
          />
        ) : (
          <ul className="divide-y divide-border/40">
            {data.history.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-semibold">{item.periodLabel}</p>
                  {item.description !== item.periodLabel && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums">{formatMoney(item.amountCents)}</p>
                  <p
                    className={cn(
                      "text-xs font-medium",
                      item.status === "paid"
                        ? "text-emerald-400"
                        : item.status === "overdue"
                          ? "text-rose-400"
                          : "text-muted-foreground",
                    )}
                  >
                    {item.statusLabel}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ClientSection>
    </div>
  );
}
