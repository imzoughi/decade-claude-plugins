---
name: decade-modeles
description: Politique Decade de choix du modèle (haiku, sonnet, opus) pour chaque tâche du workflow front, avec escalade automatique quand une boucle bloque. À appliquer à chaque délégation à un sous-agent et à chaque lancement de boucle, pour économiser les tokens sans perdre en qualité.
---
# Le bon modèle pour chaque tâche

Principe : **le modèle le moins cher qui fait le travail du premier coup.** Un modèle trop faible qui rate trois tours coûte plus cher qu’un modèle fort qui réussit au premier.

## Qui choisit quoi
| Niveau | Où c’est réglé | Qui le change |
| --- | --- | --- |
| Session principale (chef d’orchestre) | `"model": "sonnet"` dans `.claude/settings.json` du projet | le pilote (`/model` pour une session) |
| `/next-step` | `model: haiku` dans la commande | équipe technique (plugin) |
| Chaque sous-agent | `model:` de l’agent = valeur par défaut Decade | surchargé par `modeles` dans `decade.config.json` |
| Boucles `claude -p` | `--model` lu dans `modeles.boucle` | `decade.config.json` |

Une skill ne change pas le modèle d’une session déjà ouverte : elle décide du modèle de chaque **délégation**. Quand tu délègues à un sous-agent (outil Agent / Task), passe le paramètre `model` avec la valeur de la table ci-dessous, ou celle de `modeles` dans `decade.config.json` si elle existe.

## Table Decade (valeurs par défaut)
| Tâche | Modèle | Pourquoi |
| --- | --- | --- |
| État du projet, bloc « À toi, pilote », orchestration d’une boucle | **haiku** | lire des fichiers et suivre une procédure |
| Documentation, portail, LIVRAISON.md | **haiku** | rédaction cadrée par des modèles |
| Passation backend (contrat de données, branchements) | **sonnet** | lecture du code et déduction des schémas |
| Pack Claude Design (tokens, inventaire, prompts) | **sonnet** | extraction structurée du Figma |
| Intégration d’un composant ou d’une page | **sonnet** | code, bon rapport qualité / coût |
| Contrôle QA (tests, captures, axe, perf) | **sonnet** | jugement sur des captures |
| Audit du Figma (scores A et B, UX) | **opus** | jugement de design, décision go / no-go |
| `/sync-figma` : contrôle des règles d’or | **opus** | arbitrage sur ce qui entre dans le design system |
| **Escalade** : dernier tour d’une boucle encore ROUGE | **opus** | débloquer plutôt que boucler |

## Escalade (boucles composants et pages)
- Tours 1 à `escaladeAuTour - 1` : intégrateur en `modeles.integration` (sonnet).
- Tour `escaladeAuTour` (par défaut le 3ᵉ, le dernier) : intégrateur en `modeles.escalade` (opus), avec le rapport QA du tour précédent.
- Jamais d’escalade du contrôleur QA : il doit rester constant pour que les verdicts soient comparables.
- Note le modèle utilisé dans le rapport QA du tour (`Modèle de l’intégrateur : …`).

## Autres économies (à appliquer partout)
- Un sous-agent rend un résumé de 15 lignes maximum ; le détail va dans un fichier (`qa/`, `audit/`).
- Ne lis jamais `node_modules/`, `.next/`, `out/`, `storybook-static/`, `.lighthouseci/` (aussi refusés par les permissions du projet).
- Les fichiers jetables (scripts de test ponctuels, logs) vont dans `tmp/` (ignoré par git) et sont supprimés en fin d’étape par le pilote.
- Pour lire un gros fichier (rapport Lighthouse, log), cherche la ligne utile (Grep) au lieu de le lire en entier.
- Entre deux étapes, le pilote peut lancer `/compact` : l’état est dans les fichiers, rien n’est perdu.

## Mesurer (pour optimiser sur du réel)
- Le hook `log-tokens` enregistre, à la fin de chaque tour (boucles comprises), les tokens consommés par la session et par chaque sous-agent : `workflow/logs/tokens.jsonl`, rangés par étape et par modèle.
- `/decade-front:conso` donne le total, la répartition par étape, modèle et agent, et compare au budget estimé de la stack (`budgetTokens` dans `decade.config.json` : forfaits par étape, plus un montant par composant et par page du backlog).
- Après chaque projet : recaler `budgetTokens` sur le réel (`workflow/conso.md`), pour que le budget du suivant soit juste.

## Repères (estimation Decade, à calibrer par la mesure)
Pour ~35 composants et 6 pages, tokens totaux (cache relu compris, ~85 % du total) : html ≈ 25 M · react ≈ 30 M · nextjs ≈ 34 M. Composants et pages représentent environ 80 % du total : c’est là que le choix du modèle et le nombre de tours comptent le plus.
