---
description: Consommation de tokens du projet — total, par étape, par modèle et par agent, comparée au budget estimé de la stack
allowed-tools: Bash(node *hooks/conso.js), Read
model: haiku
---
**Entrées :** `workflow/logs/tokens.jsonl` (écrit à la fin de chaque tour par le hook `log-tokens`) · `decade.config.json` → `budgetTokens`, `stack` · `workflow/backlog.md`
**Sorties :** `workflow/conso.md` · le résumé pour le pilote

Lance `node "${CLAUDE_PLUGIN_ROOT}/hooks/conso.js"` et montre son résultat.
Puis, en 3 lignes maximum pour le pilote : où on en est par rapport au budget, l’étape qui consomme le plus, et la mesure la plus utile du skill `decade-modeles` si une étape dépasse son budget.
Termine par le bloc « 🧭 À toi, pilote » (skill `decade-guide-pilote`).
