# Stack B — Next.js / React

Pour : projets dont la cible est une application Next.js.

## Outils
- Next.js (App Router) + React + TypeScript strict.
- SCSS modules (`*.module.scss`) + variables CSS générées depuis `design/ds-export/tokens.json` (export Claude Design) (Style Dictionary).
- Storybook 10.3+ (addon MCP) pour les composants, Next DevTools MCP ; Playwright pour captures et tests ; axe pour l’accessibilité ; Lighthouse CI pour la performance.
- Données : mocks typés en `src/mocks/*.ts`, exposés comme s’ils venaient d’une API (le backend remplace la couche `src/lib/api`).

## Arborescence
```
src/
  app/                  routes (une route par page du BRIEF), layout.tsx
  components/ui/        atomes (Button, Input, Badge…)
  components/blocks/    molécules et organismes (ProductCard, MegaMenu…)
  styles/               tokens.css, globals.scss, mixins
  lib/api/              fonctions d’accès aux données (mocks aujourd’hui)
  mocks/                données typées
.storybook/
tests/                  Playwright
```

## Conventions
- Un composant = `Nom.tsx` + `Nom.module.scss` + `Nom.stories.tsx` ; props typées et documentées.
- Server components par défaut ; `"use client"` seulement pour l’interactif (couches, menus, carrousels).
- Pas de librairie UI tierce sauf décision du BRIEF ; primitives accessibles possibles (Radix) si validé.
- Images via `next/image`, polices via `next/font`.
- Scripts npm attendus : `dev`, `build`, `start`, `check` (lint + tsc + build), `storybook`, `shots`, `test:ui`, `perf`.
