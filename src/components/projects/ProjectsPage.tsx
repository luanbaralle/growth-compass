import { Footer } from "@/components/landing/shared/Footer";
import { Nav } from "@/components/landing/shared/Nav";
import { captureUtmFromUrl } from "@/lib/utm";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Blocks,
  Building2,
  CalendarClock,
  ChartColumn,
  CheckCircle2,
  CheckSquare,
  Clapperboard,
  Clock3,
  Compass,
  FileSpreadsheet,
  Image,
  Layers3,
  LoaderCircle,
  MessageCircleMore,
  MoveRight,
  Rocket,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
} from "lucide-react";
import { Fragment, useEffect, type ReactNode } from "react";

type StageStatus = "done" | "active" | "todo";

interface StageItem {
  title: string;
  description: string;
  status: StageStatus;
}

interface Pillar {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface BoardColumn {
  title: string;
  description: string;
  items: string[];
}

interface FlowStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface AssetGroup {
  title: string;
  items: string[];
  note?: string;
}

interface AssetChecklistItem {
  label: string;
  status: "done" | "pending";
}

interface EssentialDeliverable {
  title: string;
  description: string;
  icon: LucideIcon;
}

const displayFont = {
  fontFamily: '"Cormorant Garamond", "Times New Roman", serif',
} as const;

const sectionShellClass = "mx-auto max-w-7xl px-5 sm:px-8";
const surfaceCardClass =
  "rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_80px_-48px_rgba(0,0,0,0.85)] backdrop-blur-sm";
const insetCardClass = "rounded-[1.4rem] border border-white/10 bg-[#0b0b0c]/90";
const chipClass =
  "rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/74";

const quickLinks = [
  { label: "Timeline", href: "#timeline" },
  { label: "Direcao", href: "#direcao" },
  { label: "Pilares", href: "#pilares" },
  { label: "Escopo", href: "#escopo" },
  { label: "Assets", href: "#assets" },
  { label: "Arquitetura", href: "#arquitetura" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Proximos passos", href: "#proximos-passos" },
];

const timeline: StageItem[] = [
  {
    title: "Kickoff",
    description: "Alinhamento estrategico concluido e projeto oficialmente iniciado.",
    status: "done",
  },
  {
    title: "Planejamento",
    description: "Consolidacao de escopo, materiais e prioridades imediatas.",
    status: "active",
  },
  {
    title: "Arquitetura",
    description: "Estruturacao da jornada, paginas e fluxos de conversao.",
    status: "todo",
  },
  {
    title: "Design",
    description: "Direcao visual premium baseada na autoridade da Frizon.",
    status: "todo",
  },
  {
    title: "Desenvolvimento",
    description: "Construcao da plataforma, componentes e paginas principais.",
    status: "todo",
  },
  {
    title: "Conteudo",
    description: "Organizacao editorial, provas sociais e argumentos comerciais.",
    status: "todo",
  },
  {
    title: "Google Ads",
    description: "Preparacao de tracking, campanhas e estrutura de aquisicao.",
    status: "todo",
  },
  {
    title: "Lancamento",
    description: "Publicacao da plataforma e ativacao operacional.",
    status: "todo",
  },
];

const projectMilestones: StageItem[] = [
  {
    title: "Kickoff realizado",
    description: "Definicoes centrais mapeadas com objetivo de aquisicao claro.",
    status: "done",
  },
  {
    title: "Planejamento e arquitetura em andamento",
    description: "Escopo inicial e estrutura da plataforma sendo consolidados.",
    status: "active",
  },
  {
    title: "Wireframe aprovado",
    description: "Validacao da experiencia principal antes do design final.",
    status: "todo",
  },
  {
    title: "Design concluido",
    description: "Camada visual premium pronta para a etapa de build.",
    status: "todo",
  },
  {
    title: "Desenvolvimento iniciado",
    description: "Estrutura principal publicada em ambiente interno.",
    status: "todo",
  },
  {
    title: "Google Analytics configurado",
    description: "Base de mensuracao habilitada para jornada e campanhas.",
    status: "todo",
  },
  {
    title: "Primeiras campanhas no ar",
    description: "Google Search e PMax operando com tracking validado.",
    status: "todo",
  },
  {
    title: "Primeiro lead gerado",
    description: "Conversao inicial registrada pela maquina de aquisicao.",
    status: "todo",
  },
  {
    title: "Primeira venda",
    description: "Fechamento atribuido a operacao digital construida.",
    status: "todo",
  },
];

const pillars: Pillar[] = [
  {
    title: "Posicionamento",
    description: "Transformar Gabriel na principal referencia em empreendimentos Frizon.",
    icon: Building2,
  },
  {
    title: "Geracao de Leads",
    description: "Construir uma maquina previsivel de aquisicao atraves do Google.",
    icon: ChartColumn,
  },
  {
    title: "Experiencia Premium",
    description: "Criar uma experiencia acima do padrao do mercado imobiliario regional.",
    icon: Sparkles,
  },
  {
    title: "Escalabilidade",
    description: "Preparar toda a estrutura para crescer junto com o investimento.",
    icon: Layers3,
  },
];

const strategicGoals = [
  "Posicionar Gabriel como referencia em empreendimentos Frizon.",
  "Utilizar a autoridade da Frizon como prova de credibilidade.",
  "Criar uma experiencia superior ao site institucional da construtora.",
  "Captar leads altamente qualificados.",
  "Preparar uma estrutura escalavel para futuras campanhas.",
  "Construir base solida para SEO e trafego pago.",
];

const scopeItems = [
  "Home Premium",
  "Pagina Gabriel",
  "Pagina Frizon",
  "5 paginas de empreendimentos",
  "CTA WhatsApp",
  "SEO tecnico",
  "Google Analytics 4",
  "Google Tag Manager",
];

const assetsMapped: AssetGroup[] = [
  {
    title: "Empreendimentos",
    items: [
      "Revista digital dos 5 empreendimentos",
      "Renders 3D",
      "Plantas",
      "Logos dos empreendimentos",
      "Fotos institucionais",
      "Localizacao e ficha tecnica",
      "Informacoes completas dos empreendimentos",
      "Material utilizado atualmente pela Frizon",
    ],
  },
  {
    title: "Prova social",
    items: ["Fotos de entregas de chave", "Fotos do Gabriel com premiacoes"],
  },
  {
    title: "Gabriel",
    items: ["Varias fotos profissionais", "CRECI"],
  },
  {
    title: "Autoridade",
    items: [
      "Mais de R$ 30 milhoes em apartamentos vendidos em Itanhaem e Mongagua",
      "Exclusivo Frizon Construtora",
    ],
  },
  {
    title: "Marca Frizon",
    items: ["Identidade visual consolidada", "Logo", "Cores", "Material institucional"],
  },
  {
    title: "Drive compartilhado",
    items: ["Drive com informacoes complementares em validacao de acesso"],
  },
];

const assetsRequested: AssetGroup[] = [
  {
    title: "Gabriel",
    items: [
      "Foto profissional em alta resolucao",
      "Outras fotos (atendimento, stand, etc.)",
      "Video de apresentacao",
      "Mini biografia",
      "Redes sociais",
      "WhatsApp",
      "E-mail",
    ],
  },
  {
    title: "Autoridade",
    items: [
      "Premiacoes",
      "Certificados",
      "Numero de clientes",
      "Numero de apartamentos vendidos",
      "Tempo de mercado",
    ],
  },
  {
    title: "Frizon",
    items: [
      "Resumo institucional",
      "Ano de fundacao",
      "Diferenciais",
      "Quantidade de empreendimentos entregues",
      "Quantidade em construcao",
    ],
  },
  {
    title: "Empreendimentos",
    note: "Para cada um dos 5 empreendimentos.",
    items: [
      "Descricao completa",
      "Bairro",
      "Cidade",
      "Status",
      "Preco inicial",
      "Area",
      "Dormitorios",
      "Suites",
      "Vagas",
      "Diferenciais",
      "Area de lazer",
      "Localizacao",
      "Memorial descritivo",
      "PDF comercial",
      "Link Google Maps",
    ],
  },
];

const highImpactAssets: AssetGroup[] = [
  {
    title: "Gabriel",
    items: ["Video apresentando quem ele e (1 minuto)."],
  },
  {
    title: "Cliente",
    items: ['Videos rapidos de depoimento, como "Comprei meu apartamento com o Gabriel..."'],
  },
  {
    title: "Bastidores",
    items: ["Stand", "Apartamento decorado", "Obras", "Atendimento"],
  },
  {
    title: "Drone",
    items: ["Mais imagens aereas. Quanto mais, melhor."],
  },
  {
    title: "Lifestyle",
    items: [
      "Praias",
      "Calcadao",
      "Familias",
      "Por do sol",
      "Ciclovia",
      "Quiosques",
      "Esportes",
      "Litoral",
    ],
  },
];

const assetChecklist: AssetChecklistItem[] = [
  { label: "Logo Frizon", status: "done" },
  { label: "Fotos Gabriel", status: "done" },
  { label: "CRECI", status: "done" },
  { label: "Mini Bio", status: "pending" },
  { label: "WhatsApp", status: "pending" },
  { label: "Instagram", status: "done" },
  { label: "Fotos/Videos drone", status: "pending" },
  { label: "Renders", status: "done" },
  { label: "Plantas", status: "done" },
  { label: "PDFs Comerciais", status: "pending" },
  { label: "Videos Entrega de Chaves", status: "pending" },
  { label: "Depoimentos", status: "pending" },
  { label: "Premiacoes", status: "done" },
  { label: "Material Institucional Frizon", status: "done" },
  { label: "Informacoes completas dos 5 empreendimentos", status: "done" },
];

const essentialDeliverables: EssentialDeliverable[] = [
  {
    title: "Video institucional do Gabriel",
    description:
      "Video de 60-90 segundos contando historia, diferenciais e compromisso com o cliente para servir como principal ancora da secao de autoridade.",
    icon: Clapperboard,
  },
  {
    title: "Fotos profissionais ineditas em contexto real",
    description:
      "Fotos no stand, apartamento decorado, obra, atendimento e vista para o mar para dar identidade propria ao projeto, sem parecer apenas uma extensao da Frizon.",
    icon: Image,
  },
  {
    title: "Planilha mestre dos empreendimentos",
    description:
      "Fonte unica de verdade com preco inicial, metragem, plantas, status da obra, diferenciais e materiais disponiveis para reduzir inconsistencias no site e nas campanhas.",
    icon: FileSpreadsheet,
  },
];

const audience = [
  "Segunda residencia",
  "Investidores",
  "Familias",
  "Aposentados",
  "Veranistas",
  "Imoveis de alto padrao proximos a praia",
];

const performanceStack = [
  "Google Search",
  "Performance Max",
  "Google Tag Manager",
  "Google Analytics 4",
  "SEO tecnico",
  "Indexacao individual dos empreendimentos",
];

const architectureFlow: FlowStep[] = [
  {
    title: "Google",
    description: "Captacao de demanda com intencao clara.",
    icon: ScanSearch,
  },
  {
    title: "Pagina inicial",
    description: "Primeiro contato com posicionamento e autoridade.",
    icon: Workflow,
  },
  {
    title: "Empreendimentos",
    description: "Curadoria da oferta e organizacao da navegacao.",
    icon: Workflow,
  },
  {
    title: "Pagina individual",
    description: "Argumentacao detalhada, prova visual e CTA direcionado.",
    icon: Workflow,
  },
  {
    title: "WhatsApp Gabriel",
    description: "Conversao principal conduzida sem friccao.",
    icon: MessageCircleMore,
  },
];

const roadmap: BoardColumn[] = [
  {
    title: "Planejamento",
    description: "Base estrategica do projeto.",
    items: ["Planejamento", "Pesquisa", "Arquitetura", "Wireframe"],
  },
  {
    title: "Desenvolvimento",
    description: "Estrutura e experiencia da plataforma.",
    items: ["Desenvolvimento", "Componentes", "Home", "Empreendimentos"],
  },
  {
    title: "Marketing",
    description: "Mensuracao e aquisicao desde o dia zero.",
    items: ["GTM", "GA4", "Search", "PMax"],
  },
  {
    title: "Futuro",
    description: "Expansao da maquina de crescimento.",
    items: ["Meta Ads", "Remarketing", "SEO", "Blog"],
  },
];

const nextSteps = [
  "Arquitetura da plataforma",
  "Coleta da identidade visual",
  "Curadoria dos materiais recebidos",
  "Validacao do drive compartilhado",
  "Desenvolvimento da estrutura principal",
];

const team = ["Raise One", "Luan", "Vinicius", "Caio"];

const heroStats = [
  { label: "Etapas mapeadas", value: "08" },
  { label: "Pilares estrategicos", value: "04" },
  { label: "Frentes do roadmap", value: "04" },
  { label: "Atualizacao", value: "03/07" },
];

function statusMeta(status: StageStatus) {
  if (status === "done") {
    return {
      label: "Concluido",
      icon: CheckCircle2,
      dot: "bg-emerald-400",
      panel:
        "border-emerald-400/25 bg-emerald-400/[0.08] shadow-[0_0_50px_-30px_rgba(52,211,153,0.55)]",
      badge: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    };
  }

  if (status === "active") {
    return {
      label: "Em andamento",
      icon: LoaderCircle,
      dot: "bg-amber-300",
      panel:
        "border-brand/25 bg-brand/[0.08] shadow-[0_0_50px_-30px_color-mix(in_oklch,var(--brand)_55%,transparent)]",
      badge: "border-brand/25 bg-brand/10 text-amber-100",
    };
  }

  return {
    label: "Aguardando",
    icon: Clock3,
    dot: "bg-white/30",
    panel: "border-white/10 bg-white/[0.03]",
    badge: "border-white/10 bg-white/[0.04] text-white/70",
  };
}

function SectionShell({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn(sectionShellClass, className)}>
      {children}
    </section>
  );
}

function SurfaceCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <article className={cn(surfaceCardClass, className)}>{children}</article>;
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand/80">{eyebrow}</p>
      <h2 className="mt-4 text-4xl leading-none text-white sm:text-5xl" style={displayFont}>
        {title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-white/68 sm:text-lg">{description}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.55rem] border border-white/10 bg-white/[0.03] px-5 py-5 backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">{label}</p>
      <p className="mt-3 text-3xl text-white" style={displayFont}>
        {value}
      </p>
    </div>
  );
}

function IconHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-white/80">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">{eyebrow}</p>
        <h3 className="mt-1 text-3xl text-white" style={displayFont}>
          {title}
        </h3>
        {description ? <p className="mt-1 text-sm text-white/58">{description}</p> : null}
      </div>
    </div>
  );
}

function AssetGroupPanel({
  title,
  note,
  items,
  tone = "neutral",
  mode = "chips",
}: AssetGroup & {
  tone?: "neutral" | "emerald" | "amber" | "rose";
  mode?: "chips" | "list";
}) {
  const toneStyles =
    tone === "emerald"
      ? {
          badge: "border-emerald-400/18 bg-emerald-400/8 text-emerald-200",
          chip: "border-emerald-400/15 bg-emerald-400/8 text-emerald-100/90",
        }
      : tone === "amber"
        ? {
            badge: "border-brand/18 bg-brand/8 text-amber-100",
            chip: "border-brand/18 bg-brand/8 text-amber-100/90",
          }
        : tone === "rose"
          ? {
              badge: "border-rose-400/16 bg-rose-400/8 text-rose-100",
              chip: "border-rose-400/16 bg-rose-400/8 text-rose-100/90",
            }
          : {
              badge: "border-white/10 bg-white/[0.04] text-white/72",
              chip: "border-white/10 bg-white/[0.04] text-white/78",
            };

  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-black/20 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/72">{title}</p>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
            toneStyles.badge,
          )}
        >
          {items.length} itens
        </span>
      </div>
      {note ? <p className="mt-2 text-sm text-white/54">{note}</p> : null}

      {mode === "chips" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm leading-relaxed",
                toneStyles.chip,
              )}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <ul className="mt-3 grid gap-2.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/76">
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  tone === "rose"
                    ? "bg-rose-300"
                    : tone === "amber"
                      ? "bg-amber-300"
                      : "bg-white/40",
                )}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectMilestoneList() {
  return (
    <ul className="mt-6 space-y-3">
      {projectMilestones.map((item) => {
        const meta = statusMeta(item.status);
        const Icon = meta.icon;

        return (
          <li key={item.title} className={cn("rounded-[1.35rem] border px-4 py-4", meta.panel)}>
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                  meta.badge,
                )}
              >
                <Icon className={cn("h-4 w-4", item.status === "active" && "animate-spin")} />
              </span>
              <div>
                <p className="font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/64">{item.description}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function ProjectsPage() {
  useEffect(() => {
    captureUtmFromUrl();
  }, []);

  const completedCount = timeline.filter((item) => item.status === "done").length;
  const activeCount = timeline.filter((item) => item.status === "active").length;
  const touchedCount = completedCount + activeCount;
  const progressWidth = `${((completedCount + activeCount * 0.5) / timeline.length) * 100}%`;
  const mappedAssetCount = assetsMapped.reduce((total, group) => total + group.items.length, 0);
  const requestedAssetCount = assetsRequested.reduce((total, group) => total + group.items.length, 0);
  const highImpactAssetCount = highImpactAssets.reduce((total, group) => total + group.items.length, 0);
  const checklistReadyCount = assetChecklist.filter((item) => item.status === "done").length;

  return (
    <div
      className="min-h-screen bg-[#050505] text-white"
      style={{ fontFamily: '"Manrope", Inter, system-ui, sans-serif' }}
    >
      <Nav ctaHref="#proximos-passos" ctaLabel="Proximos passos" homeHref="/" />

      <main id="top" className="overflow-x-hidden">
        <section className="relative isolate overflow-hidden border-b border-white/8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_22%),linear-gradient(180deg,#080808_0%,#050505_48%,#09090b_100%)]" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />
          <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:py-20 xl:grid-cols-[minmax(0,1.08fr)_380px] xl:gap-12 xl:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.7)]" />
                Projeto em andamento
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.36em] text-white/45">
                Gabriel França - Frizon Construtora
              </p>
              <h1
                className="mt-4 max-w-3xl text-5xl leading-none text-white sm:text-6xl lg:text-7xl"
                style={displayFont}
              >
                Projeto Gabriel França
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/78 sm:text-2xl">
                Plataforma Premium de Geracao de Leads para Empreendimentos Frizon
              </p>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/62 sm:text-lg">
                Uma plataforma desenvolvida para posicionar Gabriel Franca como referencia em
                empreendimentos Frizon, gerar leads qualificados e criar uma operacao escalavel de
                aquisicao de clientes.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#timeline"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  Acompanhar cronograma
                </a>
                <a
                  href="#roadmap"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white/84 transition-colors hover:border-white/25 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                >
                  Ver roadmap operacional
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {quickLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/66 transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {heroStats.map((item) => (
                  <MetricCard key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <SurfaceCard className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between xl:flex-col xl:items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                      Mural de evolucao
                    </p>
                    <h2 className="mt-3 text-3xl text-white" style={displayFont}>
                      Pagina viva do projeto
                    </h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/62">
                    Ultima atualizacao 03/07/2026
                  </div>
                </div>

                <ProjectMilestoneList />
              </SurfaceCard>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <SurfaceCard className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
                    Conversao principal
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400/12 text-emerald-200">
                      <MessageCircleMore className="h-5 w-5" />
                    </div>
                    <p className="text-base font-semibold text-white">WhatsApp Gabriel</p>
                  </div>
                </SurfaceCard>

                <SurfaceCard className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
                    Direcao estrategica
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/12 text-amber-200">
                      <Target className="h-5 w-5" />
                    </div>
                    <p className="text-base font-semibold text-white">
                      Posicionamento, autoridade e aquisicao
                    </p>
                  </div>
                </SurfaceCard>
              </div>
            </div>
          </div>
        </section>

        <SectionShell id="timeline" className="py-18 lg:py-24">
          <SectionHeading
            eyebrow="Timeline do projeto"
            title="Cada etapa visivel, cada avanco perceptivel."
            description="A timeline foi desenhada para transmitir evolucao real. Conforme o projeto anda, esta mesma pagina pode ser atualizada e ganhar ainda mais peso comercial."
          />

          <SurfaceCard className="mt-10 bg-[#0b0b0d] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Cronograma de implantacao</p>
                <p className="mt-1 text-sm text-white/54">
                  {completedCount} concluida{completedCount === 1 ? "" : "s"}, {activeCount} em
                  andamento e {timeline.length - touchedCount} aguardando.
                </p>
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/56">
                {touchedCount}/{timeline.length} etapas ativadas
              </div>
            </div>

            <div className="mt-6 h-1.5 rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(251,191,36,1)_0%,rgba(110,231,183,0.8)_100%)]"
                style={{ width: progressWidth }}
              />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {timeline.map((item, index) => {
                const meta = statusMeta(item.status);
                const Icon = meta.icon;

                return (
                  <div
                    key={item.title}
                    className={cn(
                      "relative overflow-hidden rounded-[1.65rem] border p-5 transition-transform duration-300 hover:-translate-y-0.5",
                      meta.panel,
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={cn(
                          "inline-flex h-10 w-10 items-center justify-center rounded-full border",
                          meta.badge,
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4.5 w-4.5",
                            item.status === "active" && "animate-spin",
                          )}
                        />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/48">
                        Etapa {index + 1}
                      </span>
                    </div>
                    <p className="mt-5 text-2xl text-white" style={displayFont}>
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/64">{item.description}</p>
                    <div
                      className={cn(
                        "mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]",
                        meta.badge,
                      )}
                    >
                      <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
                      {meta.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </SurfaceCard>
        </SectionShell>

        <SectionShell id="direcao" className="py-8 lg:py-12">
          <div className="grid gap-5 xl:grid-cols-12">
            <SurfaceCard className="xl:col-span-6 p-7 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/42">Objetivo</p>
              <h2 className="mt-4 text-4xl text-white sm:text-5xl" style={displayFont}>
                Construir uma plataforma premium focada em posicionamento, autoridade e geracao de
                leads qualificados.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/64">
                A estrutura nasce para ser mais do que um site institucional. Ela deve funcionar
                como uma maquina de aquisicao, conduzindo o usuario da busca no Google ate o
                contato com Gabriel pelo WhatsApp com uma experiencia acima do padrao do mercado.
              </p>
            </SurfaceCard>

            <SurfaceCard className="xl:col-span-3 p-7">
              <IconHeader
                icon={Target}
                eyebrow="Objetivos estrategicos"
                title="Direcao"
                description="Os resultados que guiam a construcao."
              />
              <ul className="mt-6 space-y-3">
                {strategicGoals.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/74">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </SurfaceCard>

            <SurfaceCard className="xl:col-span-3 p-7">
              <IconHeader
                icon={Users}
                eyebrow="Publico-alvo"
                title="Perfil ideal"
                description="Segmentos com maior aderencia comercial."
              />
              <div className="mt-6 flex flex-wrap gap-2.5">
                {audience.map((item) => (
                  <span key={item} className={chipClass}>
                    {item}
                  </span>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard className="xl:col-span-6 p-7 sm:p-8">
              <IconHeader
                icon={Compass}
                eyebrow="Estrategia comercial"
                title="Uma jornada intencional, sem ruido."
                description="A plataforma nao sera um portal imobiliario tradicional."
              />
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">
                O foco e transmitir confianca, exclusividade e qualidade, conduzindo o visitante
                para uma unica acao principal: conversar com Gabriel pelo WhatsApp.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className={cn(insetCardClass, "px-4 py-4")}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">
                    Conversao principal
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">WhatsApp Gabriel</p>
                </div>
                <div className={cn(insetCardClass, "px-4 py-4")}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">
                    Navegacao orientada
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">
                    CTA distribuido de forma estrategica
                  </p>
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard className="xl:col-span-6 p-7 sm:p-8">
              <IconHeader
                icon={ChartColumn}
                eyebrow="Marketing e performance"
                title="Mensuracao preparada desde o inicio."
                description="Base pronta para SEO, tracking e campanhas."
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {performanceStack.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-[1.15rem] border border-white/10 bg-[#0b0b0c] px-4 py-3.5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/12 text-amber-100">
                      <BadgeCheck className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-white/82">{item}</span>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </div>
        </SectionShell>

        <SectionShell id="pilares" className="py-18 lg:py-24">
          <SectionHeading
            eyebrow="Pilares"
            title="Quatro pilares que sustentam a operacao."
            description="Esses blocos guiam a direcao estrategica do produto, do posicionamento ate a estrutura de midia e mensuracao."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <SurfaceCard
                  key={pillar.title}
                  className="group p-7 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/[0.04] text-brand transition-colors group-hover:border-brand/25 group-hover:bg-brand/10 group-hover:text-amber-100">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-3xl text-white" style={displayFont}>
                    {pillar.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-white/64">{pillar.description}</p>
                </SurfaceCard>
              );
            })}
          </div>
        </SectionShell>

        <SectionShell id="escopo" className="py-8 lg:py-12">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <SurfaceCard className="p-7 sm:p-8">
              <IconHeader icon={CheckSquare} eyebrow="Escopo inicial" title="Plataforma" />
              <div className="mt-8 grid gap-3">
                {scopeItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/12 text-emerald-200">
                      <BadgeCheck className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-base font-medium text-white/84">{item}</span>
                  </div>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-7 sm:p-8">
              <IconHeader
                icon={Blocks}
                eyebrow="Assets do projeto"
                title="Inventario em organizacao"
                description="Uma camada dedicada para mapear o que existe, o que precisa ser solicitado e o que pode elevar a percepcao premium."
              />

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Mapeados" value={String(mappedAssetCount).padStart(2, "0")} />
                <MetricCard
                  label="A solicitar"
                  value={String(requestedAssetCount).padStart(2, "0")}
                />
                <MetricCard
                  label="Alta diferenca"
                  value={String(highImpactAssetCount).padStart(2, "0")}
                />
                <MetricCard
                  label="Checklist pronto"
                  value={`${checklistReadyCount}/${assetChecklist.length}`}
                />
              </div>

              <div className={cn(insetCardClass, "mt-6 p-5")}>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/52">
                  Melhor decisao de estrutura
                </p>
                <p className="mt-3 text-base leading-relaxed text-white/70">
                  Em vez de uma lista simples de recebidos e pendentes, organizamos esta camada
                  como um inventario estrategico de assets. Isso facilita a leitura para o cliente,
                  orienta a coleta de materiais e ajuda a priorizar o que realmente aumenta a
                  qualidade percebida do projeto.
                </p>
                <a
                  href="#assets"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-100 transition-colors hover:text-white"
                >
                  Ver inventario completo
                  <MoveRight className="h-4 w-4" />
                </a>
              </div>
            </SurfaceCard>
          </div>
        </SectionShell>

        <SectionShell id="assets" className="py-18 lg:py-24">
          <SectionHeading
            eyebrow="Assets e materiais"
            title="A materia-prima da percepcao premium."
            description="Aqui a leitura esta organizada em tres camadas: o que ja sabemos que existe, o que precisa ser solicitado e o que pode transformar o projeto de bom para excepcional."
          />

          <div className="mt-10 grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <SurfaceCard className="border-emerald-400/15 bg-emerald-400/[0.04] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                    Ja sabemos que existe
                  </p>
                  <h3 className="mt-3 text-4xl text-white" style={displayFont}>
                    Base confirmada
                  </h3>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-white/68">
                    Esses materiais foram citados ou confirmados pelo Gabriel e mostram que ja
                    existe uma boa base para construcao do projeto.
                  </p>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  {mappedAssetCount} itens mapeados
                </div>
              </div>

              <div className="mt-7 grid gap-4">
                {assetsMapped.map((group) => (
                  <AssetGroupPanel key={group.title} {...group} tone="emerald" />
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard className="border-brand/15 bg-brand/[0.04] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-100">
                    Precisamos solicitar
                  </p>
                  <h3 className="mt-3 text-4xl text-white" style={displayFont}>
                    Coleta prioritaria
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/68">
                    Estes sao os itens que vao destravar design, paginas individuais,
                    posicionamento e campanhas com mais consistencia.
                  </p>
                </div>
                <div className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
                  {requestedAssetCount} itens a solicitar
                </div>
              </div>

              <div className="mt-7 grid gap-4">
                {assetsRequested.map((group) => (
                  <AssetGroupPanel key={group.title} {...group} tone="amber" />
                ))}
              </div>
            </SurfaceCard>
          </div>

          <SurfaceCard className="mt-5 border-rose-400/12 bg-[linear-gradient(180deg,rgba(251,191,36,0.07),rgba(244,63,94,0.04))] p-6 sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-100/90">
                  Material que faria muita diferenca
                </p>
                <h3 className="mt-3 text-4xl text-white" style={displayFont}>
                  O que elevaria o projeto de bom para excepcional
                </h3>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/68">
                  Esses assets nao foram necessariamente citados, mas agregam valor direto na
                  percepcao premium, humanizacao da marca e capacidade de conversao.
                </p>
              </div>
              <div className="rounded-full border border-rose-400/16 bg-rose-400/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-100">
                {highImpactAssetCount} oportunidades de alto impacto
              </div>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {highImpactAssets.map((group) => (
                <AssetGroupPanel key={group.title} {...group} tone="rose" mode="list" />
              ))}
            </div>
          </SurfaceCard>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <SurfaceCard className="p-7 sm:p-8">
              <IconHeader
                icon={CheckSquare}
                eyebrow="Checklist prioritario"
                title="Assets para o Gabriel preencher ou consolidar"
                description="Uma leitura executiva para facilitar follow-up e organizacao do envio."
              />

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {assetChecklist.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-white/10 bg-[#0b0b0c] px-4 py-3.5"
                  >
                    <span className="text-sm font-medium text-white/82">{item.label}</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                        item.status === "done"
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                          : "border-white/10 bg-white/[0.04] text-white/62",
                      )}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          item.status === "done" ? "bg-emerald-300" : "bg-white/35",
                        )}
                      />
                      {item.status === "done" ? "ok" : "pendente"}
                    </span>
                  </div>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-7 sm:p-8">
              <IconHeader
                icon={Sparkles}
                eyebrow="Entregaveis essenciais"
                title="Os 3 itens que mais aumentam o nivel do projeto"
                description="Se tivermos esses entregaveis bem resolvidos, a plataforma sobe de patamar."
              />

              <div className="mt-7 space-y-3">
                {essentialDeliverables.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-[1.35rem] border border-white/10 bg-[#0b0b0c] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/12 text-amber-100">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/52">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <p className="text-base font-semibold text-white">{item.title}</p>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-white/68">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SurfaceCard>
          </div>
        </SectionShell>

        <SectionShell id="arquitetura" className="py-18 lg:py-24">
          <SectionHeading
            eyebrow="Arquitetura"
            title="Da busca ate o WhatsApp, sem desvios."
            description="A ilustracao abaixo resume a jornada principal de conversao pensada para a operacao."
          />

          <SurfaceCard className="mt-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] p-7 sm:p-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch xl:justify-between">
              {architectureFlow.map((step, index) => {
                const Icon = step.icon;

                return (
                  <Fragment key={step.title}>
                    <div className="min-w-0 flex-1 rounded-[1.7rem] border border-white/10 bg-[#0b0b0c] p-5 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brand/20 bg-brand/10 text-amber-100">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="mt-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/56">
                        Passo {index + 1}
                      </div>
                      <p className="mt-4 text-2xl text-white" style={displayFont}>
                        {step.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/62">{step.description}</p>
                    </div>

                    {index < architectureFlow.length - 1 ? (
                      <>
                        <div className="flex items-center justify-center xl:hidden">
                          <MoveRight className="h-5 w-5 rotate-90 text-brand/70" />
                        </div>
                        <div className="hidden items-center justify-center xl:flex">
                          <MoveRight className="h-5 w-5 text-brand/70" />
                        </div>
                      </>
                    ) : null}
                  </Fragment>
                );
              })}
            </div>
          </SurfaceCard>
        </SectionShell>

        <SectionShell id="roadmap" className="py-18 lg:py-24">
          <SectionHeading
            eyebrow="Roadmap"
            title="Um Kanban executivo do que vem agora e do que escala depois."
            description="A organizacao em frentes deixa claro o que esta sendo construido agora, o que compoe o motor de marketing e o que fica preparado para a proxima camada de crescimento."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {roadmap.map((column, index) => (
              <SurfaceCard key={column.title} className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
                      Coluna {index + 1}
                    </p>
                    <h3 className="mt-2 text-3xl text-white" style={displayFont}>
                      {column.title}
                    </h3>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/56">
                    {column.items.length} cards
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/58">{column.description}</p>

                <div className="mt-6 space-y-3">
                  {column.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-white/10 bg-[#0b0b0c] px-4 py-3.5"
                    >
                      <span className="font-medium text-white/82">{item}</span>
                      <span className="h-2.5 w-2.5 rounded-full bg-brand/80" />
                    </div>
                  ))}
                </div>
              </SurfaceCard>
            ))}
          </div>
        </SectionShell>

        <SectionShell id="proximos-passos" className="py-8 lg:py-12">
          <div className="grid gap-5 lg:grid-cols-2">
            <SurfaceCard className="p-7 sm:p-8">
              <IconHeader icon={Rocket} eyebrow="Proximos passos" title="Em andamento" />

              <div className="mt-7 grid gap-3">
                {nextSteps.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-[#0b0b0c] px-4 py-4"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/12 text-amber-100">
                      <MoveRight className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-base font-medium text-white/84">{item}</span>
                  </div>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-7 sm:p-8">
              <IconHeader icon={CalendarClock} eyebrow="Status da atualizacao" title="03/07/2026" />

              <div className={cn(insetCardClass, "mt-7 p-5")}>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/52">
                  Resumo executivo
                </p>
                <p className="mt-4 text-base leading-relaxed text-white/70">
                  Ja recebemos uma base relevante de materiais, incluindo revista digital dos 5
                  empreendimentos, fotos profissionais do Gabriel, fotos de entregas, premiacoes e
                  CRECI. O foco agora e consolidar a arquitetura, validar o conteudo do drive
                  compartilhado e transformar esse acervo em uma experiencia premium na plataforma.
                </p>
              </div>
            </SurfaceCard>
          </div>
        </SectionShell>

        <SectionShell className="py-18 lg:py-24">
          <SectionHeading
            eyebrow="Acompanhamento do projeto"
            title="Tudo o que importa no projeto, em um so lugar."
            description="Aqui voce acompanha o status do projeto, os proximos movimentos e quem esta conduzindo cada etapa, com mais clareza e previsibilidade ao longo da entrega."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <SurfaceCard className="p-7 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {team.map((member) => (
                  <div key={member} className={cn(insetCardClass, "p-5")}>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
                      Responsavel
                    </p>
                    <p className="mt-3 text-3xl text-white" style={displayFont}>
                      {member}
                    </p>
                  </div>
                ))}
              </div>
            </SurfaceCard>

            <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(251,191,36,0.08),rgba(255,255,255,0.03))] p-7 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.85)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand/20 bg-brand/10 text-amber-100">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-4xl text-white" style={displayFont}>
                Transparencia na entrega
              </h3>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                Esta pagina foi estruturada para funcionar como um ponto central de acompanhamento.
                Conforme novas etapas forem concluidas, atualizamos o mesmo endereco para que voce
                consiga visualizar o historico, os status e os proximos passos do projeto em um so
                lugar, como em{" "}
                <code className="rounded bg-black/25 px-1.5 py-0.5 text-sm text-white">
                  /projetos/gabrielfranca
                </code>
                .
              </p>
            </article>
          </div>
        </SectionShell>
      </main>

      <Footer />
    </div>
  );
}
