import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { CopilotMeetingArtifact } from "../meeting/types";
import type { RecommendedEngagement } from "../types";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 52;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BODY_SIZE = 10;
const BODY_LINE = 14;
const SECTION_GAP = 18;

export interface BriefingPdfInput {
  artifact: CopilotMeetingArtifact;
  sessionTitle: string;
  generatedAt?: string;
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

function drawLines(
  page: PDFPage,
  lines: string[],
  x: number,
  startY: number,
  font: PDFFont,
  size: number,
  lineHeight: number,
  color = rgb(0.12, 0.12, 0.12),
): number {
  let y = startY;
  for (const line of lines) {
    page.drawText(line, { x, y, size, font, color });
    y -= lineHeight;
  }
  return y;
}

function ensureSpace(
  pdfDoc: PDFDocument,
  pageRef: { page: PDFPage },
  yRef: { y: number },
  needed: number,
  fonts: { regular: PDFFont; bold: PDFFont },
): void {
  if (yRef.y - needed >= MARGIN) return;
  pageRef.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  yRef.y = PAGE_HEIGHT - MARGIN;
  yRef.y = drawLines(
    pageRef.page,
    ["Raise One Copilot — continuação"],
    MARGIN,
    yRef.y,
    fonts.regular,
    8,
    12,
    rgb(0.45, 0.45, 0.45),
  );
}

function drawSectionTitle(
  pdfDoc: PDFDocument,
  pageRef: { page: PDFPage },
  yRef: { y: number },
  title: string,
  fonts: { regular: PDFFont; bold: PDFFont },
): void {
  ensureSpace(pdfDoc, pageRef, yRef, SECTION_GAP + 20, fonts);
  yRef.y -= 8;
  yRef.y = drawLines(pageRef.page, [title], MARGIN, yRef.y, fonts.bold, 11, 14, rgb(0.05, 0.05, 0.05));
  pageRef.page.drawLine({
    start: { x: MARGIN, y: yRef.y + 4 },
    end: { x: MARGIN + CONTENT_WIDTH, y: yRef.y + 4 },
    thickness: 0.5,
    color: rgb(0.82, 0.82, 0.82),
  });
  yRef.y -= 6;
}

function drawParagraph(
  pdfDoc: PDFDocument,
  pageRef: { page: PDFPage },
  yRef: { y: number },
  text: string,
  fonts: { regular: PDFFont; bold: PDFFont },
): void {
  const lines = wrapText(text, fonts.regular, BODY_SIZE, CONTENT_WIDTH);
  for (const line of lines) {
    ensureSpace(pdfDoc, pageRef, yRef, BODY_LINE + 4, fonts);
    yRef.y = drawLines(pageRef.page, [line], MARGIN, yRef.y, fonts.regular, BODY_SIZE, BODY_LINE);
  }
  yRef.y -= 4;
}

function drawBullets(
  pdfDoc: PDFDocument,
  pageRef: { page: PDFPage },
  yRef: { y: number },
  items: string[],
  fonts: { regular: PDFFont; bold: PDFFont },
): void {
  for (const item of items) {
    const lines = wrapText(`• ${item}`, fonts.regular, BODY_SIZE, CONTENT_WIDTH - 8);
    for (const line of lines) {
      ensureSpace(pdfDoc, pageRef, yRef, BODY_LINE + 4, fonts);
      yRef.y = drawLines(pageRef.page, [line], MARGIN + 4, yRef.y, fonts.regular, BODY_SIZE, BODY_LINE);
    }
  }
  yRef.y -= 4;
}

function drawEngagement(
  pdfDoc: PDFDocument,
  pageRef: { page: PDFPage },
  yRef: { y: number },
  engagement: RecommendedEngagement,
  fonts: { regular: PDFFont; bold: PDFFont },
): void {
  drawParagraph(pdfDoc, pageRef, yRef, `Estratégia: ${engagement.strategy}`, fonts);
  drawParagraph(
    pdfDoc,
    pageRef,
    yRef,
    `Confiança da recomendação: ${engagement.confidence}%`,
    fonts,
  );
  for (const phase of engagement.phases) {
    ensureSpace(pdfDoc, pageRef, yRef, BODY_LINE * 3, fonts);
    yRef.y = drawLines(
      pageRef.page,
      [phase.name],
      MARGIN,
      yRef.y,
      fonts.bold,
      BODY_SIZE,
      BODY_LINE,
    );
    drawBullets(pdfDoc, pageRef, yRef, phase.items, fonts);
  }
}

export async function buildBriefingPdf(input: BriefingPdfInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fonts = { regular, bold };

  const pageRef = { page: pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]) };
  const yRef = { y: PAGE_HEIGHT - MARGIN };

  const diagnosis = input.artifact.diagnosis as Record<string, unknown>;
  const contact = String(diagnosis.contact ?? "Prospect");
  const company = String(diagnosis.company ?? "");
  const generatedAt =
    input.generatedAt ?? new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

  yRef.y = drawLines(pageRef.page, ["RAISE ONE COPILOT"], MARGIN, yRef.y, bold, 16, 20);
  yRef.y = drawLines(
    pageRef.page,
    ["Briefing pós-reunião comercial"],
    MARGIN,
    yRef.y,
    regular,
    11,
    15,
    rgb(0.35, 0.35, 0.35),
  );
  yRef.y -= 6;
  yRef.y = drawLines(
    pageRef.page,
    [`Gerado em ${generatedAt}`],
    MARGIN,
    yRef.y,
    regular,
    9,
    12,
    rgb(0.5, 0.5, 0.5),
  );
  yRef.y -= 10;

  yRef.y = drawLines(
    pageRef.page,
    [company ? `${contact} · ${company}` : contact],
    MARGIN,
    yRef.y,
    bold,
    13,
    17,
  );
  yRef.y = drawLines(pageRef.page, [input.sessionTitle], MARGIN, yRef.y, regular, 10, 14);
  yRef.y -= 8;

  const coverage = Number(diagnosis.diagnosticCoverage ?? 0);
  const depth = Number(diagnosis.knowledgeDepth ?? input.artifact.knowledge_depth ?? 0);
  const readiness = String(diagnosis.proposalReadiness ?? "—");
  drawParagraph(
    pdfDoc,
    pageRef,
    yRef,
    `Cobertura diagnóstica: ${coverage}% · Profundidade: ${depth}% · Prontidão para proposta: ${readiness.replace("_", " ")}`,
    fonts,
  );

  drawSectionTitle(pdfDoc, pageRef, yRef, "Situação", fonts);
  drawParagraph(
    pdfDoc,
    pageRef,
    yRef,
    String(diagnosis.situation ?? input.artifact.transcript_summary ?? "—"),
    fonts,
  );

  if (diagnosis.mainProblem) {
    drawSectionTitle(pdfDoc, pageRef, yRef, "Principal problema", fonts);
    drawParagraph(pdfDoc, pageRef, yRef, String(diagnosis.mainProblem), fonts);
  }

  if (diagnosis.constraint) {
    drawSectionTitle(pdfDoc, pageRef, yRef, "Restrição", fonts);
    drawParagraph(pdfDoc, pageRef, yRef, String(diagnosis.constraint), fonts);
  }

  if (diagnosis.opportunity) {
    drawSectionTitle(pdfDoc, pageRef, yRef, "Oportunidade R1", fonts);
    drawParagraph(pdfDoc, pageRef, yRef, String(diagnosis.opportunity), fonts);
  }

  const learned = input.artifact.what_we_learned ?? [];
  if (learned.length > 0) {
    drawSectionTitle(pdfDoc, pageRef, yRef, "O que aprendemos", fonts);
    drawBullets(pdfDoc, pageRef, yRef, learned, fonts);
  }

  const unknowns = input.artifact.unknowns ?? [];
  if (unknowns.length > 0) {
    drawSectionTitle(pdfDoc, pageRef, yRef, "Lacunas e próximos passos", fonts);
    drawBullets(pdfDoc, pageRef, yRef, unknowns.slice(0, 15), fonts);
  }

  const engagement = input.artifact.recommended_engagement as RecommendedEngagement | null;
  if (engagement?.phases?.length) {
    drawSectionTitle(pdfDoc, pageRef, yRef, "Engajamento recomendado", fonts);
    drawEngagement(pdfDoc, pageRef, yRef, engagement, fonts);
  }

  if (input.artifact.transcript_summary) {
    drawSectionTitle(pdfDoc, pageRef, yRef, "Resumo executivo", fonts);
    drawParagraph(pdfDoc, pageRef, yRef, input.artifact.transcript_summary, fonts);
  }

  return pdfDoc.save();
}

export function buildBriefingFileName(companyName: string, contactName: string): string {
  const safe = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 40);

  const base = safe(companyName) || safe(contactName) || "briefing";
  const date = new Date().toISOString().slice(0, 10);
  return `Copilot-${base}-${date}.pdf`;
}
