import { heroTypewriterPhrases } from "@/lib/home/content";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const TYPE_MS = 54;
const DELETE_MS = 34;
const PAUSE_TYPED_MS = 2400;
const PAUSE_DELETED_MS = 420;

interface HeroTypewriterProps {
  className?: string;
}

export function HeroTypewriter({ className }: HeroTypewriterProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(true);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const phrase = heroTypewriterPhrases[phraseIndex];
    let timeoutId = 0;

    if (!isDeleting && text === phrase) {
      timeoutId = window.setTimeout(() => setIsDeleting(true), PAUSE_TYPED_MS);
    } else if (isDeleting && text === "") {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((current) => (current + 1) % heroTypewriterPhrases.length);
      }, PAUSE_DELETED_MS);
    } else if (isDeleting) {
      timeoutId = window.setTimeout(() => {
        setText(phrase.slice(0, text.length - 1));
      }, DELETE_MS);
    } else {
      timeoutId = window.setTimeout(() => {
        setText(phrase.slice(0, text.length + 1));
      }, TYPE_MS);
    }

    return () => window.clearTimeout(timeoutId);
  }, [isActive, text, isDeleting, phraseIndex]);

  return (
    <p
      className={cn(
        "mx-auto inline-flex min-h-[2.75rem] max-w-full items-center justify-center rounded-full border border-brand/25 bg-brand-soft/50 px-4 py-2 text-sm font-semibold tracking-tight text-foreground shadow-[0_0_32px_oklch(0.72_0.19_48_/_0.12)] backdrop-blur-sm sm:min-h-[3rem] sm:px-5 sm:text-base",
        className,
      )}
      aria-live="polite"
    >
      <span className="relative inline-flex items-center">
        <span className="invisible whitespace-nowrap" aria-hidden="true">
          {heroTypewriterPhrases[1]}
        </span>
        <span className="absolute inset-0 inline-flex items-center justify-center whitespace-nowrap">
          {text}
          <span
            aria-hidden="true"
            className="ml-px inline-block h-[1.05em] w-[2px] translate-y-px animate-pulse bg-brand"
          />
        </span>
      </span>
    </p>
  );
}
