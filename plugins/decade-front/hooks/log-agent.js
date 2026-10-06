// SubagentStop : trace chaque fin de sous-agent dans workflow/logs/agents.jsonl (qui, quand, session).
const { readInput, projectDir, fs, path } = require("./_lib");
const input = readInput();
const dir = path.join(projectDir(input), "workflow", "logs");
try {
  fs.mkdirSync(dir, { recursive: true });
  const line = { date: new Date().toISOString(), evenement: input.hook_event_name || "SubagentStop", agent: input.agent_type || input.subagent_type || null, session: input.session_id || null };
  fs.appendFileSync(path.join(dir, "agents.jsonl"), JSON.stringify(line) + "\n");
} catch {}
process.exit(0);
