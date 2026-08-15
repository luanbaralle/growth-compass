/** Converte action_url (ex. /os/producao?task=uuid) para navegação TanStack Router */
export function parseNotificationHref(href: string): {
  to: string;
  search: Record<string, string>;
} {
  try {
    const url = new URL(href, "http://localhost");
    const search: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      search[key] = value;
    });
    return { to: url.pathname, search };
  } catch {
    return { to: href, search: {} };
  }
}
