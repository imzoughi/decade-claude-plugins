---
name: decade-brief
description: Méthode Decade pour cadrer un projet front à partir d’un Figma d’agence et remplir BRIEF.md et decade.config.json. À utiliser au démarrage d’un projet ou quand une décision de cadrage manque.
---
# Cadrage Decade

Sources de variables : `decade.config.json` à la racine du projet (voir `decade.config.template.json`). Toute valeur déjà présente dans ce fichier est une décision prise : ne la redemande pas.

## Déroulé
1. Lis `decade.config.json`. Si le fichier manque, crée-le depuis `decade.config.template.json`, puis applique le preset du type de projet (`presets/ecommerce.json`, `presets/vitrine.json`) pour proposer pages et couches par défaut.
2. Si le lien Figma est connu et que le serveur MCP Figma répond, lis la structure (pages, frames, composants, styles, variables) et pré-remplis ce qu’elle révèle.
2 bis. **Inventaire des pages (obligatoire, avant toute question)** : liste toutes les pages d’écran du Figma, sans en oublier.
   - Parcours **toutes** les pages du document, y compris celles absentes de la liste renvoyée par l’API (pages masquées, page « Examples », frames de départ des prototypes, liens entre frames) : lis-les par leur identifiant.
   - Une page d’écran = une frame de premier niveau de largeur ≥ 360 px qui ressemble à un écran. Regroupe bureau et mobile d’un même écran, puis les versions (v1, v2…) ; note l’identifiant et la largeur de chaque frame.
   - Ajoute les pages du preset (`presets/<type>.json`) absentes du Figma, et les écrans secondaires (tiroirs, menus, filtres, confirmations).
   - Écris `workflow/pages.md` depuis `pages.template.md`, rien de coché, et mets « (recommandée) » sur une version par page.
   - Montre au pilote la liste **numérotée**, groupée (trouvées dans le Figma / absentes / écrans secondaires), avec ta recommandation, puis **arrête-toi et demande-lui de choisir** : « réponds par les numéros à garder (ex. 1, 3, 5-7), “recommandé” pour ma sélection, ou coche directement workflow/pages.md ». Ne choisis jamais à sa place.
3. Pose en une seule fois les questions restantes, numérotées, chacune avec un choix par défaut, formulées simplement, sans jargon front. Obligatoires : `stack`, hébergement, version de Node (les pages se choisissent dans la liste de l’étape 2 bis).
   - **stack**, sans valeur par défaut (le champ reste vide tant que le pilote n’a pas répondu) :
     - `html` : maquettes pour un CMS que le backend intégrera, stack inconnue, maquettes de validation ;
     - `react` : application React sans Next.js (Vite) ;
     - `nextjs` : l’application cible est en Next.js — on y va directement, sans passer par le HTML.
   - Rappelle que la stack peut encore changer sans perte jusqu’à l’étape 4 (design system), plus après `/import-ds`.
4. Écris les réponses dans `decade.config.json` (valeurs courtes) et dans `BRIEF.md` (depuis `BRIEF.template.md`, décisions détaillées).
5. Après le choix du pilote : coche ses pages dans `workflow/pages.md` (et remplis « Décision »), écris la liste dans `decade.config.json` → `pages`, puis crée `workflow/backlog.md` depuis `backlog.template.md` avec **seulement les pages cochées**, une ligne par page : `- [ ] <slug> — frame <id bureau> / <id mobile>, v<N>` (ou « absente du Figma, à composer avec le design system »).
6. Laisse la ligne « Validé par le pilote » vide : seul le pilote la remplit.
