import { cn } from "@/lib/utils";
import type { MarketingChannel } from "@/domains/marketing/types";
import { CHANNEL_LABELS, formatMoney, formatPercent } from "@/domains/marketing/types";

const channelStyles: Record<MarketingChannel, string> = {
  google_ads: "border-blue-400/40 text-blue-300 bg-blue-400/10",
  meta_ads: "border-violet-400/40 text-violet-300 bg-violet-400/10",
  landing_page: "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
  seo: "border-amber-400/40 text-amber-300 bg-amber-400/10",
  google_business: "border-cyan-400/40 text-cyan-300 bg-cyan-400/10",
};

export function MarketingChannelBadge({
  channel,
  className,
}: {
  channel: MarketingChannel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        channelStyles[channel],
        className,
      )}
    >
      {CHANNEL_LABELS[channel]}
    </span>
  );
}

export { formatMoney, formatPercent };
