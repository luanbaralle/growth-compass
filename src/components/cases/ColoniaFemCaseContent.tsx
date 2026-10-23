import type { Case } from "@/types/case";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import heroLp from "@/assets/case-colonia-fem/hero-lp.png";
import lpDesktop from "@/assets/case-colonia-fem/lp-desktop.webp";
import lpMobile from "@/assets/case-colonia-fem/lp-mobile.png";
import coloniaLogo from "@/assets/case-colonia-fem/logo-horizontal.webp";
import videoPoster from "@/assets/case-colonia-fem/video-poster.webp";
import { CaseCTA } from "./CaseCTA";
import { CaseHero } from "./CaseHero";
import { ColoniaFemIdentitySection } from "./ColoniaFemIdentitySection";
import { DeliverablesScrollSection } from "./DeliverablesScrollSection";
import { ProblemScrollSection } from "./ProblemScrollSection";
import { ProcessTimeline } from "./ProcessTimeline";
import { ResultsSection } from "./ResultsSection";
import { LiveSiteShowcase } from "./showcase";
import { LessonsSection } from "./shared/LessonsSection";
import { TransformSection } from "./shared/TransformSection";
import { WhyItWorkedSection } from "./shared/WhyItWorkedSection";
import {
  CaseBody,
  CaseEyebrow,
  CaseHeading,
  CaseReveal,
  CaseSection,
} from "./shared/CaseSection";

const VIDEO_HORIZONTAL = "/colonia-fem-video/comercial-horizontal.mp4";
const VIDEO_VERTICAL = "/colonia-fem-video/comercial-vertical.mp4";

function usePousadaVideoSrc() {
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767.98px)");
    const apply = () => setVertical(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return vertical ? VIDEO_VERTICAL : VIDEO_HORIZONTAL;
}

interface ColoniaFemCaseContentProps {
  caseData: Case;
}

function withColoniaFemAssets(caseData: Case): Case {
  return {
    ...caseData,
    heroImage: heroLp,
    coverImage: heroLp,
    gallery: [
      {
        src: lpDesktop,
        alt: "Landing page Pousada Colônia FEM, página completa",
      },
    ],
    heroExtended: {
      ...caseData.heroExtended,
      logo: coloniaLogo,
      panelImage: heroLp,
      panelLayout: "wide",
    },
  };
}

