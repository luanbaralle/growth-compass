import type { ContentChannel, ContentType } from "@/domains/content-production/types";
import { TYPE_LABELS } from "@/domains/content-production/types";
import {
  buildPublicationCaption,
  getPreviewAspect,
  isCarousel,
  isVerticalVideo,
  toSocialHandle,
  type PreviewAspect,
  type PublicationPreviewInput,
} from "@/domains/content-production/content-publication-preview-utils";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Pause,
  Play,
  Send,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { useRef, useState } from "react";

export type PublicationPreviewProps = PublicationPreviewInput & {
  channel: ContentChannel;
  contentType: ContentType;
  companyName: string;
  mediaUrl?: string | null;
  mediaMimeType?: string | null;
};

function Avatar({
  name,
  className,
  ring,
}: {
  name: string;
  className?: string;
  ring?: boolean;
}) {
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] p-[2px]",
        ring && "p-[2px]",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white",
        )}
      >
        {initial}
      </div>
    </div>
  );
}

function PreviewCaption({
  text,
  className,
  placeholderClassName,
}: {
  text: string;
  className?: string;
  placeholderClassName?: string;
}) {
  if (!text.trim() || text.startsWith("Escreva a legenda")) {
    return (
      <p className={cn("italic opacity-60", placeholderClassName, className)}>
        {text}
      </p>
    );
  }

  return (
    <p className={cn("whitespace-pre-wrap break-words leading-snug", className)}>
      {text}
    </p>
  );
}

