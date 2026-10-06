# Pièges connus (retours du projet de référence)

- Windows : importer un fichier local en ESM exige `pathToFileURL(...)`, sinon `ERR_UNSUPPORTED_ESM_URL_SCHEME`.
- Node : `import.meta.dirname` impose Node ≥ 20.11 ; fixer `engines` et `.nvmrc`.
- Polices ouvertes en `file://` : pas de preload ; intégrer les woff2 en base64 ou servir en http.
- Spécificité : les styles du design system peuvent écraser la mise en page projet (ex. méga-menu collé à gauche) ; vérifier le centrage aux grandes largeurs.
- `data-href` sur un bouton peut déclencher une navigation globale : nommer les attributs sans collision.
- Une règle d’affinage peut casser le mobile : l’envelopper dans le mixin de breakpoint.
- Casse : si le BRIEF interdit les majuscules, une règle globale `text-transform: none` évite les oublis.
- Claude Design n’a pas le connecteur Figma : tout passe par `design/pack.zip` (tokens, assets, captures, inventaire).
- Une retouche faite seulement dans le code est perdue au prochain `/import-ds` : retoucher dans Claude Design, réexporter, réimporter.
