---
name: decade-stack-react
description: Conventions Decade pour les composants React (API des props, composition, stories, accessibilité, Storybook et Storybook MCP). À utiliser quand decade.config.json indique "stack": "react" ou "nextjs" (Next.js s’appuie sur ce skill).
---
# Stack React Decade

Lis `conventions.md` avant d’écrire du code. Applique aussi les skills intégrés **vercel-react-best-practices** (performance) et **vercel-composition-patterns** (API des composants) ; en cas de conflit, les règles d’or Decade priment.

## Composants
- Un composant = `Nom.tsx` + `Nom.module.scss` + `Nom.stories.tsx`. Props typées, variantes nommées par rôle, pas d’empilement de booléens (composants composés plutôt que `isX`, `hasY`).
- Tokens en variables CSS depuis `design/ds-export/tokens.json` ; animations du skill `decade-motion` (`useReducedMotion`).
- Une story par variante et par état : **une story = un exemple du portail = un test**.

## Storybook et Storybook MCP (si `outils.storybookMcp` vaut true)
- Storybook ≥ 10.3, addon `@storybook/addon-mcp`, `componentsManifest: true` dans `.storybook/main.ts`. Le serveur MCP répond sur `http://localhost:6006/mcp` quand Storybook tourne (`npm run storybook`).
- Avant de créer un composant : interroge `docs-list` / `docs-show` pour réutiliser l’existant (règle d’or « pas de doublon »).
- Après modification : `test-run` (tests et accessibilité des stories) jusqu’au vert, dans la limite des tours de la config.
- Storybook MCP est en préversion : s’il ne répond pas, continue sans lui et note-le dans `workflow/blocages.md`.

## Données
Mocks typés dans `src/mocks/`, exposés par `src/lib/api` comme une vraie API ; le backend remplacera cette couche.
