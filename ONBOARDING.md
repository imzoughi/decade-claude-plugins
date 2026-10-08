# Onboarding : du Figma de l’agence au package de maquettes

Guide pas à pas du workflow Decade, de l’installation du poste jusqu’à la livraison du package de maquettes. Il s’adresse au **pilote** : la personne qui conduit le projet, à la fois chef de projet et développeur backend.

> **En une minute**
> - Installation du plugin : section 1.3 (depuis le dépôt GitHub imzoughi/decade-claude-plugins).
> - Au démarrage : `/decade-front:build-front <lien Figma>` (les commandes portent le préfixe `decade-front:`).
> - Ensuite, à chaque session : `/decade-front:next-step`. Cette commande dit toujours où on en est, quoi faire, et qui doit valider.
> - Trois acteurs : 👤 le **pilote** (chef de projet et dev backend) décide, valide et lance les commandes ; 🤖 **Claude Code** et 🤖 **Claude Design** font le travail.
> - Le pilote valide à 4 moments : le BRIEF, l’audit, le design system et la recette.
> - Tu es toujours guidé : chaque commande finit par le bloc **🧭 À toi, pilote**, qui dit quoi faire maintenant et quoi vérifier.
> - Claude ne pousse jamais sur Git : c’est le pilote qui relit, commit et pousse.

---

## Sommaire

