// PreToolUse Read/Edit/Write : protège les secrets, les dossiers de référence et tout ce qui est hors du projet.
const { readInput, projectDir, config, block, path } = require("./_lib");
const input = readInput();
const tool = input.tool_name || "";
const file = String((input.tool_input && (input.tool_input.file_path || input.tool_input.path)) || "");
if (!file) process.exit(0);
const root = path.resolve(projectDir(input));
const abs = path.resolve(root, file);
const rel = path.relative(root, abs).split(path.sep).join("/");
const base = path.basename(abs);
if ((/^\.env(\..*)?$/.test(base) && !/\.(example|sample|template)$/.test(base)) || /\.(pem|key|p12|pfx|jks|keystore)$/.test(base) || /^id_(rsa|ed25519|ecdsa)/.test(base) || /^(\.npmrc|\.netrc|\.pgpass|\.htpasswd)$/.test(base) || /^(credentials|service[-_]?account|secrets?)([-_.].*)?\.(json|ya?ml|txt|ini)$/i.test(base)) block(`accès à un fichier secret refusé (${base}).`);
if (tool === "Read") process.exit(0);
if (rel.startsWith("..") || path.isAbsolute(rel)) block(`écriture hors du projet refusée (${file}).`);
const prot = ((config(input).gardeFous || {}).dossiersProteges) || ["design/ds-export"];
for (const d of prot) if (rel === d || rel.startsWith(d.replace(/\/$/, "") + "/")) block(`${d}/ est en lecture seule : c’est l’export validé de Claude Design. Retouche dans Claude Design, réexporte, puis /import-ds.`);
process.exit(0);
