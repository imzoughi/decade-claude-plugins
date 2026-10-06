---
description: Interne (boucle) — un composant, en boucle intégrateur → contrôleur jusqu’au vert
argument-hint: <NomDuComposant>
---
**Entrées :** un composant du backlog · design/ds-export/ · dernier rapport QA
**Sorties :** le composant, ses variantes, états et sa fiche de doc · verdict QA · case cochée ou blocage

Composant : $1. Nombre de tours : `boucles.toursMax` dans `decade.config.json` (3 par défaut).
Pour chaque tour :
1. Sous-agent **decade-integrateur** : créer ou corriger $1 (toutes variantes et états, doc ou story), en tenant compte du dernier rapport du contrôleur. Modèle (skill `decade-modeles`) : `modeles.integration` (sonnet), puis `modeles.escalade` (opus) au tour `modeles.escaladeAuTour`.
2. Sous-agent **decade-controleur-qa** (`modeles.qa`, jamais escaladé) : vérifier $1, verdict VERT ou ROUGE ; le rapport note le modèle de l’intégrateur.
3. VERT → coche $1 dans `workflow/backlog.md`, écris le rapport dans `qa/`, arrête. ROUGE → tour suivant.
Après le dernier tour encore ROUGE : laisse décoché, écris les écarts dans `workflow/blocages.md`.
Réponse finale en 3 lignes : statut, tours utilisés, écarts restants.
