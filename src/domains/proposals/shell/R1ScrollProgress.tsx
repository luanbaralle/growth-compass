"use client";

import { useEffect, useState } from "react";

export function R1ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-white/[0.06]">
      <div
        className="h-full bg-gradient-to-r from-emerald-500/80 to-sky-400/80 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
