---
description: Étape 7 — contrôle qualité indépendant via le sous-agent contrôleur
argument-hint: [cible | all]
---
**Entrées :** une cible (composant, page ou all) · breakpoints de la config
**Sorties :** qa/recette.md (si all et VERT) · qa/qa-<cible>.md avec verdict VERT ou ROUGE

Délègue au sous-agent **decade-controleur-qa** la vérification de : $ARGUMENTS (vide = all). Écris son rapport dans `qa/qa-<cible>.md`. Si ROUGE, propose au pilote de relancer la boucle concernée.
Sur `all` et VERT, écris aussi `qa/recette.md` : la check-list de recette du pilote, une case par page (lien du portail, points à regarder, capture de référence), puis une case « Recette validée → remplir « Recette du pilote » dans BRIEF.md ».
Termine par le bloc « 🧭 À toi, pilote » (skill `decade-guide-pilote`).
