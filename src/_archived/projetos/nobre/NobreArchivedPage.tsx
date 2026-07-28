import { Link } from "@tanstack/react-router";
import { Footer } from "@/components/landing/shared/Footer";
import { Nav } from "@/components/landing/shared/Nav";
import { Archive } from "lucide-react";

export function NobreArchivedPage() {
  return (
    <div className="min-h-screen bg-[#090909] text-white antialiased">
      <Nav homeHref="/" ctaHref="/diagnostico" ctaLabel="Diagnóstico gratuito" />

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">
          <Archive className="h-4 w-4" strokeWidth={2} />
          Arquivado
        </span>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight sm:text-3xl">Página arquivada</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/55">
          Esta proposta comercial não está mais disponível.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/25 hover:text-white"
        >
          Voltar ao site
        </Link>
      </main>

      <Footer />
    </div>
  );
}
