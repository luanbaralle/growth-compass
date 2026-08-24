import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { accentClass, fadeUp } from "../report-ui";
import type { ReportAccent } from "@/data/reports/types";
import { cn } from "@/lib/utils";

export function ReportMetricCard({
  value,
  label,
  description,
  icon,
  accent,
  index = 0,
}: {
  value: string;
  label: string;
  description: string;
  icon: ReactNode;
  accent: ReportAccent;
  index?: number;
}) {
  const a = accentClass[accent];
  return (
    <motion.div
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-7"
    >
      <div className={cn("absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl", a.soft)} />
      <div className="relative flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", a.soft, a.text)}>
          {icon}
        </div>
        <span className={cn("h-2 w-2 rounded-full", a.dot)} />
      </div>
      <div className="relative mt-8">
        <div className="font-display text-4xl tracking-tight text-white md:text-5xl">{value}</div>
        <div className="mt-2 text-sm font-medium text-white/90">{label}</div>
        <p className="mt-3 text-sm leading-relaxed text-white/50">{description}</p>
      </div>
    </motion.div>
  );
}
