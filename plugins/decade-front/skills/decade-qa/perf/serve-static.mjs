#!/usr/bin/env node
// Petit serveur local pour mesurer un site statique (Next.js en export statique : dossier out/).
// Usage : node scripts/serve-static.mjs [dossier=out] [port=3000]
// Sans dépendance, écoute sur 127.0.0.1 uniquement. Gère le basePath (GitHub Pages) : si un chemin n’existe pas,
// il retire le premier segment (/mon-projet/_next/… → /_next/…). Utilisé par lighthouserc.cjs, jamais en production.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "out");
const port = Number(process.argv[3] || 3000);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif", ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml" };

if (!fs.existsSync(root)) { console.error(`Dossier introuvable : ${root} (lance d’abord le build)`); process.exit(1); }

function resolve(p) {
  const safe = path.normalize(decodeURIComponent(p)).replace(/^(\.\.[/\\])+/, "");
  const base = path.join(root, safe);
  if (!base.startsWith(root)) return null; // pas de sortie du dossier
  for (const f of [base, base + ".html", path.join(base, "index.html")]) {
    try { if (fs.statSync(f).isFile()) return f; } catch {}
  }
  return null;
}

http.createServer((req, res) => {
  const url = (req.url || "/").split("?")[0].split("#")[0];
  let file = resolve(url);
  if (!file) { const sans = url.replace(/^\/[^/]+/, ""); if (sans && sans !== url) file = resolve(sans); } // basePath : /mon-projet/… → /…
  if (!file) { res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }); return res.end("404"); }
  res.writeHead(200, { "content-type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => console.log(`serveur statique prêt : http://localhost:${port} (${path.relative(process.cwd(), root) || "."})`));
