import type { Case } from "@/types/case";
import { kbconcept } from "./kbconcept";
import { nobre } from "./nobre";
import { studio21 } from "./studio21";
import { unip } from "./unip";

const rawCases: Case[] = [studio21, unip, nobre, kbconcept];

function attachNextProjects(cases: Case[]): Case[] {
  return cases.map((current) => ({
    ...current,
    nextProjects: cases
      .filter((other) => other.slug !== current.slug)
      .slice(0, 3)
      .map((other) => ({
        slug: other.slug,
        title: other.title,
        coverImage: other.coverImage,
      })),
  }));
}

export const allCases: Case[] = attachNextProjects(rawCases);

export function getAllCases(): Case[] {
  return allCases;
}

export function getCaseBySlug(slug: string): Case | undefined {
  return allCases.find((c) => c.slug === slug);
}

export function getCaseSlugs(): string[] {
  return allCases.map((c) => c.slug);
}
