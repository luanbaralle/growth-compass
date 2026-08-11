import logoHorizontal from "@/assets/raise-one-logo-horizontal.png";
import logoVertical from "@/assets/raise-one-logo-vertical.png";
import { cn } from "@/lib/utils";

export type LogoVariant = "horizontal" | "vertical";
export type LogoSize = "nav" | "footer" | "login" | "loginHero" | "sidebar" | "compact";

const LOGO_SRC: Record<LogoVariant, string> = {
  horizontal: logoHorizontal,
  vertical: logoVertical,
};

export function Logo({
  variant = "horizontal",
  size,
  className,
}: {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}) {
  const resolvedSize =
    size ?? (variant === "vertical" ? "compact" : "nav");

  return (
    <span
      className={cn(
        "brand-logo-wrap",
        variant === "horizontal" ? "brand-logo-wrap-horizontal" : "brand-logo-wrap-vertical",
        `brand-logo-size-${resolvedSize}`,
        className,
      )}
    >
      <img
        src={LOGO_SRC[variant]}
        alt="Raise One"
        className="brand-logo-image"
      />
    </span>
  );
}
