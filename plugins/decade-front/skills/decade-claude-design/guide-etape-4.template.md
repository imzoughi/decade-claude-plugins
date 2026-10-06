# Étape 4 — Design system dans Claude Design · check-list du pilote

> Projet : {{projet}} · pack du {{date}} · {{nbGroupes}} groupes, {{nbComposants}} composants
> Coche chaque case au fur et à mesure (`[x]`). Un doute ? Arrête-toi et lance `/next-step` dans Claude Code.

## A. Ouvrir
- [ ] Dans Claude (Cowork), créer un design system nommé « {{projet}} ».
- [ ] Joindre `design/pack.zip` au premier message.

## B. Coller les prompts, dans l’ordre (`design/pack/prompts-claude-design.md`)
- [ ] Prompt 1 · Création → attendre la fin de la réponse.
{{#groupes}}
- [ ] Prompt {{n}} · Groupe « {{nom}} » ({{nb}} composants) → vérifier que les {{nb}} composants apparaissent.
{{/groupes}}
- [ ] Prompt contrôle → lire le tableau rendu par Claude Design.

## C. Vérifier (avant d’exporter)
- [ ] Couleurs et typographies identiques au Figma (comparer avec `design/pack/captures/`).
- [ ] Chaque composant a ses états (survol, focus, désactivé, erreur).
- [ ] Les animations ont une version « mouvement réduit ».
- [ ] Le tableau de contrôle ne signale aucun écart, ou chaque écart est accepté par toi.
{{#affinage}}
- [ ] Seules les corrections UX que tu as cochées sont appliquées.
{{/affinage}}
- [ ] Si le client doit voir le design system : partager le lien Claude Design et attendre son accord.

## D. Exporter et déposer
- [ ] Prompt export → télécharger le zip `ds-export`.
- [ ] Le dézipper dans `design/ds-export/` du dépôt (sans rien modifier).
- [ ] Revenir dans Claude Code et lancer `/next-step`.
