import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { getDataDir } from "@/lib/data-dir.server";

const RATE_LIMIT_FILE = path.join(getDataDir(), "serp-rate-limit.json");
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

interface RateLimitEntry {
  timestamps: number[];
}

type RateLimitStore = Record<string, RateLimitEntry>;

export interface SerpRateLimitStatus {
  allowed: boolean;
  bypassed: boolean;
  hourCount: number;
  dayCount: number;
  maxHour: number;
  maxDay: number;
  retryAfterMs?: number;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getBypassIps(): Set<string> {
  const raw = process.env.SERP_RATE_LIMIT_BYPASS_IPS;
  const defaults = ["127.0.0.1", "::1", "0:0:0:0:0:0:0:1"];
  if (!raw?.trim()) return new Set(defaults);
  return new Set([
    ...defaults,
    ...raw
      .split(",")
      .map((ip) => ip.trim())
      .filter(Boolean),
  ]);
}

function getMaxHour(): number {
  return parsePositiveInt(process.env.SERP_RATE_LIMIT_MAX_HOUR, 8);
}

function getMaxDay(): number {
  return parsePositiveInt(process.env.SERP_RATE_LIMIT_MAX_DAY, 20);
}

async function readStore(): Promise<RateLimitStore> {
  await mkdir(path.dirname(RATE_LIMIT_FILE), { recursive: true });
  try {
    const raw = await readFile(RATE_LIMIT_FILE, "utf-8");
    return JSON.parse(raw) as RateLimitStore;
  } catch {
    return {};
  }
}

async function writeStore(store: RateLimitStore): Promise<void> {
  await mkdir(path.dirname(RATE_LIMIT_FILE), { recursive: true });
  await writeFile(RATE_LIMIT_FILE, JSON.stringify(store, null, 2), "utf-8");
}

function pruneTimestamps(timestamps: number[], now: number): number[] {
  const cutoff = now - DAY_MS;
  return timestamps.filter((ts) => ts > cutoff);
}

export function resolveClientIp(): string {
  const forwarded = getRequestIP({ xForwardedFor: true });
  if (forwarded) return forwarded;

  const realIp = getRequestHeader("x-real-ip");
  if (realIp) return realIp;

  const cfIp = getRequestHeader("cf-connecting-ip");
  if (cfIp) return cfIp;

  return "unknown";
}

export function isSerpRateLimitBypassed(ip: string): boolean {
  if (getBypassIps().has(ip)) return true;

  const secret = process.env.SERP_DEV_BYPASS_SECRET?.trim();
  if (!secret) return false;

  const header = getRequestHeader("x-serp-dev-bypass");
  return header === secret;
}

export async function checkSerpRateLimit(ip: string): Promise<SerpRateLimitStatus> {
  const maxHour = getMaxHour();
  const maxDay = getMaxDay();
  const bypassed = isSerpRateLimitBypassed(ip);

  if (bypassed) {
    return {
      allowed: true,
      bypassed: true,
      hourCount: 0,
      dayCount: 0,
      maxHour,
      maxDay,
    };
  }

  const now = Date.now();
  const hourCutoff = now - HOUR_MS;
  const store = await readStore();
  const entry = store[ip] ?? { timestamps: [] };
  const dayTimestamps = pruneTimestamps(entry.timestamps, now);
  const hourTimestamps = dayTimestamps.filter((ts) => ts > hourCutoff);
  const hourCount = hourTimestamps.length;
  const dayCount = dayTimestamps.length;

  if (hourCount >= maxHour) {
    const oldest = Math.min(...hourTimestamps);
    return {
      allowed: false,
      bypassed: false,
      hourCount,
      dayCount,
      maxHour,
      maxDay,
      retryAfterMs: Math.max(0, oldest + HOUR_MS - now),
    };
  }

  if (dayCount >= maxDay) {
    const oldest = Math.min(...dayTimestamps);
    return {
      allowed: false,
      bypassed: false,
      hourCount,
      dayCount,
      maxHour,
      maxDay,
      retryAfterMs: Math.max(0, oldest + DAY_MS - now),
    };
  }

  return {
    allowed: true,
    bypassed: false,
    hourCount,
    dayCount,
    maxHour,
    maxDay,
  };
}

/** Registra uma chamada live ao Serper/CSE (cache não passa por aqui). */
export async function recordSerpLiveRequest(ip: string): Promise<void> {
  if (isSerpRateLimitBypassed(ip)) return;

  const now = Date.now();
  const store = await readStore();
  const entry = store[ip] ?? { timestamps: [] };
  entry.timestamps = pruneTimestamps([...entry.timestamps, now], now);
  store[ip] = entry;

  // Remove IPs inativos há mais de 7 dias
  for (const [key, value] of Object.entries(store)) {
    const pruned = pruneTimestamps(value.timestamps, now);
    if (pruned.length === 0) delete store[key];
    else store[key] = { timestamps: pruned };
  }

  await writeStore(store);
}

/** Verifica limite e consome 1 slot antes de uma chamada live ao Serper/CSE. */
export async function consumeSerpLiveQuota(ip: string): Promise<SerpRateLimitStatus> {
  const status = await checkSerpRateLimit(ip);
  if (!status.allowed) return status;

  await recordSerpLiveRequest(ip);
  return {
    ...status,
    hourCount: status.hourCount + (status.bypassed ? 0 : 1),
    dayCount: status.dayCount + (status.bypassed ? 0 : 1),
  };
}
