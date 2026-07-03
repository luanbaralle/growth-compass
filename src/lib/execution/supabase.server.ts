import type { ExecutionState } from "./types";

const ROW_ID = "main";

export function isSupabaseEnabled(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function headers() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
}

export async function loadSupabaseExecutionState(): Promise<ExecutionState | null> {
  const url = process.env.SUPABASE_URL!;
  const res = await fetch(
    `${url}/rest/v1/r1_execution_state?id=eq.${ROW_ID}&select=data`,
    { headers: headers() },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase read failed: ${res.status} ${text}`);
  }

  const rows = (await res.json()) as { data: ExecutionState }[];
  if (!rows.length) return null;
  return rows[0].data;
}

export async function saveSupabaseExecutionState(state: ExecutionState): Promise<void> {
  const url = process.env.SUPABASE_URL!;
  const payload = {
    id: ROW_ID,
    data: state,
    updated_at: new Date().toISOString(),
  };

  const res = await fetch(`${url}/rest/v1/r1_execution_state`, {
    method: "POST",
    headers: { ...headers(), Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase write failed: ${res.status} ${text}`);
  }
}
