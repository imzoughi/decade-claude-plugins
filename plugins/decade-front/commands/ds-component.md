---
description: Interne (boucle) — un composant, en boucle intégrateur → contrôleur jusqu’au vert
argument-hint: <NomDuComposant>
---
**Entrées :** un composant du backlog · design/ds-export/ · dernier rapport QA
**Sorties :** le composant, ses variantes, états et sa fiche de doc · verdict QA · case cochée ou blocage

Composant : $1. Nombre de tours : `boucles.toursMax` dans `decade.config.json` (3 par défaut).

0. Préalables (react, nextjs) : si `tests/stories.spec.ts` manque ou diffère de `tests/stories.spec.ts` du skill `decade-qa`, copie-le ; si le script npm `test:stories` manque dans `package.json`, ajoute `"test:stories": "playwright test tests/stories.spec.ts"`.

Pour chaque tour :
1. Sous-agent **decade-integrateur** : créer ou corriger $1 (toutes variantes et états, doc ou story), en tenant compte du dernier rapport du contrôleur. Modèle (skill `decade-modeles`) : `modeles.integration` (sonnet), puis `modeles.escalade` (opus) au tour `modeles.escaladeAuTour`.
2. Sous-agent **decade-controleur-qa** (`modeles.qa`, jamais escaladé) : vérifier $1, verdict VERT, ROUGE ou BLOQUÉ ; le rapport note le modèle de l’intégrateur.
3. Écris toujours le rapport du contrôleur dans `qa/qa-$1-tour<N>.md` (le contrôleur n’a pas d’outil d’écriture).
   - VERT → coche $1 dans `workflow/backlog.md`, arrête.
   - ROUGE → tour suivant.
   - BLOQUÉ → arrête tout de suite, sans tour suivant ni escalade : le problème vient de l’environnement, pas du code. Écris la commande refusée et le message dans `workflow/blocages.md` et dans `workflow/STOP-BOUCLE.md` (2 lignes : ce qui bloque, ce que le pilote doit faire). Le script de boucle s’arrête en le voyant.
Après le dernier tour encore ROUGE : laisse décoché, écris les écarts dans `workflow/blocages.md`.
Réponse finale en 3 lignes : statut, tours utilisés, écarts restants.
