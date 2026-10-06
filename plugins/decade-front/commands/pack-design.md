---
description: Étape 3 — préparer le pack pour Claude Design via le sous-agent préparateur
---
**Entrées :** Figma · audit · corrections UX cochées par le pilote
**Sorties :** design/pack/ (tokens, motion, assets, captures, inventaire, prompts) · design/pack/GUIDE-ETAPE-4.md · design/pack.zip · backlog (composants)

Vérifie d’abord : si `design/pack/ux-corrections.md` existe et qu’aucune case n’est cochée, arrête-toi et demande la validation du pilote.
Sinon, délègue au sous-agent **decade-preparateur-design**. Il écrit aussi `design/pack/GUIDE-ETAPE-4.md`, la check-list du pilote pour Claude Design (modèle dans le skill `decade-claude-design`).
Termine par le bloc « 🧭 À toi, pilote » (skill `decade-guide-pilote`) : à faire maintenant, ouvrir `design/pack/GUIDE-ETAPE-4.md` et le suivre case par case ; ensuite /next-step.
