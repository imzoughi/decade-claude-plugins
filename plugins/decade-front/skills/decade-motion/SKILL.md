---
name: decade-motion
description: Système d’animation Decade — tokens de mouvement dans le design system, catalogue d’animations par composant, niveaux d’accessibilité (prefers-reduced-motion) et implémentation HTML ou Next.js. À utiliser pour toute animation, transition ou micro-interaction, dans Claude Design comme dans le code.
---
# Animations Decade

Les animations font partie du **design system** : elles sont définies une fois comme des tokens et des modèles, dans Claude Design, puis exportées et appliquées partout. Aucune durée ni courbe n’est écrite en dur dans un composant.

Réglages projet : `decade.config.json` → `motion` (`niveau` : `sobre` ou `expressif`).

## 1. Tokens de mouvement (`tokens-motion.json`)
Durées, courbes et distances, nommées par rôle. Ils rejoignent `tokens.json` (famille `motion`) et deviennent des variables CSS `--motion-*`.

## 2. Catalogue par composant (`catalogue.md`)
Chaque animation du projet est une ligne du catalogue : composant, déclencheur, propriété animée, tokens utilisés, **niveau** d’accessibilité. Claude Design documente la ligne dans le README du composant ; le code l’applique telle quelle.

## 3. Trois niveaux pour `prefers-reduced-motion`
Règle : on dégrade avec douceur, on ne coupe pas tout (approche du skill *accessible-animation* d’iart-ai, dont les règles sont reprises ici).
| Niveau | Quand l’utilisateur demande moins de mouvement | Exemples |
| --- | --- | --- |
| 1 · Retirer | supprimé | parallaxe, grands glissements, rotation 3D, défilement détourné, défilement automatique |
| 2 · Adoucir | remplacé par un fondu court (≤ 200 ms), sans déplacement | ouverture d’un drawer, carrousel, apparition au défilement |
| 3 · Garder | conservé | fondus, changements de couleur, anneau de focus, indicateur de chargement, mouvement porteur de sens |

- En mode réduit, utiliser `0.01ms` et non `0s` : les événements `transitionend` / `animationend` continuent de fonctionner.
- Tout mouvement automatique de plus de 5 secondes (carrousel, bannière) a un bouton pause, quel que soit le réglage (WCAG 2.2.2).
- Aucune animation ne bloque une action : l’utilisateur peut cliquer pendant qu’elle se joue.

## 4. Implémentation
- **html** : `snippets/motion.scss` (variables, mixins `motion-safe` / `motion-reduce`, règle globale du mode réduit) et `snippets/motion.js` (`prefersReducedMotion()` qui suit le réglage en direct).
- **nextjs** : les mêmes variables CSS, et `snippets/useReducedMotion.ts` (état initial « mouvement » côté serveur, synchronisé au montage pour éviter un écart d’hydratation). Avec Framer Motion, utiliser son `useReducedMotion()` ; avec GSAP, `gsap.matchMedia()`.

## 5. Vérification
Le contrôleur QA rejoue les tests d’interaction une seconde fois avec le mode réduit émulé (`reducedMotion: "reduce"` dans Playwright) et vérifie : niveau 1 absent, niveau 2 en fondu court, niveau 3 présent, aucun blocage.

## Sources et licences
Où sont les règles et sur quoi elles s’appuient : `REGLES-ET-SOURCES.md` à la racine du dépôt. Licences des projets cités : `THIRD-PARTY-NOTICES.md`.
- Les trois niveaux de mouvement réduit reprennent l’approche de motion-skills (iart-ai, MIT) https://github.com/iart-ai/motion-skills, reformulée ; critères WCAG 2.2.2 et 2.3.3.
