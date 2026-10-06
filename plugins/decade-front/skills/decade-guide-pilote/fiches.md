# Fiches du pilote — une par étape

Format de chaque fiche : **Fait** (ce que le pilote fait) · **Vérifie** (points à reprendre dans « À vérifier ») · **Ne fait pas** · **Terminé quand**.

## 1 · Démarrer — `/build-front <lien Figma>`
- **Fait :** choisit les pages à produire dans la liste de toutes les pages trouvées dans le Figma (`workflow/pages.md`), une version par page ; puis répond aux questions (stack, hébergement, délai).
- **Vérifie :** aucune page du Figma n’a été oubliée (comparer avec le fichier Figma) ; une seule version par page ; les pages « absentes du Figma » cochées sont des écarts assumés ; la stack est la bonne (html, react ou nextjs) ; le délai est réaliste.
- **Ne fait pas :** ne remplit pas `decade.config.json` à la main.
- **Terminé quand :** « Validé par le pilote » est rempli dans `BRIEF.md` (nom + date).

## 2 · Auditer — `/audit`
- **Fait :** lit les trois phrases en tête du rapport et la décision.
- **Vérifie :** la décision (NO-GO, GO fidèle, GO + affinage UX) ; les critères bloquants cités ; l’impact planning.
- **Ne fait pas :** ne corrige pas le Figma lui-même.
- **NO-GO :** envoie `audit/retours-agence.md` à l’agence tel quel ; au retour du Figma corrigé : `/audit`.
- **Terminé quand :** la décision est GO (fidèle ou affinage UX).

## 3 · Préparer — `/pack-design`
- **Fait :** si affinage UX, coche dans `design/pack/ux-corrections.md` les corrections qu’il accepte, avant la commande.
- **Vérifie :** les corrections cochées sont des choix assumés ; l’inventaire des composants ne manque rien d’évident.
- **Ne fait pas :** ne modifie pas le pack à la main.
- **Terminé quand :** `design/pack.zip` et `design/pack/GUIDE-ETAPE-4.md` existent.

## 4 · Design system — Claude Design (hors Claude Code)
- **Fait :** suit `design/pack/GUIDE-ETAPE-4.md` case par case : joindre `design/pack.zip`, coller les prompts dans l’ordre, contrôler, exporter.
- **Vérifie :** couleurs et typographies conformes au Figma ; chaque composant a ses états ; les animations respectent le mouvement réduit.
- **Ne fait pas :** ne saute pas le prompt de contrôle ; ne modifie pas l’export.
- **Terminé quand :** l’export est dézippé dans `design/ds-export/` et la dernière case du guide est cochée.

## 5 · Composants — `/import-ds`, puis la boucle
- **Fait :** lance `/import-ds`, puis accepte la boucle proposée par `/next-step`.
- **Vérifie :** le portail montre les composants ; les éléments bloqués dans `workflow/blocages.md` ; les diffs avant commit.
- **Ne fait pas :** ne coche pas le backlog à la main (seul un VERT du contrôleur coche).
- **Terminé quand :** la section Composants du backlog est toute cochée.

## 6 · Pages — la boucle pages
- **Fait :** accepte la boucle pages proposée par `/next-step`.
- **Vérifie :** les captures des pages face au Figma ; les blocages restants.
- **Ne fait pas :** ne corrige pas le CSS.
- **Terminé quand :** la section Pages du backlog est toute cochée.

## 7 · Publier — `/qa all`, recette, `/publish`
- **Fait :** lance `/qa all`, fait la recette avec `qa/recette.md`, remplit « Recette du pilote » dans `BRIEF.md`, lance `/publish` (il prépare aussi la passation backend `livraison/backend/` ; seule : `/handoff`), puis pousse avec les commandes de `livraison/LIVRAISON.md`.
- **Vérifie :** `qa/qa-all.md` est VERT ; chaque page de la recette est cochée ; le lien public s’ouvre.
- **Ne fait pas :** ne publie pas avec une QA ROUGE.
- **Terminé quand :** le lien public est dans le README et le package est dans `livraison/`, avec `livraison/backend/AGENTS.md` pour l’équipe ou l’IA backend.

## Mise à jour du Figma — `/sync-figma` (à tout moment)
- **Fait :** coche dans `design/sync/sync-AAAA-MM-JJ.md` les changements qu’il accepte ; envoie `design/sync/retours-designer.md` au designer.
- **Vérifie :** les changements non conformes aux règles d’or.
- **Terminé quand :** la nouvelle version est importée et notée dans `design/CHANGELOG.md`.
