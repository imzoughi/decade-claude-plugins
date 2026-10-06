// Markdown → HTML de la doc (README du design system, fiches, journal) : vrai parseur GFM (marked) + code coloré au build (Shiki).
// Interdit : un convertisseur maison (tableaux, listes imbriquées, code et échappements cassés). Même rendu que la branche Next.js.
import { Marked } from 'marked';
import { createHighlighter } from 'shiki';

const THEME = 'github-dark-default';
const LANGS = ['html', 'njk', 'scss', 'css', 'js', 'ts', 'tsx', 'jsx', 'json', 'bash', 'md'];
let hl;
/** À appeler une fois avant md() (buildDocs le fait). */
export async function initMarkdown() { hl ??= await createHighlighter({ themes: [THEME], langs: LANGS.filter((l) => l !== 'njk') }); }

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function codeBlock(code, lang = 'text', label = 'Code') {
  const l = lang === 'njk' ? 'html' : (LANGS.includes(lang) ? lang : 'text');
  const html = hl ? hl.codeToHtml(code.replace(/\n$/, ''), { lang: l, theme: THEME }) : `<pre class="shiki"><code>${esc(code)}</code></pre>`;
  return `<div class="doc-codeblock"><button type="button" class="doc-copy" data-doc-copy-block aria-label="Copier : ${esc(label)}">Copier</button>${html.replace(/\s*tabindex="0"/, '').replace('<pre ', `<pre role="region" tabindex="0" aria-label="${esc(label)}" `)}</div>`;
}

/** `shift` : le « # Titre » du fichier est retiré ; 0 → « ## » devient h2, 1 → h3 (dans une section h2). */
export function md(src, { shift = 0, label = 'Contenu' } = {}) {
  const seen = new Map();
  const m = new Marked({ gfm: true, breaks: false });
  m.use({ renderer: {
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens); const n = Math.min(6, depth + shift);
      let id = slug(inner) || 'section'; const k = seen.get(id) || 0; seen.set(id, k + 1); if (k) id += '-' + k;
      return `<h${n} id="${id}">${inner}<a class="anchor" href="#${id}" aria-label="Lien vers cette section">#</a></h${n}>\n`;
    },
    code({ text, lang }) { return codeBlock(text, (lang || '').split(/\s/)[0], `Code (${label})`); },
    table(token) {
      const cell = (c, tag) => `<${tag}${tag === 'th' ? ' scope="col"' : ''}${c.align ? ` style="text-align:${c.align}"` : ''}>${this.parser.parseInline(c.tokens)}</${tag}>`;
      const head = `<tr>${token.header.map((c) => cell(c, 'th')).join('')}</tr>`;
      const body = token.rows.map((r) => `<tr>${r.map((c) => cell(c, 'td')).join('')}</tr>`).join('');
      return `<div class="doc-table" role="region" tabindex="0" aria-label="Tableau (${esc(label)})"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>\n`;
    },
    html({ text }) { return esc(text); }, // pas de HTML brut venu d’un README : affiché comme texte
    image({ href, title, text }) { return `<img src="${esc(href)}" alt="${esc(text || '')}"${title ? ` title="${esc(title)}"` : ''} loading="lazy">`; },
  } });
  const body = src.replace(/\r\n/g, '\n').replace(/^# .*\n+/, '');
  return `<div class="doc-prose">${m.parse(body)}</div>`;
}
