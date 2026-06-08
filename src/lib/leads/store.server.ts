import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getDataDir } from "@/lib/data-dir.server";
import type { Lead, LeadStatus, SubmitLeadInput } from "./types";

const LEADS_FILE = path.join(getDataDir(), "leads.json");

async function ensureStore(): Promise<Lead[]> {
  await mkdir(path.dirname(LEADS_FILE), { recursive: true });
  try {
    const raw = await readFile(LEADS_FILE, "utf-8");
    return JSON.parse(raw) as Lead[];
  } catch {
    await writeFile(LEADS_FILE, "[]", "utf-8");
    return [];
  }
}

async function saveLeads(leads: Lead[]): Promise<void> {
  await mkdir(path.dirname(LEADS_FILE), { recursive: true });
  await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

export async function createLead(input: SubmitLeadInput): Promise<Lead> {
  const leads = await ensureStore();
  const now = new Date().toISOString();

  const lead: Lead = {
    id: randomUUID(),
    ...input,
    status: "new",
    createdAt: now,
    updatedAt: now,
  };

  leads.unshift(lead);
  await saveLeads(leads);
  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  const leads = await ensureStore();
  return leads.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  notes?: string,
): Promise<Lead | null> {
  const leads = await ensureStore();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;

  leads[index] = {
    ...leads[index],
    status,
    notes: notes ?? leads[index].notes,
    updatedAt: new Date().toISOString(),
  };

  await saveLeads(leads);
  return leads[index];
}

export async function deleteLead(id: string): Promise<boolean> {
  const leads = await ensureStore();
  const next = leads.filter((l) => l.id !== id);
  if (next.length === leads.length) return false;
  await saveLeads(next);
  return true;
}
