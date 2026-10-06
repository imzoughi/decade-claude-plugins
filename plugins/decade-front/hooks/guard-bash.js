// PreToolUse Bash : bloque les commandes dangereuses ou réservées au pilote.
const { readInput, config, block } = require("./_lib");
const input = readInput();
const cmd = String((input.tool_input && input.tool_input.command) || "");
const gf = (config(input).gardeFous) || {};
const rules = [
  [/\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r)\b/i, "suppression récursive interdite (rm -rf). Dis au pilote quels fichiers supprimer."],
  [/\bgit\s+reset\s+--hard\b/, "git reset --hard interdit : il efface du travail."],
  [/\bgit\s+push\b.*(--force|-f\b|--force-with-lease)/, "push forcé interdit."],
  [/\bgit\s+clean\s+-[a-z]*f/i, "git clean -f interdit."],
  [/\b(curl|wget)\b[^|]*\|\s*(sh|bash|zsh|node|python)/, "exécution d’un script téléchargé interdite."],
  [/\bnpm\s+publish\b/, "publication npm interdite."],
  [/\b(printenv|env)\b\s*$|echo\s+\$\{?[A-Z_]*(TOKEN|SECRET|KEY|PASSWORD)/, "affichage de secrets interdit."],
];
for (const [re, msg] of rules) if (re.test(cmd)) block(msg);
if (gf.bloquerGitPush !== false && /\bgit\s+push\b/.test(cmd)) block("Claude ne pousse pas : donne la commande au pilote, qui relit et pousse lui-même.");
process.exit(0);
