// Décade · référence (projet de référence Intersport). Builds the documentation site (dist/docs) from docs/templates, docs/catalog.mjs, the design-system READMEs,
// the tokens, and the header comments of the JS modules and SCSS partials.
import fs from 'node:fs'; import path from 'node:path'; import * as sass from 'sass'; import prettier from 'prettier'; import { pathToFileURL } from 'node:url';
import { createEnv } from './nunjucks-env.mjs';
import { md, codeBlock, initMarkdown } from './markdown.mjs';
export { md };

const root = path.resolve(import.meta.dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

/** First /** … *\/ or // block of a source file, as plain text. */
function headerComment(src) {
  const m = src.match(/^\s*\/\*\*([\s\S]*?)\*\//); if (m) return m[1].split('\n').map(l => l.replace(/^\s*\* ?/, '')).join('\n').trim();
  return src.split('\n').filter(l => l.startsWith('//')).map(l => l.replace(/^\/\/\s?/, '')).join('\n').trim();
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function buildDocs({ dist }) {
  await initMarkdown();
  const out = path.join(dist, 'docs'); fs.mkdirSync(out, { recursive: true });
  const { groups, components } = await import(pathToFileURL(path.join(root, 'docs/catalog.mjs')).href + '?t=' + Date.now());
  const env = createEnv([path.join(root, 'docs/templates')]); const site = env.getGlobal('data').site;
  const byId = Object.fromEntries(site.pages.map(p => [p.id, p]));
  env.addGlobal('base', '../'); env.addGlobal('url', id => '../' + byId[id].file);
  env.addFilter('md', (s, shift = 1) => md(s, { shift })); env.addFilter('code', (s, lang = 'html', label = 'Code') => codeBlock(s, lang, label)); env.addFilter('esc', esc);

  // Shared context
  const tokens = JSON.parse(read('design/ds-export/tokens.json'));
  const jsModules = fs.readdirSync(path.join(root, 'src/js/modules')).filter(f => f.endsWith('.js')).map(f => ({ file: 'modules/' + f, doc: headerComment(read('src/js/modules/' + f)) }));
  const core = !fs.existsSync(path.join(root, 'src/js/core')) ? [] : fs.readdirSync(path.join(root, 'src/js/core')).filter(f => f.endsWith('.js') && !f.includes('generated')).map(f => ({ file: 'core/' + f, doc: headerComment(read('src/js/core/' + f)) }));
  const scssDirs = fs.readdirSync(path.join(root, 'src/scss'), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).map(d => ({
    dir: d, files: fs.readdirSync(path.join(root, 'src/scss', d)).filter(f => f.endsWith('.scss')).map(f => ({ file: f, doc: (read(`src/scss/${d}/${f}`).split('\n').find(l => l.startsWith('//')) || '').replace(/^\/\/\/?\s?/, '') })) }));
  const pagesInfo = site.pages.map(p => { const src = read('src/templates/pages/' + p.file.replace(/\.html$/, '.njk')); return { ...p, doc: (src.match(/\{#([\s\S]*?)#\}/) || [, ''])[1].trim() }; });
  const nav = groups.map(g => ({ group: g, items: components.filter(c => c.group === g) }));
  const cfg = fs.existsSync(path.join(root, 'decade.config.json')) ? JSON.parse(read('decade.config.json')) : {};
  const perf = { seuils: { scoreMin: 85, lcpMs: 2500, cls: 0.1, tbtMs: 300, ...(cfg.performance || {}) }, pages: fs.existsSync(path.join(root, 'qa/perf.json')) ? JSON.parse(read('qa/perf.json')) : [] };
  const ctx = { perf, tokens, jsModules, core, scssDirs, pagesInfo, nav, groups, components, site, page: { id: 'docs', title: 'Documentation' } };

  const render = (tpl, file, extra = {}) => fs.writeFileSync(path.join(out, file), env.render(tpl, { ...ctx, ...extra, current: file }));
  for (const [tpl, file, title] of [['index.njk', 'index.html', 'Démarrage'], ['architecture.njk', 'architecture.html', 'Architecture'], ['tokens.njk', 'tokens.html', 'Tokens'], ['pages.njk', 'pages.html', 'Pages'], ['javascript.njk', 'javascript.html', 'JavaScript'], ['scss.njk', 'scss.html', 'SCSS'], ['guidelines.njk', 'guidelines.html', 'Guide de marque'], ['versions.njk', 'versions.html', 'Journal des versions'], ['performance.njk', 'performance.html', 'Performance'], ])
    render(tpl, file, { title, brandbook: tpl === 'guidelines.njk' ? md(read('design/ds-export/README.md')) : '', changelog: tpl === 'versions.njk' && fs.existsSync(path.join(root, 'design/CHANGELOG.md')) ? md(read('design/CHANGELOG.md')) : '' });

  for (const c of components) {
    let html = '', live = '';
    if (c.example) { live = env.renderString(c.example, ctx); html = await prettier.format(live, { parser: 'html', printWidth: 120, htmlWhitespaceSensitivity: 'ignore' }).catch(() => live); }
    const dsFile = c.ds ? [`design/ds-export/components/${c.ds}/README.md`, `design/ds-export/components/${c.ds}.md`].find((f) => fs.existsSync(path.join(root, f))) : null;
    const dsDoc = dsFile ? md(read(dsFile), { shift: 1, label: c.title }) : '';
    const js = c.js ? jsModules.find(m => m.file === c.js) : null;
    render('component.njk', `c-${c.id}.html`, { title: c.title, c, live, html: html.length > 60000 ? html.slice(0, 60000) + '\n<!-- … (tronqué) -->' : html, dsDoc, js });
  }
  const r = sass.compile(path.join(root, 'docs/docs.scss'), { loadPaths: [path.join(root, 'src/scss')], style: 'expanded' });
  fs.writeFileSync(path.join(out, 'docs.css'), r.css);
  fs.copyFileSync(path.join(root, 'docs/docs.js'), path.join(out, 'docs.js'));
  return 8 + components.length;
}
