import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/landing/shared/Logo";
import googleAdsLogo from "@/assets/reports/studio21/google-ads-logo.png";
import type { ReportCompany } from "@/data/reports/types";

export function ReportHub({ company }: { company: ReportCompany }) {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#090909] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        <div className="absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand/[0.12] blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-lg items-center justify-between px-5 py-4">
          <Logo size="nav" />
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/35">Relatórios</span>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full max-w-md flex-col items-center text-center"
        >
          <div className="flex items-center gap-5">
            <img src={company.logo} alt={company.name} className="h-10 w-auto md:h-12" />
            <span className="h-8 w-px bg-white/15" />
            <img src={googleAdsLogo} alt="Google Ads" className="h-8 w-auto opacity-90 md:h-9" />
          </div>

          <p className="mt-10 text-[11px] uppercase tracking-[0.22em] text-white/40">
            Relatórios de Performance
          </p>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-white md:text-4xl">
            {company.name}
          </h1>
          <p className="mt-2 text-sm text-white/45">{company.legalName}</p>

          <nav className="mt-10 w-full space-y-3">
            {company.months.map((report, i) => (
              <motion.div
                key={report.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  to="/relatorios/$empresa/$mes"
                  params={{ empresa: company.slug, mes: report.slug }}
                  className="group flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 backdrop-blur-sm transition-colors hover:border-brand/40 hover:bg-white/[0.06]"
                >
                  <div className="text-left">
                    <div className="text-base font-semibold text-white">{report.monthLabel}</div>
                    <div className="mt-0.5 text-xs text-white/45">
                      {report.cycleLabel} · {report.period}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/35 transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      </div>
    </main>
  );
}
