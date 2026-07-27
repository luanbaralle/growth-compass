import { cn } from "@/lib/utils";

interface DiagnosticMascotProps {
  className?: string;
}

export function DiagnosticMascot({ className }: DiagnosticMascotProps) {
  return (
    <div aria-hidden className={cn("diagnostic-mascot", className)}>
      <div className="diagnostic-mascot__glow" />
      <svg
        viewBox="0 0 160 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="diagnostic-mascot__svg"
      >
        <ellipse cx="80" cy="168" rx="42" ry="8" fill="#ff8a1e" opacity="0.12" />

        <g className="diagnostic-mascot__body-group">
          <rect x="46" y="58" width="68" height="72" rx="18" fill="#1c1c1c" stroke="#ff8a1e" strokeOpacity="0.35" strokeWidth="1.5" />
          <rect x="54" y="66" width="52" height="36" rx="10" fill="#101010" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />

          <circle cx="68" cy="84" r="5" fill="#ff8a1e" className="diagnostic-mascot__eye diagnostic-mascot__eye--left" />
          <circle cx="92" cy="84" r="5" fill="#ff8a1e" className="diagnostic-mascot__eye diagnostic-mascot__eye--right" />
          <circle cx="66.5" cy="82.5" r="1.5" fill="#ffd4ad" opacity="0.9" />
          <circle cx="90.5" cy="82.5" r="1.5" fill="#ffd4ad" opacity="0.9" />

          <path
            d="M72 98c3 2.5 7 2.5 10 0"
            stroke="#ff8a1e"
            strokeOpacity="0.55"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M72 112h16"
            stroke="#ffffff"
            strokeOpacity="0.12"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <path
            d="M80 54V42"
            stroke="#ff8a1e"
            strokeOpacity="0.5"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="80" cy="38" r="4" fill="#ff8a1e" opacity="0.85" />

          <rect x="38" y="78" width="10" height="28" rx="5" fill="#1c1c1c" stroke="#ff8a1e" strokeOpacity="0.25" strokeWidth="1" />
          <rect x="112" y="74" width="10" height="32" rx="5" fill="#1c1c1c" stroke="#ff8a1e" strokeOpacity="0.25" strokeWidth="1" />

          <rect x="58" y="130" width="14" height="18" rx="6" fill="#1c1c1c" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
          <rect x="88" y="130" width="14" height="18" rx="6" fill="#1c1c1c" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />

          <path
            d="M80 102 L80 118 L74 126"
            stroke="#ff8a1e"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        <g className="diagnostic-mascot__glass-group">
          <circle cx="118" cy="62" r="18" stroke="#ff8a1e" strokeWidth="2.5" fill="#ff8a1e" fillOpacity="0.08" />
          <circle cx="118" cy="62" r="12" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1" />
          <line x1="106" y1="74" x2="96" y2="84" stroke="#ff8a1e" strokeWidth="3" strokeLinecap="round" />
          <path
            d="M112 56c2-3 6-4 9-2"
            stroke="#ffd4ad"
            strokeOpacity="0.6"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        <circle cx="132" cy="48" r="2" fill="#ff8a1e" opacity="0.7" className="diagnostic-mascot__spark diagnostic-mascot__spark--a" />
        <circle cx="142" cy="58" r="1.5" fill="#ff8a1e" opacity="0.5" className="diagnostic-mascot__spark diagnostic-mascot__spark--b" />
      </svg>
    </div>
  );
}
