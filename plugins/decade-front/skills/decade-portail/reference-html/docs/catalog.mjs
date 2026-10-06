// Catalogue de la documentation : une entrée par composant ou module affiché dans la doc.
// Généré et tenu à jour par /import-ds (une entrée par composant de design/ds-export/).
// example : Nunjucks rendu en direct dans la page de doc (mêmes CSS / JS que le site) · usage : code à copier
// ds : nom du composant dans le design system (lit design/ds-export/components/<ds>.md)
// scss / js : fichiers qui l’implémentent · hooks : attributs data-* et événements · page : page où le voir en situation
export const groups = ['Fondations', 'Navigation', 'Actions & formulaires', 'Produit', 'Listes & catalogue', 'Couches (drawers)'];

export const components = [
  { id: 'badge', title: 'Badge', group: 'Fondations', ds: 'Badge', scss: ['components/_badge.scss'],
    example: `{% import "macros/ui.njk" as ui %}<div class="is-row">{{ ui.badge('promo', '-30%') }}{{ ui.badge('new') }}</div>` },
  { id: 'button', title: 'Button', group: 'Actions & formulaires', ds: 'Button', scss: ['components/_button.scss'],
    example: `{% import "macros/ui.njk" as ui %}<div class="is-row">{{ ui.button('Ajouter au panier', iconName='shopping-cart') }}{{ ui.button('Voir les offres', 'secondary') }}</div>` },
  { id: 'main-nav', title: 'Méga-menu desktop', group: 'Navigation', ds: 'MegaMenu', scss: ['layout/_main-nav.scss'], js: 'modules/mega-menu.js',
    hooks: ['data-mega-nav', 'data-mega-trigger', 'src/data/nav.json'], page: 'home',
    example: `{% include "modules/layout/main-nav.njk" %}` },
];
