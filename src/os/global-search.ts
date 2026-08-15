export type GlobalSearchResultKind =
  | "company"
  | "project"
  | "prospect"
  | "content_task";

export type GlobalSearchResult = {
  id: string;
  kind: GlobalSearchResultKind;
  title: string;
  subtitle: string;
  href: string;
};

export type GlobalSearchResponse = {
  query: string;
  results: GlobalSearchResult[];
};

export const GLOBAL_SEARCH_KIND_LABELS: Record<GlobalSearchResultKind, string> = {
  company: "Empresas",
  project: "Projetos",
  prospect: "Prospecção",
  content_task: "Produção",
};

export const OS_SEARCH_OPEN_EVENT = "os:open-search";

export function openOSSearch() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OS_SEARCH_OPEN_EVENT));
}
