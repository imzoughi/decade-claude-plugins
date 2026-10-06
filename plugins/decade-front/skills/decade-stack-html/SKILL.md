---
name: decade-stack-html
description: Conventions Decade pour les maquettes HTML / SCSS / JS modulaires (Nunjucks, Dart Sass, modules JS, esbuild). À utiliser quand decade.config.json indique "stack": "html".
---
# Stack HTML / SCSS / JS Decade
Lis `conventions.md` (arborescence, conventions, scripts npm) et `pieges.md` (retours du projet de référence) avant d’écrire du code.
Depuis `design/ds-export/` : variables CSS et partials SCSS depuis les tokens, une macro Nunjucks par composant (même HTML que le rendu du composant du design system), un module JS par composant interactif. Portail et doc : skill `decade-portail` (référence HTML). Animations : skill `decade-motion` (`snippets/motion.scss`, `snippets/motion.js`).