0. [Qui fait quoi](#0-qui-fait-quoi)
1. [Installer le poste (une seule fois)](#1-installer-le-poste-une-seule-fois)
2. [Créer le projet (10 minutes)](#2-créer-le-projet-10-minutes)
3. [Le parcours en 7 étapes](#3-le-parcours-en-7-étapes)
4. [Livrer le package de maquettes](#4-livrer-le-package-de-maquettes)
5. [Après la livraison : mises à jour du Figma](#5-après-la-livraison--mises-à-jour-du-figma)
6. [Aide-mémoire](#6-aide-mémoire) · [6 bis. Économiser les tokens](#6-bis-économiser-les-tokens--le-bon-modèle-pour-chaque-tâche)
7. [Garde-fous : ce que Claude ne fera pas](#7-garde-fous--ce-que-claude-ne-fera-pas)
8. [Dépannage](#8-dépannage)
9. [Checklists](#9-checklists)

---

## 0. Qui fait quoi

👤 = une personne · 🤖 = un agent (IA) · l’agence est un fournisseur externe

| Rôle | Fait | Ne fait pas |
| --- | --- | --- |
| 👤 **Agence** | Livre le Figma, corrige selon les retours d’audit | — |
| 👤 **Pilote** (chef de projet et dev backend) | Décide et valide (BRIEF et stack, go / no-go, corrections UX, design system, recette), lance les commandes, fait passer les fichiers entre Claude Code et Claude Design, relit, commit, pousse | N’écrit ni CSS ni composant |
| 🤖 **Claude Code** | Audit, pack, import, composants, pages, QA, doc, package | Ne pousse pas, ne décide pas du design |
| 🤖 **Claude Design** | Design system visuel, affinage UI/UX, export | — |

🤖 Côté Claude Code, le travail est réparti entre un **chef d’orchestre** (la session principale, qui répond à `/next-step`) et 5 sous-agents spécialisés : l’**auditeur**, le **préparateur**, l’**intégrateur**, le **contrôleur QA** et le **documentaliste**. Tu n’as pas à les appeler : les commandes s’en chargent.

### Comment tu es guidé, à chaque étape

Tu n’as jamais à te demander « et maintenant ? ». Trois mécanismes le garantissent :

1. **À l’ouverture de Claude Code**, une ligne s’affiche avant même que tu tapes quoi que ce soit :
   `🧭 Étape 4 sur 7 · Design system → Suivre design/pack/GUIDE-ETAPE-4.md dans Claude Design…`
2. **À la fin de chaque commande**, le bloc « À toi, pilote ». Si Claude l’oublie, un garde-fou l’oblige à le donner avant de te rendre la main.
   ```text
   🧭 À toi, pilote — étape 2 sur 7 · Auditer
   ✔ Fait : audit rendu, score A 82, score B 68 (audit/audit-2026-10-01.md)
   ▶ À faire maintenant : cocher les corrections UX acceptées dans design/pack/ux-corrections.md
   ☐ À vérifier : les critères bloquants cités · l’impact planning
   ⏭ Ensuite : /pack-design
   ```
3. **Quand l’action se passe hors de Claude Code**, une check-list t’attend dans le dépôt, à cocher au fur et à mesure :

| Moment | Check-list | Écrite par |
| --- | --- | --- |
| Étape 2, NO-GO | `audit/retours-agence.md`, prête à envoyer à l’agence | `/audit` |
| Étape 4, Claude Design | `design/pack/GUIDE-ETAPE-4.md` : ouvrir, coller, vérifier, exporter, déposer | `/pack-design` |
| Étape 7, recette | `qa/recette.md` : une case par page | `/qa all` |

L’état du projet est lu dans les fichiers du dépôt, pas dans la mémoire de Claude : si tu reprends après une semaine, ou si un collègue reprend ton projet, il voit exactement la même chose.

---

## 1. Installer le poste (une seule fois)

### 1.1 Prérequis

| Outil | Version | Vérifier |
| --- | --- | --- |
| Node.js | 22 conseillé (20.11 minimum) | `node -v` |
| Git | récent | `git --version` |
| VS Code | récent | — |
| Compte Claude | avec accès à Claude Code et à Claude (Cowork) pour Claude Design | — |
| Accès Figma | au fichier de l’agence (lecture au minimum) | — |

### 1.2 Installer Claude Code

Suis la page d’installation officielle de Claude Code (installeur pour macOS / Linux, PowerShell pour Windows). Ensuite, dans un terminal :

```bash
claude --version
```

### 1.3 Installer le plugin Decade

Le plugin `decade-front` contient les commandes, les sous-agents, les skills et les garde-fous. Il s’installe **une fois par poste**, puis sert à tous les projets.

Le plugin est dans le dépôt Git **[imzoughi/decade-claude-plugins](https://github.com/imzoughi/decade-claude-plugins)**. C’est l’installation normale (option A). L’option B (dossier local) ne sert que si tu n’as pas accès à GitHub.

#### Option A — depuis le dépôt Git (recommandé)

Lance `claude` dans n’importe quel dossier, puis tape les deux commandes **une par une** (Entrée après chacune, attends la réponse) :

```text
/plugin marketplace add imzoughi/decade-claude-plugins
```
```text
/plugin install decade-front@decade
```

Puis `/exit`, relance `claude` et tape `/plugin` : **decade-front** doit apparaître, avec sa version et **sans erreur**.

> Si le dépôt est privé, il faut que Git sache s’identifier sur GitHub depuis ton poste (par exemple : `git clone https://github.com/imzoughi/decade-claude-plugins.git` doit marcher dans un terminal). Sinon, demande l’accès au dépôt ou utilise l’option B.

#### Option B — depuis un dossier de ton PC (sans accès à GitHub)

**1. Extraire le zip au bon endroit.**

- Clic droit sur `decade-claude-plugins.zip` → **Extraire tout…**. Ne travaille jamais « dans » le zip : Windows l’affiche comme un dossier, mais Claude Code ne peut pas le lire.
- Place le dossier extrait dans un endroit stable (pas dans Téléchargements), de préférence :
  ```text
  C:\Users\<toi>\decade-claude-plugins
  ```
- Vérifie qu’il contient **directement** ces éléments (et pas un second dossier `decade-claude-plugins` à l’intérieur) :
  ```text
  decade-claude-plugins\
    .claude-plugin\        ← dossier qui commence par un point : Affichage → Afficher → Éléments masqués si tu ne le vois pas
    plugins\
    project-template\
    README.md
    ONBOARDING.md
  ```

**2. Déclarer le dossier et installer le plugin**, une commande à la fois :

```text
/plugin marketplace add C:/Users/<toi>/decade-claude-plugins
```
```text
/plugin install decade-front@decade
```

> Écris le chemin avec des `/`, même sous Windows. Ne colle pas les deux commandes sur la même ligne : Claude Code les lirait comme un seul chemin (« Path does not exist »).

**3. Redémarrer.** `/exit`, relance `claude`, puis `/plugin` : **decade-front** doit apparaître sans erreur.

> Tu passes de l’option B à l’option A ? Retire d’abord l’ancienne source : `/plugin marketplace remove decade`, puis suis l’option A.

#### Mettre à jour le plugin

Quand tu reçois une nouvelle version :

1. Option A : rien à préparer, la commande ci-dessous lit la dernière version du dépôt. Option B : remplace d’abord le contenu de ton dossier `decade-claude-plugins` par celui du nouveau zip (même emplacement).
2. Dans Claude Code :
   ```text
   /plugin marketplace update decade
   ```
3. `/exit`, relance `claude`, et vérifie la version dans `/plugin`.

> Claude Code garde une copie du plugin en cache, rangée par **numéro de version**. Si le numéro n’a pas changé, il ne relit rien : la version est montée à chaque livraison du plugin. En cas de doute (ou d’erreur « Duplicate hooks file detected »), voir le Dépannage.

#### Le nom des commandes

Les commandes d’un plugin portent le nom du plugin devant : **`/decade-front:build-front`**, **`/decade-front:next-step`**, etc. Selon ton environnement (terminal, extension VS Code, application), le nom court (`/build-front`) peut ne pas être reconnu : utilise toujours le nom complet. Astuce : tape `/decade` et l’autocomplétion propose toutes les commandes.

Dans ce guide, les commandes sont parfois écrites en version courte pour la lisibilité : ajoute `decade-front:` devant.

### 1.4 Brancher Figma

```bash
claude plugin install figma@claude-plugins-official
# ou, avec l’application Figma desktop en mode développeur :
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```

### 1.5 Skills UI/UX (conseillés)

Installe les skills **impeccable** et **ui-ux-pro-max** dans Claude Code **et** dans Claude (Cowork), pour qu’ils servent aussi dans Claude Design. Sans eux, le plugin applique une version courte de leurs règles (skill `decade-ui-ux`).

| Skill | Source à utiliser |
|---|---|
| impeccable | dépôt GitHub `pbakaus/impeccable` |
| ui-ux-pro-max | dépôt GitHub de son auteur (`ui-ux-pro-max-skill`), à confirmer par l’équipe avant la première installation |

> **Sécurité.** Ce sont des skills tiers : un skill peut contenir des scripts que Claude exécutera. Installe-les uniquement depuis ces dépôts, jamais depuis une copie ou un site de partage, à une version précise (tag ou commit noté par l’équipe), et relis le contenu avant la première installation et à chaque mise à jour. En cas de doute, ne les installe pas : le plugin fonctionne sans.

### 1.6 Vérification rapide

- [ ] `node -v` affiche 20.11 ou plus (22 conseillé). Si une vieille version sort, c’est un autre Node qui passe en premier dans le PATH : corrige-le avant de continuer.
- [ ] `claude --version` répond
- [ ] `/plugin` liste **decade-front**, sans erreur, avec la dernière version
- [ ] Taper `/decade` propose les commandes `decade-front:…`
- [ ] Claude Code peut lire un fichier Figma (le plus simple : `/decade-front:build-front` le vérifie à l’étape 2.3)

---

## 2. Créer le projet (10 minutes)

### 2.1 Créer le dépôt

Crée un dépôt Git vide pour le projet, par exemple `client-boutique-front`, et clone-le sur ton poste.

### 2.2 Copier le modèle Decade

Copie **le contenu** de `project-template\` (pas le dossier lui-même) à la racine du projet. Dans PowerShell, depuis le dossier du projet :

```powershell
Copy-Item -Recurse -Force "$env:USERPROFILE\decade-claude-plugins\project-template\*" .
```

Tu dois obtenir :

```text
CLAUDE.md               règles lues par Claude à chaque session
decade.config.json      les réglages du projet (rempli par /decade-front:build-front)
.claude\settings.json   modèle (sonnet), plugin activé, permissions, interdits
.gitignore              dossiers à ne jamais pousser (node_modules, builds, rapports, tmp)
scripts\loop.sh         boucles (macOS, Linux, Git Bash)
scripts\loop.ps1        boucles (Windows PowerShell)
```

Rien à modifier dans `.claude\settings.json` : il active `decade-front@decade` et déclare le dépôt `imzoughi/decade-claude-plugins`. Un collègue qui ouvre le projet sans avoir le plugin se voit proposer de l’installer.

### 2.3 Démarrer

Ouvre le dossier dans VS Code, lance `claude` dans le terminal intégré. Avant même de taper quoi que ce soit, tu dois voir :

```text
🧭 Nouveau projet : lance /decade-front:build-front <lien Figma>
```

Si cette ligne n’apparaît pas, le plugin n’est pas actif dans ce dossier : reprends la vérification 1.6. Sinon :

```text
/decade-front:build-front https://www.figma.com/design/<id-du-fichier>
```

`/build-front` :

1. vérifie l’installation (Node, accès au Figma, plugin, skills conseillés) et te dit quoi corriger ;
2. crée `decade.config.json` avec le lien Figma ;
3. lance le cadrage, décrit à l’étape 1 ci-dessous ;
4. installe les outils propres à la stack, dans le projet et à version fixée : Lighthouse CI (`@lhci/cli`) pour la performance, et Storybook MCP et Next DevTools MCP pour React et Next.js. Aucun serveur MCP n’est téléchargé au lancement (`npx --no-install`).

> `/build-front` ne sert qu’une fois. Sur un projet déjà démarré, il ne refait rien et te renvoie vers `/next-step`.

---

## 3. Le parcours en 7 étapes

```text
 1 Démarrer        /build-front <lien>    → config + BRIEF              ✔ pilote valide
 2 Auditer         /audit                 → score A + score B           ✔ pilote décide
      NO-GO ─► retours agence → l’agence corrige → /audit   ⟲
 3 Préparer        /pack-design           → pack.zip + prompts
 4 Design system   Claude Design          → design system + export      ✔ pilote valide
 5 Composants      /import-ds + boucle    ⟲ intégrateur → contrôleur QA
 6 Pages           boucle pages           ⟲ intégrateur → contrôleur QA (+ performance)
 7 Publier         /qa all → /publish     → portail, doc, package       ✔ pilote recette
```

À chaque session, commence par **`/next-step`**. Il répond avec le bloc « 🧭 À toi, pilote » : où on en est, ce qui est fait, l’action à faire maintenant, ce qu’il faut vérifier, et la suite. S’il y a un blocage, une ligne « ⚠ Bloqué » dit qui doit agir.

---

### Étape 1 — Démarrer et cadrer

| | |
| --- | --- |
| **Qui** | 👤 Pilote |
| **Commande** | `/build-front <lien Figma>` (voir 2.3) |
| **Entrées** | lien Figma · réponses du pilote · modèle du type de projet (e-commerce, vitrine) |
| **Sorties** | `workflow/pages.md` (toutes les pages du Figma, choisies par toi) · `decade.config.json` · `BRIEF.md` · `workflow/backlog.md` (une ligne par page retenue) |
| **Validation** | le pilote choisit les pages, puis relit `BRIEF.md` et remplit la ligne « Validé par le pilote » (nom + date) |
| **Durée type** | ½ jour |

**1. Tu choisis les pages.** Claude parcourt tout le Figma (y compris les pages masquées) et te montre la liste numérotée de toutes les pages d’écran, en trois groupes :

```text
Pages trouvées dans le Figma
  1. accueil — v2 · bureau + mobile (recommandée)
  2. accueil — v1 · bureau + mobile
  3. liste-produits — v3 · bureau + mobile (recommandée)
  …
Pages attendues pour un e-commerce, absentes du Figma
  9. paiement — à composer avec le design system
Écrans secondaires
 12. mini-panier (tiroir)
```

Réponds par les numéros à garder (`1, 3, 5-7, 9`), par **recommandé** pour la sélection de Claude, ou coche directement `workflow/pages.md`. Une seule version par page. Seules les pages retenues entrent dans le backlog ; les autres restent dans la liste pour plus tard.

**2. Tu réponds aux autres questions.** Claude les pose en une fois, avec une réponse proposée par défaut pour chacune. La plus importante est la **stack**. Elle n’a pas de valeur par défaut :

| Stack | Quand la choisir |
| --- | --- |
| `html` | maquettes pour un CMS que le backend intégrera, stack inconnue, maquettes de validation |
| `react` | application React sans Next.js |
| `nextjs` | l’application finale est en Next.js (on y va directement, sans passer par le HTML) |

> La stack peut encore changer sans perte jusqu’à l’étape 4. Après `/import-ds`, en changer oblige à régénérer composants et pages.

---

### Étape 2 — Auditer le Figma

| | |
| --- | --- |
| **Qui** | 👤 Pilote : lance, puis décide |
| **Commande** | `/audit` |
| **Entrées** | Figma · `decade.config.json` · `BRIEF.md` |
| **Sorties** | `audit/audit-AAAA-MM-JJ.md` · `audit/retours-agence.md` · `design/pack/ux-corrections.md` (si affinage) · `design/figma-snapshot.json` |
| **Validation** | le pilote lit les trois phrases en tête du rapport et confirme la décision |
| **Durée type** | ½ jour, plus le délai de l’agence en cas de NO-GO |

Deux scores sur 100 :

- **A, intégrabilité** : peut-on intégrer ce fichier ? Tokens, composants, responsive…
- **B, qualité UI/UX** : le design est-il bon pour l’utilisateur ? Règles impeccable et ui-ux-pro-max.

| Décision | Condition | Suite |
| --- | --- | --- |
| **NO-GO** | A < 60, ou un critère bloquant à 0 | le pilote envoie `audit/retours-agence.md` à l’agence ; quand le Figma est corrigé, relancer `/audit` |
| **GO fidèle** | A ≥ 60 et B ≥ 75 | on passe à l’étape 3 |
| **GO avec affinage UX** | A ≥ 60 et B < 75 | le pilote **coche** les corrections acceptées dans `design/pack/ux-corrections.md`, puis étape 3 |

> On corrige l’expérience, pas l’identité : logo, couleurs, polices et ton de la marque ne changent pas.

---

### Étape 3 — Préparer le pack pour Claude Design

| | |
| --- | --- |
| **Qui** | 👤 Pilote |
| **Commande** | `/pack-design` |
| **Entrées** | Figma · audit · corrections UX cochées par le pilote |
| **Sorties** | `design/pack/` et `design/pack.zip` : tokens, mouvement, assets, captures, inventaire, règles d’or, `prompts-claude-design.md`, et ta check-list `GUIDE-ETAPE-4.md` |
| **Durée type** | ½ jour |

Claude Design n’a pas accès au Figma : le pack lui apporte tout. Si des corrections UX existent mais qu’aucune n’est cochée, la commande s’arrête et demande la validation du pilote.

---

### Étape 4 — Créer le design system dans Claude Design

| | |
| --- | --- |
| **Qui** | 👤 Pilote, qui valide aussi |
| **Où** | Claude (Cowork), en créant un design system |
| **Entrées** | `design/pack.zip` · `design/pack/prompts-claude-design.md` · ta check-list `design/pack/GUIDE-ETAPE-4.md` |
| **Sorties** | le design system (lien partageable) · l’export `ds-export` (zip) |
| **Validation** | le pilote valide le design system sur son lien |
| **Durée type** | 1 à 2 jours |

C’est la seule étape qu’aucun agent ne peut faire : Claude Code ne pilote pas Claude Design. 👤 Le pilote fait passer les fichiers, colle les prompts, vérifie groupe par groupe, puis valide le design system à la fin.

Pas à pas (c’est exactement ce que contient `design/pack/GUIDE-ETAPE-4.md`, à cocher au fur et à mesure) :

1. Dans Claude (Cowork), crée un **design system** et joins `design/pack.zip`.
2. Ouvre `design/pack/prompts-claude-design.md` et colle les prompts **un par un**, en attendant la fin de chacun avant le suivant :
   1. le prompt de création (fondations, mouvement, guide de marque) ;
   2. un prompt par groupe de composants ;
   3. le prompt de contrôle final ;
   4. le prompt d’export.
3. Relis le design system sur son lien et valide-le. Si le client doit le voir, partage-lui ce lien.
4. Télécharge le zip `ds-export` et **dézippe-le dans `design/ds-export/`** du projet.
5. Lance `/next-step`.

> `design/ds-export/` est en lecture seule pour Claude : c’est la référence validée. Toute retouche visuelle se fait dans Claude Design, puis nouvel export et `/import-ds`.

---

### Étape 5 — Construire les composants

| | |
| --- | --- |
| **Qui** | 👤 Pilote |
| **Commandes** | `/import-ds`, puis la boucle des composants |
| **Entrées** | `design/ds-export/` · stack de la config |
| **Sorties** | tokens, styles et composants dans le code · portail et doc à jour · rapports `qa/` · backlog coché pour les composants verts |
| **Durée type** | 1 à 2 jours |

1. **Stack react ou nextjs uniquement** : dans un second terminal, lance `npm run storybook`, et aussi `npm run dev` pour Next.js. Storybook MCP et Next DevTools MCP en ont besoin.
2. `/import-ds` : il refuse de démarrer si la stack n’est pas choisie.
3. `/next-step` propose ensuite de lancer la boucle. Réponds « oui », ou lance-la toi-même :

```bash
scripts/loop.sh composants                                        # macOS, Linux, Git Bash
powershell -ExecutionPolicy Bypass -File scripts/loop.ps1 composants   # Windows
```

**Ce que fait la boucle :** elle prend chaque composant non coché du backlog, un par un. Pour chacun, l’**intégrateur** code, puis le **contrôleur QA** vérifie : tests, captures, accessibilité, règles d’or. Seul un verdict VERT coche la case. Après 3 tours ratés, l’écart est noté dans `workflow/blocages.md` et la boucle passe au suivant. Si tu relances la boucle, elle reprend là où elle s’était arrêtée.

**Ton rôle :** relis les diffs et les captures par lots, puis commit.

---

### Étape 6 — Assembler les pages

| | |
| --- | --- |
| **Qui** | 👤 Pilote |
| **Commande** | la boucle des pages |
| **Entrées** | composants validés · données de démo |
| **Sorties** | pages vérifiées, reliées au portail · mesures de performance par page (`qa/perf.json`) |
| **Durée type** | 2 jours |

```bash
scripts/loop.sh pages                                             # macOS, Linux, Git Bash
powershell -ExecutionPolicy Bypass -File scripts/loop.ps1 pages   # Windows
```

À chaque page, le contrôleur mesure aussi la performance (Lighthouse, 3 passages) :

| Mesure | Seuil de départ |
| --- | --- |
| Score Lighthouse | 85 minimum |
| LCP (affichage du contenu principal) | 2,5 s maximum |
| CLS (stabilité de la mise en page) | 0,1 maximum |
| TBT (temps de blocage) | 300 ms maximum |
| JavaScript / images par page | 300 Ko / 200 Ko maximum |

Les seuils se règlent dans `decade.config.json` → `performance`. Au premier projet, ils ne font qu’avertir (`"bloquant": false`).

---

### Étape 7 — Vérifier, faire la recette, publier

| | |
| --- | --- |
| **Qui** | 👤 Pilote, qui fait aussi la recette |
| **Commandes** | `/qa all`, puis `/publish` |
| **Entrées** | toutes les pages vertes · recette du pilote |
| **Sorties** | `qa/qa-all.md` · portail et documentation · `livraison/<projet>-v<version>.zip` · `livraison/LIVRAISON.md` · commandes Git |
| **Validation** | le pilote fait la recette sur le portail et la note dans `BRIEF.md` |
| **Durée type** | 1 jour |

1. `/qa all` : contrôle complet (build, tests, captures, accessibilité, performance de tout le site).
2. **Recette** : le pilote suit `qa/recette.md` (une case par page, avec le lien du portail et les points à regarder), puis note sa recette dans `BRIEF.md` (« Recette du pilote »).
3. `/publish` : il vérifie que la QA est verte et que la recette est notée, puis prépare le portail, la doc et le package de livraison.
4. Lance toi-même les commandes Git que `/publish` affiche : commit, push, tag.

---

## 4. Livrer le package de maquettes

### 4.1 Ce que contient la livraison

| Élément | Contenu |
| --- | --- |
| **Lien public** | le portail en ligne (GitHub Pages ou Vercel, selon `hebergement`) : toutes les pages par parcours, et la documentation |
| **Package** `livraison/<projet>-v<version>.zip` | **html** : le dossier `dist/` complet, qui s’ouvre sans serveur · **react / nextjs** : les sources (sans `node_modules` ni secrets), le build et les commandes de lancement |
| **`livraison/LIVRAISON.md`** | contenu du package, version du design system, lien public, résultats QA et performance, points ouverts, où brancher les données |
| **Documentation** (dans le portail) | démarrage, architecture, guide de marque, tokens, fiche de chaque composant (règles, exemple vivant, code), pages, JavaScript / SCSS, journal des versions, performance |
| **Design system** | le lien Claude Design validé, et la version indiquée dans le portail |

### 4.2 Publier

1. Relis `livraison/LIVRAISON.md`.
2. Lance les commandes Git affichées par `/publish` :

```bash
git add -A
git commit -m "Livraison maquettes v1.0.0"
git tag v1.0.0
git push origin main --tags
```

3. **GitHub Pages**, la première fois seulement : Settings → Pages → Source « GitHub Actions ». Ensuite, chaque push sur `main` republie le site.
4. Vérifie le lien public : le portail, une page de chaque parcours et la documentation.

### 4.3 Transmettre

- **Au client** : le lien public, le lien du design system, et `LIVRAISON.md`.
- **À l’équipe backend** : le package, et la page « Comment brancher les données » de la documentation. En HTML, ce sont les fichiers de `src/data/` ; en React / Next.js, la couche `src/lib/api/`.

---

## 5. Après la livraison : mises à jour du Figma

Le designer modifie ou ajoute des composants ? On ne refait pas tout.

1. `/sync-figma` compare le Figma à la photo prise lors de l’audit. Il classe chaque composant en **nouveau**, **modifié** ou **supprimé**, puis le contrôle avec les **règles d’or**. Verdict : conforme, à corriger par le designer, ou écart à valider par le pilote.
2. Le pilote **coche** les changements acceptés dans `design/sync/sync-AAAA-MM-JJ.md`. Les retours au designer sont dans `design/sync/retours-designer.md`.
3. Relance `/sync-figma` : il prépare `design/pack-maj.zip`, qui ne contient que les composants acceptés.
4. Dans Claude Design, colle les prompts de mise à jour. Le design system passe à une nouvelle version (par exemple 1.3 → 1.4), avec un journal des changements.
5. Dézippe le nouvel export dans `design/ds-export/`, puis lance `/import-ds`. Seuls les composants changés sont repris, et les pages qui les utilisent sont revérifiées.
6. `/qa all`, puis `/publish` : nouvelle version du package.

**Les 9 règles d’or :**

1. tokens seulement ;
2. tous les états ;
3. une version mobile ;
4. accessibilité ;
5. pas de doublon ;
6. nommage Decade ;
7. mouvement du catalogue ;
8. identité respectée ;
9. README complet.

---

## 6. Aide-mémoire

| Quand | Commande | Qui valide ensuite |
| --- | --- | --- |
| Tout début du projet | `/build-front <lien Figma>` | pilote (BRIEF) |
| À chaque session | `/next-step` | — |
| Étape 2 | `/audit` | pilote (go / no-go, corrections UX) |
| Étape 3 | `/pack-design` | — |
| Étape 4 | prompts dans Claude Design | pilote (design system) |
| Étape 5 | `/import-ds` + `scripts/loop.sh composants` | pilote (relecture) |
| Étape 6 | `scripts/loop.sh pages` | pilote |
| Étape 7 | `/qa all` puis `/publish` | pilote (recette) |
| Nouvelle livraison du designer | `/sync-figma` | pilote (changements acceptés) |
| Régénérer la doc, à tout moment | `/docs` (ou `/docs verifier` pour contrôler sans modifier) | — |
| Voir la consommation de tokens | `/conso` | — |
| Préparer la passation backend (pour une autre équipe ou IA) | `/handoff` | — |

**Fichiers à connaître :**

| Fichier | Rôle |
| --- | --- |
| `decade.config.json` | tous les réglages du projet : stack, pages, seuils d’audit et de performance, nombre de tours, outils |
| `BRIEF.md` | décisions du projet, validations du pilote |
| `workflow/backlog.md` | ce qui reste à faire ; une case n’est cochée que si la QA est verte |
| `workflow/blocages.md` | ce que les boucles n’ont pas réussi à terminer |
| `audit/`, `qa/` | rapports d’audit et de QA |
| `design/pack.zip`, `design/ds-export/` | l’aller et le retour avec Claude Design |
| `livraison/` | le package et `LIVRAISON.md` |

---

## 6 bis. Économiser les tokens : le bon modèle pour chaque tâche

Le skill `decade-modeles` choisit le modèle le moins cher qui réussit du premier coup :

| Tâche | Modèle |
| --- | --- |
| Session principale du projet | sonnet (réglé dans `.claude/settings.json`) |
| `/decade-front:next-step`, sessions de boucle, documentation | haiku |
| Pack Claude Design, intégration, contrôle QA | sonnet |
| Audit du Figma, règles d’or de `/sync-figma` | opus |
| Dernier tour d’une boucle encore ROUGE | opus (escalade) |

Ce que tu fais, toi :
- Ne passe pas la session en opus « pour aller plus vite » : les agents qui en ont besoin l’utilisent déjà.
- Entre deux étapes, tape `/compact` : l’état du projet est dans les fichiers, rien n’est perdu.
- Pour changer un réglage sur un projet : `modeles` dans `decade.config.json`.
- Pour voir ce que le projet a consommé : `/decade-front:conso` (total, par étape, par modèle, par agent, comparé au budget de la stack). Le détail reste dans `workflow/conso.md`.

Ordres de grandeur pour ~35 composants et 6 pages (estimation à confirmer par `/decade-front:conso`) :

| Stack | Tokens totaux | dont composants + pages |
| --- | --- | --- |
| HTML / SCSS / JS | ≈ 25 M | ≈ 20 M |
| React | ≈ 30 M | ≈ 25 M |
| Next.js | ≈ 34 M | ≈ 28 M |

Environ 85 % de ces tokens sont relus depuis le cache (beaucoup moins chers) ; ce qui coûte, ce sont les tours de boucle et le modèle utilisé.

---

## 7. Garde-fous : ce que Claude ne fera pas

Ils sont actifs dans tous les modes, même quand les boucles tournent seules.

| Claude ne fera pas | Ce que tu fais à la place |
| --- | --- |
| `git push` (même simple), push forcé, `git reset --hard` | relire, commit et pousser toi-même |
| `rm -rf`, `git clean -f` | supprimer toi-même les fichiers indiqués |
| lire ou modifier `.env`, des clés ou des certificats | gérer les secrets hors de Claude |
| écrire hors du projet | — |
| modifier `design/ds-export/` | retoucher dans Claude Design, réexporter, `/import-ds` |
| écrire une couleur, une durée ou une courbe d’animation en dur dans un composant | rien : Claude reçoit le message et utilise un token |
| cocher une case sans verdict VERT du contrôleur QA | lire `workflow/blocages.md` et décider |

Chaque fin de sous-agent est tracée dans `workflow/logs/agents.jsonl`.

---

## 8. Dépannage

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| `/build-front` : « Figma non joignable » | serveur MCP Figma absent ou fichier non partagé | refaire l’étape 1.4 ; vérifier l’accès au fichier |
| `/build-front` : « Projet déjà démarré » | la config et le BRIEF existent | utiliser `/next-step` |
| `/next-step` : « Nouveau projet » | pas de config ni de BRIEF | lancer `/build-front <lien Figma>` |
| `/import-ds` : « Stack non choisie » | champ `stack` vide | choisir la stack (html, react, nextjs), remplir la config, relancer |
| Storybook MCP ne répond pas (react, nextjs) | Storybook non lancé, ou version < 10.3 | `npm run storybook` dans un second terminal ; sinon, la boucle continue sans lui et le note |
| Next DevTools MCP muet (nextjs) | serveur de développement arrêté, ou Next.js < 16 | `npm run dev` dans un second terminal |
| La boucle s’arrête sur un composant | 3 tours ratés | lire `workflow/blocages.md`, corriger dans Claude Design si c’est visuel, relancer la boucle |
| Performance rouge sur une page | image trop lourde, JavaScript trop gros, mise en page instable | demander à Claude « diagnostique la performance de <page> » (Chrome DevTools MCP si activé) |
| Windows : le script ne se lance pas | politique d’exécution PowerShell | `powershell -ExecutionPolicy Bypass -File scripts/loop.ps1 composants` |
| La doc affiche du Markdown brut (`**`, `|---|`, `#`) ou n’a pas le style habituel | doc écrite sans le kit Decade | `/decade-front:docs` : remet la doc sur le kit, la reconstruit et la contrôle |
| `ERR_UNSUPPORTED_ESM_URL_SCHEME` (Windows) | import d’un chemin `C:\` | déjà traité dans les modèles Decade (`pathToFileURL`) ; à signaler si ça revient |
| « Unknown command: /build-front » | le nom court n’est pas reconnu dans ton environnement | taper le nom complet : `/decade-front:build-front`, `/decade-front:next-step`… (tape `/decade` pour l’autocomplétion) |
| `/plugin` : « Duplicate hooks file detected » | ancienne version du plugin en cache | `/plugin uninstall decade-front@decade`, `/plugin marketplace update decade`, `/plugin install decade-front@decade` ; sinon supprimer `%USERPROFILE%\.claude\plugins\cache\decade` |
| Le plugin modifié n’est pas pris en compte | même numéro de version, Claude Code garde la copie en cache | monter la version dans `plugin.json` et `marketplace.json`, puis `/plugin marketplace update decade` |
| La consommation de tokens grimpe | session principale en opus, gros fichiers lus | vérifier `"model": "sonnet"` dans `.claude/settings.json` et `/model` ; `/compact` entre deux étapes (skill `decade-modeles`) |

---

## 9. Checklists

### Avant de démarrer

- [ ] Poste installé (section 1)
- [ ] Dépôt créé et modèle copié (section 2)
- [ ] Accès au Figma de l’agence
- [ ] Réponses du cadrage prêtes (pages, stack, hébergement, contraintes du client)

### Avant de livrer

- [ ] `qa/qa-all.md` est VERT
- [ ] `workflow/blocages.md` est vide, ou ses points sont acceptés par le pilote
- [ ] La recette du pilote est notée dans `BRIEF.md`
- [ ] Le portail affiche la bonne version du design system
- [ ] La page Performance est verte (ou ses avertissements sont acceptés au premier projet)
- [ ] `livraison/LIVRAISON.md` est relu
- [ ] Commit, tag et push faits par le pilote
- [ ] Le lien public est vérifié (portail, un exemple par parcours, documentation)
- [ ] Liens transmis au client et à l’équipe backend qui intègre

---

*Workflow Decade · plugin decade-front. Pour aller plus loin, voir la documentation « Workflow Figma → Claude Design → maquettes front » et le README du dépôt `decade-claude-plugins`.*
