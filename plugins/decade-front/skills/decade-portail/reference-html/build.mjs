// Build Decade (maquettes + portail + doc).
//   node build.mjs            build everything into dist/
//   node build.mjs --watch    rebuild on change + static server on http://localhost:3000
//   node build.mjs --prod     minified CSS/JS
import fs from 'node:fs'; import path from 'node:path'; import http from 'node:http';
import * as sass from 'sass'; import * as esbuild from 'esbuild';
import { createEnv } from './tools/nunjucks-env.mjs';
import { buildDocs } from './tools/build-docs.mjs';

const root = import.meta.dirname; const dist = path.join(root, 'dist');
const prod = process.argv.includes('--prod'); const watch = process.argv.includes('--watch');
const t0 = () => performance.now();

export function renderPages() {
  const env = createEnv(); const site = env.getGlobal('data').site;
  const byId = Object.fromEntries(site.pages.map(p => [p.id, p]));
  for (const page of site.pages) {
    const depth = page.file.split('/').length - 1; const base = '../'.repeat(depth);
    env.addGlobal('base', base); env.addGlobal('page', page);
    env.addGlobal('url', id => { if (!byId[id]) throw new Error(`url(): unknown page "${id}" in ${page.file}`); return base + byId[id].file; });
    const tpl = `pages/${page.file.replace(/\.html$/, '.njk')}`;
    const html = env.render(tpl);
    const out = path.join(dist, page.file); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html);
  }
  return site.pages.length;
}
export function buildCss() {
  const r = sass.compile(path.join(root, 'src/scss/main.scss'), { loadPaths: [path.join(root, 'node_modules')], style: prod ? 'compressed' : 'expanded', sourceMap: !prod, silenceDeprecations: ['import'] });
  fs.mkdirSync(path.join(dist, 'css'), { recursive: true });
  // Inline the latin display-font files as data: URIs so titles render even when pages are opened from disk
  // (browsers block font files over file://). latin-ext files stay external (rarely needed).
  r.css = r.css.replace(/url\(["']?\.\.\/assets\/fonts\/(barlow-condensed-latin-\d+-\w+\.woff2)["']?\)/g, (m, f) =>
    `url(data:font/woff2;base64,${fs.readFileSync(path.join(root, 'src/assets/fonts', f)).toString('base64')})`);
  fs.writeFileSync(path.join(dist, 'css/main.css'), r.css + (r.sourceMap ? '\n/*# sourceMappingURL=main.css.map */' : ''));
  if (r.sourceMap) fs.writeFileSync(path.join(dist, 'css/main.css.map'), JSON.stringify(r.sourceMap));
  return r.css.length;
}
export async function buildJs() {
  await esbuild.build({ entryPoints: [path.join(root, 'src/js/main.js')], bundle: true, format: 'iife', target: 'es2019', minify: prod, sourcemap: !prod, outfile: path.join(dist, 'js/main.js'), logLevel: 'warning' });
}
function copyAssets() { fs.cpSync(path.join(root, 'src/assets'), path.join(dist, 'assets'), { recursive: true }); }

export async function build() {
  const s = t0();
  fs.mkdirSync(dist, { recursive: true }); copyAssets();
  const css = buildCss(); await buildJs(); const n = renderPages(); const d = await buildDocs({ dist });
  console.log(`✓ ${n} pages · ${d} doc pages · css ${(css / 1024).toFixed(0)} KB · ${Math.round(t0() - s)} ms`);
}

await build();
if (watch) {
  let timer; const rebuild = f => { clearTimeout(timer); timer = setTimeout(() => build().catch(e => console.error('✗', e.message)), 120); };
  fs.watch(path.join(root, 'src'), { recursive: true }, (e, f) => rebuild(f));
  fs.watch(path.join(root, 'docs'), { recursive: true }, (e, f) => rebuild(f));
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.map': 'application/json', '.png': 'image/png' };
  http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
    const f = path.join(dist, p); if (!f.startsWith(dist) || !fs.existsSync(f)) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
  }).listen(3000, () => console.log('→ http://localhost:3000  (docs: /docs/)'));
}
