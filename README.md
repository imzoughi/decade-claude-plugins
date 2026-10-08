# Decade · plugins Claude Code

Les **skills**, **sous-agents** et **garde-fous** maison de Decade, **variabilisés** pour servir tous les projets.
Premier plugin : **decade-front** — Figma de l’agence → audit → Claude Design → maquettes HTML / SCSS / JS ou Next.js.

## Trois niveaux de variables
| Niveau | Où | Qui le maintient | Exemples |
| --- | --- | --- | --- |
| Entreprise | ce dépôt (plugin `decade-front`) | équipe technique Decade | grilles d’audit, conventions de stack, règles UI/UX, garde-fous |
| Type de projet | `skills/decade-brief/presets/*.json` | équipe technique | pages et couches par défaut d’un e-commerce, d’un site vitrine |
| Projet | `decade.config.json` dans chaque dépôt | le pilote | client, lien Figma, stack, pages, seuils, tours de boucle, dossiers protégés |

On améliore une grille ou une convention **une fois**, dans le plugin : tous les projets en profitent à la mise à jour.

## Ce que contient le plugin
```
plugins/decade-front/
  .claude-plugin/plugin.json
  commands/   build-front (démarrage), next-step (en cours), audit, pack-design, import-ds, sync-figma, qa, publish, docs, conso, handoff (+ internes ds-component, page)
  agents/     decade-auditeur, decade-preparateur-design, decade-integrateur,
              decade-controleur-qa, decade-documentaliste, decade-passeur-backend
  skills/     decade-brief, decade-audit-figma, decade-ui-ux, decade-claude-design,
              decade-stack-html, decade-stack-nextjs, decade-qa, decade-motion,
              decade-regles-or, decade-portail (références HTML et Next.js), decade-stack-react,
              decade-guide-pilote (bloc « 🧭 À toi, pilote » et fiches des étapes),
              decade-modeles (le bon modèle pour chaque tâche, escalade),
              decade-passation-backend (livraison/backend/ pour une équipe ou une IA backend),
              vercel-react-best-practices, vercel-composition-patterns (tiers, MIT, version figée)
  hooks/      hooks.json + guard-bash, guard-files, check-tokens, log-agent,
              etat, guide-session, check-guide, log-tokens, conso (Node, Windows compris)
project-template/   CLAUDE.md, decade.config.json, .claude/settings.json, scripts/loop.(sh|ps1)
```

## Entrées et sorties de chaque étape
| Étape | Commande | Entrées | Sorties |
| --- | --- | --- | --- |
| 1 Démarrer et cadrer | `/build-front <lien Figma>` | lien Figma, réponses du pilote, preset | `decade.config.json`, `BRIEF.md`, backlog |
| 2 Auditer | `/audit` | Figma, config, BRIEF | rapport (scores, décision), retours agence, corrections UX, photo du Figma |
| 3 Préparer | `/pack-design` | Figma, audit, corrections cochées | `design/pack.zip` (tokens, motion, assets, captures, inventaire, règles d’or, prompts) |
| 4 Design system | Claude Design | `pack.zip` | `design/ds-export/` (version, journal, tokens, CSS, composants, README) |
| 5 Composants | `/import-ds` + boucle | `ds-export/`, stack | composants vérifiés, portail et doc à jour |
| 6 Pages | boucle | composants, données de démo | pages vérifiées, reliées au portail |
| 7 Publier | `/qa all`, `/publish` | QA verte, recette du pilote | portail + doc publiés, commandes git |
| Mise à jour | `/sync-figma` | Figma modifié, photo précédente | rapport de changements, retours designer, `pack-maj.zip`, backlog à refaire |

## Le livrable : portail + documentation, identique pour chaque projet
Reprise du projet de référence Intersport, en HTML comme en Next.js (skill `decade-portail`) : un portail qui regroupe toutes les pages par parcours, et une documentation avec démarrage, architecture, guide de marque, tokens, une fiche par composant (règles, exemple vivant, code à copier), pages, JavaScript / SCSS et journal des versions.


Régénérer la doc à tout moment : `/decade-front:docs` (met le projet au kit si besoin, reconstruit, contrôle avec docs:check ; `/decade-front:docs verifier` contrôle sans rien modifier).

