import { platformMockups } from "@/lib/projects/nobre-content";
import { cn } from "@/lib/utils";
import {
  Building2,
  Check,
  ClipboardList,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

type MockupView = "dashboard" | "pendencies" | "owner" | "property" | "settings";

const views: { id: MockupView; label: string; icon: LucideIcon }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "pendencies", label: "Pendências", icon: ClipboardList },
  { id: "owner", label: "Proprietário", icon: User },
  { id: "property", label: "Imóvel", icon: Building2 },
  { id: "settings", label: "Configurações", icon: Settings },
];

const badgeStyles: Record<string, string> = {
  Disponível: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  "Preço alterado": "bg-amber-50 text-amber-700 ring-amber-600/10",
  "Sem resposta": "bg-slate-100 text-slate-600 ring-slate-500/10",
  "Contato solicitado": "bg-blue-50 text-blue-700 ring-blue-600/10",
  "Em análise": "bg-violet-50 text-violet-700 ring-violet-600/10",
};

function MockBadge({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset",
        badgeStyles[label] ?? "bg-slate-100 text-slate-600 ring-slate-500/10",
      )}
    >
      {label}
    </span>
  );
}

function MockButton({
  label,
  variant = "secondary",
}: {
  label: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-3 py-1.5 text-[11px] font-medium",
        variant === "primary" ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700",
      )}
    >
      {label}
    </span>
  );
}

function ViewHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
      <p className="mt-0.5 text-[12px] text-slate-500">{subtitle}</p>
    </div>
  );
}

