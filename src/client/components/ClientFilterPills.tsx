import { cn } from "@/lib/utils";

export function ClientFilterPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="client-filter-row" role="tablist">
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={cn("client-filter-pill", active && "client-filter-pill-active")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
