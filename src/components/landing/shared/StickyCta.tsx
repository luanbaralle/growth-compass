import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface StickyCtaProps {
  label?: string;
  href?: string;
}

export function StickyCta({ label = "Diagnóstico gratuito", href = "#diagnostico" }: StickyCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById("diagnostico");
    if (!form) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/95 p-3 backdrop-blur-xl sm:hidden">
      <a
        href={href}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand"
      >
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
