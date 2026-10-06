---
name: decade-claude-design
description: Méthode Decade pour préparer le pack destiné à Claude Design (tokens, assets, captures, inventaire, prompts prêts à coller) et pour importer l’export du design system. À utiliser aux étapes pack et import.
---
# Aller-retour Claude Design

Claude Design n’a pas le connecteur Figma : le pack lui apporte tout.

## Pack (`design/pack/`, zippé en `design/pack.zip`)
1. `tokens.json` : `{ name, value, usage }` par famille (color clair / sombre, type, spacing, radius, shadow, zIndex, breakpoint), nommés par rôle. Contraste de chaque paire texte / fond calculé.
2. `assets/` : logos et pictos SVG, images webp, polices si licence libre. Jamais redessinés. `icons-map.md` vers la bibliothèque `icones` de la config.
3. `captures/` : un composant clé et chaque gabarit, desktop et mobile.
4. `motion/` : `tokens-motion.json` et `catalogue.md` du skill `decade-motion`, ajustés au niveau `motion.niveau` de la config et aux interactions annotées dans le Figma.
5. `inventaire.md` : un tableau par groupe ; remplit la section Composants du backlog dans le même ordre.
6. `regles-or.md` du skill `decade-regles-or` : Claude Design les applique à chaque composant.
7. `prompts-claude-design.md` depuis `prompts-template.md` : variables remplacées, un prompt par groupe réel, corrections UX cochées uniquement.
8. Si affinage UX : copie `regles.md` du skill `decade-ui-ux` dans le pack.
9. `GUIDE-ETAPE-4.md` depuis `guide-etape-4.template.md` : la check-list du pilote (ouvrir, coller les prompts dans l’ordre, vérifier, exporter, déposer), une case par prompt réellement généré. Pack de mise à jour : même guide dans `design/pack-maj/`, limité aux composants acceptés.

## Import (`design/ds-export/` → code)
- `design/ds-export/` est en **lecture seule** pour Claude (garde-fou) : c’est la référence validée.
- Les tokens `motion.*` deviennent des variables `--motion-*` ; chaque animation suit le catalogue et son niveau (skill `decade-motion`).
- Branche selon `stack` : skill `decade-stack-html` ou `decade-stack-nextjs`.
- Toute retouche visuelle : dans Claude Design, nouvel export, nouvel import.
