// SessionStart : à chaque ouverture de Claude Code, le pilote voit où en est le projet
// et la prochaine action, sans rien taper. Le même état est donné à Claude.
const { readInput, projectDir } = require("./_lib");
const { etat, blocages } = require("./etat");

const input = readInput();
const d = projectDir(input);
const e = etat(d);
const b = blocages(d);
const av = e.avancement ? ` (${e.avancement.faits}/${e.avancement.total})` : "";
const ligne = e.etape === 0
  ? "🧭 Nouveau projet : lance /decade-front:build-front <lien Figma>"
  : `🧭 Étape ${e.etape} sur 7 · ${e.nom}${av} → ${e.action}` + (b.length ? ` · ⚠ ${b.length} blocage(s) : /decade-front:next-step` : "");
process.stdout.write(JSON.stringify({
  systemMessage: ligne,
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: "[guidage Decade] État du projet lu dans le dépôt : " + JSON.stringify(Object.assign(e, { blocages: b })) +
      ". Le pilote n’est pas développeur front : quand il te parle du projet, termine par le bloc « 🧭 À toi, pilote » (skill decade-guide-pilote).",
  },
}));
