import { formatCity, type BrazilCity } from "@/data/brazil-cities";
import { searchCitiesFn } from "@/lib/api/cities.functions";
import { citiesMatch, searchCities } from "@/lib/city-search";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

interface CityAutocompleteProps {
  value: BrazilCity | null;
  onChange: (city: BrazilCity | null) => void;
  disabled?: boolean;
  error?: string;
}

export function CityAutocomplete({ value, onChange, disabled, error }: CityAutocompleteProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(value ? formatCity(value) : "");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [remoteSuggestions, setRemoteSuggestions] = useState<BrazilCity[]>([]);
  const [searching, setSearching] = useState(false);

  const localSuggestions = searchCities(query, 8);
  const suggestions =
    remoteSuggestions.length > 0 || query.trim().length >= 2
      ? remoteSuggestions
      : localSuggestions;
  const showList = open && query.trim().length > 0 && suggestions.length > 0;

  useEffect(() => {
    if (value) setQuery(formatCity(value));
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setRemoteSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchCitiesFn({ data: { query: q, limit: 8 } });
        setRemoteSuggestions(results);
      } catch {
        setRemoteSuggestions(localSuggestions);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const selectCity = (city: BrazilCity) => {
    onChange(city);
    setQuery(formatCity(city));
    setOpen(false);
  };

  const handleInputChange = (text: string) => {
    setQuery(text);
    setOpen(true);
    setHighlight(0);
    if (value && text !== formatCity(value)) {
      onChange(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showList) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && suggestions[highlight]) {
      e.preventDefault();
      selectCity(suggestions[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          disabled={disabled}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Digite e selecione sua cidade"
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          className={cn(
            "w-full rounded-xl border bg-background py-3.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/20",
            error
              ? "border-destructive/60 focus:border-destructive/60"
              : "border-border focus:border-brand/60",
          )}
        />
        {searching && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
            ...
          </span>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1.5 max-h-56 w-full overflow-auto rounded-xl border border-border bg-surface py-1 shadow-xl"
        >
          {suggestions.map((city, i) => {
            const selected = value && citiesMatch(value, city);
            return (
              <li key={`${city.name}-${city.state}`} role="option" aria-selected={!!selected}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectCity(city)}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors",
                    i === highlight
                      ? "bg-brand-soft text-foreground"
                      : "text-foreground hover:bg-surface-elevated",
                  )}
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="font-medium">{city.name}</span>
                  <span className="text-muted-foreground">{city.state}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
