---
name: decade-portail
description: Structure standard Decade du livrable front — portail qui regroupe toutes les pages, documentation du design system (tokens, composants vivants avec code, pages, versions) — identique en HTML / SCSS / JS et en Next.js. À utiliser pour créer ou mettre à jour le portail et la doc, à chaque import et à la publication.
---
# Portail et documentation Decade

Tous les projets livrent **la même structure**, reprise du projet de référence Intersport. Le pilote et le client retrouvent toujours les mêmes entrées, quel que soit le client ou la stack.

## Ce que le livrable contient
| Entrée | Contenu | Source |
| --- | --- | --- |
| Portail (`/`) | logo, nombre de pages, version du design system, boutons « Voir le site » / « Documentation », une carte par parcours avec ses pages, une carte Documentation — styles du kit `doc-kit/portal.scss` (variables `--doc-*` seulement), à copier tel quel | données du site (pages + groupes) |
| Démarrage | prise en main, commandes npm, liens clés | modèle |
| Architecture | arborescence, conventions, cycle de vie d’un composant, synchronisation avec le design system | modèle + projet |
| Guide de marque | README du design system | `design/ds-export/README.md` |
| Tokens | couleurs clair / sombre, typo, espacements, rayons, ombres, mouvement | `design/ds-export/tokens.json` |
| Composants | une fiche par composant : règles du design system, exemple vivant, code à copier, fichiers, hooks, page où le voir | catalogue + `design/ds-export/components/*.md` |
| Pages & maquettes | aperçu de chaque page, bureau et mobile | données du site |
| JavaScript / SCSS (html) | un paragraphe par fichier, lu dans son commentaire d’en-tête | fichiers du projet |
| Journal des versions | une entrée par version importée du design system | `design/CHANGELOG.md` |
| Performance | score, LCP, CLS, TBT, poids par page, VERT ou ROUGE | `qa/perf.json` (écrit par `/qa`) |

## Kit de documentation (`doc-kit/`) — obligatoire, toutes stacks
La doc doit avoir **le rendu de la doc Intersport**, sans erreur de balisage. Pour ça, on ne réinvente rien :
- **Styles** : copie `doc-kit/docs.scss` tel quel (classes `doc-*`, apparence Intersport). Le seul fichier à adapter est `doc-kit/_doc-theme.scss` : relie chaque variable `--doc-*` à un token du projet (couleurs, polices), en clair et en sombre. Aucune autre feuille de style pour la doc.
- **Markdown** (README du design system, fiches composant, journal) : toujours par un vrai parseur GFM, jamais par un convertisseur maison.
  - html : `reference-html/tools/markdown.mjs` (`marked` + `shiki`) ;
  - react / nextjs : `reference-nextjs/src/docs/Markdown.tsx` (`react-markdown` + `remark-gfm` + `rehype-slug` + `shiki`).
- **Code** : tout bloc de code passe par `codeBlock()` (html) ou `<CodeBlock>` (nextjs) : coloré au build par Shiki, bouton Copier, région défilante nommée. Jamais de `<pre>{texte}</pre>` brut pour du Markdown.
- **Exemples** : sous chaque exemple, son code (nextjs : `parameters.docs.source.code` de la story, sinon JSX reconstruit depuis les args, `src/docs/jsx.ts`).
- **Fiches du design system** : `design/ds-export/components/<Nom>/README.md` (ou `<Nom>.md`), rendues avec un décalage d’un niveau (sous le h2 « Règles du design system »).
- **Contrôle** : `node <plugin>/skills/decade-portail/doc-kit/check-docs.mjs <dossier construit>` après chaque build de la doc (html : `dist/docs` ; nextjs : `out --prefix /docs [--base /<basePath>]`). Il refuse : Markdown non rendu, HTML échappé affiché, bloc de code vide, lien interne cassé, image sans alt, id en double, h1 absent ou multiple, kit absent. ROUGE = la doc n’est pas livrable.
- Dépendances à installer : html → `marked shiki` ; nextjs/react → `react-markdown remark-gfm rehype-slug shiki lucide-react`.

## Branche html (`reference-html/`)
- `build.mjs` construit pages, CSS, JS et doc dans `dist/` ; `tools/build-docs.mjs` génère la doc ; `tools/nunjucks-env.mjs` fournit `icon()` et les filtres.
- Données : `src/data/site.json` (`name`, `slug`, `dsVersion`, `home`, `groups[]`, `pages[]`) ; catalogue : `docs/catalog.mjs`.
- Modèles : `docs/templates/*.njk` (layout, index, architecture, guidelines, tokens, component, pages, javascript, scss, versions), portail `src/templates/pages/index.njk`, styles `src/scss/pages/_portal.scss`, `docs/docs.scss`, `docs/docs.js`.
- L’intégration des polices en base64 dans `build.mjs` sert aux pages ouvertes depuis le disque ; adapter le nom des fichiers de police au projet.

## Branches react et nextjs (`reference-nextjs/`)
- Portail : `src/app/page.tsx` ; doc : `src/app/docs/` — `layout.tsx` (barre du haut, navigation, thème, via `src/docs/DocChrome.tsx`), `page.tsx` (démarrage), `architecture`, `marque` (guide de marque), `tokens`, `composants/[id]`, `pages`, `versions`, `performance`. Styles : `docs.scss` + `_doc-theme.scss` du kit. Copier ces fichiers, puis adapter seulement les données (`site.ts`, catalogue) et `_doc-theme.scss`.
- Données : `src/data/site.ts` ; catalogue : `src/docs/catalog.tsx`, alimenté par les **stories** (portable stories) : une story = un exemple du portail = un test ; bloc de code : `src/docs/CodeBlock.tsx`.
- Stack `react` (sans Next.js) : même structure, en routes du routeur de l’application (`/` et `/docs`).
- Storybook (et son serveur MCP) sert aux développeurs et aux agents ; le portail et la doc ci-dessus restent le livrable standard partagé avec le pilote et le client. Les deux lisent les mêmes stories : aucune double documentation.

## Règles
- À chaque composant ou page ajouté : une entrée dans le catalogue ou dans les données du site. Rien n’est livré sans sa fiche.
- La version affichée (`dsVersion`) est celle de `design/ds-export/version.json`.
- Le portail et la doc utilisent les tokens et composants du design system, comme le reste du site.
