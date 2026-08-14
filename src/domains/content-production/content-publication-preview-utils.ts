import type { ContentChannel, ContentType } from "./types";

export type PublicationPreviewInput = {
  title: string;
  briefingCaption: string;
};

export function buildPublicationCaption(input: PublicationPreviewInput): string {
  if (input.briefingCaption.trim()) return input.briefingCaption.trim();
  if (input.title.trim()) return input.title.trim();
  return "Escreva a legenda na aba Briefing…";
}

export function toSocialHandle(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
    .slice(0, 24);
}

export type PreviewAspect = "square" | "portrait" | "landscape";

export function getPreviewAspect(
  channel: ContentChannel,
  contentType: ContentType,
): PreviewAspect {
  if (channel === "youtube") return "landscape";
  if (channel === "tiktok") return "portrait";

  if (channel === "instagram") {
    if (contentType === "video_curto" || contentType === "carrossel") return "portrait";
    if (contentType === "video_medio" || contentType === "video_longo") return "landscape";
    return "square";
  }

  if (contentType === "video_curto") return "portrait";
  if (contentType === "video_medio" || contentType === "video_longo") return "landscape";
  return "square";
}

export function isVerticalVideo(contentType: ContentType): boolean {
  return contentType === "video_curto";
}

export function isCarousel(contentType: ContentType): boolean {
  return contentType === "carrossel";
}
