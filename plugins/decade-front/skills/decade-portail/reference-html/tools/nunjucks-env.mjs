// Nunjucks environment shared by the build and the docs generator.
import nunjucks from 'nunjucks'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const read = f => JSON.parse(fs.readFileSync(path.join(root, 'src/data', f), 'utf8'));

// Any Lucide icon not in data/icons.json is read from node_modules/lucide-static (same version as the design system).
function fromLucide(n) {
  const f = path.join(root, 'node_modules/lucide-static/icons', n + '.svg');
  if (!fs.existsSync(f)) { console.warn(`[icon] unknown Lucide icon "${n}"`); return null; }
  const svg = fs.readFileSync(f, 'utf8'); const body = svg.slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>'));
  return [...body.matchAll(/<(\w+)([^>]*?)\/?>/g)].map(m => [m[1], Object.fromEntries([...m[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(a => [a[1], a[2]]))]);
}

export function createEnv(extraPaths = []) {
  const icons = read('icons.json'); const { aliases, filled } = read('icon-aliases.json');
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader([path.join(root, 'src/templates'), ...extraPaths], { noCache: true }), { autoescape: true, trimBlocks: true, lstripBlocks: true });
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

  /** icon('map-pin', { size: 20, class: 'x', label: 'Texte', filled: true }) → inline Lucide SVG (same markup as the design system's Icon). */
  env.addGlobal('icon', (name, o = {}) => {
    const n = aliases[name] || name; const size = o.size || 24;
    if (!icons[n]) icons[n] = fromLucide(n);
    const els = icons[n] || icons.info;
    const fill = (o.filled || n === 'play') && filled[n] ? 'currentColor' : 'none';
    const a11y = o.label ? `role="img" aria-label="${esc(o.label)}"` : 'aria-hidden="true"';
    const body = els.map(([tag, at]) => `<${tag} ${Object.entries(at).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')}></${tag}>`).join('');
    return new nunjucks.runtime.SafeString(`<svg class="is-icon lucide lucide-${n}${o.class ? ' ' + o.class : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="${o.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${body}</svg>`);
  });
  /** 59.99 | price → "59,99 €" (non-breaking space). */
  env.addFilter('price', n => Number(n).toFixed(2).replace('.', ',') + ' €');
  /** Colour swatch background from one colour or a [a, b] pair. */
  env.addFilter('fixed', (n, d = 1) => Number(n).toFixed(d).replace('.', ','));
  env.addFilter('swatchBg', c => Array.isArray(c) ? (c.length > 1 ? `linear-gradient(135deg, ${c[0]} 0 50%, ${c[1]} 50% 100%)` : c[0]) : c);
  env.addFilter('json', o => new nunjucks.runtime.SafeString(esc(JSON.stringify(o))));
  env.addFilter('discount', (was, now) => was ? Math.round((1 - now / was) * 100) : 0);
  env.addFilter('take', (list, n, start = 0) => list.slice(start, start + n));
  env.addFilter('find', (list, id) => list.find(x => x.id === id));
  env.addFilter('findAll', (list, ids) => ids.map(id => list.find(x => x.id === id)).filter(Boolean));

  const data = { products: read('products.json'), stores: read('stores.json'), site: read('site.json'), nav: read('nav.json') };
  data.byId = Object.fromEntries(data.products.products.map(p => [p.id, p]));
  env.addGlobal('data', data);
  return env;
}
