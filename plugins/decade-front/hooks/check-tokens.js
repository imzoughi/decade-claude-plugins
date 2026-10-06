// PostToolUse Edit/Write : refuse couleurs, durées et courbes d’animation en dur dans les composants (tokens obligatoires).
const { readInput, projectDir, config, fs, path } = require("./_lib");
const input = readInput();
if (((config(input).gardeFous || {}).couleursEnDurInterdites) === false) process.exit(0);
const file = String((input.tool_input && input.tool_input.file_path) || "");
if (!file) process.exit(0);
const root = projectDir(input);
const rel = path.relative(root, path.resolve(root, file)).split(path.sep).join("/");
const isComponent = /(^|\/)(components|modules|macros)\//.test(rel) && /\.(s?css|tsx|jsx|njk)$/.test(rel);
if (!isComponent || /tokens?|motion\.(s?css|js|ts)$/i.test(rel)) process.exit(0);
let src = ""; try { src = fs.readFileSync(path.resolve(root, file), "utf8"); } catch { process.exit(0); }
const hits = [];
src.split(/\r?\n/).forEach((line, i) => {
  if (/^\s*(\/\/|\/\*|\*)/.test(line)) return;
  const color = line.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(\s*\d/);
  if (color) hits.push(`ligne ${i + 1} : couleur ${color[0]}`);
  if (/(transition|animation|duration|delay)/i.test(line)) {
    const t = line.replace(/0?\.01ms/g, "").match(/(?<![\w.])(\d+\.?\d*|\.\d+)m?s\b|cubic-bezier\(/);
    if (t) hits.push(`ligne ${i + 1} : mouvement ${t[0]}`);
  }
});
if (hits.length) {
  process.stderr.write(`[garde-fou Decade] valeur en dur dans ${rel} (${hits.slice(0, 5).join(", ")}). Utilise les tokens : var(--couleur…) ou var(--motion-duration-…), var(--motion-ease-…) (design/ds-export/tokens.json).\n`);
  process.exit(2);
}
process.exit(0);
