---
description: Étape 2 — auditer le Figma de l’agence (score A, score B, go / no-go) et chiffrer l’intégration, via le sous-agent auditeur
allowed-tools: Read, Glob, Grep, Agent, Task, Bash(node *chiffrage.mjs*)
argument-hint: [lien Figma]
---
**Entrées :** Figma de l’agence · decade.config.json · BRIEF.md
**Sorties :** audit/audit-AAAA-MM-JJ.md (scores, décision) · audit/retours-agence.md · design/pack/ux-corrections.md si affinage · design/figma-snapshot.json · audit/chiffrage-inventaire.json · audit/chiffrage.md

Délègue au sous-agent **decade-auditeur** l’audit du Figma ($ARGUMENTS, sinon `figma` dans `decade.config.json`).
Il écrit aussi la photo du Figma `design/figma-snapshot.json` (skill `decade-regles-or`), point de départ des futures mises à jour, et l’inventaire du chiffrage `audit/chiffrage-inventaire.json` (skill `decade-chiffrage` : une classe S, M, L ou XL par composant et par page, et les dépendances externes).
Puis lance `node "${CLAUDE_PLUGIN_ROOT}/skills/decade-chiffrage/chiffrage.mjs"`, qui écrit `audit/chiffrage.md`, et donne au pilote en une ligne la date d’engagement (P80) et les dépendances.
Quand il a fini, termine par le bloc « 🧭 À toi, pilote » (skill `decade-guide-pilote`) : la décision en une phrase et qui agit. NO-GO : à faire maintenant, envoyer `audit/retours-agence.md` à l’agence ; au retour du Figma corrigé, /audit. GO + affinage UX : à faire maintenant, cocher `design/pack/ux-corrections.md`.
