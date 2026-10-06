# Stack React Decade (Vite + React + TypeScript)

Pour : projets React sans Next.js (application existante, widget, bibliothèque de composants).

## Outils
- Vite + React + TypeScript strict ; SCSS modules ; Storybook 10.3+ avec addon MCP ; Playwright pour captures et tests ; axe pour l’accessibilité ; Lighthouse CI pour la performance.

## Arborescence
```
src/
  components/ui/        atomes (Button, Input, Badge…)
  components/blocks/    molécules et organismes (ProductCard, MegaMenu…)
  pages/                une page par entrée du BRIEF (routeur léger)
  styles/               tokens.css, globals.scss, mixins, motion.scss
  lib/api/              accès aux données (mocks aujourd’hui)
  mocks/                données typées
  portal/               portail et documentation (skill decade-portail)
.storybook/
tests/                  Playwright + Lighthouse CI
```

## Scripts npm attendus
`dev`, `build`, `check` (lint + tsc + build), `storybook`, `shots`, `test:ui`, `perf`.