function DashboardView() {
  const { dashboard } = platformMockups;

  return (
    <div className="p-3 sm:p-5">
      <ViewHeader title={dashboard.title} subtitle={dashboard.subtitle} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {dashboard.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-3 sm:px-4 sm:py-4"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">{stat.label}</p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full min-w-[640px] text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                {dashboard.tableHeaders.map((header) => (
                  <th key={header} className="px-3 py-2.5 font-medium text-slate-500">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dashboard.rows.map((row) => (
                <tr key={row.owner} className="border-b border-slate-50 last:border-0">
                  <td className="px-3 py-2.5 font-medium text-slate-800">{row.owner}</td>
                  <td className="px-3 py-2.5 text-slate-600">{row.property}</td>
                  <td className="px-3 py-2.5">
                    <MockBadge label={row.status} />
                  </td>
                  <td className="px-3 py-2.5 text-slate-500">{row.lastContact}</td>
                  <td className="px-3 py-2.5 text-slate-600">{row.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Atividades recentes</p>
          <ul className="mt-3 space-y-2.5">
            {dashboard.activities.map((activity) => (
              <li key={activity} className="flex items-start gap-2 text-[11px] text-slate-600">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" strokeWidth={2} />
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PendenciesView() {
  const { pendencies } = platformMockups;

  return (
    <div className="space-y-3 p-4 sm:p-5">
      <ViewHeader title={pendencies.title} subtitle={pendencies.subtitle} />
      {pendencies.items.map((item) => (
        <div key={item.owner} className="rounded-lg border border-slate-100 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[14px] font-semibold text-slate-900">{item.owner}</p>
              <p className="mt-0.5 text-[12px] text-slate-500">{item.property}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium text-slate-700">{item.type}</p>
              {item.detail ? (
                <p className="mt-0.5 text-[13px] font-semibold text-slate-900">{item.detail}</p>
              ) : null}
            </div>
          </div>
          <div className="mt-4 rounded-md border border-slate-100 bg-slate-50/80 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-400">Mensagem</p>
            <p className="mt-1 text-[12px] italic text-slate-600">&ldquo;{item.message}&rdquo;</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.actions.map((action, i) => (
              <MockButton key={action} label={action} variant={i === 0 ? "primary" : "secondary"} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function OwnerTimelineView() {
  const { ownerTimeline } = platformMockups;

  return (
    <div className="p-5 sm:p-6">
      <ViewHeader title={ownerTimeline.title} subtitle={ownerTimeline.owner} />
      <div className="space-y-0">
        {ownerTimeline.events.map((event, i) => (
          <div key={`${event.date}-${event.label}`} className="relative flex gap-4 pb-6 last:pb-0">
            <div className="flex w-12 shrink-0 flex-col items-center">
              <span className="text-[11px] font-mono text-slate-400">{event.date}</span>
              {i < ownerTimeline.events.length - 1 ? <div className="mt-2 w-px flex-1 bg-slate-200" /> : null}
            </div>
            <div className="relative min-w-0 flex-1 pt-0.5">
              <div className="absolute -left-[1.35rem] top-1.5 h-2 w-2 rounded-full border-2 border-white bg-blue-500 ring-1 ring-blue-500/20" />
              <p className="text-[13px] font-medium text-slate-800">{event.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropertyRecordView() {
  const { propertyRecord } = platformMockups;

  return (
    <div className="p-5 sm:p-6">
      <ViewHeader title={propertyRecord.title} subtitle="Ficha executiva do imóvel" />
      <div className="grid gap-4 sm:grid-cols-2">
        {propertyRecord.fields.map((field) => (
          <div key={field.label} className="rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-400">{field.label}</p>
            <p className="mt-1.5 text-[13px] font-medium text-slate-800">{field.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 border-t border-slate-100 pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Linha do tempo</p>
        <div className="mt-4 space-y-3">
          {propertyRecord.timeline.map((event) => (
            <div key={event.label} className="flex items-center gap-3 text-[12px]">
              <span className="w-10 shrink-0 font-mono text-slate-400">{event.date}</span>
              <span className="h-px flex-1 bg-slate-100" />
              <span className="text-slate-600">{event.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  const { settings } = platformMockups;

  return (
    <div>
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <ViewHeader title={settings.title} subtitle="Parâmetros operacionais e integrações" />
      </div>
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="border-b border-slate-100 p-5 lg:border-b-0 lg:border-r">
          <p className="text-[12px] font-semibold text-slate-900">{settings.integrations.title}</p>
          <ul className="mt-4 space-y-3">
            {settings.integrations.items.map((item) => (
              <li key={item} className="flex items-center gap-2.5 rounded-lg border border-slate-100 px-3 py-2.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2} />
                <span className="text-[13px] font-medium text-slate-700">{item}</span>
                <span className="ml-auto h-5 w-9 rounded-full bg-emerald-500/90 p-0.5">
                  <span className="block h-4 w-4 translate-x-4 rounded-full bg-white shadow-sm" />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5">
          <p className="text-[12px] font-semibold text-slate-900">{settings.operational.title}</p>
          <div className="mt-4 space-y-3">
            {settings.operational.fields.map((field) => (
                <div
                  key={field.label}
                  className="flex flex-col gap-2 rounded-lg border border-slate-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <span className="text-[12px] text-slate-500">{field.label}</span>
                  <span className="w-fit rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[12px] font-medium text-slate-800">
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockupContent({ view }: { view: MockupView }) {
  const content: Record<MockupView, ReactNode> = {
    dashboard: <DashboardView />,
    pendencies: <PendenciesView />,
    owner: <OwnerTimelineView />,
    property: <PropertyRecordView />,
    settings: <SettingsView />,
  };

  return <div className="min-h-[340px] sm:min-h-[420px]">{content[view]}</div>;
}

export function PlatformMockupsSection() {
  const [activeView, setActiveView] = useState<MockupView>("dashboard");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-xl border border-white/[0.1] bg-[#eceff3] p-2 shadow-2xl shadow-black/30 sm:p-3">
        <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-[10px] font-bold text-white">
                N
              </div>
              <span className="text-[12px] font-medium text-slate-800 sm:text-[13px]">Nobre Operacional</span>
            </div>
            <div className="-mx-1 flex items-center gap-1 overflow-x-auto px-1 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {views.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveView(item.id)}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-[10px] font-medium transition-colors sm:gap-1.5 sm:px-2.5 sm:text-[11px]",
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-400 hover:bg-slate-50 hover:text-slate-700",
                    )}
                  >
                    <Icon className="h-3 w-3" strokeWidth={1.75} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <MockupContent view={activeView} />
        </div>
      </div>

      <p className="mt-4 text-center text-[12px] leading-relaxed text-white/35">{platformMockups.disclaimer}</p>
    </div>
  );
}
