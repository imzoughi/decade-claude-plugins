---
name: decade-stack-nextjs
description: Conventions Decade pour les maquettes Next.js (App Router, rendu serveur et client, next/image, next/font, routes du portail, Next DevTools MCP). S’appuie sur decade-stack-react pour les composants. À utiliser quand decade.config.json indique "stack": "nextjs".
---
# Stack Next.js Decade

Les composants suivent **decade-stack-react** (et donc les skills Vercel intégrés). Ce skill ajoute ce qui est propre à l’application Next.js ; lis `conventions.md`.

## Application
- App Router ; server components par défaut, `"use client"` seulement pour l’interactif (couches, menus, carrousels, formulaires) et au plus bas de l’arbre.
- Images via `next/image` (tailles déclarées, `priority` seulement sur l’image principale), polices via `next/font`, métadonnées par route.
- Layout racine : `<html lang="fr" suppressHydrationWarning>` et `<body suppressHydrationWarning>` (référence : `decade-portail/reference-nextjs/src/app/layout.tsx`). Les extensions du navigateur (correcteurs comme LanguageTool, QuillBot, Grammarly, gestionnaires de mots de passe) et le bouton de thème de la doc (`data-theme`) modifient les attributs de ces deux balises avant React : sans cette option, erreur d’hydratation en développement. L’option ne masque que les attributs de ces deux balises, jamais les erreurs des composants.
- Données via `src/lib/api` (mocks typés) : le backend remplacera cette couche.
- Portail et doc : skill `decade-portail` (référence Next.js), routes `/` et `/docs`, catalogue alimenté par les stories.
- Animations : skill `decade-motion` (variables `--motion-*`, `useReducedMotion`).

## Next DevTools MCP (si `outils.nextDevtoolsMcp` vaut true, Next.js ≥ 16)
- Serveur `next-devtools` dans `.mcp.json`, installé dans le projet (`next-devtools-mcp`, version fixée) et lancé avec `npx --no-install` ; il se connecte seul au serveur de développement (`npm run dev`).
- Après chaque modification : `get_errors` (erreurs de compilation, d’exécution, d’hydratation) ; `get_routes` pour vérifier que chaque page du BRIEF a sa route.
