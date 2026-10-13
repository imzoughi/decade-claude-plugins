#!/usr/bin/env node
// Chiffrage d’une intégration (skill decade-chiffrage).
// Usage : node chiffrage.mjs [dossier du projet] [--json]
// Lit audit/chiffrage-inventaire.json (écrit par l’auditeur) et decade.config.json, tire 5 000 scénarios
// (loi triangulaire par élément + un facteur d’erreur commun au projet), et écrit audit/chiffrage.md.
// Ne fait aucun appel réseau.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const root = path.resolve(args.find((a) => !a.startsWith("--")) || ".");
const P = JSON.parse(fs.readFileSync(path.join(here, "parametres.json"), "utf8"));
const read = (f) => { try { return JSON.parse(fs.readFileSync(path.join(root, f), "utf8")); } catch { return null; } };
const inv = read("audit/chiffrage-inventaire.json");
if (!inv) { console.error("audit/chiffrage-inventaire.json introuvable : lance d’abord /decade-front:audit."); process.exit(1); }
const cfg = read("decade.config.json") || {};
const stack = inv.stack || cfg.stack || "nextjs";
const plan = inv.abonnement || cfg.chiffrage?.abonnement || "max20x";
const toutOpus = (inv.modeles || cfg.chiffrage?.modeles) === "opus";
const premier = inv.premierProjet ?? cfg.chiffrage?.premierProjet ?? true;
const tjm = cfg.chiffrage?.coutJourEuros ?? P.coutJourEuros;
const A = inv.scores?.A ?? 100, B = inv.scores?.B ?? 100;
const comps = inv.composants || [], pages = inv.pages || [];
const CL = ["S", "M", "L", "XL"], PL = ["S", "M", "L"];
for (const c of comps) if (!CL.includes(c.classe)) { console.error(`classe inconnue pour ${c.nom} : ${c.classe}`); process.exit(1); }
for (const p of pages) if (!PL.includes(p.classe)) { console.error(`classe inconnue pour la page ${p.nom} : ${p.classe}`); process.exit(1); }

// Loi triangulaire [a, m, b]
let seed = 42; const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const tri = ([a, m, b]) => { const u = rnd(), f = (m - a) / (b - a || 1); return u < f ? a + Math.sqrt(u * (b - a) * (m - a)) : b - Math.sqrt((1 - u) * (b - a) * (b - m)); };
const pert = ([a, m, b]) => (a + 4 * m + b) / 6;

function scenario() {
  const sys = tri(P.risques.facteurSystemique);
  // Dev front
  let dev = tri(P.dev.miseEnPlace[stack] || P.dev.miseEnPlace.nextjs);
  for (const c of comps) dev += tri(P.dev.composant[c.classe]) * P.dev.facteurStack[stack];
  for (const p of pages) dev += tri(P.dev.page[p.classe]) * P.dev.facteurStack[stack] + (p.absente ? tri(P.dev.pageAbsente) : 0);
  dev *= P.dev.qaReprises * sys;
  // Plugin : heures d’agents
  let ag = tri(P.plugin.agentFixe);
  for (const c of comps) ag += tri(P.plugin.agentComposant[c.classe]) * P.plugin.facteurStack[stack];
  for (const p of pages) ag += tri(P.plugin.agentPage[p.classe]) * P.plugin.facteurStack[stack] + (p.absente ? tri(P.plugin.agentPageAbsente) : 0);
  if (A < 80) ag *= P.risques.auditA_sous80;
  if (B < 75) ag *= P.risques.affinageUX_agent;
  ag *= sys;
  // Plugin : heures de pilote (relecture, en parallèle des agents) et tâches qui bloquent le calendrier
  let relu = 0;
  for (const c of comps) relu += tri(P.plugin.piloteRelectureMin[c.classe]) / 60;
  for (const p of pages) relu += tri(P.plugin.piloteRelecturePageMin[p.classe]) / 60;
  let fixe = Object.values(P.plugin.piloteFixeH).reduce((s, x) => s + tri(x), 0) + (B < 75 ? P.risques.affinageUX_heuresPilote : 0);
  const pr = premier ? P.risques.premierProjet : 1;
  relu *= pr * sys; fixe *= pr * sys;
  const H = P.calendrier.piloteHeuresParJour;
  const Aj = (P.calendrier.agentHeuresParJour[plan] || P.calendrier.agentHeuresParJour.max20x) * (toutOpus ? P.calendrier.facteurToutOpus : 1);
  const jours = fixe / H + Math.max(ag / Aj, relu / H);
  return { dev, ag, pilote: (relu + fixe) / H, jours };
}
const N = P.tirages, R = Array.from({ length: N }, scenario);
const q = (k, p) => { const v = R.map((r) => r[k]).sort((a, b) => a - b); return v[Math.min(N - 1, Math.floor(p * N))]; };
const Q = (k) => ({ p50: q(k, 0.5), p80: q(k, 0.8), p90: q(k, 0.9) });
const out = { stack, plan, toutOpus, premierProjet: premier, composants: comps.length, pages: pages.length, dev: Q("dev"), plugin: { calendrier: Q("jours"), pilote: Q("pilote"), agentsH: Q("ag") }, tjm };
if (args.includes("--json")) { console.log(JSON.stringify(out, null, 2)); process.exit(0); }

