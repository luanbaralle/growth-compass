/** Extrai file ID de URLs comuns do Google Drive. */
export function extractDriveFileId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) return fileMatch[1];

  try {
    const parsed = new URL(trimmed);
    const id = parsed.searchParams.get("id");
    if (id) return id;
  } catch {
    // ignore
  }

  return null;
}

export function isGoogleDriveUrl(url: string): boolean {
  try {
    const host = new URL(url.trim()).hostname.toLowerCase();
    return host.includes("drive.google.com") || host.includes("docs.google.com");
  } catch {
    return false;
  }
}

/** URL de embed/preview do Drive (funciona com compartilhamento "qualquer com o link"). */
export function toDrivePreviewUrl(url: string): string | null {
  const id = extractDriveFileId(url);
  if (!id) return null;
  return `https://drive.google.com/file/d/${id}/preview`;
}

export function toDriveOpenUrl(url: string): string {
  const id = extractDriveFileId(url);
  if (id) return `https://drive.google.com/file/d/${id}/view`;
  return url.trim();
}
