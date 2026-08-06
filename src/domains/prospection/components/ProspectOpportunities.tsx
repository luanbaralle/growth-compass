import { updateProspectOpportunity } from "@/domains/prospection/api.server";
import type { ProspectOpportunityItem } from "@/domains/prospection/types";
import { OPPORTUNITY_ITEMS } from "@/domains/prospection/types";
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
          <div key={item.key} className="flex items-center gap-2 rounded-lg border border-border/40 px-3 py-2">
            <Checkbox
              id={`opp-${item.key}`}
              checked={checked}
              onCheckedChange={(v) => void toggle(item.key, v === true)}
            />
            <Label htmlFor={`opp-${item.key}`} className="cursor-pointer text-sm font-normal">
              {item.label}
            </Label>
          </div>
        );
      })}
    </div>
  );
}
