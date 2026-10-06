---
description: Prépare (ou met à jour) la passation backend — livraison/backend/ lisible par une autre IA ou une équipe backend — et la contrôle
argument-hint: [verifier]
allowed-tools: Read, Glob, Grep, Agent, Task, Bash(node *check-handoff.mjs*), Bash(git status)
---
**Entrées :** `decade.config.json` · `src/data/` · pages et composants livrés · `livraison/LIVRAISON.md`
**Sorties :** `AGENTS.md` (racine) · `livraison/backend/` (AGENTS.md, contrat-donnees.json, exemples/, branchements.md, actions.md) · verdict du contrôle

Le pilote n’est pas développeur : phrases courtes.

- Si `$ARGUMENTS` vaut `verifier` : lance seulement `node "${CLAUDE_PLUGIN_ROOT}/skills/decade-passation-backend/check-handoff.mjs"` et rends le verdict.
- Sinon, délègue au sous-agent **decade-passeur-backend** (skill `decade-passation-backend`), puis relance le contrôle toi-même.

Termine par le bloc « 🧭 À toi, pilote » (skill `decade-guide-pilote`) :
- ✔ Fait : nombre d’entités, de pages et d’actions décrites ; verdict du contrôle ;
- ▶ À faire maintenant : ouvrir `livraison/backend/branchements.md` et vérifier que chaque page a ses données ;
- ☐ À vérifier : « Points ouverts » dans `livraison/backend/AGENTS.md` (questions à poser à l’équipe backend) ;
- ⏭ Ensuite : `/decade-front:publish` (le dossier `livraison/backend/` part dans le package) ou transmettre le dépôt à l’équipe backend.
