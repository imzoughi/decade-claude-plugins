# Prompts Claude Design (modèle)

`/pack-design` recopie ce fichier dans `design/pack/prompts-claude-design.md` en remplaçant les variables `<…>`.
Dans Claude (Cowork), demander un **design system** et joindre `design/pack.zip`. Un message par bloc, dans l’ordre. Attendre la fin de chaque bloc avant le suivant.

## 1. Création (un seul message)
```
Crée le design system <MARQUE> à partir du pack joint. BRIEF.md fait foi.
- Tokens depuis tokens.json (clair et sombre), polices du BRIEF, logos et pictos depuis assets/ tels quels.
- Icônes : uniquement <BIBLIOTHEQUE_ICONES>, selon icons-map.md.
- Les captures/ montrent le rendu attendu de chaque composant et gabarit.
- Mouvement : ajoute les tokens de motion/tokens-motion.json (durées, courbes, distances) et une page
  « Mouvement » avec un aperçu animé de chaque ligne de motion/catalogue.md et sa version en mode réduit
  (niveau 1 retiré, niveau 2 en fondu court, niveau 3 gardé). Aucune durée écrite en dur dans un composant.
- README = guide de marque : ton, fondations, formulaires, couches, iconographie, et un tableau
  « anatomie des pages » (quels composants, dans quel ordre, sur chaque page du BRIEF).
<SI_AFFINAGE_UX>
- Le Figma a des faiblesses UI/UX. Applique, avec les skills impeccable et ui-ux-pro-max
  (ou regles.md (skill decade-ui-ux) joint), uniquement les corrections cochées de ux-corrections.md.
  Garde l’identité : logo, couleurs, polices, ton. Note chaque écart au Figma dans le README, section « Écarts validés ».
</SI_AFFINAGE_UX>
Commence par les fondations (couleurs, typo, espacements, rayons, ombres) ; j’enverrai les groupes ensuite.
```

## 2. Un message par groupe (généré depuis inventaire.md)
```
Ajoute le groupe <GROUPE> : <LISTE_DES_COMPOSANTS avec variantes et états>.
Chaque composant : aperçu interactif, tous ses états, version mobile, ses animations du catalogue
(tokens de mouvement, niveau, version réduite), README de règles.
Vérifie clair, sombre et mobile avant de me rendre la main.
```

## 3. Contrôle (après le dernier groupe)
```
Relis tout le design system avec impeccable et ui-ux-pro-max : cohérence des espacements, hiérarchie,
états manquants, contraste, cibles tactiles, animations (tokens utilisés, mode réduit, bouton pause
des contenus qui défilent seuls). Corrige dans les tokens et les composants, pas au cas par cas.
Mets à jour l’index et le tableau « anatomie des pages ».
```

## 4. Export (dernier message)
```
Livre un zip ds-export contenant : version.json ({ version, date }), CHANGELOG.md, tokens.json (famille motion comprise), motion-catalogue.md, le CSS complet du design system (bundle.css),
un fichier .jsx par composant, le README et les README de composants. Pas d’autre fichier.
```
Puis dézipper dans `design/ds-export/` du dépôt et lancer `/next-step`.

## 5. Mise à jour (pack de mise à jour de /sync-figma)
```
Mets à jour le design system <MARQUE> en version <VERSION> avec le pack joint. Ne touche qu’aux composants listés.
- Modifier : <COMPOSANT> — <CE QUI CHANGE>, en gardant son API (noms des variantes et propriétés).
- Ajouter : <COMPOSANT> — respecte les règles d’or jointes (regles-or.md) : tokens seulement, tous les états,
  mobile, accessibilité, animations du catalogue, README complet.
Mets à jour l’index, le tableau « anatomie des pages » et le CHANGELOG, puis livre le zip ds-export complet.
```

## Retouches pendant le projet
Toute retouche visuelle passe d’abord par Claude Design, puis on refait l’export et `/import-ds`.
Le code et le design system restent ainsi alignés.
