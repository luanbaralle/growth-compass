import { updateProspectOpportunity } from "@/domains/prospection/api.server";
import type { ProspectOpportunityItem } from "@/domains/prospection/types";
import { OPPORTUNITY_ITEMS } from "@/domains/prospection/types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function ProspectOpportunities({
  prospectId,
  items,
  onUpdated,
}: {
  prospectId: string;
  items: ProspectOpportunityItem[];
  onUpdated: () => void;
}) {
  const itemMap = new Map(items.map((i) => [i.opportunity_key, i.checked]));

  const toggle = async (key: string, checked: boolean) => {
    await updateProspectOpportunity({ data: { prospectId, opportunityKey: key, checked } });
    onUpdated();
  };

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {OPPORTUNITY_ITEMS.map((item) => {
        const checked = itemMap.get(item.key) ?? false;
        return (
          <label
            key={item.key}
            htmlFor={`opp-${item.key}`}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 transition-colors",
              checked
                ? "border-brand/25 bg-brand/5"
                : "border-border/20 bg-surface-elevated/30 hover:border-border/35",
            )}
          >
            <Checkbox
              id={`opp-${item.key}`}
              checked={checked}
              onCheckedChange={(v) => void toggle(item.key, v === true)}
            />
            <Label htmlFor={`opp-${item.key}`} className="cursor-pointer text-[13px] font-normal">
              {item.label}
            </Label>
          </label>
        );
      })}
    </div>
  );
}
