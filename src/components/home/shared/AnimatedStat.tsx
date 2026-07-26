import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

interface AnimatedStatProps {
  value: string;
  label: string;
  className?: string;
  compact?: boolean;
}

export function AnimatedStat({ value, label, className, compact }: AnimatedStatProps) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
    >
      <p
        className={cn(
          "font-bold tracking-tight text-brand",
          compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl",
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "mt-1 text-muted-foreground",
          compact ? "text-xs sm:text-sm" : "text-sm",
        )}
      >
        {label}
      </p>
    </div>
  );
}
