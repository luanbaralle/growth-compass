import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getDataDir } from "@/lib/data-dir.server";
import { getSerpPrefer } from "./serper.server";
import type { SerpFetchResult } from "./types";

const CACHE_FILE = path.join(getDataDir(), "serp-cache.json");
const TTL_MS = 48 * 60 * 60 * 1000;

interface SerpCacheStore {
  [normalizedQuery: string]: {
    expiresAt: string;
    result: SerpFetchResult;
  };
}

async function readStore(): Promise<SerpCacheStore> {
  await mkdir(path.dirname(CACHE_FILE), { recursive: true });
  try {
    const raw = await readFile(CACHE_FILE, "utf-8");
    return JSON.parse(raw) as SerpCacheStore;
  } catch {
    return {};
  }
}

async function writeStore(store: SerpCacheStore): Promise<void> {
  await mkdir(path.dirname(CACHE_FILE), { recursive: true });
  await writeFile(CACHE_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export function normalizeSerpQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function serpCacheKey(query: string): string {
  return `${normalizeSerpQuery(query)}|${getSerpPrefer()}`;
}

export async function getCachedSerp(query: string): Promise<SerpFetchResult | null> {
  const key = serpCacheKey(query);
  if (!key) return null;

  const store = await readStore();
  const entry = store[key];
  if (!entry) return null;

  if (new Date(entry.expiresAt).getTime() < Date.now()) {
    delete store[key];
    await writeStore(store);
    return null;
  }

  return entry.result;
}

export async function setCachedSerp(query: string, result: SerpFetchResult): Promise<void> {
  const key = serpCacheKey(query);
  if (!key || result.source !== "google") return;

  const store = await readStore();
  store[key] = {
    expiresAt: new Date(Date.now() + TTL_MS).toISOString(),
    result,
  };
  await writeStore(store);
}
