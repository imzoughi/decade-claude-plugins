# Grilles d’audit Figma

Deux scores sur 100 : **A — intégrabilité** (peut-on intégrer ce fichier ?) et **B — qualité UI/UX** (le design est-il bon pour l’utilisateur ?).

## Grille A — Intégrabilité

Note chaque critère : 0 = absent ou inutilisable, 1 = partiel, 2 = conforme.
Score = somme(note × poids) / 2. Poids total = 100 par grille.

| # | Critère | Poids | Bloquant | Conforme (2) si… |
| --- | --- | --- | --- | --- |
| 1 | Tokens / styles | 15 | oui | couleurs, typos, espacements, rayons, ombres en styles ou variables nommées ; pas de valeurs sauvages |
| 2 | Composants | 15 | oui | éléments répétés en composants avec variantes (taille, type), instances utilisées dans les écrans |
| 3 | États | 10 | | survol, focus, actif, désactivé, erreur, chargement, vide pour boutons, champs, cartes, onglets |
| 4 | Responsive | 15 | oui | au moins mobile et desktop pour chaque gabarit ; auto-layout ; règles de passage claires |
| 5 | Accessibilité | 10 | | contraste ≥ 4,5:1, tailles de cible ≥ 44 px, focus dessiné, textes alternatifs prévus |
| 6 | Nommage et structure | 10 | | pages, frames et calques nommés ; composants rangés ; pas de « Frame 123 » |
| 7 | Contenus | 5 | | textes réalistes, cas longs et vides, images aux bons formats |
| 8 | Interactions | 10 | | couches, menus, filtres, carrousels, modales prototypés ou annotés (y compris leurs animations) |
| 9 | Assets | 5 | | logos et pictos exportables en SVG, images en haute définition, licences des polices |
| 10 | Cohérence | 5 | | mêmes composants et espacements d’un écran à l’autre |

## Grille B — Qualité UI/UX (règles impeccable + ui-ux-pro-max)

| # | Critère | Poids | Conforme (2) si… |
| --- | --- | --- | --- |
| 1 | Hiérarchie visuelle | 15 | un point d’entrée clair par écran, 3 niveaux de titre max, action principale évidente |
| 2 | Espacement et rythme | 15 | échelle d’espacement régulière, plus d’air entre sections qu’à l’intérieur |
| 3 | Lisibilité | 10 | tailles ≥ 16 px pour le texte courant, 45–75 caractères par ligne, interligne confortable |
| 4 | Contraste et couleur | 10 | contraste ≥ 4,5:1, l’accent réservé aux actions, pas de sens porté par la couleur seule |
| 5 | Parcours et ergonomie | 15 | étapes claires (tunnel, filtres, compte), peu de clics, retour arrière possible |
| 6 | Formulaires | 10 | labels visibles, aide et erreurs sous le champ, bons claviers mobiles |
| 7 | Mobile | 10 | cibles ≥ 44 px, contenus prioritaires en premier, pas de débordement |
| 8 | Retours et états | 10 | chargement, succès, erreur, vide prévus et compréhensibles |
| 9 | Cohérence du langage visuel | 5 | mêmes composants, icônes d’une seule famille, pas d’effet gratuit |

## Décision

| Score A | Score B | Décision | Suite |
| --- | --- | --- | --- |
| < seuilNoGo (60), ou un bloquant à 0 | — | **NO-GO** | retours agence, puis `/audit` à nouveau |
| ≥ seuilNoGo | ≥ seuilUx (75) | **GO fidèle** | Claude Design reproduit le Figma tel quel |
| ≥ seuilNoGo | < seuilUx | **GO avec affinage UX** | le pilote coche les corrections de `ux-corrections.md` ; Claude Design les applique avec impeccable + ui-ux-pro-max |

Entre 60 et 79 sur A : on démarre, les retours partent quand même à l’agence.
L’affinage garde l’identité de marque (logo, couleurs, polices, ton). Il corrige l’expérience, pas le style.

## Format des retours agence
`[Bloquant|Majeur|Mineur] Écran / composant — problème constaté — attendu.`
Exemple : `[Majeur] Fiche produit / bouton ajouter — pas d’état désactivé ni chargement — ajouter les variantes disabled et loading.`

## Sources et licences
Où sont les règles et sur quoi elles s’appuient : `REGLES-ET-SOURCES.md` à la racine du dépôt. Licences des projets cités : `THIRD-PARTY-NOTICES.md`.
- Grille A : critères maison et WCAG 2.2 ; grille B : règles d’impeccable et d’UI/UX Pro Max reformulées, WCAG 2.2 et heuristiques de Nielsen. Le détail critère par critère est dans `REGLES-ET-SOURCES.md`.
