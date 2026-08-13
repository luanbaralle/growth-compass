import { cn } from "@/lib/utils";

const URL_REGEX = /(https?:\/\/[^\s<>"']+)/g;

function stripTrailingPunctuation(url: string): string {
  return url.replace(/[.,;:!?)]+$/, "");
}

export function textContainsUrl(text: string): boolean {
  return /https?:\/\/[^\s<>"']+/.test(text);
}

export function LinkifiedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(URL_REGEX);

  return (
    <div className={cn("whitespace-pre-wrap break-words text-sm leading-relaxed", className)}>
      {parts.map((part, index) => {
        if (!/^https?:\/\//.test(part)) {
          return <span key={index}>{part}</span>;
        }

        const href = stripTrailingPunctuation(part);
        const trailing = part.slice(href.length);

        return (
          <span key={index}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand underline underline-offset-2 hover:text-brand/80"
              onClick={(e) => e.stopPropagation()}
            >
              {href}
            </a>
            {trailing}
          </span>
        );
      })}
    </div>
  );
}
