#!/usr/bin/env node
// Contrôle de la passation backend (skill decade-passation-backend).
// Usage : node check-handoff.mjs [dossier du projet]   (défaut : dossier courant)
// Bloquant (code 1) : fichier manquant, contrat invalide, exemple non conforme au contrat, page ou entité absente des branchements.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const B = path.join(root, 'livraison', 'backend');
const errors = []; const warnings = [];
const err = (m) => errors.push(m); const warn = (m) => warnings.push(m);
const read = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } };
const rel = (f) => path.relative(root, f).split(path.sep).join('/');

// 1. Fichiers
const need = [path.join(root, 'AGENTS.md'), ...['AGENTS.md', 'contrat-donnees.json', 'branchements.md', 'actions.md'].map((f) => path.join(B, f))];
for (const f of need) if (!fs.existsSync(f)) err(`${rel(f)} manquant`);
const racine = read(path.join(root, 'AGENTS.md'));
if (racine && !racine.includes('livraison/backend/AGENTS.md')) err('AGENTS.md (racine) doit renvoyer vers livraison/backend/AGENTS.md');
for (const f of ['AGENTS.md', 'branchements.md', 'actions.md']) {
  const t = read(path.join(B, f));
  if (t && /\{\{[^}]+\}\}/.test(t)) err(`livraison/backend/${f} : texte du modèle non remplacé (${t.match(/\{\{[^}]+\}\}/)[0]})`);
}

// 2. Contrat
let contrat = null;
const ct = read(path.join(B, 'contrat-donnees.json'));
if (ct) { try { contrat = JSON.parse(ct); } catch (e) { err(`contrat-donnees.json : JSON invalide (${e.message})`); } }
const entites = contrat?.entites && typeof contrat.entites === 'object' ? contrat.entites : {};
if (contrat && !Object.keys(entites).length) err('contrat-donnees.json : aucune entité dans « entites »');
if (ct && /\{\{[^}]+\}\}/.test(ct)) err('contrat-donnees.json : texte du modèle non remplacé');

// Validateur JSON Schema minimal (type, required, properties, items, enum, $ref vers une autre entité)
const typeOf = (v) => v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v;
function check(v, s, where, out, depth = 0) {
  if (!s || depth > 20) return;
  if (s.$ref) { const n = s.$ref.split('/').pop(); return check(v, entites[n], where, out, depth + 1); }
  if (s.type) {
    const types = [].concat(s.type); const t = typeOf(v);
    if (!types.includes(t) && !(t === 'integer' && types.includes('number'))) { out.push(`${where} : ${JSON.stringify(v)?.slice(0, 40)} n’est pas de type ${types.join('|')}`); return; }
  }
  if (s.enum && !s.enum.includes(v)) out.push(`${where} : « ${v} » hors des valeurs permises (${s.enum.join(', ')})`);
  if (typeOf(v) === 'object') {
    for (const k of s.required || []) if (!(k in v)) out.push(`${where} : champ obligatoire « ${k} » absent`);
    for (const [k, sub] of Object.entries(s.properties || {})) if (k in v) check(v[k], sub, `${where}.${k}`, out, depth + 1);
  }
  if (Array.isArray(v) && s.items) v.forEach((x, i) => check(x, s.items, `${where}[${i}]`, out, depth + 1));
}
for (const [nom, s] of Object.entries(entites)) {
  if (!s || s.type !== 'object' || !s.properties || !Array.isArray(s.required)) err(`entité ${nom} : il faut type "object", properties et required`);
  const ex = contrat.exemples?.[nom];
  if (!ex) { err(`entité ${nom} : pas de fichier d’exemple dans « exemples »`); continue; }
  const f = path.join(B, ex); const t = read(f);
  if (!t) { err(`entité ${nom} : ${rel(f)} manquant`); continue; }
  let data; try { data = JSON.parse(t); } catch (e) { err(`${rel(f)} : JSON invalide (${e.message})`); continue; }
  const list = Array.isArray(data) ? data : [data];
  if (!list.length) err(`${rel(f)} : aucun exemple`);
  const out = []; list.forEach((x, i) => check(x, s, `${nom}${Array.isArray(data) ? `[${i}]` : ''}`, out));
  out.slice(0, 10).forEach((m) => err(`${rel(f)} : ${m}`)); if (out.length > 10) err(`${rel(f)} : … ${out.length - 10} écart(s) de plus`);
}

// 3. Branchements : toutes les pages du site, toutes les entités
const br = read(path.join(B, 'branchements.md')) || '';
const siteTxt = read(path.join(root, 'src/data/site.ts')) || read(path.join(root, 'src/data/site.json')) || '';
// Pages = objets du site qui ont un titre ET un lien (href en nextjs/react, file en html) ; les groupes n’en ont pas.
const pages = [...siteTxt.matchAll(/\{[^{}]*\}/g)].map((m) => m[0])
  .filter((o) => /\b"?(href|file)"?\s*:/.test(o)).map((o) => (o.match(/\b"?title"?\s*:\s*"([^"]+)"/) || [])[1])
  .filter((t) => t && !/^Maquettes/.test(t));
for (const p of pages) if (br && !br.toLowerCase().includes(p.toLowerCase())) err(`branchements.md : la page « ${p} » n’apparaît pas`);
if (!pages.length) warn('pages du site introuvables (src/data/site.ts ou site.json) : contrôle des pages ignoré');
for (const nom of Object.keys(entites)) if (br && !br.includes(nom)) err(`branchements.md : l’entité ${nom} n’apparaît pas`);
const act = read(path.join(B, 'actions.md')) || '';
if (act && (act.match(/^## /gm) || []).length === 0) err('actions.md : aucune action (une section « ## » par action)');

console.log(`Passation backend : ${Object.keys(entites).length} entité(s), ${pages.length} page(s) dans ${rel(B) || B}`);
if (warnings.length) console.log(`\nAvertissements (${warnings.length}) :\n- ` + warnings.join('\n- '));
if (errors.length) { console.log(`\nERREURS (${errors.length}) :\n- ` + errors.slice(0, 60).join('\n- ') + '\n\nVerdict : ROUGE'); process.exit(1); }
console.log('\nVerdict : VERT'); process.exit(0);
