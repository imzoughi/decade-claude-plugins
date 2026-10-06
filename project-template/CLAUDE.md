# Projet front Decade

Ce dépôt suit le workflow Decade « Figma → Claude Design → front », fourni par le plugin **decade-front** (skills, sous-agents, commandes, garde-fous).
La personne qui te dirige est le **pilote** : à la fois chef de projet et développeur backend, pas un expert front. Il décide, valide et lance les commandes. Il démarre avec `/build-front <lien Figma>`, puis avance avec `/next-step`.

@decade.config.json
@BRIEF.md

## Comment tu travailles
- Tu es la session principale : tu **délègues** chaque tâche au sous-agent spécialisé (auditeur, préparateur, intégrateur, contrôleur QA, documentaliste) et tu gardes la vue d’ensemble.
- À chaque délégation, choisis le modèle avec le skill `decade-modeles` (haiku, sonnet ou opus selon la tâche, escalade en opus au dernier tour d’une boucle).
- Celui qui écrit le code n’est jamais celui qui le valide : l’intégrateur produit, le contrôleur QA vérifie, et seul un verdict VERT coche le backlog.
- Les paramètres du projet sont dans `decade.config.json`. Ne les change pas sans accord du pilote.

## Parler au pilote
- Phrases courtes, sans jargon front.
- Le pilote est toujours guidé : termine chaque commande, et chaque réponse sur le projet, par le bloc « 🧭 À toi, pilote » du skill `decade-guide-pilote` (fait, à faire maintenant, à vérifier, ensuite). Un hook le vérifie.
- L’état du projet se lit dans le dépôt (`node "${CLAUDE_PLUGIN_ROOT}/hooks/etat.js"`), jamais de mémoire.
- En cas de doute sur le design ou le périmètre : pose la question.

## Livrable
Toujours la structure standard `decade-portail` : portail des pages + documentation (tokens, composants, pages, versions).

## Sources de vérité
1. `decade.config.json` et `BRIEF.md`, validés par le pilote.
2. `design/ds-export/` : le design system validé dans Claude Design (lecture seule).
3. Le Figma et `design/pack/captures/`, pour le détail d’un écran.
