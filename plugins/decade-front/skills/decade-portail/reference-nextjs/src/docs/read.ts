// Lecture des fichiers du projet au build (README du design system, journal, mesures). Absent = chaîne vide.
import fs from "node:fs";
import path from "node:path";
export const readText = (rel: string) => { const f = path.join(process.cwd(), rel); return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : ""; };
export const readJson = <T,>(rel: string, fallback: T): T => { const t = readText(rel); return t ? (JSON.parse(t) as T) : fallback; };
