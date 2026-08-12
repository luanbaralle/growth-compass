import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { formatCnpj, formatCpf, formatReceiptDate } from "./receipt-utils";
import { centsToWordsPt } from "./number-to-words.pt";
import { formatMoney } from "./types";

export interface ReceiptPdfInput {
  receiptNumber: string;
  issueDate: string;
  clientLegalName: string;
  clientCnpj: string | null;
  amountCents: number;
  serviceDescription: string;
  issuerName: string;
  issuerCpf: string;
  issuerEmail: string;
  issuerPhone: string;
}

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

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
  color = rgb(0.1, 0.1, 0.1),
): number {
  let y = startY;
  for (const line of lines) {
    page.drawText(line, { x, y, size, font, color });
    y -= lineHeight;
  }
  return y;
}

export async function buildReceiptPdf(input: ReceiptPdfInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = PAGE_HEIGHT - MARGIN;

  const clientName = input.clientLegalName.trim() || "Cliente";
  page.drawText(clientName.toUpperCase(), {
    x: MARGIN,
    y,
    size: 14,
    font: bold,
    color: rgb(0.05, 0.05, 0.05),
  });
  y -= 22;

  page.drawText(formatCnpj(input.clientCnpj), {
    x: MARGIN,
    y,
    size: 11,
    font: regular,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 28;

  const metaRight = `${input.receiptNumber}    ${formatReceiptDate(input.issueDate)}`;
  page.drawText(metaRight, {
    x: MARGIN,
    y,
    size: 11,
    font: regular,
    color: rgb(0.15, 0.15, 0.15),
  });
  y -= 36;

  page.drawText(formatMoney(input.amountCents), {
    x: MARGIN,
    y,
    size: 18,
    font: bold,
    color: rgb(0.05, 0.05, 0.05),
  });
  y -= 28;

  const amountWords = centsToWordsPt(input.amountCents);
  const amountWordsCapitalized = amountWords.charAt(0).toUpperCase() + amountWords.slice(1);
  y = drawLines(page, [amountWordsCapitalized], MARGIN, y, regular, 11, 16);
  y -= 12;

  y = drawLines(
    page,
    wrapText(input.serviceDescription, regular, 11, CONTENT_WIDTH),
    MARGIN,
    y,
    regular,
    11,
    16,
  );
  y -= 20;

  const declaration =
    "Declaro, para os devidos fins, que recebi do cliente acima identificado o valor descrito neste recibo referente aos serviços prestados.";
  y = drawLines(
    page,
    wrapText(declaration, regular, 10.5, CONTENT_WIDTH),
    MARGIN,
    y,
    regular,
    10.5,
    15,
    rgb(0.25, 0.25, 0.25),
  );
  y -= 28;

  page.drawText(input.issuerName, {
    x: MARGIN,
    y,
    size: 11,
    font: bold,
    color: rgb(0.05, 0.05, 0.05),
  });
  y -= 16;

  page.drawText(formatCpf(input.issuerCpf), {
    x: MARGIN,
    y,
    size: 10.5,
    font: regular,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 14;

  if (input.issuerEmail.trim()) {
    page.drawText(input.issuerEmail.trim(), {
      x: MARGIN,
      y,
      size: 10.5,
      font: regular,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 14;
  }

  if (input.issuerPhone.trim()) {
    page.drawText(input.issuerPhone.trim(), {
      x: MARGIN,
      y,
      size: 10.5,
      font: regular,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  return pdfDoc.save();
}
