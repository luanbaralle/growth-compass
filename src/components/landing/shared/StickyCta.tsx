import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface StickyCtaProps {
  label?: string;
  href?: string;
}

const SCROLL_THRESHOLD_PX = 80;

export function StickyCta({ label = "Diagnóstico gratuito", href = "#diagnostico" }: StickyCtaProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setHasScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const form = document.getElementById("diagnostico");
    if (!form) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFormInView(entry.isIntersecting),
      { threshold: 0.12 },
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  const visible = hasScrolled && !formInView;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border/40 bg-background/90 p-3 backdrop-blur-xl transition-transform duration-300 ease-out sm:hidden",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <a
        href={href}
        className="group flex w-full items-center justify-center gap-2 rounded-full border border-brand/25 bg-black px-5 py-3.5 text-sm font-semibold text-brand transition-colors hover:border-brand/40 hover:bg-black/90"
      >
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
