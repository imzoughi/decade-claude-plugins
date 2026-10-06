---
description: Étape 2 — auditer le Figma de l’agence (score A, score B, go / no-go) via le sous-agent auditeur
argument-hint: [lien Figma]
---
**Entrées :** Figma de l’agence · decade.config.json · BRIEF.md
**Sorties :** audit/audit-AAAA-MM-JJ.md (scores, décision) · audit/retours-agence.md · design/pack/ux-corrections.md si affinage · design/figma-snapshot.json

Délègue au sous-agent **decade-auditeur** l’audit du Figma ($ARGUMENTS, sinon `figma` dans `decade.config.json`).
Il écrit aussi la photo du Figma `design/figma-snapshot.json` (skill `decade-regles-or`), point de départ des futures mises à jour.
Quand il a fini, termine par le bloc « 🧭 À toi, pilote » (skill `decade-guide-pilote`) : la décision en une phrase et qui agit. NO-GO : à faire maintenant, envoyer `audit/retours-agence.md` à l’agence ; au retour du Figma corrigé, /audit. GO + affinage UX : à faire maintenant, cocher `design/pack/ux-corrections.md`.
