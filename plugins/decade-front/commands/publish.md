---
description: Étape 7 — documentation, portail, package de livraison et préparation de la publication via le sous-agent documentaliste
---
**Entrées :** qa/qa-all.md VERT · recette du pilote notée dans BRIEF.md
**Sorties :** portail + documentation générés · `livraison/backend/` (passation backend) · `AGENTS.md` · `livraison/<projet>-v<version>.zip` · `livraison/LIVRAISON.md` · commandes git pour le pilote · lien public attendu

Vérifie que `qa/qa-all.md` est VERT et que la recette du pilote est notée dans `BRIEF.md`. Sinon, arrête-toi et dis quoi faire.
Puis, dans cet ordre (un sous-agent ne peut pas en lancer un autre : c’est toi qui délègues chaque étape) :
1. **decade-documentaliste** : portail et documentation à jour (skill `decade-portail`), build de production.
2. **decade-passeur-backend** : passation backend (comme `/decade-front:handoff`) ; le contrôle `check-handoff.mjs` doit être VERT.
3. **decade-documentaliste** : package de livraison `livraison/<projet>-v<version du design system>.zip` :
   - **html** : le dossier `dist/` complet (pages, CSS, JS, assets, portail, doc), utilisable sans serveur ;
   - **react / nextjs** : les sources sans `node_modules` ni secrets, le build de production, et les commandes pour lancer le projet.
   Le package contient aussi `AGENTS.md` et `livraison/backend/`.
4. **decade-documentaliste** : `livraison/LIVRAISON.md`, rédigé pour le client et l’équipe backend : contenu du package, version du design system, lien public, résultats QA et performance, points ouverts ; pour le branchement des données, renvoyer vers `livraison/backend/AGENTS.md` (ne pas recopier).
Termine par le bloc « 🧭 À toi, pilote » (skill `decade-guide-pilote`) : à faire maintenant, les commandes git à lancer par le pilote (Claude ne pousse jamais) ; à vérifier, le lien public s’ouvre.
