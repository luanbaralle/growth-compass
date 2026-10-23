// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

function resolveColoniaFemVideoDir() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const projetos = path.resolve(here, "../..");
  const femRoot = fs
    .readdirSync(projetos, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && entry.name.startsWith("Pousada Colonia"));
  if (!femRoot) return null;
  const dir = path.join(projetos, femRoot.name, "next-app/public/assets/video");
  return fs.existsSync(dir) ? dir : null;
}

function sendMp4(req: IncomingMessage, res: ServerResponse, filePath: string) {
  const stat = fs.statSync(filePath);
  const range = req.headers.range;
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Cache-Control", "no-cache");

  if (!range) {
    res.setHeader("Content-Length", stat.size);
    res.statusCode = 200;
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const [startRaw, endRaw] = range.replace(/bytes=/, "").split("-");
  const start = Number.parseInt(startRaw, 10);
  const end = endRaw ? Number.parseInt(endRaw, 10) : stat.size - 1;
  if (Number.isNaN(start) || Number.isNaN(end) || start >= stat.size) {
    res.statusCode = 416;
    res.setHeader("Content-Range", `bytes */${stat.size}`);
    res.end();
    return;
  }

  res.statusCode = 206;
  res.setHeader("Content-Range", `bytes ${start}-${end}/${stat.size}`);
  res.setHeader("Content-Length", end - start + 1);
  fs.createReadStream(filePath, { start, end }).pipe(res);
}

function coloniaFemVideoPlugin() {
  const dir = resolveColoniaFemVideoDir();
  return {
    name: "colonia-fem-video",
    configureServer(server: { middlewares: { use: (path: string, handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void } }) {
      if (dir) {
        console.info(`[colonia-fem-video] serving ${dir}`);
      } else {
        console.warn("[colonia-fem-video] local mp4 folder not found");
      }

      server.middlewares.use("/colonia-fem-video", (req, res, next) => {
        if (!dir) {
          next();
          return;
        }
        const file = decodeURIComponent((req.url ?? "").split("?")[0] ?? "").replace(/^\/+/, "");
        if (!file.endsWith(".mp4") || file.includes("..") || file.includes("/") || file.includes("\\")) {
          next();
          return;
        }
        const full = path.join(dir, file);
        if (!fs.existsSync(full)) {
          next();
          return;
        }
        sendMp4(req, res, full);
      });
    },
  };
}

export default defineConfig({
  nitro: { preset: "vercel" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      coloniaFemVideoPlugin(),
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
