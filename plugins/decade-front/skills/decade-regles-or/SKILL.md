---
name: decade-regles-or
description: Règles d’or du design system Decade, contrôle d’un composant nouveau ou modifié, versionnage et journal des changements du design system. À utiliser à chaque mise à jour du Figma (/sync-figma), à chaque import et par le contrôleur QA.
---
# Règles d’or et vie du design system

Un composant n’entre dans le design system (ou n’y change) que s’il respecte **toutes** les règles d’or de `regles-or.md`. Le contrôle est le même pour un premier import et pour une mise à jour.

## Contrôle d’un composant
Pour chaque composant nouveau ou modifié, produis une ligne :
`Composant — CONFORME | À CORRIGER (designer) | ÉCART À VALIDER (pilote) — règles concernées — preuve (nœud Figma)`.
- **À corriger** : la règle est enfreinte sans raison (couleur hors tokens, état manquant, contraste). Retour au designer.
- **Écart à valider** : la règle est enfreinte volontairement (nouveau token, nouvelle variante de marque). Le pilote tranche ; s’il accepte, la règle ou le token est mis à jour et noté au journal.

## Photo du Figma (`design/figma-snapshot.json`)
Écrite à chaque audit et à chaque synchronisation : pour chaque composant, `{ nom, cle, variantes, proprietes, empreinte, ecrans }`. L’empreinte est un hachage court de la structure du nœud (calques, styles et variables utilisés, auto-layout). Elle sert à détecter ce qui a changé.

## Versionnage
- `design/ds-export/version.json` : `{ "version": "1.4.0", "date": "…", "figma": "<version Figma>" }`, livré par Claude Design.
- Majeur : un composant supprimé ou renommé, une rupture d’API. Mineur : composant ajouté, variante ajoutée. Correctif : retouche visuelle.
- `design/CHANGELOG.md` : une entrée par version, écrite pour le pilote et le client (ajouté, modifié, supprimé, pages touchées).
