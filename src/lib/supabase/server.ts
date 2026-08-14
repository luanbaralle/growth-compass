const STORAGE_BUCKET = "company-files";

export function requireSupabaseConfig(): { url: string; key: string } {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios. Configure no .env e execute as migrations.",
    );
  }
  return { url, key };
}

function buildHeaders(prefer?: string, contentType: string | false = "application/json"): HeadersInit {
  const { key } = requireSupabaseConfig();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    ...(contentType !== false ? { "Content-Type": contentType } : {}),
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

async function parseResponse<T>(res: Response, context: string): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${context}: ${res.status} ${text}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export async function dbSelect<T>(table: string, query = ""): Promise<T[]> {
  const { url } = requireSupabaseConfig();
  const q = query ? `?${query}` : "";
  const res = await fetch(`${url}/rest/v1/${table}${q}`, {
    headers: buildHeaders(),
  });
  return parseResponse<T[]>(res, `SELECT ${table}`);
}

export async function dbInsert<T>(table: string, row: Record<string, unknown> | Record<string, unknown>[]): Promise<T[]> {
  const { url } = requireSupabaseConfig();
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: buildHeaders("return=representation"),
    body: JSON.stringify(row),
  });
  const data = await parseResponse<T | T[]>(res, `INSERT ${table}`);
  return Array.isArray(data) ? data : [data];
}

export async function dbUpdate<T>(
  table: string,
  query: string,
  patch: Record<string, unknown>,
): Promise<T[]> {
  const { url } = requireSupabaseConfig();
  const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
    method: "PATCH",
    headers: buildHeaders("return=representation"),
    body: JSON.stringify(patch),
  });
  const data = await parseResponse<T | T[]>(res, `UPDATE ${table}`);
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

export async function dbDelete(table: string, query: string): Promise<void> {
  const { url } = requireSupabaseConfig();
  const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
    method: "DELETE",
    headers: buildHeaders(undefined, false),
  });
  await parseResponse<void>(res, `DELETE ${table}`);
}

export async function dbCount(table: string, query = ""): Promise<number> {
  const { url, key } = requireSupabaseConfig();
  const q = query ? `?${query}` : "";
  const res = await fetch(`${url}/rest/v1/${table}${q}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "count=exact",
      Range: "0-0",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`COUNT ${table}: ${res.status} ${text}`);
  }
  const range = res.headers.get("content-range");
  if (!range) return 0;
  const total = range.split("/")[1];
  return parseInt(total, 10) || 0;
}

export async function storageUpload(
  path: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<void> {
  const { url } = requireSupabaseConfig();
  const res = await fetch(`${url}/storage/v1/object/${STORAGE_BUCKET}/${path}`, {
    method: "POST",
    headers: {
      ...buildHeaders(undefined, contentType),
      "x-upsert": "true",
    },
    body: body as BodyInit,
  });
  await parseResponse(res, `STORAGE UPLOAD ${path}`);
}

export async function storageDelete(path: string): Promise<void> {
  const { url } = requireSupabaseConfig();
  const res = await fetch(`${url}/storage/v1/object/${STORAGE_BUCKET}/${path}`, {
    method: "DELETE",
    headers: buildHeaders(undefined, false),
  });
  await parseResponse(res, `STORAGE DELETE ${path}`);
}

type StorageListItem = {
  name: string;
  id: string | null;
  metadata: { size?: number } | null;
};

export async function storageList(
  prefix: string,
  limit = 1000,
  offset = 0,
): Promise<StorageListItem[]> {
  const { url } = requireSupabaseConfig();
  const res = await fetch(`${url}/storage/v1/object/list/${STORAGE_BUCKET}`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      prefix: prefix.replace(/^\//, ""),
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    }),
  });
  const data = await parseResponse<StorageListItem[]>(res, `STORAGE LIST ${prefix}`);
  return data ?? [];
}

export async function storageListAllFilePaths(rootPrefix: string): Promise<string[]> {
  const normalized = rootPrefix.replace(/^\//, "").replace(/\/$/, "");
  const paths: string[] = [];

  async function walk(prefix: string): Promise<void> {
    let offset = 0;
    while (true) {
      const items = await storageList(prefix, 1000, offset);
      if (items.length === 0) break;

      for (const item of items) {
        const childPath = prefix ? `${prefix}/${item.name}` : item.name;
        if (item.id === null) {
          await walk(childPath);
        } else {
          paths.push(childPath);
        }
      }

      if (items.length < 1000) break;
      offset += items.length;
    }
  }

  await walk(normalized);
  return paths;
}

export async function storageSignUrl(path: string, expiresIn = 3600): Promise<string> {
  const { url } = requireSupabaseConfig();
  const res = await fetch(`${url}/storage/v1/object/sign/${STORAGE_BUCKET}/${path}`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ expiresIn }),
  });
  const data = await parseResponse<{ signedURL: string }>(res, `STORAGE SIGN ${path}`);
  return `${url}/storage/v1${data.signedURL}`;
}

export { STORAGE_BUCKET };
