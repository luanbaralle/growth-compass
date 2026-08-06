// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: { preset: "vercel" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      {
        name: "raise-one-server-only",
        // Externalize pure *.server modules in the client build so node-only code
        // (session, repositories) never lands in the browser bundle.
        apply: "build",
        enforce: "pre",
        resolveId(source, _importer, options) {
          if (options?.ssr) return null;
          if (!source.includes(".server") || source.includes("node_modules")) return null;
          // TanStack Start transforms server fn modules for the client — never externalize those.
          if (source.includes(".functions") || source.includes("api.server")) return null;
          return { id: source, external: true };
        },
      },
    ],
  },
});
