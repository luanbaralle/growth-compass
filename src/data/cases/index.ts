import type { Case } from "@/types/case";
import { amf } from "./amf";
import { atlas } from "./atlas";
import { kbconcept } from "./kbconcept";
import { studio21 } from "./studio21";
import { unip } from "./unip";
import { valerio } from "./valerio";

const rawCases: Case[] = [studio21, unip, kbconcept, valerio, amf, atlas];

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
