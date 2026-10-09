# Composants tiers et licences

Ce fichier recense tout ce qui, dans le plugin `decade-front`, vient d’un tiers, sous quelle licence, et comment on l’utilise. À tenir à jour à chaque ajout ou mise à jour d’un composant tiers (et à relire à chaque montée de version).

> Ce recensement est un travail d’ingénierie, pas un avis juridique. Les licences ont été relevées à la date indiquée ; elles peuvent changer d’une version à l’autre de chaque projet.

Relevé le : 9 octobre 2026.

## 1. Copié dans le plugin (redistribué)

| Composant | Dossier dans le plugin | Source | Version figée | Licence | Obligations |
|---|---|---|---|---|---|
| Vercel React Best Practices | `plugins/decade-front/skills/vercel-react-best-practices/` | https://github.com/vercel-labs/agent-skills | commit `063bee9` (28/08/2026) | MIT, © Vercel | garder l’avis de copyright et le texte de licence : `LICENSE.md` dans le dossier |
| Vercel Composition Patterns | `plugins/decade-front/skills/vercel-composition-patterns/` | https://github.com/vercel-labs/agent-skills | commit `063bee9` (28/08/2026) | MIT, © Vercel | idem |

Chaque dossier copié contient un `VENDOR.md` (source, version, relecture) et un `LICENSE.md` (texte de la licence).

## 2. Inspiré ou résumé dans nos propres mots (non copié)

Ces projets ont inspiré des règles du plugin. Aucun fichier n’est copié : les règles sont reformulées en français, en quelques lignes, et chaque endroit cite sa source.

| Projet | Licence | Où le plugin s’en inspire |
|---|---|---|
| impeccable (Paul Bakaus) · https://github.com/pbakaus/impeccable | Apache-2.0 (paquet npm `impeccable`) | `skills/decade-ui-ux/regles.md` · `skills/decade-audit-figma/grilles.md` (grille B) |
| UI/UX Pro Max · https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | MIT (paquet npm `ui-ux-pro-max-cli`) | `skills/decade-ui-ux/regles.md` · `skills/decade-audit-figma/grilles.md` (grille B) |
| motion-skills (iart-ai) · https://github.com/iart-ai/motion-skills | MIT | `skills/decade-motion/SKILL.md` (trois niveaux pour le mouvement réduit) |

Les licences MIT et Apache-2.0 autorisent l’usage commercial, la modification et l’usage interne. Leurs obligations (avis de copyright, texte de licence, fichier NOTICE pour Apache-2.0) s’appliquent quand on **redistribue** le code ou le texte. Ici, rien n’est redistribué : on cite la source par courtoisie et par traçabilité.

## 3. Installé à part par le pilote (non distribué par le plugin)

| Composant | Licence | Comment |
|---|---|---|
| impeccable | Apache-2.0 | installé par le pilote depuis le dépôt officiel, version précise (ONBOARDING 1.5) |
| UI/UX Pro Max | MIT | idem ; ce skill contient des scripts Python (recherche dans des fichiers CSV) : relire avant installation |

Le plugin fonctionne sans eux (version courte de leurs règles dans `decade-ui-ux`). Chaque poste qui les installe accepte leur licence.

## 4. Outils installés dans les projets (dépendances npm)

Installés par `/build-front` dans les `devDependencies` du projet, version fixée. Ils ne sont pas distribués par le plugin ni livrés au client (outils de développement et de contrôle).

| Outil | Licence |
|---|---|
| `@lhci/cli` (Lighthouse CI) | Apache-2.0 |
| `@playwright/test` | Apache-2.0 |
| `axe-core`, `@axe-core/playwright` | MPL-2.0 |
| `storybook`, `@storybook/addon-mcp` | MIT |
| `next-devtools-mcp` | MIT |
| `chrome-devtools-mcp` (optionnel) | Apache-2.0 |

MPL-2.0 (axe-core) : obligations seulement si l’on modifie et redistribue les fichiers d’axe-core eux-mêmes ; l’utiliser pour tester ne crée aucune obligation sur le code du projet.

## 5. Normes et références citées

WCAG 2.2 et les motifs WAI-ARIA (W3C), les heuristiques de Nielsen, Core Web Vitals (Google), Practical Typography, Apple HIG, Atomic Design, Design Tokens (W3C Community Group). Le plugin les **cite** (critère et lien), il ne reproduit pas leurs textes. Liste complète et liens : [`REGLES-ET-SOURCES.md`](REGLES-ET-SOURCES.md).

## 6. Licence du plugin lui-même

Dépôt privé. La licence du plugin `decade-front` reste à déclarer par son propriétaire (fichier `LICENSE` à la racine).
