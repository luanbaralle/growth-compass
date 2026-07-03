export interface HoursSnapshot {
  id: string;
  date: string;
  week: number;
  weekLabel: string;
  hoursRecovered: number;
  hoursGoal: number;
  delegatedCount: number;
  totalDelegations: number;
  productionQueue: number;
  avgDelayDays: number;
  recordedBy?: TeamMember;
  source: "review" | "manual";
}