const f1 = (x) => (Math.round(x * 2) / 2).toLocaleString("fr-FR");
const up = (x) => Math.ceil(x * 2) / 2;
const sem = (j) => Math.ceil(j / P.calendrier.joursOuvresParSemaine);
const nb = (k) => comps.filter((c) => c.classe === k).length;
const nbp = (k) => pages.filter((p) => p.classe === k).length;
const lourds = comps.filter((c) => c.classe === "L" || c.classe === "XL");
const engage = up(out.plugin.calendrier.p80);
const md = `# Chiffrage — ${cfg.projet || path.basename(root)}

Généré par \`/decade-front:audit\` (skill decade-chiffrage), paramètres du ${P.version}. Stack ${stack} · abonnement ${plan}${toutOpus ? " · tout en Opus" : " · un modèle par tâche"} · ${premier ? "premier projet du pilote" : "pilote rodé"}.

## À retenir

| | Médiane (P50) | **Engagement (P80)** | Prudent (P90) |
|---|---|---|---|
| Pilote + plugin · délai | ${f1(out.plugin.calendrier.p50)} j | **${f1(engage)} j ouvrés** | ${f1(out.plugin.calendrier.p90)} j |
| Pilote + plugin · travail du pilote | ${f1(out.plugin.pilote.p50)} j | ${f1(out.plugin.pilote.p80)} j | ${f1(out.plugin.pilote.p90)} j |
| Dev front classique · travail | ${f1(out.dev.p50)} j | ${f1(out.dev.p80)} j | ${f1(out.dev.p90)} j |

- **Date à annoncer** : ${f1(engage)} jours ouvrés après le GO (${sem(engage)} semaine${sem(engage) > 1 ? "s" : ""}), hors dépendances externes ci-dessous. Huit projets sur dix tiennent ce délai si les paramètres sont justes.
- Coût du pilote au P80 : ${Math.round(out.plugin.pilote.p80 * tjm).toLocaleString("fr-FR")} € (${tjm} €/j) · dev front classique au P80 : ${Math.round(out.dev.p80 * tjm).toLocaleString("fr-FR")} €.
- Agents : ${f1(out.plugin.agentsH.p50)} h (P50) à ${f1(out.plugin.agentsH.p80)} h (P80) de travail machine, réparties selon le quota de l’abonnement.

## Volumétrie

| Classe | Composants | Pages |
|---|---|---|
| S | ${nb("S")} | ${nbp("S")} |
| M | ${nb("M")} | ${nbp("M")} |
| L | ${nb("L")} | ${nbp("L")} |
| XL | ${nb("XL")} | — |
| **Total** | **${comps.length}** | **${pages.length}**${pages.filter((p) => p.absente).length ? ` (dont ${pages.filter((p) => p.absente).length} absente(s) du Figma)` : ""} |

Composants qui pèsent le plus : ${lourds.length ? lourds.map((c) => `${c.nom} (${c.classe})`).join(", ") : "aucun L ni XL"}.

## Dépendances externes (hors chiffrage)

${(inv.dependances || []).length ? inv.dependances.map((d) => `- ${d}`).join("\n") : "- Aucune relevée par l’audit."}

Chaque dépendance décale la date du temps de réponse de celui qui la tient (agence, client) : à annoncer comme une condition, pas à cacher dans la marge.

## Hypothèses

- Scores de l’audit : A ${A} / 100, B ${B} / 100${A < 80 ? " (A < 80 : agents +10 %)" : ""}${B < 75 ? " (B < 75 : affinage UX, +2 h de pilote)" : ""}.
- Dev front : un dev confirmé, documentation non comptée ; temps par classe dans \`parametres.json\`.
- Plugin : temps d’agents et de pilote par classe, calés sur Avion ; ${P.calendrier.piloteHeuresParJour} h de pilote par jour ; ${P.calendrier.agentHeuresParJour[plan] ?? "?"} h d’agents par jour avec l’abonnement ${plan}${toutOpus ? `, ×${P.calendrier.facteurToutOpus} en tout Opus` : ""}.
- Une erreur commune au projet (de −15 % à +40 %) est tirée à chaque scénario : elle élargit la fourchette, comme dans la réalité.
- ${N.toLocaleString("fr-FR")} scénarios tirés ; P80 = la valeur que 80 % des scénarios ne dépassent pas.

Le détail par composant est dans \`audit/chiffrage-inventaire.json\` : le pilote peut y changer une classe, puis relancer \`node "<plugin>/skills/decade-chiffrage/chiffrage.mjs"\`.
`;
fs.mkdirSync(path.join(root, "audit"), { recursive: true });
fs.writeFileSync(path.join(root, "audit", "chiffrage.md"), md);
console.log(`Chiffrage : délai P50 ${f1(out.plugin.calendrier.p50)} j · engagement P80 ${f1(engage)} j ouvrés · dev front P80 ${f1(out.dev.p80)} j → audit/chiffrage.md`);