Kit de documentation (`decade-portail/doc-kit/`) : mêmes styles que la doc Intersport pour toutes les stacks (seul `_doc-theme.scss` s’adapte au projet), Markdown rendu par un vrai parseur (GFM), code coloré au build (Shiki), et `npm run docs:check` qui bloque toute doc avec du Markdown non rendu, des liens cassés ou un balisage incorrect.

## Trois stacks, choisies au démarrage
La stack est choisie à l’étape 1 (`/build-front`, question obligatoire, sans valeur par défaut) et validée par le pilote avec le BRIEF. `/import-ds` refuse de démarrer tant qu’elle est vide. Elle peut changer sans perte jusqu’à l’étape 4.
| Stack | Quand | Skills chargés | Outils MCP ajoutés par `/build-front` |
| --- | --- | --- | --- |
| `html` | CMS intégré par le backend, stack inconnue, maquettes de validation | decade-stack-html | — |
| `react` | application React sans Next.js (Vite) | decade-stack-react + skills Vercel | Storybook MCP |
| `nextjs` | application cible en Next.js | decade-stack-nextjs (+ react) + skills Vercel | Storybook MCP, Next DevTools MCP |

Skills tiers intégrés au plugin, à version figée et relus (voir `VENDOR.md`) : `vercel-react-best-practices` (performance React / Next.js) et `vercel-composition-patterns` (API des composants). Storybook MCP est en préversion : s’il ne répond pas, le travail continue sans lui.

## Performance dans la QA
Lighthouse CI (`@lhci/cli`, installé dans le projet) sur le site construit (en Next.js export statique : `out/` servi en local), 3 passages, médiane : score ≥ 85, LCP ≤ 2,5 s, CLS ≤ 0,1, TBT ≤ 300 ms, JS ≤ 300 Ko et images ≤ 200 Ko par page. Seuils dans `decade.config.json` → `performance` (avertissement au premier projet, bloquant ensuite). Mesuré dans la boucle des pages et par `/qa all`, jamais dans la boucle des composants. Résultats dans `qa/perf.json` et dans la page « Performance » du portail. Diagnostic d’un résultat rouge : Chrome DevTools MCP (optionnel).

## Faire vivre le design system
1. Le designer livre une mise à jour : `/sync-figma` compare le Figma à la photo prise à l’audit (nouveau, modifié, supprimé).
2. Chaque changement passe les **règles d’or** (skill `decade-regles-or`) : conforme, à corriger par le designer, ou écart à valider par le pilote.
3. Le pilote coche ce qui entre ; un pack de mise à jour ne contient que ces composants.
4. Claude Design applique les changements, monte la version et écrit le journal.
5. `/import-ds` ne reprend que les composants changés ; la boucle revérifie ces composants et les pages qui les utilisent.

## Le pilote est toujours guidé
Trois mécanismes, pour qu’à aucun moment le pilote ne se demande « et maintenant ? » :
1. **À l’ouverture** de Claude Code, le hook `guide-session` lit le dépôt et affiche l’étape et la prochaine action (`🧭 Étape 4 sur 7 · Design system → …`).
2. **À la fin de chaque commande**, le bloc « 🧭 À toi, pilote » : fait, à faire maintenant (une seule action), à vérifier, ensuite. Le hook `check-guide` refuse de rendre la main sans lui.
3. **Hors de Claude Code**, une check-list dans le dépôt : `design/pack/GUIDE-ETAPE-4.md` pour Claude Design, `audit/retours-agence.md` en NO-GO, `qa/recette.md` pour la recette. Les boucles finissent par « lance /next-step ».

L’état vient toujours des fichiers (`hooks/etat.js`), pas de la mémoire de Claude : deux pilotes, ou deux sessions, lisent la même chose. Les fiches de chaque étape (fait, vérifie, ne fait pas, terminé quand) sont dans `skills/decade-guide-pilote/fiches.md`.

## Le bon modèle pour chaque tâche (économie de tokens)
Skill `decade-modeles` : le modèle le moins cher qui réussit du premier coup.

