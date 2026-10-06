# {{projet}} — passation backend

> Fichier pour toute IA de développement (Claude Code, Codex, Cursor…) et pour les développeurs backend.
> Front livré par Decade le {{date}} · design system {{nomDS}} v{{versionDS}} · stack {{stack}}.

## Ce que tu reçois
- Un front **terminé et contrôlé** : {{nbPages}} pages, {{nbComposants}} composants, documentation en ligne : {{lienDoc}}.
- Toutes les données affichées sont aujourd’hui des **données d’exemple** dans `{{dossierDonnees}}`.
- Ton travail : remplacer ces données d’exemple par les vraies données et brancher les actions utilisateur, **sans changer l’apparence**.

## Lis dans cet ordre
1. `contrat-donnees.json` — la forme exacte de chaque donnée attendue par le front (JSON Schema).
2. `exemples/` — les données d’exemple actuelles, conformes au contrat (utiles comme réponses factices d’API).
3. `branchements.md` — page par page : quel fichier lit quelle donnée, quoi remplacer, quels états gérer.
4. `actions.md` — ce que chaque bouton ou formulaire doit déclencher côté serveur.

## Règles à respecter
- **Ne modifie pas** : les styles (`*.scss`), les tokens du design system, les composants de `{{dossierComposants}}`, la documentation (`{{dossierDoc}}`).
- Modifie seulement les fonctions d’accès aux données (`{{dossierDonnees}}`) et ajoute ce qu’il faut pour les actions (appels d’API, gestion d’erreur).
- Garde la forme des données du contrat. Si l’API renvoie autre chose, adapte dans la fonction d’accès, pas dans les composants.
- Chaque donnée chargée gère ses 3 états avec les composants prévus dans `branchements.md` (chargement, vide, erreur).
- Pas de secret dans le code : variables d’environnement uniquement ({{fichierEnvExemple}}).

## Commandes
| But | Commande |
|---|---|
| Installer | `{{cmdInstall}}` |
| Lancer en local | `{{cmdDev}}` |
| Tout contrôler (lint, types, build, doc) | `{{cmdCheck}}` |
| Tests visuels (pages identiques au design) | `{{cmdTestsUI}}` |

Le travail est fini quand `{{cmdCheck}}` est vert et que les tests visuels n’ont pas bougé.

## Points ouverts
{{pointsOuverts}}
