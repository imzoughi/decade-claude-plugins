// Stop : mesure les tokens consommés à chaque tour, sous-agents compris, et les range par étape du workflow.
// Lit le transcript de la session (champs usage), calcule l’écart depuis la dernière mesure et ajoute une ligne à
// workflow/logs/tokens.jsonl : { date, session, etape, commande, modeles (session principale, par modèle), agents (sous-agents, par type), modelesAgents (sous-agents, par modèle) },
// chaque valeur { entree, sortie, cacheLu, cacheEcrit }.
// Rapport : /decade-front:conso (node hooks/conso.js). Ne bloque jamais : en cas de doute, n’écrit rien.
const { readInput, projectDir, fs, path } = require("./_lib");
const { etat } = require("./etat");

const input = readInput();
try {
  if (!input.transcript_path || !fs.existsSync(input.transcript_path)) process.exit(0);
  const d = projectDir(input);
  if (!fs.existsSync(path.join(d, "decade.config.json")) && !fs.existsSync(path.join(d, "BRIEF.md"))) process.exit(0); // pas un projet Decade
  const logs = path.join(d, "workflow", "logs");
  const snapDir = path.join(logs, ".tokens");
  fs.mkdirSync(snapDir, { recursive: true });

  const vide = () => ({ entree: 0, sortie: 0, cacheLu: 0, cacheEcrit: 0 });
  const add = (acc, u) => {
    acc.entree += u.input_tokens || 0; acc.sortie += u.output_tokens || 0;
    acc.cacheLu += u.cache_read_input_tokens || 0; acc.cacheEcrit += u.cache_creation_input_tokens || 0;
  };
  const modeles = {}; const agents = {}; const modelesAgents = {}; const vus = new Set(); const typeParOutil = {};
  let commande = null;
  for (const l of fs.readFileSync(input.transcript_path, "utf8").split("\n")) {
    if (!l.trim()) continue;
    let j; try { j = JSON.parse(l); } catch { continue; }
    const m = j.message;
    if (j.type === "assistant" && m && m.usage) {
      for (const c of Array.isArray(m.content) ? m.content : []) if (c.type === "tool_use" && (c.name === "Agent" || c.name === "Task")) typeParOutil[c.id] = (c.input && c.input.subagent_type) || "sous-agent";
      const cle = m.id || j.requestId || j.uuid; // un message découpé en plusieurs lignes ne compte qu’une fois
      if (vus.has(cle)) continue; vus.add(cle);
      add(modeles[m.model || "inconnu"] ??= vide(), m.usage);
    } else if (j.type === "user") {
      const t = typeof m?.content === "string" ? m.content : (Array.isArray(m?.content) ? m.content.filter((c) => c.type === "text").map((c) => c.text).join(" ") : "");
      const cmd = t.match(/<command-name>\/?(?:decade-front:)?([\w-]+)<\/command-name>/); if (cmd) commande = cmd[1];
      const r = j.toolUseResult; // résultat d’un sous-agent : ses tokens sont dans un autre transcript, résumés ici
      if (r && (r.usage || r.totalTokens)) {
        const id = Array.isArray(m?.content) ? (m.content.find((c) => c.type === "tool_result") || {}).tool_use_id : null;
        const nom = (id && typeParOutil[id]) || r.agentType || "sous-agent";
        const cle = "agent:" + (id || j.uuid); if (vus.has(cle)) continue; vus.add(cle);
        const u = r.usage || { input_tokens: r.totalTokens };
        add(agents[nom] ??= vide(), u);
        const MODELE_AGENT = { auditeur: "audit", "preparateur-design": "preparation", integrateur: "integration", "controleur-qa": "qa", documentaliste: "documentation" };
        const role = Object.keys(MODELE_AGENT).find((k) => nom.includes(k));
        const parDefaut = { audit: "opus", preparation: "sonnet", integration: "sonnet", qa: "sonnet", documentation: "haiku" };
        const cfgM = (() => { try { return JSON.parse(fs.readFileSync(path.join(d, "decade.config.json"), "utf8")).modeles || {}; } catch { return {}; } })();
        add(modelesAgents[r.model || (role ? (cfgM[MODELE_AGENT[role]] || parDefaut[MODELE_AGENT[role]]) : "inconnu")] ??= vide(), u);
      }
    }
  }
  // Écart depuis la dernière mesure de cette session
  const session = input.session_id || path.basename(input.transcript_path, ".jsonl");
  const snapFile = path.join(snapDir, session.replace(/[^\w-]/g, "_") + ".json");
  const avant = fs.existsSync(snapFile) ? JSON.parse(fs.readFileSync(snapFile, "utf8")) : {};
  const diff = (now, prev) => {
    const out = {};
    for (const [k, v] of Object.entries(now)) {
      const p = prev[k] || vide(); const dlt = { entree: v.entree - p.entree, sortie: v.sortie - p.sortie, cacheLu: v.cacheLu - p.cacheLu, cacheEcrit: v.cacheEcrit - p.cacheEcrit };
      if (dlt.entree || dlt.sortie || dlt.cacheLu || dlt.cacheEcrit) out[k] = dlt;
    }
    return out;
  };
  const dm = diff(modeles, avant.modeles || {}); const da = diff(agents, avant.agents || {}); const dma = diff(modelesAgents, avant.modelesAgents || {});
  fs.writeFileSync(snapFile, JSON.stringify({ modeles, agents, modelesAgents }));
  if (!Object.keys(dm).length && !Object.keys(da).length) process.exit(0);
  // Étape : d’après la commande du tour (plus fiable que l’état, qui a déjà avancé), sinon d’après l’état du dépôt.
  const PAR_COMMANDE = { "build-front": [1, "Démarrer"], brief: [1, "Démarrer"], audit: [2, "Auditer"], "pack-design": [3, "Préparer"], "import-ds": [5, "Composants"], "ds-component": [5, "Composants"], page: [6, "Pages"], qa: [7, "Publier"], publish: [7, "Publier"], docs: [7, "Publier"], handoff: [7, "Publier"], conso: [0, "Pilotage"], "sync-figma": [8, "Mise à jour"], "next-step": [0, "Pilotage"] };
  const [etape, nomEtape] = PAR_COMMANDE[commande] || (() => { const e = etat(d); return [e.etape, e.nom]; })();
  const ligne = { date: new Date().toISOString(), session, etape, nomEtape, commande, modeles: dm, agents: da, modelesAgents: dma };
  fs.appendFileSync(path.join(logs, "tokens.jsonl"), JSON.stringify(ligne) + "\n");
} catch { /* la mesure ne doit jamais gêner le travail */ }
process.exit(0);
