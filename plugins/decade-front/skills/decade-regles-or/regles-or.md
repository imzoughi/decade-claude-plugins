# Règles d’or du design system Decade

1. **Tokens seulement.** Couleurs, typos, espacements, rayons, ombres et mouvements viennent des tokens. Un nouveau token se justifie (écart à valider).
2. **Tous les états.** Défaut, survol, focus visible, actif, désactivé ; erreur et chargement quand c’est pertinent ; état vide pour les listes.
3. **Mobile d’abord pensé.** Une version mobile existe ; zones cliquables ≥ 44 px ; pas de débordement.
4. **Accessible.** Contraste ≥ 4,5:1 (3:1 pour les grands textes et icônes), nom accessible, ordre de focus logique, Échap ferme les couches.
5. **Un rôle, un composant.** Pas de doublon : si un composant existant couvre le besoin avec une variante, on ajoute la variante.
6. **Nommage Decade.** Nom en PascalCase, variantes nommées par rôle (`primary`, `secondary`, `sm`, `lg`), propriétés explicites.
7. **Mouvement du catalogue.** Animations issues du catalogue et de ses trois niveaux ; pause sur tout défilement automatique.
8. **Identité respectée.** Logo, couleurs de marque, polices et ton inchangés sans validation du pilote.
9. **Documenté.** Chaque composant a son README : usage, variantes, états, accessibilité, animations, exemple.
