import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// In development, serve the files in api/ the way Vercel does in production:
// /api/vendor/login runs the POST export of api/vendor/login.ts.
function devApi(): Plugin {
  return {
    name: "dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();
        const url = new URL(req.url, `http://${req.headers.host}`);
        let mod: Record<string, unknown>;
        try {
          mod = await server.ssrLoadModule(`${url.pathname}.ts`);
        } catch {
          res.statusCode = 404;
          return res.end();
        }
        const handler = mod[req.method ?? "GET"];
        if (typeof handler !== "function") {
          res.statusCode = 405;
          return res.end();
        }
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string") headers.set(k, v);
        const response: Response = await handler(
          new Request(url, {
            method: req.method,
            headers,
            body: req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.concat(chunks),
          }),
        );
        res.statusCode = response.status;
        response.headers.forEach((v, k) => k !== "set-cookie" && res.setHeader(k, v));
        const cookies = response.headers.getSetCookie();
        if (cookies.length) res.setHeader("set-cookie", cookies);
        res.end(Buffer.from(await response.arrayBuffer()));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Make .env values (VENDOR_ACCESS, VENDOR_SESSION_SECRET) visible to the dev API.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  if (mode === "preview") {
    // the single-file chat preview (scripts/build-preview.mjs)
    return {
      plugins: [react()],
      publicDir: false,
      build: { outDir: "dist-preview", emptyOutDir: true, cssCodeSplit: false, modulePreload: false, rollupOptions: { input: "preview.html" } },
    };
  }
  return { plugins: [react(), devApi()] };
});
