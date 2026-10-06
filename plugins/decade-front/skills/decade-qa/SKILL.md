---
name: decade-qa
description: Contrôles qualité Decade (build, tests d’interaction, captures multi-largeurs, accessibilité, règles du BRIEF) et format du rapport. À utiliser pour vérifier un composant, une page ou tout le projet.
---
# QA Decade

Largeurs : `decade.config.json` → `breakpoints`.

| Contrôle | Commande | Vert si… |
| --- | --- | --- |
| Build, lint, types, doc | `npm run check` (se termine par `npm run docs:check`) | aucune erreur |
| Documentation | `npm run docs:check` (`scripts/check-docs.mjs`, kit `decade-portail`) | VERT : aucun Markdown non rendu, aucun HTML échappé affiché, aucun bloc de code vide, aucun lien interne cassé, un seul h1 par page ; styles du kit présents (`.doc-shell`) |
| Interactions | `npm run test:ui` | couches, menus, filtres, formulaires, clavier, Échap, focus OK |
| Captures | `npm run shots` | ni débordement, ni texte coupé, ni chevauchement, cartes de même hauteur |
| Accessibilité | axe via Playwright | aucun problème sérieux ; contraste ≥ 4,5:1 |
| Mouvement | `npm run test:ui` en mode réduit émulé | niveaux du catalogue respectés, pause sur tout défilement auto, rien de bloqué |
| Performance | `npm run perf` (Lighthouse CI, `perf/lighthouserc.cjs`) | LCP ≤ 2,5 s, CLS ≤ 0,1, TBT ≤ 300 ms, score ≥ 85, JS ≤ 300 Ko, images ≤ 200 Ko par page (seuils de `performance` dans la config) |
| Code React (react, nextjs) | lecture | règles CRITICAL et HIGH de `vercel-react-best-practices` respectées ; pas d’empilement de booléens (`vercel-composition-patterns`) |
| Erreurs Next.js (nextjs) | Next DevTools MCP `get_errors` | aucune erreur de compilation, d’exécution ou d’hydratation |
| Règles du BRIEF | lecture | casse, police des titres, boutons, icônes conformes |

## Performance : quand et comment
- Mesure sur le site **construit** (html : `dist/` ; nextjs : `next build` puis `next start` ; react : `vite build` puis `vite preview`), 3 passages, valeur médiane.
- Dans la boucle des **pages** : la page vérifiée seulement. Dans `/qa all` : toutes les pages. Jamais dans la boucle des composants.
- On mesure ce que le front maîtrise (affichage, stabilité, poids) : les données sont fictives, pas de test serveur ni d’API.
- `performance.bloquant` vaut false au premier projet (avertissement), puis true ; on resserre les seuils projet après projet.
- Résultat : `qa/perf.json` (une ligne par page : score, LCP, CLS, TBT, poids JS, poids images), repris par la page « Performance » du portail.
- Un résultat ROUGE se diagnostique avec Chrome DevTools MCP (trace de performance) par l’intégrateur, jamais par le contrôleur.

## Rapport
`qa/qa-<cible>.md` : tableau (contrôle, statut, détail), puis ce qui reste rouge. Le contrôleur ne corrige jamais : il décrit l’écart et la correction attendue.
