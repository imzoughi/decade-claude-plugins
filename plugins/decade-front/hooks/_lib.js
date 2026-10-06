// Outils communs aux garde-fous Decade : lecture de l’entrée JSON et de decade.config.json.
const fs = require("fs");
const path = require("path");
function readInput() {
  try { return JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch { return {}; }
}
function projectDir(input) { return process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd(); }
function config(input) {
  try { return JSON.parse(fs.readFileSync(path.join(projectDir(input), "decade.config.json"), "utf8")); } catch { return {}; }
}
function block(message) { process.stderr.write("[garde-fou Decade] " + message + "\n"); process.exit(2); }
module.exports = { readInput, projectDir, config, block, fs, path };
