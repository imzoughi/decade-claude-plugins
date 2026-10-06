// Stop : après une commande du workflow, Claude ne peut pas rendre la main au pilote
// sans le bloc « 🧭 À toi, pilote » (fait, à faire, à vérifier, ensuite).
const { readInput, fs } = require("./_lib");

const COMMANDES = /<command-name>\/?(?:decade-front:)?(build-front|next-step|audit|pack-design|import-ds|sync-figma|qa|publish|docs|conso|handoff)<\/command-name>/;
const MARQUE = "À toi, pilote";

const input = readInput();
if (input.stop_hook_active) process.exit(0); // déjà relancé une fois : on ne boucle pas

let lignes = [];
try { lignes = fs.readFileSync(input.transcript_path, "utf8").trim().split("\n"); } catch { process.exit(0); }
const texte = (msg) => {
  const c = msg && msg.content;
  if (typeof c === "string") return c;
  return Array.isArray(c) ? c.filter((x) => x.type === "text").map((x) => x.text).join("\n") : "";
};

let commande = null, reponse = "", vuAssistant = true;
for (const l of lignes) {
  let j; try { j = JSON.parse(l); } catch { continue; }
  if (j.type === "user" && !j.isMeta) {
    const t = texte(j.message);
    if (!t) continue; // résultat d’outil
    const m = t.match(COMMANDES);
    // le texte développé d’une commande arrive juste après elle : il ne remplace pas la commande
    if (m) commande = m[1]; else if (vuAssistant) commande = null;
    reponse = ""; vuAssistant = false;
  } else if (j.type === "assistant") {
    vuAssistant = true;
    const t = texte(j.message);
    if (t) reponse = t;
  }
}
if (!commande || reponse.includes(MARQUE)) process.exit(0);
process.stdout.write(JSON.stringify({
  decision: "block",
  reason: `/${commande} est terminé mais le pilote n’a pas son guidage. Termine par le bloc « 🧭 ${MARQUE} » du skill decade-guide-pilote : Fait, À faire maintenant, À vérifier, Ensuite.`,
}));