function CommercialVideo() {
  const src = usePousadaVideoSrc();
  const stageRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const cinemaRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [cinemaOpen, setCinemaOpen] = useState(false);
  const [cinemaReady, setCinemaReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setPreviewReady(false);
  }, [src]);

  useEffect(() => {
    const video = previewRef.current;
    const stage = stageRef.current;
    if (!video || !stage || cinemaOpen) return;

    video.muted = true;
    video.defaultMuted = true;

    const attempt = () => {
      video.muted = true;
      const play = video.play();
      if (play?.then) play.then(() => setPreviewReady(true)).catch(() => {});
    };

    if (video.readyState >= 2) attempt();
    else {
      video.addEventListener("loadeddata", attempt, { once: true });
      video.addEventListener("canplay", attempt, { once: true });
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) attempt();
        else video.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(stage);

    return () => {
      io.disconnect();
      video.pause();
    };
  }, [src, cinemaOpen]);

  useEffect(() => {
    if (!cinemaOpen) {
      setCinemaReady(false);
      return;
    }

    const video = cinemaRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const start = () => {
      if (!video) return;
      video.muted = false;
      const play = video.play();
      if (play?.then) {
        play.then(() => setCinemaReady(true)).catch(() => setCinemaReady(true));
      } else {
        setCinemaReady(true);
      }
    };

    if (video && video.readyState >= 2) start();
    else video?.addEventListener("loadeddata", start, { once: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCinemaOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      video?.pause();
    };
  }, [cinemaOpen, src]);

  const closeCinema = () => setCinemaOpen(false);

  return (
    <>
      <div
        ref={stageRef}
        className="relative min-h-[340px] w-full overflow-hidden bg-[#0c0a09] max-md:aspect-[9/16] max-md:min-h-0 max-md:max-h-[min(78svh,680px)] md:aspect-[21/9]"
      >
        <video
          ref={previewRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: previewReady && !cinemaOpen ? 1 : 0.35 }}
          src={src}
          poster={videoPoster}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden
        />

        <button
          type="button"
          onClick={() => setCinemaOpen(true)}
          className="group absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 bg-[rgba(14,10,8,0.58)] px-8 py-8 transition-colors hover:bg-[rgba(14,10,8,0.68)]"
          aria-label="Assistir o vídeo comercial da Pousada Colônia FEM"
        >
          <span className="font-display text-[clamp(1.9rem,4vw,3.1rem)] leading-none tracking-tight text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.35)]">
            Veja como é estar aqui.
          </span>
          <span className="text-[0.72rem] uppercase tracking-[0.2em] text-white/85">
            Sinta a experiência
          </span>
          <span className="mt-2 grid h-[76px] w-[76px] place-items-center rounded-full border-[1.5px] border-white/90 bg-[rgba(12,10,9,0.25)] text-white backdrop-blur-[4px] transition-transform duration-300 group-hover:scale-105 group-hover:bg-white/16">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      </div>

      {mounted &&
        cinemaOpen &&
        createPortal(
          <div className="fixed inset-0 z-[80] grid place-items-center bg-black">
            <div className="absolute inset-0 bg-[#050403]" aria-hidden />
            <video
              ref={cinemaRef}
              className="relative z-[2] h-full w-full object-cover transition-opacity duration-700"
              style={{ opacity: cinemaReady ? 1 : 0 }}
              src={src}
              poster={videoPoster}
              playsInline
              autoPlay
              preload="auto"
              onEnded={closeCinema}
            />
            <button
              type="button"
              onClick={closeCinema}
              className="absolute right-5 top-5 z-[4] rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Fechar
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

export function ColoniaFemCaseContent({ caseData }: ColoniaFemCaseContentProps) {
  const data = withColoniaFemAssets(caseData);
  const content = data.content;
  const primaryGallery = data.gallery[0];

  return (
    <div className="case-study">
      <CaseHero caseData={data} />

      <ProblemScrollSection
        id="problema"
        eyebrow="O problema"
        headline={data.challenge}
        intro={content?.problemIntro}
        pains={data.goals}
        channels={content?.problemChannels ?? []}
        closing={content?.problemClosing}
      />

      <ProcessTimeline steps={data.process} eyebrow="A solução" title={data.solution} />

      <ColoniaFemIdentitySection />

      <ResultsSection
        metrics={data.metrics}
        deliverables={[]}
        intro={content?.resultsIntro}
      />

      {content?.whyItWorked && content.whyItWorked.length > 0 && (
        <WhyItWorkedSection
          title={content.whyItWorkedTitle}
          intro={content.whyItWorkedIntro}
          items={content.whyItWorked}
          systemFlow={content.systemFlow}
          systemFlowIntro={content.systemFlowIntro}
        />
      )}

      {primaryGallery && (
        <CaseSection id="landing-page" className="overflow-visible py-24 sm:py-32">
          <CaseReveal className="mx-auto max-w-3xl text-center">
            <hr className="border-white/[0.08]" />
            <CaseHeading className="mt-10 text-2xl sm:text-3xl lg:text-4xl">
              {content?.landingTitle}
            </CaseHeading>
            {content?.landingDescription && (
              <CaseBody className="mx-auto mt-6 max-w-2xl">{content.landingDescription}</CaseBody>
            )}
            <hr className="mt-10 border-white/[0.08]" />
          </CaseReveal>

          <div className="mt-14 sm:mt-20">
            <LiveSiteShowcase
              url={data.website ?? "https://pousadacoloniafem.com.br"}
              displayUrl="pousadacoloniafem.com.br"
              desktopFallback={primaryGallery.src}
              mobileFallback={lpMobile}
              title="Landing page Pousada Colônia FEM"
            />
          </div>

          {data.website && (
            <CaseReveal delay={0.1} className="mt-10 flex justify-center">
              <a
                href={data.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Ver projeto ao vivo
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </CaseReveal>
          )}
        </CaseSection>
      )}

      <CaseSection
        id="video"
        variant="elevated"
        className="py-24 sm:py-32 lg:py-40"
        containerClassName="max-w-none px-0"
      >
        <CaseReveal className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <CaseEyebrow>Vídeo comercial</CaseEyebrow>
          <CaseHeading>O filme que apresenta a estadia.</CaseHeading>
          <CaseBody className="mx-auto mt-6 max-w-2xl">
            Produzido pela Raise One e integrado à landing page. Na página da pousada, o preview
            roda em silêncio; no clique, o cinema abre com áudio. Aqui, o mesmo filme: um ativo
            de comunicação que complementa a fotografia e ajuda a transmitir a experiência da
            hospedagem.
          </CaseBody>
        </CaseReveal>

        <CaseReveal delay={0.08} className="relative mt-12 w-full sm:mt-16">
          <CommercialVideo />
        </CaseReveal>
      </CaseSection>

      {content?.lessonsLearned && content.lessonsLearned.length > 0 && (
        <LessonsSection
          title={content.lessonsTitle}
          intro={content.lessonsIntro}
          items={content.lessonsLearned}
        />
      )}

      {content?.agencyDeliverables && content.agencyDeliverables.length > 0 && (
        <DeliverablesScrollSection
          id="entregaveis"
          items={content.agencyDeliverables}
          intro={content.deliverablesIntro}
        />
      )}

      {content?.transformBefore && content?.transformAfter && (
        <TransformSection
          intro={content.transformIntro}
          closing={content.transformClosing}
          before={content.transformBefore}
          after={content.transformAfter}
        />
      )}

      <CaseCTA caseData={data} />
    </div>
  );
}
