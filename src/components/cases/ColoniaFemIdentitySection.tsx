import { useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import brandLogo from "@/assets/case-colonia-fem/brand-logo.webp";
import brandHorizontal from "@/assets/case-colonia-fem/brand-horizontal.webp";
import brandSymbol from "@/assets/case-colonia-fem/brand-symbol.webp";
import brandRoof from "@/assets/case-colonia-fem/brand-roof.webp";
import brandWave from "@/assets/case-colonia-fem/brand-wave.webp";
import brandBird from "@/assets/case-colonia-fem/brand-bird.webp";
import applyDigital from "@/assets/case-colonia-fem/apply-digital.webp";
import applyKey from "@/assets/case-colonia-fem/apply-key.webp";
import applyFacade from "@/assets/case-colonia-fem/apply-facade.webp";
import { fadeUp, staggerContainer, viewportOnce } from "./shared/motion";

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Lato:wght@400;700&display=swap";

const PALETTE = [
  { name: "Colônia Red", hex: "#A61E22", role: "Presença", onDark: true },
  { name: "Sand Beige", hex: "#D7C6B0", role: "Acolhimento", onDark: false },
  { name: "Natural Green", hex: "#5B7A5E", role: "Natureza", onDark: true },
  { name: "Coastal Blue", hex: "#5A8FB7", role: "Litoral", onDark: true },
  { name: "Warm White", hex: "#F8F5EE", role: "Respiro", onDark: false },
] as const;

const MARKS = [
  { src: brandRoof, label: "Telhado", hint: "Abrigo" },
  { src: brandWave, label: "Onda", hint: "O mar ao lado" },
  { src: brandBird, label: "Pássaro", hint: "Leveza do litoral" },
] as const;

function useColoniaFonts() {
  useEffect(() => {
    const id = "colonia-fem-brand-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = FONTS_HREF;
    document.head.appendChild(link);
  }, []);
}

export function ColoniaFemIdentitySection() {
  useColoniaFonts();

  return (
    <section
      id="identidade"
      className="relative overflow-hidden bg-[#F8F5EE] text-[#1f1c1a]"
    >
      <img
        src={brandWave}
        alt=""
        className="pointer-events-none absolute -right-[12%] top-16 w-[min(52vw,34rem)] opacity-[0.14]"
        aria-hidden
      />
      <img
        src={brandBird}
        alt=""
        className="pointer-events-none absolute -left-8 bottom-[38%] w-28 opacity-[0.08] sm:w-40"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A61E22]">
            Identidade visual
          </p>
          <h2
            className="mt-5 text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl lg:text-[2.85rem] lg:leading-[1.08]"
            style={{ fontFamily: '"EB Garamond", Georgia, serif' }}
          >
            Uma marca para ser reconhecida da busca até a chave do quarto.
          </h2>
          <p
            className="mx-auto mt-6 max-w-2xl text-base leading-[1.75] text-[#4a4540] sm:text-lg"
            style={{ fontFamily: "Lato, system-ui, sans-serif" }}
          >
            A Raise One desenhou o sistema visual da Colônia FEM. Logo, paleta, tipografia e
            aplicações passaram a orientar a landing page, o vídeo, as peças digitais e os pontos
            de contato da hospedagem.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto mt-16 flex max-w-xl flex-col items-center sm:mt-20"
        >
          <img
            src={brandLogo}
            alt="Logotipo principal Pousada Colônia FEM"
            className="w-full max-w-[28rem]"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mx-auto mt-12 grid max-w-3xl items-center gap-8 sm:grid-cols-2 sm:gap-10"
        >
          <motion.div variants={fadeUp} className="flex justify-center border-t border-[#1f1c1a]/10 pt-8 sm:border-t-0 sm:pt-0">
            <img
              src={brandHorizontal}
              alt="Versão horizontal da marca"
              className="w-full max-w-[22rem]"
            />
          </motion.div>
          <motion.div variants={fadeUp} className="flex justify-center border-t border-[#1f1c1a]/10 pt-8 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-10">
            <img src={brandSymbol} alt="Símbolo da marca" className="w-full max-w-[16rem]" />
          </motion.div>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mx-auto mt-20 grid max-w-4xl gap-4 sm:grid-cols-3"
        >
          {MARKS.map((mark) => (
            <motion.li
              key={mark.label}
              variants={fadeUp}
              className="flex flex-col items-center rounded-[1.4rem] bg-white/70 px-6 py-8 ring-1 ring-[#1f1c1a]/10"
            >
              <img src={mark.src} alt="" className="h-16 w-auto object-contain sm:h-20" />
              <p
                className="mt-6 text-xl tracking-tight"
                style={{ fontFamily: '"EB Garamond", Georgia, serif' }}
              >
                {mark.label}
              </p>
              <p
                className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#6e675f]"
                style={{ fontFamily: "Lato, system-ui, sans-serif" }}
              >
                {mark.hint}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-20 grid gap-10 lg:mt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A61E22]">
              Tipografia
            </p>
            <p
              className="mt-4 text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-[-0.02em] text-[#A61E22]"
              style={{ fontFamily: '"EB Garamond", Georgia, serif' }}
            >
              Conforto à beira do mar.
            </p>
            <p
              className="mt-5 max-w-md text-base leading-relaxed text-[#4a4540]"
              style={{ fontFamily: "Lato, system-ui, sans-serif" }}
            >
              EB Garamond nos títulos, para o nome ter peso editorial. Lato no texto, para a
              conversa digital permanecer clara. Clássico no nome. Leve na comunicação.
            </p>
            <div
              className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#6e675f]"
              style={{ fontFamily: "Lato, system-ui, sans-serif" }}
            >
              <span>
                <strong className="font-bold text-[#1f1c1a]">Títulos</strong> EB Garamond
              </span>
              <span>
                <strong className="font-bold text-[#1f1c1a]">Texto</strong> Lato
              </span>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="overflow-hidden rounded-[1.4rem] bg-[#1f1c1a] px-7 py-8 text-[#F8F5EE]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D7C6B0]">
              Sobre o lettering
            </p>
            <p
              className="mt-4 text-2xl leading-snug"
              style={{ fontFamily: '"EB Garamond", Georgia, serif' }}
            >
              O desenho do logotipo é peça própria da marca.
            </p>
            <p
              className="mt-4 text-sm leading-relaxed text-[#D7C6B0]"
              style={{ fontFamily: "Lato, system-ui, sans-serif" }}
            >
              As famílias desta página sustentam site, redes, materiais impressos e apresentações.
              A marca não se dissolve em fonte genérica.
            </p>
          </motion.div>
        </div>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="grid sm:grid-cols-5"
      >
        {PALETTE.map((color) => (
          <motion.li
            key={color.hex}
            variants={fadeUp}
            className="flex min-h-[200px] flex-col justify-end px-5 py-6 sm:min-h-[240px]"
            style={{ backgroundColor: color.hex }}
          >
            <p
              className={cn(
                "text-[10px] uppercase tracking-[0.22em]",
                color.onDark ? "text-white/70" : "text-[#1f1c1a]/55",
              )}
              style={{ fontFamily: "Lato, system-ui, sans-serif" }}
            >
              {color.role}
            </p>
            <p
              className={cn(
                "mt-2 text-xl tracking-tight",
                color.onDark ? "text-white" : "text-[#1f1c1a]",
              )}
              style={{ fontFamily: '"EB Garamond", Georgia, serif' }}
            >
              {color.name}
            </p>
            <p
              className={cn(
                "mt-1 font-mono text-[11px]",
                color.onDark ? "text-white/70" : "text-[#1f1c1a]/55",
              )}
            >
              {color.hex}
            </p>
          </motion.li>
        ))}
      </motion.ul>

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="max-w-2xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A61E22]">
            Aplicações
          </p>
          <h3
            className="mt-4 text-3xl tracking-tight sm:text-4xl"
            style={{ fontFamily: '"EB Garamond", Georgia, serif' }}
          >
            A identidade atravessa o digital e o lugar.
          </h3>
          <p
            className="mt-4 max-w-xl text-base leading-relaxed text-[#4a4540]"
            style={{ fontFamily: "Lato, system-ui, sans-serif" }}
          >
            Feed, chave, fachada. O mesmo sistema visual, para a pousada ser reconhecida antes
            mesmo da primeira mensagem no WhatsApp.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
          <motion.figure
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="overflow-hidden rounded-[1.4rem] bg-white shadow-[0_24px_60px_-28px_rgba(31,28,26,0.35)]"
          >
            <img
              src={applyDigital}
              alt="Aplicação da identidade na presença digital da Pousada Colônia FEM"
              className="h-full w-full object-cover"
            />
            <figcaption
              className="px-5 py-4 text-sm text-[#4a4540]"
              style={{ fontFamily: "Lato, system-ui, sans-serif" }}
            >
              Presença digital
            </figcaption>
          </motion.figure>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <motion.figure
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              className="overflow-hidden rounded-[1.4rem] bg-white shadow-[0_24px_60px_-28px_rgba(31,28,26,0.35)]"
            >
              <img
                src={applyKey}
                alt="Cartão-chave e identificador de quarto com a marca Colônia FEM"
                className="w-full object-cover"
              />
              <figcaption
                className="px-5 py-4 text-sm text-[#4a4540]"
                style={{ fontFamily: "Lato, system-ui, sans-serif" }}
              >
                Chave e identificação
              </figcaption>
            </motion.figure>
            <motion.figure
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              className="overflow-hidden rounded-[1.4rem] bg-white shadow-[0_24px_60px_-28px_rgba(31,28,26,0.35)]"
            >
              <img
                src={applyFacade}
                alt="Fachada da Pousada Colônia FEM com a marca aplicada"
                className="w-full object-cover"
              />
              <figcaption
                className="px-5 py-4 text-sm text-[#4a4540]"
                style={{ fontFamily: "Lato, system-ui, sans-serif" }}
              >
                Fachada
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </div>
    </section>
  );
}
