---
description: Démarrage d’un projet — vérifie l’installation, crée la configuration et lance le cadrage à partir du lien Figma
argument-hint: <lien Figma>
allowed-tools: Read, Write, Glob, Grep, Bash(node -v), Bash(ls *), Bash(git status), mcp__figma
---
**Entrées :** lien Figma de l’agence ($ARGUMENTS) · modèle de projet Decade
**Sorties :** `decade.config.json` (stack choisie) · `workflow/pages.md` (toutes les pages du Figma, choisies par le pilote) · `BRIEF.md` · `workflow/backlog.md` · `lighthouserc.cjs` · `.mcp.json` (react, nextjs) · liste de vérification de l’installation

Tu démarres un projet Decade. La personne en face (le pilote) n’est pas développeuse front : phrases courtes, sans jargon.

## 0. Garde-fous
- Si `decade.config.json` et `BRIEF.md` existent déjà, le projet a démarré : ne refais rien, réponds « Projet déjà démarré : lance /next-step » avec l’étape en cours.
- Sans lien Figma dans $ARGUMENTS : demande-le, sans rien créer.

## 1. Vérifier l’installation
Coche et affiche : Node ≥ 20.11 (`node -v`) · serveur MCP Figma joignable (lecture du fichier) · plugin decade-front actif · skills impeccable et ui-ux-pro-max (conseillés, installés depuis leur dépôt officiel : voir ONBOARDING 1.5). Après l’outillage (section 4), vérifie aussi `npx --no-install lhci --version`. Pour chaque point manquant, donne l’action exacte et arrête-toi si Figma n’est pas joignable.

## 2. Créer la configuration
Crée `decade.config.json` depuis le modèle du skill `decade-brief`, avec `figma` = $ARGUMENTS.

## 3. Cadrer
Applique le skill `decade-brief` : d’abord l’**inventaire de toutes les pages** du Figma (`workflow/pages.md`), montré au pilote en liste numérotée avec ta recommandation ; **attends son choix** avant de créer le backlog. Puis les autres questions (`BRIEF.md`). La **stack** est choisie ici ; tant qu’elle est vide, ne va pas plus loin.
Si tu t’arrêtes pour attendre le choix des pages, termine quand même par le bloc « 🧭 À toi, pilote » : à faire maintenant, choisir les pages (numéros, « recommandé », ou cases de `workflow/pages.md`).

## 4. Outiller selon la stack
- Toutes les stacks : installe Lighthouse CI dans le projet, version fixée (`npm i -D --save-exact @lhci/cli@0.15.1`), copie `perf/lighthouserc.cjs` du skill `decade-qa` à la racine et ajoute le script npm `perf` (`lhci autorun`). Il utilise le Chrome du poste et garde ses rapports en local (`qa/lighthouse/`).
- `nextjs` : copie aussi `perf/serve-static.mjs` dans `scripts/` (serveur local sans dépendance, pour mesurer `out/` quand le projet est en export statique : `next start` ne fonctionne pas dans ce mode).
- Toutes les stacks : copie `doc-kit/check-docs.mjs` du skill `decade-portail` dans `scripts/` et ajoute le script npm `docs:check` (html : `node scripts/check-docs.mjs dist/docs` ; nextjs : `node scripts/check-docs.mjs out --prefix /docs` ; react : `node scripts/check-docs.mjs dist --prefix /docs`), appelé à la fin de `npm run check`.
- `react` : fusionne `mcp/mcp.react.json` du skill `decade-stack-react` dans `.mcp.json` si `outils.storybookMcp` vaut true.
- `nextjs` : fusionne `mcp/mcp.nextjs.json` (Storybook MCP + Next DevTools MCP) selon `outils` ; si `outils.nextDevtoolsMcp` vaut true, installe d’abord le serveur dans le projet, version fixée : `npm i -D --save-exact next-devtools-mcp@0.4.0`.
- `outils.chromeDevtoolsMcp` à true : installe `npm i -D --save-exact chrome-devtools-mcp@1.10.1`, puis ajoute le serveur `chrome-devtools` (`"command": "npx", "args": ["--no-install", "chrome-devtools-mcp"]`) pour diagnostiquer la performance.
- Sécurité : aucun serveur MCP n’est lancé par `npx -y` ni en `@latest`. Chaque serveur est une dépendance du projet, version fixée, sous `package-lock.json` ; `--no-install` refuse tout téléchargement au lancement.
- Affiche ce qui a été ajouté ; ne touche à aucun autre fichier.

Termine par le bloc « 🧭 À toi, pilote » (skill `decade-guide-pilote`) : à faire maintenant, relire `BRIEF.md` (pages retenues comprises) et remplir « Validé par le pilote » ; ensuite /decade-front:next-step.
