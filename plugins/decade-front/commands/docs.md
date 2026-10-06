---
description: Régénère la documentation du projet (portail + doc) avec le kit Decade, la contrôle et donne le lien — à tout moment, sans attendre /publish
argument-hint: [verifier]
allowed-tools: Read, Write, Edit, Glob, Grep, Agent, Task, Bash(npm run *), Bash(npm install *), Bash(node *check-docs.mjs*), Bash(ls *), Bash(git status)
---
**Entrées :** `decade.config.json` (stack) · `design/ds-export/` (README, fiches, tokens) · `design/CHANGELOG.md` · catalogue des composants et données du site · `qa/perf.json`
**Sorties :** la doc reconstruite (html : `dist/docs/` ; nextjs : `out/docs/` ; react : `dist/docs/`) · verdict de `npm run docs:check` · le lien à ouvrir

Tu régénères la documentation du projet. Le pilote n’est pas développeur front : phrases courtes.

## 0. Mode « verifier »
Si `$ARGUMENTS` vaut `verifier` : ne modifie rien, lance seulement l’étape 3 (build + contrôle) et rends le verdict.

## 1. Le projet est-il sur le kit Decade ?
Le projet est **à jour** si les trois sont vrais :
- la doc utilise les styles du kit (`docs.scss` identique à `doc-kit/docs.scss` du skill `decade-portail`, plus un `_doc-theme.scss`) ;
- le Markdown est rendu par le parseur de référence (nextjs/react : `src/docs/Markdown.tsx` avec `react-markdown` ; html : `tools/markdown.mjs` avec `marked`), sans parseur maison ;
- le script npm `docs:check` existe, et `scripts/check-docs.mjs` aussi.

Sinon, **mets le projet à jour** en déléguant au sous-agent **decade-documentaliste** (skill `decade-portail`) :
- copier depuis les références du skill, sans les réécrire : styles du kit (`docs.scss`, `portal.scss`), portail (nextjs/react : `src/app/page.tsx` ; html : `_portal.scss` + `index.njk`), `Markdown`, `CodeBlock`, `CopyButton`, `DocChrome`, `Hero`, `read`, `jsx`, layout et pages de la doc (nextjs/react) ou `tools/markdown.mjs`, `build-docs.mjs` et gabarits (html) ;
- adapter seulement `_doc-theme.scss` (relier les `--doc-*` aux tokens du projet, en clair et en sombre) et les données (site, catalogue) ;
- installer les dépendances manquantes (nextjs/react : `react-markdown remark-gfm rehype-slug shiki lucide-react` ; html : `marked shiki`) ;
- copier `doc-kit/check-docs.mjs` dans `scripts/` et ajouter `docs:check` (voir `/decade-front:build-front`, étape 4), appelé à la fin de `npm run check` ;
- supprimer de la doc l’ancien parseur Markdown maison et les styles improvisés **seulement après** avoir vérifié qu’ils ne sont plus importés nulle part.

Montre au pilote la liste des fichiers ajoutés ou modifiés avant de continuer.

## 2. Mettre le contenu à jour
- Catalogue : un composant par fiche, une story par exemple (nextjs/react) ; ajoute ce qui manque d’après `workflow/backlog.md`.
- Version affichée = `design/ds-export/version.json`.
- Portail : il n’utilise que les variables `--doc-*` (reliées aux tokens dans `_doc-theme.scss`) ; ne jamais le styler avec des noms de tokens devinés. `docs:check` signale toute variable CSS non définie et un portail sans le kit.
- Tokens : la page lit `design/ds-export/tokens.json` au format de l’export Claude Design (`{ color: { themes, tokens: [{ name, value: { light, dark } }] }, type: { families, groups }, spacing: { tokens } … }`) ; garde la page de référence, elle accepte aussi l’ancien format (`{ famille: [...] }`). `docs:check` signale une page Tokens vide.
- Pages, journal des versions (`design/CHANGELOG.md`), performance (`qa/perf.json`) : relus tels quels.

## 3. Construire et contrôler
- `npm run build`, puis `npm run docs:check`.
- ROUGE : corrige les erreurs listées (au plus 2 tours), puis relance. Toujours ROUGE : écris les erreurs restantes dans `workflow/blocages.md` et arrête-toi.

## 4. Rendre la main
Termine par le bloc « 🧭 À toi, pilote » (skill `decade-guide-pilote`) :
- ✔ Fait : doc reconstruite, verdict de `docs:check`, nombre de pages contrôlées ;
- ▶ À faire maintenant : ouvrir la doc (`npm run dev` puis http://localhost:3000/docs en nextjs ; `npm start` puis /docs/ en html) ;
- ☐ À vérifier : le guide de marque, une fiche composant, sur ordinateur et sur téléphone ;
- ⏭ Ensuite : /decade-front:next-step.
