/** Rola o container principal do OS (e fallback window) para o topo. */
export function scrollOsShellToTop(): void {
  const main = document.querySelector("main.dashboard-page-bg");
  if (main instanceof HTMLElement) {
    main.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}
