// État du projet Decade, lu uniquement dans les fichiers du dépôt.
// Source unique pour le guidage du pilote : hook d’ouverture de session et /decade-front:next-step
// (`node "${CLAUDE_PLUGIN_ROOT}/hooks/etat.js"` affiche l’état en JSON).
const fs = require("fs");
const path = require("path");

const lire = (d, f) => { try { return fs.readFileSync(path.join(d, f), "utf8"); } catch { return null; } };
const existe = (d, f) => fs.existsSync(path.join(d, f));
const nonVide = (d, f) => { try { return fs.readdirSync(path.join(d, f)).length > 0; } catch { return false; } };
// Une ligne « | Libellé | valeur | » du BRIEF est remplie si la valeur n’est plus le texte du modèle.
const champRempli = (brief, libelle) => {
  const m = brief && brief.match(new RegExp("\\|\\s*" + libelle + "\\s*\\|\\s*([^|\\n]*)\\|"));
  const v = m ? m[1].trim() : "";
  return v !== "" && !/^nom \+ date/.test(v);
};
const section = (backlog, titre) => {
  if (!backlog) return { faits: 0, total: 0 };
  const bloc = (backlog.split(/^## /m).find((b) => b.startsWith(titre)) || "");
  const faits = (bloc.match(/^- \[x\] /gim) || []).length;
  const reste = (bloc.match(/^- \[ \] /gm) || []).length;
  return { faits, total: faits + reste };
};
const dernierAudit = (d) => {
  try {
    const f = fs.readdirSync(path.join(d, "audit")).filter((x) => /^audit-.*\.md$/.test(x)).sort().pop();
    if (!f) return null;
    const m = (lire(d, "audit/" + f) || "").match(/D[ée]cision\s*:\s*(NO-GO|GO fid[èe]le|GO \+ affinage UX)/i);
    return { fichier: "audit/" + f, decision: m ? m[1].toUpperCase().replace("FIDELE", "FIDÈLE") : null };
  } catch { return null; }
};
const aucuneCaseCochee = (txt) => txt && /- \[ \]/.test(txt) && !/- \[x\]/i.test(txt);

function etat(d) {
  const e = (etape, nom, action, qui, fiche) => ({ etape, nom, action, qui, fiche });
  const cfgTxt = lire(d, "decade.config.json");
  const brief = lire(d, "BRIEF.md");
  if (!cfgTxt || !brief) return e(0, "Nouveau projet", "/decade-front:build-front <lien Figma>", "pilote", "fiche 1");
  let cfg = {}; try { cfg = JSON.parse(cfgTxt); } catch {}
  const choixPages = lire(d, "workflow/pages.md");
  if (choixPages && !/^- \[x\] /im.test(choixPages)) return e(1, "Démarrer", "Choisir les pages à produire : réponds par leurs numéros à Claude, ou coche workflow/pages.md", "pilote", "fiche 1");
  if (!cfg.stack) return e(1, "Démarrer", "Choisir la stack (html, react ou nextjs) avec /decade-front:build-front, puis valider le BRIEF", "pilote", "fiche 1");
  if (!champRempli(brief, "Validé par le pilote")) return e(1, "Démarrer", "Relire BRIEF.md et remplir « Validé par le pilote » (nom + date)", "pilote", "fiche 1");

  const audit = dernierAudit(d);
  if (!audit) return e(2, "Auditer", "/decade-front:audit", "pilote", "fiche 2");
  if (!audit.decision) return e(2, "Auditer", "Relancer /decade-front:audit : la décision n’est pas écrite dans " + audit.fichier, "pilote", "fiche 2");
  if (audit.decision === "NO-GO") return e(2, "Auditer (NO-GO)", "Envoyer audit/retours-agence.md à l’agence ; quand le Figma corrigé arrive : /decade-front:audit", "agence", "fiche 2 · NO-GO");

  const ux = lire(d, "design/pack/ux-corrections.md");
  if (!existe(d, "design/pack.zip")) {
    if (aucuneCaseCochee(ux)) return e(3, "Préparer", "Cocher les corrections UX acceptées dans design/pack/ux-corrections.md, puis /decade-front:pack-design", "pilote", "fiche 3");
    return e(3, "Préparer", "/decade-front:pack-design", "pilote", "fiche 3");
  }
  if (!nonVide(d, "design/ds-export")) return e(4, "Design system", "Suivre design/pack/GUIDE-ETAPE-4.md dans Claude Design, puis déposer l’export dans design/ds-export/", "pilote", "fiche 4");

  const backlog = lire(d, "workflow/backlog.md");
  const comp = section(backlog, "Composants"), pages = section(backlog, "Pages");
  if (!existe(d, "design/import-version.json")) return e(5, "Composants", "/decade-front:import-ds, puis la boucle composants", "pilote", "fiche 5");
  if (comp.total === 0 || comp.faits < comp.total) return Object.assign(e(5, "Composants", "Lancer la boucle composants (/decade-front:next-step la propose)", "pilote", "fiche 5"), { avancement: comp });
  if (pages.total === 0 || pages.faits < pages.total) return Object.assign(e(6, "Pages", "Lancer la boucle pages (/decade-front:next-step la propose)", "pilote", "fiche 6"), { avancement: pages });

  const qa = lire(d, "qa/qa-all.md");
  if (!qa || !(/verdict\W*\s*:?\s*\**VERT/i.test(qa) || (/VERT/.test(qa) && !/ROUGE/.test(qa)))) return e(7, "Publier", "/decade-front:qa all", "pilote", "fiche 7");
  const recette = lire(d, "qa/recette.md");
  const restantes = recette ? (recette.match(/^- \[ \] /gm) || []).length : 0;
  if (restantes > 0) return e(7, "Publier", `Finir la recette : ${restantes} case(s) à cocher dans qa/recette.md, puis remplir « Recette du pilote » dans BRIEF.md`, "pilote", "fiche 7");
  if (!champRempli(brief, "Recette du pilote")) return e(7, "Publier", "Faire la recette avec qa/recette.md, puis remplir « Recette du pilote » dans BRIEF.md", "pilote", "fiche 7");
  if (!existe(d, "livraison/LIVRAISON.md")) return e(7, "Publier", "/decade-front:publish", "pilote", "fiche 7");
  if (!existe(d, "livraison/backend/AGENTS.md")) return e(7, "Publier", "/decade-front:handoff (passation backend), puis /decade-front:publish", "pilote", "fiche 7");
  return e(7, "Livré", "Pousser (commandes dans livraison/LIVRAISON.md) et partager le lien ; nouvelle version du Figma : /decade-front:sync-figma", "pilote", "fiche 7");
}

function blocages(d) {
  const b = lire(d, "workflow/blocages.md");
  if (!b) return [];
  return b.split("\n").filter((l) => /^- (?!\[x\])\S/i.test(l)).map((l) => l.replace(/^- (\[ \] )?/, "").trim());
}

module.exports = { etat, blocages };

if (require.main === module) {
  const d = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  process.stdout.write(JSON.stringify(Object.assign(etat(d), { blocages: blocages(d) }), null, 2) + "\n");
}
