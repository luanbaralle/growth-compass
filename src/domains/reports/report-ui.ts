import {
  Calendar,
  MapPin,
  PauseCircle,
  Scissors,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReportAccent, ReportIconKey } from "@/data/reports/types";

export const reportIconMap: Record<ReportIconKey, LucideIcon> = {
  target: Target,
  pause: PauseCircle,
  mapPin: MapPin,
  users: Users,
  calendar: Calendar,
  search: Search,
  trendingUp: TrendingUp,
  scissors: Scissors,
  sparkles: Sparkles,
};

export const accentClass: Record<
  ReportAccent,
  { text: string; soft: string; bar: string; dot: string }
> = {
  blue: {
    text: "text-[#8ab4f8]",
    soft: "bg-[#4285F4]/15",
    bar: "bg-[#4285F4]",
    dot: "bg-[#4285F4]",
  },
  red: {
    text: "text-[#f28b82]",
    soft: "bg-[#EA4335]/15",
    bar: "bg-[#EA4335]",
    dot: "bg-[#EA4335]",
  },
  yellow: {
    text: "text-[#fdd663]",
    soft: "bg-[#FBBC04]/15",
    bar: "bg-[#FBBC04]",
    dot: "bg-[#FBBC04]",
  },
  green: {
    text: "text-[#81c995]",
    soft: "bg-[#34A853]/15",
    bar: "bg-[#34A853]",
    dot: "bg-[#34A853]",
  },
};

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};
