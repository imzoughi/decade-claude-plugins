---
description: Étape 5 — importer l’export de Claude Design et générer les composants (intégrateur, puis contrôleur QA)
---
**Entrées :** design/ds-export/ (export validé de Claude Design, avec version.json) · stack de la config
**Sorties :** tokens, styles et composants dans le code · portail et doc à jour · qa/ · backlog coché pour les composants VERTS

0. Si `stack` est vide dans `decade.config.json`, arrête-toi : « Stack non choisie : à choisir par le pilote (html, react ou nextjs), puis relancer /import-ds. »
   Stack react ou nextjs : installe Storybook (≥ 10.3) avec `@storybook/addon-mcp` et `componentsManifest: true` si ce n’est pas déjà fait, puis lance Storybook pour la durée de l’import.
   Lis `design/ds-export/version.json`. Si un import précédent existe (`design/import-version.json`), ne traite que les composants cochés dans le dernier rapport `design/sync/` ou différents de l’import précédent : c’est une **mise à jour**, pas une reconstruction.
1. Vérifie que chaque composant de `design/pack/inventaire.md` a son fichier dans `design/ds-export/` ; liste les manquants dans `workflow/blocages.md`.
2. Délègue au sous-agent **decade-integrateur** la génération des tokens, styles et composants selon `stack`.
3. Délègue au sous-agent **decade-controleur-qa** la vérification de l’ensemble. Coche dans `workflow/backlog.md` uniquement les composants VERTS.
4. Mets à jour le portail et la documentation (skill `decade-portail`, kit de documentation : styles, Markdown et code de référence copiés, `_doc-theme.scss` relié aux tokens importés ; `npm run docs:check` VERT), écris `design/import-version.json` et ajoute l’entrée de version dans `design/CHANGELOG.md`.
5. Termine par le bloc « 🧭 À toi, pilote » (skill `decade-guide-pilote`) : composants importés, composants à reprendre (la boucle s’en charge) ; ensuite /next-step.
