# Règles du plugin : où elles sont, d’où elles viennent

Toutes les règles appliquées par le plugin `decade-front` sont dans des fichiers Markdown du dépôt, lisibles et versionnés. Ce fichier dit **où** les trouver et **sur quoi** elles s’appuient. Licences des projets cités : [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md).

Chemins relatifs à `plugins/decade-front/`.

## Où sont les règles

| Règles | Fichier | Utilisées par |
|---|---|---|
| Audit Figma, grille A (intégrabilité) et grille B (qualité UI/UX), décision GO / NO-GO, format des retours agence | `skills/decade-audit-figma/grilles.md` | agent `decade-auditeur`, commande `/audit` |
| Règles UI/UX (version courte d’impeccable et UI/UX Pro Max) | `skills/decade-ui-ux/regles.md` | audit (grille B), affinage dans Claude Design, finitions du code |
| Règles d’or du design system (9 règles) | `skills/decade-regles-or/regles-or.md` | prompts Claude Design, intégrateur, contrôleur QA ; hook `check-tokens` (règle 1) |
| Accessibilité des animations (3 niveaux, pause, mouvement réduit) | `skills/decade-motion/SKILL.md`, `skills/decade-motion/catalogue.md` | Claude Design, intégrateur, contrôleur QA |
| Contrôles QA (build, doc, interactions, captures, accessibilité, mouvement, performance, React, Next.js, BRIEF) | `skills/decade-qa/SKILL.md` | agent `decade-controleur-qa`, commande `/qa` |
| Seuils de performance (Lighthouse CI) | `skills/decade-qa/perf/lighthouserc.cjs`, réglages `performance` de `decade.config.json` | `npm run perf` |
| Règles React / Next.js (copiées de Vercel) | `skills/vercel-react-best-practices/`, `skills/vercel-composition-patterns/` | intégrateur, contrôleur QA (stacks react et nextjs) |
| Conventions par stack | `skills/decade-stack-html/`, `skills/decade-stack-react/`, `skills/decade-stack-nextjs/` | intégrateur |
| Garde-fous (commandes et fichiers interdits) | `hooks/guard-bash.js`, `hooks/guard-files.js`, `project-template/.claude/settings.json` (racine du dépôt) | à chaque action de Claude |

## Sur quoi elles s’appuient

| Règle | Référence |
|---|---|
| Contraste ≥ 4,5:1 (3:1 grands textes et icônes) | WCAG 2.2, 1.4.3 et 1.4.11 · https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html · https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html |
| Pas de sens porté par la couleur seule | WCAG 1.4.1 · https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html |
| Cibles ≥ 44 px | WCAG 2.5.5 · https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html · Apple HIG · https://developer.apple.com/design/human-interface-guidelines/accessibility |
| Focus visible, ordre de focus | WCAG 2.4.7 et 2.4.3 · https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html · https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html |
| Nom accessible | WCAG 4.1.2 · https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html |
| Textes alternatifs | WCAG 1.1.1 · https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html |
| Pas de débordement, responsive | WCAG 1.4.10 · https://www.w3.org/WAI/WCAG22/Understanding/reflow.html |
| Labels et erreurs des formulaires | WCAG 3.3.2 et 3.3.1 · https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html · https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html |
| Échap ferme les couches, clavier | WAI-ARIA APG · https://www.w3.org/WAI/ARIA/apg/patterns/ · https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ |
| Pause sur tout mouvement automatique > 5 s | WCAG 2.2.2 · https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html |
| Mouvement réduit, trois niveaux | WCAG 2.3.3 · https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html · `prefers-reduced-motion` · https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion · motion-skills · https://github.com/iart-ai/motion-skills |
| États, retours, cohérence, contrôle de l’utilisateur | Heuristiques de Nielsen · https://www.nngroup.com/articles/ten-usability-heuristics/ |
| 45 à 75 caractères par ligne | Practical Typography · https://practicaltypography.com/line-length.html |
| Hiérarchie, espacement, cohérence visuelle | impeccable · https://github.com/pbakaus/impeccable · UI/UX Pro Max · https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| Tokens seulement | Design Tokens (W3C Community Group) · https://www.designtokens.org/ |
| Un rôle, un composant | Atomic Design · https://atomicdesign.bradfrost.com/ |
| LCP ≤ 2,5 s, CLS ≤ 0,1 | Core Web Vitals · https://web.dev/articles/vitals |
| TBT, score Lighthouse | https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time · Lighthouse CI · https://github.com/GoogleChrome/lighthouse-ci |
| Budgets JS et images | budgets de performance · https://web.dev/articles/performance-budgets-101 (valeurs : choix du plugin) |
| Tests d’accessibilité automatiques | axe-core · https://github.com/dequelabs/axe-core · Playwright · https://playwright.dev/ |
| Règles React / Next.js | Vercel agent-skills · https://github.com/vercel-labs/agent-skills |

Les règles sans référence publique (nommage des calques, contenus réalistes, assets, identité de marque, contrôles de build et de documentation, règles du BRIEF) sont des **règles maison**, tirées du projet de référence.