| Tâche | Modèle |
| --- | --- |
| Session principale du projet | sonnet (`"model"` dans `.claude/settings.json`) |
| `/decade-front:next-step`, sessions de boucle, documentation | haiku |
| Pack Claude Design, intégration, contrôle QA | sonnet |
| Audit du Figma, règles d’or de `/sync-figma` | opus |
| Dernier tour d’une boucle encore ROUGE | opus (escalade) |

Réglable par projet dans `decade.config.json` → `modeles`. Mesure : hook `log-tokens` (chaque tour, par étape, modèle et agent) et `/decade-front:conso` (rapport comparé au budget `budgetTokens` de la stack). Les permissions refusent aussi la lecture de `node_modules/`, `.next/`, `out/`, `storybook-static/` et `.lighthouseci/`, qui coûtent cher sans rien apporter.

## Comment fonctionnent les agents
1. Le **pilote** (chef de projet et dev backend à la fois) tape `/build-front <lien Figma>` pour démarrer, puis `/next-step` à chaque reprise.
2. La **session principale** lit l’état du dépôt et choisit l’étape. Elle ne fait pas le travail : elle **délègue**.
3. Chaque **sous-agent** démarre avec un contexte neuf, ses **outils limités** et ses **skills préchargés** ; il rend un résumé court.
4. Dans les boucles, **intégrateur → contrôleur QA** : celui qui code n’est jamais celui qui valide. Seul un verdict VERT coche le backlog ; au bout de `toursMax` tours, l’écart part dans `workflow/blocages.md`.
5. Les **hooks** vérifient chaque action, et `log-agent` trace chaque fin de sous-agent dans `workflow/logs/agents.jsonl`.

| Sous-agent | Rôle | Peut | Ne peut pas |
| --- | --- | --- | --- |
| decade-auditeur | scores A et B, go / no-go, retours agence | lire le Figma, écrire dans `audit/` | modifier le code |
| decade-preparateur-design | pack pour Claude Design | écrire dans `design/pack/`, zipper | toucher au code |
| decade-integrateur | composants et pages | écrire le code, lancer `npm run *` | cocher le backlog, pousser |
| decade-controleur-qa | verdict VERT / ROUGE | lancer tests et captures | modifier un fichier |
| decade-documentaliste | doc, portail, publication préparée | écrire la doc | pousser sur git |

## Quatre couches de garde-fous
1. **Permissions** (`.claude/settings.json`) : liste de commandes autorisées, `git push`, `rm -rf` et `.env` refusés.
2. **Hooks** du plugin, actifs même en mode automatique :
   - `guard-bash` bloque `rm -rf`, `git reset --hard`, push forcé, tout `git push`, `curl | sh`, `npm publish`, l’affichage de secrets et la lecture d’un fichier secret en ligne de commande (`cat .env`, `type .npmrc`…) ;
   - `guard-files` bloque les secrets (`.env*`, clés `.pem` `.key` `.p12`, `id_rsa`, `.npmrc`, `.netrc`, `credentials*.json`, `secrets*.json`, `service-account*.json`), l’écriture hors du projet et dans `design/ds-export/` (référence validée) ;
   - `check-tokens` refuse une couleur, une durée ou une courbe d’animation écrite en dur dans un composant et demande un token ;
   - `log-agent` garde la trace de chaque sous-agent ;
   - `guide-session` et `check-guide` garantissent le guidage du pilote (voir plus haut).
3. **Sous-agents à outils limités** : l’auditeur et le contrôleur n’écrivent pas de code ; personne ne pousse.
4. **Humains et bornes** : 4 validations du pilote (BRIEF, audit, design system, recette), relecture des diffs, boucles bornées (`toursMax`, `--max-turns`).

Guide pas à pas pour les équipes : [ONBOARDING.md](ONBOARDING.md).

## Sécurité : MCP et services utilisés