function PlayableMedia({
  aspect,
  mediaUrl,
  mediaMimeType,
  contentType,
  channel,
  className,
}: {
  aspect: PreviewAspect;
  mediaUrl?: string | null;
  mediaMimeType?: string | null;
  contentType: ContentType;
  channel: ContentChannel;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const aspectClass =
    aspect === "portrait"
      ? "aspect-[9/16]"
      : aspect === "landscape"
        ? "aspect-video"
        : "aspect-square";

  const isVideoMedia =
    !!mediaMimeType?.startsWith("video/") ||
    (!mediaMimeType && contentType.startsWith("video_"));

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || !isVideoMedia) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-zinc-900",
        aspectClass,
        isVideoMedia && mediaUrl && "cursor-pointer",
        className,
      )}
      onClick={isVideoMedia && mediaUrl ? togglePlay : undefined}
      onKeyDown={
        isVideoMedia && mediaUrl
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                togglePlay();
              }
            }
          : undefined
      }
      role={isVideoMedia && mediaUrl ? "button" : undefined}
      tabIndex={isVideoMedia && mediaUrl ? 0 : undefined}
      aria-label={isVideoMedia && mediaUrl ? (playing ? "Pausar vídeo" : "Reproduzir vídeo") : undefined}
    >
      {mediaUrl ? (
        isVideoMedia ? (
          <video
            ref={videoRef}
            src={mediaUrl}
            className="h-full w-full object-cover"
            playsInline
            loop
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />
        ) : (
          <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
        )
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-800 to-zinc-950 text-zinc-400">
          <span className="text-[11px] font-medium uppercase tracking-wide">
            {TYPE_LABELS[contentType]}
          </span>
          <span className="px-4 text-center text-[10px] text-zinc-500">
            Envie thumbnail ou edição na aba Arquivos
          </span>
        </div>
      )}

      {isVideoMedia && mediaUrl && !playing && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm">
            <Play className="ml-1 h-6 w-6 fill-current" />
          </div>
        </div>
      )}

      {isVideoMedia && mediaUrl && playing && (
        <div className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/45 p-1.5 text-white/90">
          <Pause className="h-3.5 w-3.5 fill-current" />
        </div>
      )}

      {isCarousel(contentType) && channel !== "youtube" && (
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full shadow-sm",
                i === 0 ? "bg-white" : "bg-white/40",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function InstagramReelsPreview(props: PublicationPreviewProps) {
  const caption = buildPublicationCaption(props);
  const handle = toSocialHandle(props.companyName);

  return (
    <div className="mx-auto w-full max-w-[260px]">
      <div className="overflow-hidden rounded-[28px] border-[3px] border-zinc-800 bg-black shadow-2xl">
        <div className="relative bg-black text-white">
          <PlayableMedia
            aspect="portrait"
            mediaUrl={props.mediaUrl}
            mediaMimeType={props.mediaMimeType}
            contentType={props.contentType}
            channel="instagram"
            className="max-h-[420px] min-h-[360px]"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/75" />

          <div className="pointer-events-none absolute left-3 right-14 top-3 flex items-center justify-between text-[10px] font-semibold">
            <span>Reels</span>
            <span className="rounded-full bg-black/35 px-2 py-0.5">Seguindo</span>
          </div>

          <div className="pointer-events-none absolute bottom-20 right-2 flex flex-col items-center gap-4 text-white">
            <div className="flex flex-col items-center gap-1">
              <Heart className="h-6 w-6 drop-shadow" strokeWidth={1.5} />
              <span className="text-[9px] font-semibold drop-shadow">1,2 mil</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <MessageCircle className="h-6 w-6 drop-shadow" strokeWidth={1.5} />
              <span className="text-[9px] font-semibold drop-shadow">48</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Send className="h-6 w-6 drop-shadow" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col items-center gap-1">
              <MoreHorizontal className="h-6 w-6 drop-shadow" strokeWidth={1.5} />
            </div>
            <Avatar name={props.companyName} className="mt-1 h-7 w-7" ring />
          </div>

          <div className="pointer-events-none absolute bottom-0 left-0 right-12 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Avatar name={props.companyName} className="h-6 w-6" ring />
              <span className="text-[11px] font-semibold drop-shadow">{handle || "marca"}</span>
              <span className="rounded border border-white/70 px-1.5 py-0.5 text-[8px] font-semibold">
                Seguir
              </span>
            </div>
            <PreviewCaption
              text={caption}
              className="line-clamp-4 text-[10px] text-white drop-shadow"
              placeholderClassName="text-white/70"
            />
            <div className="mt-2 flex items-center gap-1.5 text-[9px] text-white/80">
              <Music2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{props.companyName} · áudio original</span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] text-muted-foreground">
        Clique no vídeo para reproduzir
      </p>
    </div>
  );
}

function InstagramFeedPreview(props: PublicationPreviewProps) {
  const caption = buildPublicationCaption(props);
  const handle = toSocialHandle(props.companyName);
  const aspect = getPreviewAspect("instagram", props.contentType);

  return (
    <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-md">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <Avatar name={props.companyName} className="h-8 w-8" ring />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold leading-tight">{handle || "marca"}</p>
          <p className="text-[10px] text-zinc-500">{props.companyName}</p>
        </div>
        <MoreHorizontal className="h-5 w-5 text-zinc-800" />
      </div>

      <PlayableMedia
        aspect={aspect}
        mediaUrl={props.mediaUrl}
        mediaMimeType={props.mediaMimeType}
        contentType={props.contentType}
        channel="instagram"
      />

      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-3.5">
          <Heart className="h-6 w-6" strokeWidth={1.75} />
          <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
          <Send className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <Bookmark className="h-6 w-6" strokeWidth={1.75} />
      </div>

      <div className="space-y-1 px-3 pb-3">
        <p className="text-[11px] font-semibold">1.234 curtidas</p>
        <div className="text-[11px] leading-relaxed">
          <span className="font-semibold">{handle || "marca"} </span>
          <PreviewCaption
            text={caption}
            className="inline text-[11px] text-zinc-800"
            placeholderClassName="text-zinc-400"
          />
        </div>
        <p className="pt-1 text-[10px] uppercase tracking-wide text-zinc-400">
          Ver todos os 12 comentários
        </p>
        <p className="text-[9px] uppercase text-zinc-400">Há 2 horas</p>
      </div>
    </div>
  );
}

function InstagramPreview(props: PublicationPreviewProps) {
  if (isVerticalVideo(props.contentType)) {
    return <InstagramReelsPreview {...props} />;
  }
  return <InstagramFeedPreview {...props} />;
}

function FacebookPreview(props: PublicationPreviewProps) {
  const caption = buildPublicationCaption(props);
  const aspect = getPreviewAspect("facebook", props.contentType);

  return (
    <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-md">
      <div className="flex items-start gap-2 px-3 py-3">
        <Avatar name={props.companyName} className="h-9 w-9" />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold">{props.companyName}</p>
          <p className="text-[10px] text-zinc-500">Agora · 🌎</p>
        </div>
        <MoreHorizontal className="h-5 w-5 text-zinc-500" />
      </div>
      <div className="px-3 pb-2">
        <PreviewCaption text={caption} className="text-[12px] text-zinc-800" />
      </div>
      <PlayableMedia
        aspect={aspect}
        mediaUrl={props.mediaUrl}
        mediaMimeType={props.mediaMimeType}
        contentType={props.contentType}
        channel="facebook"
      />
      <div className="border-t border-zinc-100 px-3 py-2 text-[10px] text-zinc-500">
        👍 842 · 💬 56 comentários · ↗ 12 compartilhamentos
      </div>
      <div className="grid grid-cols-3 border-t border-zinc-100 py-2 text-[11px] font-medium text-zinc-600">
        <span className="flex items-center justify-center gap-1.5">
          <ThumbsUp className="h-4 w-4 text-blue-600" /> Curtir
        </span>
        <span className="flex items-center justify-center gap-1.5">
          <MessageCircle className="h-4 w-4" /> Comentar
        </span>
        <span className="flex items-center justify-center gap-1.5">
          <Share2 className="h-4 w-4" /> Compartilhar
        </span>
      </div>
    </div>
  );
}

function YouTubePreview(props: PublicationPreviewProps) {
  const caption = buildPublicationCaption(props);

  return (
    <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl bg-[#0f0f0f] text-white shadow-md ring-1 ring-white/10">
      <PlayableMedia
        aspect="landscape"
        mediaUrl={props.mediaUrl}
        mediaMimeType={props.mediaMimeType}
        contentType={props.contentType}
        channel="youtube"
      />
      <div className="space-y-2.5 p-3">
        <p className="line-clamp-2 text-[13px] font-semibold leading-snug">
          {props.title || "Título do vídeo"}
        </p>
        <div className="flex items-center gap-2">
          <Avatar name={props.companyName} className="h-8 w-8" />
          <div>
            <p className="text-[11px] font-medium">{props.companyName}</p>
            <p className="text-[10px] text-zinc-400">12 mil inscritos</p>
          </div>
        </div>
        <div className="rounded-lg bg-white/5 p-2.5">
          <PreviewCaption
            text={caption}
            className="line-clamp-3 text-[10px] text-zinc-300"
          />
        </div>
      </div>
    </div>
  );
}

function TikTokPreview(props: PublicationPreviewProps) {
  const caption = buildPublicationCaption(props);
  const handle = toSocialHandle(props.companyName);

  return (
    <div className="mx-auto w-full max-w-[260px]">
      <div className="relative overflow-hidden rounded-[24px] border-[3px] border-zinc-800 bg-black text-white shadow-2xl">
        <PlayableMedia
          aspect="portrait"
          mediaUrl={props.mediaUrl}
          mediaMimeType={props.mediaMimeType}
          contentType={props.contentType}
          channel="tiktok"
          className="max-h-[420px] min-h-[360px]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        <div className="pointer-events-none absolute right-2 bottom-24 flex flex-col items-center gap-4">
          <Avatar name={props.companyName} className="h-10 w-10" ring />
          <Heart className="h-6 w-6" strokeWidth={1.75} />
          <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
          <Bookmark className="h-6 w-6" strokeWidth={1.75} />
          <Share2 className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-14 p-3">
          <p className="text-[12px] font-bold">@{handle || "marca"}</p>
          <PreviewCaption
            text={caption}
            className="mt-1 line-clamp-3 text-[11px] text-white/95"
          />
          <p className="mt-2 flex items-center gap-1 text-[10px] text-white/75">
            <Music2 className="h-3 w-3" />
            som original · {props.companyName}
          </p>
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] text-muted-foreground">
        Clique no vídeo para reproduzir
      </p>
    </div>
  );
}

export function ContentPublicationChannelPreview(props: PublicationPreviewProps) {
  switch (props.channel) {
    case "instagram":
      return <InstagramPreview {...props} />;
    case "facebook":
      return <FacebookPreview {...props} />;
    case "youtube":
      return <YouTubePreview {...props} />;
    case "tiktok":
      return <TikTokPreview {...props} />;
  }
}
