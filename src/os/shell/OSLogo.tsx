import { Logo, type LogoSize } from "@/components/landing/shared/Logo";
import { cn } from "@/lib/utils";

export function OSLogo({
  className,
  variant = "sidebar",
}: {
  className?: string;
  variant?: "sidebar" | "mobile";
}) {
  const size: LogoSize = variant === "mobile" ? "nav" : "sidebar";

  return <Logo variant="horizontal" size={size} className={cn(className)} />;
}
