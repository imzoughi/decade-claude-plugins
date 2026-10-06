---
name: decade-passation-backend
description: Prépare la passation du front livré à une équipe ou à une IA backend — dossier livraison/backend/ (AGENTS.md, contrat de données en JSON Schema, exemples, points de branchement, actions) et son contrôle. À utiliser pour /publish et /handoff.
---

# Passation backend Decade

Objectif : une autre IA (Claude, Codex, Cursor…) ou un développeur backend ouvre le projet et sait **sans fouiller le code** quelles données fournir, où les brancher et quoi ne pas toucher.

## Ce qu’on produit

| Fichier | Contenu | Source |
|---|---|---|
| `AGENTS.md` (racine du projet) | point d’entrée court pour n’importe quelle IA : renvoie vers `livraison/backend/AGENTS.md` | modèle `templates/AGENTS.racine.md` |
| `livraison/backend/AGENTS.md` | contexte, stack, règles (ne pas toucher aux styles, tokens, composants du design system), commandes de contrôle, ordre de travail | modèle `templates/AGENTS.md` |
| `livraison/backend/contrat-donnees.json` | une entité par objet métier (Produit, Panier, Commande, Utilisateur…), en **JSON Schema** (draft 2020-12) : types, champs obligatoires, formats, exemples | données d’exemple du site |
| `livraison/backend/exemples/<entite>.json` | les données d’exemple réelles du site, au format du contrat | `src/data/`, `src/mocks/` (nextjs/react : fichiers `.ts`, à convertir en JSON ; html : `.json`) |
| `livraison/backend/branchements.md` | un tableau page → composant → donnée lue → fichier à remplacer → appel d’API attendu → états (chargement, vide, erreur) | pages et composants livrés |
| `livraison/backend/actions.md` | chaque action utilisateur (ajouter au panier, se connecter, payer…) : déclencheur, entrée, réponse attendue, erreurs, retour visuel prévu | composants interactifs |

## Règles

- **Rien d’inventé.** Chaque entité et chaque champ du contrat vient d’une donnée réellement affichée par le site. Un champ que le front n’utilise pas n’entre pas dans le contrat.
- **Noms du code.** Les noms des entités et des champs sont ceux du code (ex. `price`, pas `prix` si le code dit `price`) : l’IA backend doit pouvoir les retrouver par recherche.
- **Montants et dates** : préciser l’unité (centimes ou euros, devise) et le format (`date-time` ISO 8601).
- **Couche d’accès** : si le projet a déjà une couche d’accès aux données (ex. `src/lib/api/`), c’est elle le point de branchement de chaque page.
- **Un point de branchement = un endroit précis** : chemin du fichier et nom de la fonction ou de la constante qui fournit aujourd’hui la donnée d’exemple. En Next.js / React, proposer une fonction d’accès (`getProducts()`, `getCart()`) dans `src/data/` si elle n’existe pas encore : les pages l’appellent, le backend n’a qu’à en changer le corps.
- **États** : pour chaque donnée chargée, dire quel composant du design system affiche le chargement (Skeleton), la liste vide (EmptyState) et l’erreur (Toast, Banner). S’il n’y en a pas, l’écrire dans « Points ouverts ».
- **HTML** : les pages sont statiques. Le dossier l’explique et donne, pour chaque page, les blocs répétés à transformer en gabarits (sélecteur CSS du bloc, entité affichée).
- **Aucun secret**, aucune URL privée, aucun identifiant de compte dans ces fichiers.
- Langue : français, phrases courtes ; noms techniques en anglais tels que dans le code.

## Contrôle

`node <plugin>/skills/decade-passation-backend/check-handoff.mjs [dossier du projet]` :
- les 5 fichiers existent, `AGENTS.md` racine renvoie vers `livraison/backend/AGENTS.md` ;
- `contrat-donnees.json` est un JSON valide, chaque entité est un schéma avec `type`, `properties` et `required` ;
- chaque `exemples/<entite>.json` existe et respecte le schéma de son entité (types, champs obligatoires, énumérations) ;
- chaque page du site (`src/data/site.ts` ou `site.json`) apparaît dans `branchements.md` ;
- chaque entité du contrat apparaît dans `branchements.md`.
ROUGE = la passation n’est pas livrable.
