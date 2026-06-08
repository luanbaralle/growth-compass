import type { CSSProperties, ReactNode } from "react";

interface SegmentThemeProps {
  accentColor: string;
  accentSoft: string;
  children: ReactNode;
}

/** Aplica cor secundária da vertical sem alterar identidade Raise One (laranja) */
export function SegmentTheme({ accentColor, accentSoft, children }: SegmentThemeProps) {
  const style = {
    "--segment-accent": accentColor,
    "--segment-accent-soft": accentSoft,
  } as CSSProperties;

  return (
    <div
      className="segment-themed min-h-screen bg-background text-foreground antialiased"
      style={style}
    >
      {children}
    </div>
  );
}
