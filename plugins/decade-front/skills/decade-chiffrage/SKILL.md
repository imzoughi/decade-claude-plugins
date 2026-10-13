---
name: decade-chiffrage
description: Chiffrage d’une intégration à partir de l’audit du Figma — classe de complexité de chaque composant et de chaque page, délai et charge en trois points (P50, P80, P90) pour le pilote + plugin et pour un dev front classique, recalés sur les projets réels. À utiliser pendant /audit et à chaque demande de chiffrage.
---
# Chiffrer une intégration

But : annoncer une date qu’on tient. On ne donne pas un chiffre unique, on donne une **date d’engagement (P80)** : 8 projets sur 10 la tiennent si les paramètres sont justes.

## 1. Classer chaque composant (grille sur 12 points)

Lis le composant dans le Figma et note 6 critères de 0 à 2 :

| Critère | 0 | 1 | 2 |
|---|---|---|---|
| Variantes (tailles, types, thèmes) | 1 à 2 | 3 à 6 | plus de 6 |
| États (survol, focus, désactivé, erreur, chargement, vide, états métier) | 2 ou moins | 3 à 5 | tous, ou des états métier (stock épuisé, quantité maxi) |
| Interaction | affichage seul | un clic, un champ simple | couche qui s’ouvre, filtre, carrousel, glisser, formulaire validé |
| Motif clavier et accessibilité (WAI-ARIA APG) | aucun | bouton, lien, onglets | fenêtre modale, menu, liste déroulante, combobox (focus piégé, Échap, flèches) |
| Écart mobile / desktop | même mise en page | réorganisation | composant différent sur mobile (tiroir au lieu de colonne) |
| Données et mouvement | statique | une liste ou une animation simple | calculs liés (total panier), plusieurs animations |

Classe : **S** 0 à 3 · **M** 4 à 6 · **L** 7 à 9 · **XL** 10 à 12.

Pages : **S** une page de contenu (sections simples) · **M** une page composée (grilles, cartes, contenus variés) · **L** un parcours ou une page à états (tunnel, filtres, compte, formulaires). Une page **absente** du Figma (à composer avec le kit) est marquée `absente: true`.

Ce qu’on ne voit pas dans le Figma (logique métier, service tiers : paiement, carte, recherche ; contenus réels très différents) ne se met pas dans une classe : c’est une **dépendance** ou un **point à confirmer**, listé à part.

## 2. Écrire l’inventaire

L’auditeur écrit `audit/chiffrage-inventaire.json` :

```json
{
  "stack": "nextjs",
  "premierProjet": true,
  "abonnement": "max20x",
  "modeles": "table",
  "scores": { "A": 77.5, "B": 50 },
  "composants": [ { "nom": "Button", "classe": "S", "notes": [0,1,1,1,0,0] } ],
  "pages": [ { "nom": "paiement", "classe": "L", "absente": true } ],
  "dependances": [ "Paiement absent du Figma : à valider par le client" ]
}
```

`premierProjet`, `abonnement` (`pro`, `max5x`, `max20x`) et `modeles` (`table` ou `opus`) viennent de `decade.config.json` → `chiffrage` s’ils y sont, sinon : premier projet, Max 20x, un modèle par tâche.

## 3. La formule

Chaque élément a trois valeurs : optimiste, probable, pessimiste (`parametres.json`). Le script tire 5 000 scénarios :

- **Dev front classique (jours)** = (mise en place + Σ composants + Σ pages + pages absentes) × facteur stack × 1,15 (QA et reprises) × E
- **Agents (heures)** = (fixe + Σ composants + Σ pages) × facteur stack × risques d’audit × E
- **Pilote (heures)** = relecture (Σ par élément) + tâches fixes (démarrage et audit, Claude Design, recette, publication, arbitrage des écarts) + affinage UX, le tout × premier projet × E
- **Délai (jours ouvrés)** = tâches fixes du pilote ÷ heures de pilote par jour + max(agents ÷ heures d’agents par jour, relecture ÷ heures de pilote par jour)

E est l’**erreur commune au projet** (de −15 % à +40 %, plus souvent au-dessus) : tirée une fois par scénario, elle reproduit ce qui arrive en vrai, quand tout le projet est sous-estimé en même temps. Sans elle, les erreurs se compenseraient et la fourchette serait trop étroite.

Les agents tournent pendant que le pilote relit : on prend le plus long des deux, pas la somme. Les heures d’agents par jour dépendent du quota de l’abonnement (moins en tout Opus).

Risques appliqués : score A sous 80 → agents +10 % ; score B sous 75 → affinage UX (+2 h de pilote, agents +5 %) ; premier projet → pilote +20 %.

Résultats : P50 (médiane), **P80 (engagement)**, P90 (prudent), pour le délai, le travail du pilote et le travail d’un dev front. Coût = jours × `chiffrage.coutJourEuros` (500 € par défaut).

## 4. Annoncer

- La date d’engagement est le **P80**, arrondi à la demi-journée supérieure, compté **après le GO** de l’audit.
- Les **dépendances externes** (écrans attendus de l’agence, validation du client, accès à un service) ne sont jamais noyées dans la marge : elles s’annoncent comme des conditions (« livraison 5 jours après réception des écrans de paiement »).
- Si la date demandée est sous le P50 : le dire tout de suite, et proposer de réduire le périmètre (pages L, composants XL) plutôt que de promettre.

## 5. Recaler (après chaque projet)

Le chiffrage devient crédible quand il est recalé sur vos projets, pas sur des estimations.

1. Mesurer : tours de boucle par composant et par page (rapports `qa/`), heures d’agents (`workflow/logs/`), jours calendaires du GO à la livraison, heures du pilote (à noter dans `workflow/temps.md`).
2. Comparer au chiffrage : réel ÷ P50, par classe et au total.
3. Ajuster `parametres.json` : nouvelle valeur probable = (3 × ancienne + réel moyen du projet) ÷ 4 pour chaque classe touchée ; élargir le pessimiste si un réel l’a dépassé.
4. Contrôle de qualité du chiffrage : sur plusieurs projets, environ 8 sur 10 doivent finir sous le P80. Beaucoup plus : le chiffrage est trop prudent. Beaucoup moins : il est optimiste, relever E.
5. Côté dev front, remplacer les valeurs par défaut par vos chiffrages passés (temps réel par composant et par page) dès qu’ils existent.

Monter la `version` de `parametres.json` à chaque recalage.

## Commandes

`node "${CLAUDE_PLUGIN_ROOT}/skills/decade-chiffrage/chiffrage.mjs"` → écrit `audit/chiffrage.md` · `--json` pour les chiffres bruts.

## Sources de la méthode

- Estimation en trois points et loi triangulaire (PERT) ; date d’engagement au percentile (P80) plutôt qu’à la moyenne.
- Simulation de Monte-Carlo pour additionner des incertitudes.
- Prévision par classe de référence (Kahneman et Tversky, Flyvbjerg) : partir des durées réelles de projets comparables, d’où le recalage.
- Motifs clavier : WAI-ARIA Authoring Practices Guide, https://www.w3.org/WAI/ARIA/apg/patterns/
