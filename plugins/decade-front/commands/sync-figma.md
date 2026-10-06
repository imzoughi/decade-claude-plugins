---
description: Mise à jour — récupérer les composants ajoutés ou modifiés dans le Figma, les contrôler avec les règles d’or et préparer la mise à jour du design system
argument-hint: [lien Figma]
---
**Entrées :** Figma mis à jour · `design/figma-snapshot.json` · `design/ds-export/` (version actuelle) · skill `decade-regles-or`.
**Sorties :** `design/sync/sync-AAAA-MM-JJ.md` · `design/sync/retours-designer.md` · `design/pack-maj.zip` · backlog mis à jour · nouvelle photo du Figma.

0. Si un rapport `design/sync/` non traité existe déjà et que le pilote y a coché des changements, passe directement à l’étape 5.
1. Délègue au sous-agent **decade-auditeur**, en mode mise à jour : comparer le Figma ($ARGUMENTS, sinon `figma` de la config) à `design/figma-snapshot.json` et classer chaque composant en **nouveau**, **modifié** ou **supprimé** ; lire aussi le journal des changements du designer s’il existe.
2. Pour chaque nouveau ou modifié : contrôle des règles d’or (CONFORME, À CORRIGER, ÉCART À VALIDER). Liste les pages qui utilisent chaque composant (colonne `écrans` de l’inventaire).
3. Écris le rapport `design/sync/sync-AAAA-MM-JJ.md` (en tête, pour le pilote : combien de changements, lesquels bloquent, version proposée) et `design/sync/retours-designer.md`.
4. Arrête-toi ici tant que le pilote n’a pas coché les changements acceptés dans le rapport. Termine par le bloc « 🧭 À toi, pilote » (skill `decade-guide-pilote`) : à faire maintenant, cocher les changements acceptés dans le rapport et envoyer `design/sync/retours-designer.md` ; ensuite /sync-figma.
5. Ensuite, délègue au sous-agent **decade-preparateur-design** un pack de mise à jour `design/pack-maj.zip` : seulement les composants acceptés, avec des prompts « modifie ce composant » ou « ajoute ce composant », la version proposée et les lignes du journal.
6. Dans `workflow/backlog.md`, décoche (ou ajoute) les composants acceptés et les pages qui les utilisent, suffixés de la version (`— v1.4`).
7. Termine par le bloc « 🧭 À toi, pilote » (skill `decade-guide-pilote`) : à faire maintenant, suivre `design/pack-maj/GUIDE-ETAPE-4.md` dans Claude Design ; ensuite /import-ds.
