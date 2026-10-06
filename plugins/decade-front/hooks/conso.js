// Rapport de consommation de tokens du projet (lancé par /decade-front:conso) : total, par étape, par modèle, par agent,
// comparé au budget de decade.config.json → budgetTokens (estimation Decade par stack). Écrit aussi workflow/conso.md.
const fs = require("fs");
const path = require("path");
const d = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const f = path.join(d, "workflow/logs/tokens.jsonl");
if (!fs.existsSync(f)) { console.log("Aucune mesure pour l’instant : la consommation est enregistrée à la fin de chaque tour (hook log-tokens)."); process.exit(0); }
const cfg = (() => { try { return JSON.parse(fs.readFileSync(path.join(d, "decade.config.json"), "utf8")); } catch { return {}; } })();
const lignes = fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

const tot = (u) => u.entree + u.sortie + u.cacheLu + u.cacheEcrit;
const vide = () => ({ entree: 0, sortie: 0, cacheLu: 0, cacheEcrit: 0 });
const plus = (a, b) => { a.entree += b.entree; a.sortie += b.sortie; a.cacheLu += b.cacheLu; a.cacheEcrit += b.cacheEcrit; return a; };
const fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(1).replace(".", ",") + " M" : n >= 1e3 ? Math.round(n / 1e3) + " k" : String(n);
const famille = (m) => /opus/i.test(m) ? "opus" : /sonnet/i.test(m) ? "sonnet" : /haiku/i.test(m) ? "haiku" : m;

const parEtape = {}; const parModele = {}; const parAgent = {}; const total = vide(); let sessions = new Set();
for (const l of lignes) {
  sessions.add(l.session);
  const cle = `${l.etape} · ${l.nomEtape}`;
  for (const [m, u] of Object.entries(l.modeles || {})) { plus(parEtape[cle] ??= vide(), u); plus(parModele[famille(m)] ??= vide(), u); plus(total, u); }
  for (const [a, u] of Object.entries(l.agents || {})) { plus(parAgent[a] ??= vide(), u); plus(parEtape[cle] ??= vide(), u); plus(total, u); }
  for (const [m, u] of Object.entries(l.modelesAgents || {})) plus(parModele[famille(m) + " (sous-agents)"] ??= vide(), u);
}
const table = (titre, obj, budget) => {
  const rows = Object.entries(obj).sort((a, b) => tot(b[1]) - tot(a[1]));
  let s = `\n## ${titre}\n| | Total | dont entrée neuve | dont cache relu | Sortie |${budget ? " Budget |" : ""}\n|---|---|---|---|---|${budget ? "---|" : ""}\n`;
  for (const [k, u] of rows) s += `| ${k} | ${fmt(tot(u))} | ${fmt(u.entree + u.cacheEcrit)} | ${fmt(u.cacheLu)} | ${fmt(u.sortie)} |${budget ? ` ${budget[k.split(" · ")[0]] ? fmt(budget[k.split(" · ")[0]]) : "—"} |` : ""}\n`;
  return s;
};
// Budget par étape : forfaits + (par composant × composants du backlog) + (par page × pages du backlog).
const budget = (() => {
  const b = cfg.budgetTokens && cfg.budgetTokens[cfg.stack]; if (!b) return null;
  const backlog = (() => { try { return fs.readFileSync(path.join(d, "workflow/backlog.md"), "utf8"); } catch { return ""; } })();
  const compte = (titre) => ((backlog.split(/^## /m).find((x) => x.startsWith(titre)) || "").match(/^- \[[ x]\] /gim) || []).length;
  const nc = compte("Composants"), np = compte("Pages");
  const r = { 0: b.pilotage, 1: b.demarrer, 2: b.audit, 3: b.pack, 5: b.parComposant * nc, 6: b.parPage * np, 7: b.publier };
  r.total = Object.values(r).reduce((x, y) => x + (y || 0), 0); r.base = `${nc} composants, ${np} pages`;
  return r;
})();
let md = `# Consommation de tokens — ${cfg.projet || "projet"} (${cfg.stack || "stack ?"})\n\n`;
md += `**Total : ${fmt(tot(total))} tokens** sur ${lignes.length} tours et ${sessions.size} sessions — dont ${fmt(total.cacheLu)} relus depuis le cache (facturés environ 10 fois moins cher) et ${fmt(total.sortie)} produits.\n`;
if (budget && budget.total) md += `Budget estimé pour la stack ${cfg.stack} (${budget.base}) : ${fmt(budget.total)} → ${Math.round(100 * tot(total) / budget.total)} % consommés.\n`;
md += table("Par étape", parEtape, budget) + table("Par modèle", parModele) + (Object.keys(parAgent).length ? table("Par sous-agent", parAgent) : "");
md += `\n## Où agir\n- Une étape au-dessus de son budget : regarder ses tours dans workflow/logs/tokens.jsonl (commande, agents).\n- Beaucoup d’opus hors audit et escalade : vérifier \"model\" dans .claude/settings.json et modeles dans decade.config.json.\n- Cache relu très élevé dans une session : /compact entre deux étapes.\n`;
fs.writeFileSync(path.join(d, "workflow/conso.md"), md);
console.log(md);
