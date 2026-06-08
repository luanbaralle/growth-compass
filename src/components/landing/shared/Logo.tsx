import logoSrc from "@/assets/raise-one-logo.png";

export function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <img
      src={logoSrc}
      alt="Raise One"
      className={`${className} object-contain`}
    />
  );
}
