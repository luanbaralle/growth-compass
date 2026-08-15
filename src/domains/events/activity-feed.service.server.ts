import { dbSelect } from "@/lib/supabase/server";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import {
  activityFeedWindowToSince,
  ENTITY_TYPE_LABELS,
  EVENT_LABELS,
  type ActivityFeedItem,
  type ActivityFeedWindow,
} from "./activity-feed";
import * as repo from "./repository.server";
import { ENTITY_ROUTES } from "./types";
import type { DomainEvent } from "./types";

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

function resolveActionUrl(event: DomainEvent): string {
  const buildRoute = ENTITY_ROUTES[event.entity_type];
  return buildRoute ? buildRoute(event.entity_id) : "/os";
}

function resolveActorName(actorId: string | null): string | null {
  if (!actorId) return null;
  return TEAM_LABELS[actorId as TeamMember] ?? actorId;
}

async function attachCompanyNames(events: DomainEvent[]): Promise<Map<string, string>> {
  const companyIds = [...new Set(events.map((event) => event.company_id).filter(Boolean))] as string[];
  if (companyIds.length === 0) return new Map();

  const companies = await dbSelect<{ id: string; name: string }>(
    "companies",
    encodeQuery({
      select: "id,name",
      id: `in.(${companyIds.join(",")})`,
    }),
  );

  return new Map(companies.map((company) => [company.id, company.name]));
}

function mapEventToFeedItem(event: DomainEvent, companyNames: Map<string, string>): ActivityFeedItem {
  const companyId = event.company_id;
  return {
    id: event.id,
    eventKey: event.event_key,
    eventLabel: EVENT_LABELS[event.event_key] ?? event.event_key,
    entityType: event.entity_type,
    entityTypeLabel: ENTITY_TYPE_LABELS[event.entity_type] ?? event.entity_type,
    entityId: event.entity_id,
    companyId,
    companyName: companyId ? companyNames.get(companyId) ?? null : null,
    actorId: event.actor_id,
    actorName: resolveActorName(event.actor_id),
    title: event.activity_title,
    body: event.activity_body,
    occurredAt: event.occurred_at,
    actionUrl: resolveActionUrl(event),
  };
}

export async function getActivityFeed(window: ActivityFeedWindow = "24h"): Promise<{
  items: ActivityFeedItem[];
  since: string;
  window: ActivityFeedWindow;
}> {
  const since = activityFeedWindowToSince(window);
  const events = await repo.findRecentDomainEvents(since, 200);
  const companyNames = await attachCompanyNames(events);

  return {
    items: events.map((event) => mapEventToFeedItem(event, companyNames)),
    since,
    window,
  };
}
