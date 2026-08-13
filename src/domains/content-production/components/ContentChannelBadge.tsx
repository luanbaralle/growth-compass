import type { ContentChannel } from "@/domains/content-production/types";
import { CHANNEL_BADGE, CHANNEL_DOT, CHANNEL_LABELS } from "@/domains/content-production/types";
import { cn } from "@/lib/utils";

export function ContentChannelBadge({
  channel,
  size = "sm",
  showDot = true,
  className,
}: {
  channel: ContentChannel;
  size?: "sm" | "md";
  showDot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-md font-medium ring-1 ring-inset",
        CHANNEL_BADGE[channel],
        size === "sm" && "px-1.5 py-0.5 text-[10px]",
        size === "md" && "px-2 py-1 text-xs",
        className,
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", CHANNEL_DOT[channel])} aria-hidden />
      )}
      <span className="truncate">{CHANNEL_LABELS[channel]}</span>
    </span>
  );
}
