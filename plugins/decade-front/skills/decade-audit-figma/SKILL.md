---
name: decade-audit-figma
description: Grilles Decade pour auditer un Figma d’agence — score A (intégrabilité), score B (qualité UI/UX), décision NO-GO / GO fidèle / GO avec affinage UX, retours agence prêts à envoyer. À utiliser pour tout audit ou re-audit de maquette.
---
# Audit Figma Decade

Grilles et matrice : `grilles.md`. Seuils : `decade.config.json` → `audit` (par défaut 60 / 80 / 75).

## Règles
- Note chaque critère 0 / 1 / 2 avec une **preuve** (nom du frame ou du nœud). Pas de preuve, pas de note.
- Échantillonne au moins 3 écrans par gabarit, desktop et mobile.
- Un critère bloquant à 0 donne NO-GO, quel que soit le score.
- Score B : applique les règles du skill `decade-ui-ux`.

## Fichiers produits
- `audit/audit-AAAA-MM-JJ.md` : première ligne exactement `Décision : NO-GO`, `Décision : GO fidèle` ou `Décision : GO + affinage UX` (le guidage du pilote la lit) ; puis, pour le pilote, les deux scores, la décision et trois phrases sur l’impact planning ; puis les tableaux A et B ; section « Évolution » si un audit précédent existe.
- `audit/retours-agence.md` : `[Bloquant|Majeur|Mineur] écran / composant — problème — attendu`, une ligne par retour, triée.
- `design/pack/ux-corrections.md` si score B < seuilUx : une case à cocher par correction (écran, problème, correction, règle). Les corrections gardent l’identité de marque.
