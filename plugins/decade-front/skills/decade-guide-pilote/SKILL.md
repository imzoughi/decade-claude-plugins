---
name: decade-guide-pilote
description: Guidage du pilote Decade — le bloc « 🧭 À toi, pilote » qui termine chaque commande du workflow, et la fiche de chaque étape (ce que le pilote fait, vérifie, fournit, et quand c’est fini). À utiliser à la fin de toute commande du workflow et chaque fois que le pilote demande quoi faire.
---
# Guider le pilote à chaque étape

Le pilote est chef de projet et dev backend, pas développeur front. Il ne doit jamais se demander « et maintenant ? ».

## Règle
Toute réponse qui clôt une commande du workflow (`/build-front`, `/next-step`, `/audit`, `/pack-design`, `/import-ds`, `/sync-figma`, `/qa`, `/publish`) se termine par ce bloc, et rien après :

```
🧭 À toi, pilote — étape N sur 7 · <nom de l’étape>
✔ Fait : <ce qui vient d’être produit, en une phrase, avec le fichier>
▶ À faire maintenant : <UNE action : la commande exacte, ou qui fait quoi dans quel fichier>
☐ À vérifier : <1 à 3 points pris dans la fiche de l’étape>
⏭ Ensuite : <la commande suivante, en général /next-step>
```

- Écris toujours les commandes avec leur nom complet, `/decade-front:<commande>` (par exemple `/decade-front:next-step`) : c’est la forme qui marche partout ; le nom court n’est pas reconnu dans tous les environnements.
- Une seule action dans « À faire maintenant ». Si c’est à l’agence d’agir, écris-le (« Envoyer … à l’agence ») et dis quoi faire au retour.
- L’état vient des fichiers du dépôt (`node "${CLAUDE_PLUGIN_ROOT}/hooks/etat.js"`), pas de ta mémoire.
- S’il y a des blocages dans `workflow/blocages.md`, ajoute une ligne `⚠ Bloqué : <élément> — <qui agit>`.
- Un hook vérifie la présence du bloc : sans lui, la commande n’est pas terminée.

## Fiches des étapes
Les fiches sont dans `fiches.md` : pour chaque étape, ce que le pilote **fait**, ce qu’il **vérifie**, ce qu’il **ne fait pas**, et à quoi il voit que l’étape est **terminée**. Prends-y les points « À vérifier ».

## Étapes hors de Claude Code
Quand l’action se passe ailleurs (Claude Design, l’agence, la recette), le pilote reçoit une check-list dans le dépôt, qu’il coche au fur et à mesure :
- étape 4 : `design/pack/GUIDE-ETAPE-4.md` (écrit par `/pack-design`) ;
- NO-GO : `audit/retours-agence.md`, prêt à envoyer ;
- étape 7 : `qa/recette.md` (écrit par `/qa all`).