| Outil | Où | Ce qui passe | Accès |
|---|---|---|---|
| MCP Figma (plugin officiel, ou app desktop `127.0.0.1:3845`) | en ligne (ou local) | le fichier Figma du client, avec le compte Figma du pilote | autorisé sans confirmation |
| MCP Storybook | local (`localhost:6006`) | composants du projet | autorisé |
| MCP Next DevTools | local, dépendance du projet (`next-devtools-mcp`, version fixée) | erreurs de build et d’hydratation | autorisé |
| MCP Chrome DevTools | local, dépendance du projet (`chrome-devtools-mcp`, version fixée), désactivé par défaut | traces de performance | confirmation |
| Claude Code (Anthropic) | en ligne | code, contenus Figma lus, rapports | abonnement |
| Claude Design | en ligne, manuel | le pack déposé par le pilote | manuel |
| GitHub | en ligne | plugin (dépôt privé), projet (push par le pilote), portail sur Pages | `git push` interdit à Claude |
| npm | en ligne | dépendances du projet, à l’installation | — |

- Aucun serveur MCP n’est lancé par `npx -y` ni en `@latest` : chaque serveur est une dépendance du projet, version fixée, sous `package-lock.json`, lancé avec `npx --no-install`.
- Les hooks ne font aucun appel réseau. Lighthouse CI (`@lhci/cli`, dépendance du projet) garde ses rapports en local.
- Le portail publié sur GitHub Pages est **public**, même si le dépôt est privé : accord du client, ou hébergement protégé.
- Skills tiers (impeccable, ui-ux-pro-max) : uniquement depuis leur dépôt officiel, à une version précise, relus avant installation (voir ONBOARDING 1.5).
- Télémétrie de Claude Code : `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` si la politique interne l’exige.

## Installation
Pas à pas complet (Windows compris) : [ONBOARDING.md](ONBOARDING.md), sections 1.3 et 2.2.

Une fois par poste, depuis le dépôt [imzoughi/decade-claude-plugins](https://github.com/imzoughi/decade-claude-plugins) — dans Claude Code, une commande à la fois :
```text
/plugin marketplace add imzoughi/decade-claude-plugins
/plugin install decade-front@decade
```
Puis `/exit`, relancer `claude`, vérifier `/plugin` (version, aucune erreur). Mise à jour : `/plugin marketplace update decade`.
Sans accès à GitHub : extraire le zip dans `C:\Users\<toi>\decade-claude-plugins` et utiliser `/plugin marketplace add C:/Users/<toi>/decade-claude-plugins` (ONBOARDING, section 1.3, option B).

Les projets créés depuis `project-template/` déclarent ce dépôt (`extraKnownMarketplaces`) : Claude Code propose d’installer le plugin à un collègue qui ne l’a pas.

Par projet (10 minutes) :
1. Copier le contenu de `project-template/` à la racine du projet.
2. Brancher Figma : `claude plugin install figma@claude-plugins-official`.
3. Lancer `claude` : la ligne `🧭 Nouveau projet…` confirme que le plugin est actif.
4. `/decade-front:build-front <lien Figma>` pour démarrer, puis `/decade-front:next-step` à chaque étape.

Mettre à jour : remplacer le dossier par le nouveau zip, `/plugin marketplace update decade`, relancer `claude`. La version est montée à chaque livraison (sinon Claude Code garde l’ancienne copie en cache).

Boucles : `scripts/loop.sh composants` · `scripts/loop.sh pages` (Windows : `./scripts/loop.ps1 composants`).

## Animations
Les animations font partie du design system : tokens `motion.*` (durées, courbes, distances), un catalogue par composant et trois niveaux pour le mode « réduire les animations » (retirer, adoucir, garder), repris du skill *accessible-animation* d’iart-ai. Tout est défini dans Claude Design, exporté, puis appliqué par l’intégrateur ; le contrôleur QA rejoue les tests en mode réduit. Skill : `decade-motion`.

## Faire évoluer
- Nouvelle règle d’audit, de stack ou d’UI/UX : modifier le skill, monter `version` dans `plugin.json` et `marketplace.json`.
- Nouveau garde-fou : un script dans `hooks/` + une entrée dans `hooks.json`.
- Nouvelle stack (ex. Vue) : un skill `decade-stack-vue` + la valeur `"stack": "vue"`.
- Retour d’expérience d’un projet : l’ajouter dans `skills/decade-stack-*/pieges.md`.
