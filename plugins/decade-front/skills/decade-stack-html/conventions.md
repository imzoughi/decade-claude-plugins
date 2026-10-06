# Stack A — HTML / SCSS / JS (maquettes statiques modulaires)

Pour : projets CMS (templates à intégrer par le backend), stack non connue, maquettes de validation.

## Outils
- Nunjucks (layouts → pages → modules → macros), données en `src/data/*.json`.
- Dart Sass avec `@use` ; tokens générés depuis `design/ds-export/tokens.json` (export Claude Design) en variables CSS + partials.
- JavaScript vanilla en modules, un registre `register({ name, selector, init })` et `mount()` ; esbuild en bundle IIFE.
- Playwright pour captures et tests. Node ≥ 20.11.

## Arborescence
```
src/
  data/            contenus JSON
  templates/       layouts/, pages/, modules/<famille>/, macros/
  scss/            tokens/, base/, components/, layouts/, pages/, refine/
  js/              modules/, main.js
  assets/          fonts/, images/, icons/
docs/              doc du design system générée
tools/             build, qa (shots, interactions)
```

## Conventions
- Un composant = une macro Nunjucks + un partial SCSS + (si besoin) un module JS.
- Classes : préfixe projet, BEM léger (`.is-card`, `.is-card__title`, `.is-card--compact`).
- États via attributs ARIA et `data-*`, jamais via des classes seules.
- Aucune dépendance runtime lourde ; bibliothèques tierces via configuration (ex. carte Leaflet).
- Scripts npm attendus : `dev`, `build`, `check`, `shots`, `test:ui`.
