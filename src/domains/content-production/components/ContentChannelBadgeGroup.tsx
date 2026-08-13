import { ContentChannelBadge } from "@/domains/content-production/components/ContentChannelBadge";
import type { ContentChannel } from "@/domains/content-production/types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ContentChannelBadgeGroup({
  channels,
  size = "sm",
  maxVisible = 1,
  className,
}: {
  channels: ContentChannel[];
  size?: "sm" | "md";
  maxVisible?: number;
  className?: string;
}) {
  if (channels.length === 0) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  const visible = channels.slice(0, maxVisible);
  const overflow = channels.length - visible.length;

  const badges = (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {visible.map((channel) => (
        <ContentChannelBadge key={channel} channel={channel} size={size} />
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            "inline-flex items-center rounded-md font-medium ring-1 ring-inset",
            "bg-surface/50 text-muted-foreground ring-border/30 transition-colors",
            size === "sm" && "px-1.5 py-0.5 text-[10px]",
            size === "md" && "px-2 py-1 text-xs",
          )}
        >
          +{overflow}
        </span>
      )}
    </span>
  );

  if (overflow === 0) return badges;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-default">{badges}</span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="border border-border/40 bg-popover p-2 text-popover-foreground"
        >
          <div className="flex max-w-[220px] flex-wrap gap-1">
            {channels.map((channel) => (
              <ContentChannelBadge key={channel} channel={channel} size={size} />
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
