import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { CreativeBrief } from "../types";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 52;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BODY_SIZE = 10;
const BODY_LINE = 14;

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
}

function drawParagraph(
  pdfDoc: PDFDocument,
  pageRef: { page: PDFPage },
  yRef: { y: number },
  text: string,
  fonts: { regular: PDFFont; bold: PDFFont },
): void {
  for (const line of wrapText(text, fonts.regular, BODY_SIZE, CONTENT_WIDTH)) {
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
    for (const line of wrapText(`• ${item}`, fonts.regular, BODY_SIZE, CONTENT_WIDTH - 8)) {
      ensureSpace(pdfDoc, pageRef, yRef, BODY_LINE + 4, fonts);
      yRef.y = drawLines(pageRef.page, [line], MARGIN + 4, yRef.y, fonts.regular, BODY_SIZE, BODY_LINE);
    }
  }
  yRef.y -= 4;
}

export async function buildCreativeBriefPdf(brief: CreativeBrief): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fonts = { regular, bold };

  const pageRef = { page: pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]) };
  const yRef = { y: PAGE_HEIGHT - MARGIN };

  yRef.y = drawLines(pageRef.page, ["RAISE ONE — BRIEF CRIATIVO"], MARGIN, yRef.y, bold, 16, 20);
  yRef.y = drawLines(
    pageRef.page,
    ["Documento para montagem da proposta (Reunião 2)"],
    MARGIN,
    yRef.y,
    regular,
    10,
    14,
    rgb(0.4, 0.4, 0.4),
  );
  yRef.y -= 8;
  yRef.y = drawLines(pageRef.page, [brief.projectTitle], MARGIN, yRef.y, bold, 13, 17);
  yRef.y = drawLines(
    pageRef.page,
    [`${brief.clientName} · ${brief.companyName}`],
    MARGIN,
    yRef.y,
    regular,
    10,
    14,
  );
  yRef.y = drawLines(
    pageRef.page,
    [
      `Template: ${brief.templateArchetype === "acceleration" ? "Aceleração (UNIP)" : "Solução sob medida"} · Slug sugerido: ${brief.suggestedProjectName}`,
    ],
    MARGIN,
    yRef.y,
    regular,
    9,
    12,
    rgb(0.5, 0.5, 0.5),
  );
  yRef.y -= 12;

  if (brief.gapsForMeeting2.length > 0) {
    yRef.y = drawLines(pageRef.page, ["LACUNAS PARA VALIDAR NA REUNIÃO 2"], MARGIN, yRef.y, bold, 11, 14);
    yRef.y -= 4;
    drawBullets(pdfDoc, pageRef, yRef, brief.gapsForMeeting2, fonts);
    yRef.y -= 8;
  }

  for (const section of brief.sections) {
    ensureSpace(pdfDoc, pageRef, yRef, 60, fonts);
    yRef.y = drawLines(
      pageRef.page,
      [`${section.number} — ${section.title}`],
      MARGIN,
      yRef.y,
      bold,
      11,
      14,
    );
    yRef.y -= 4;
    drawParagraph(pdfDoc, pageRef, yRef, section.narrative, fonts);
    if (section.bullets.length > 0) drawBullets(pdfDoc, pageRef, yRef, section.bullets, fonts);
    if (section.editorNotes) {
      drawParagraph(
        pdfDoc,
        pageRef,
        yRef,
        `[Nota editor] ${section.editorNotes}`,
        fonts,
      );
    }
    yRef.y -= 8;
  }

  return pdfDoc.save();
}

export function buildCreativeBriefFileName(companyName: string): string {
  const safe = companyName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
  const date = new Date().toISOString().slice(0, 10);
  return `Brief-Criativo-${safe || "cliente"}-${date}.pdf`;
}
