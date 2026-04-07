/**
 * Purpose: Serve `dist/` for Playwright without index.html → directory redirect.
 * Description:
 * - `serve` canonicalizes `/public/index.html` to `/public`, breaking `./` CSS.
 * - This server maps URL path to `dist` files literally (no strip of index.html).
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, relative, resolve } from "node:path";
import { createServer } from "node:http";
import { buildDist } from "./buildDist.js";

const PORT = Number.parseInt(process.env.E2E_PORT ?? "4173", 10);
const root = buildDist();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2"
};

function safePath(urlPath) {
  const raw = urlPath.split("?")[0];
  const trim = decodeURIComponent(raw.replace(/^\/+/, ""));
  const abs = resolve(root, trim);
  const rel = relative(root, abs);
  if (rel.startsWith("..")) {
    return null;
  }
  return abs;
}

createServer((req, res) => {
  if (!req.url) {
    res.statusCode = 400;
    res.end();
    return;
  }
  const abs = safePath(req.url);
  if (!abs) {
    res.statusCode = 403;
    res.end();
    return;
  }
  if (!existsSync(abs) || !statSync(abs).isFile()) {
    res.statusCode = 404;
    res.end();
    return;
  }
  const type = MIME[extname(abs)] || "application/octet-stream";
  res.setHeader("Content-Type", type);
  createReadStream(abs).pipe(res);
}).listen(PORT, "127.0.0.1", () => {
  console.log(`e2e static: http://127.0.0.1:${PORT}`);
});
