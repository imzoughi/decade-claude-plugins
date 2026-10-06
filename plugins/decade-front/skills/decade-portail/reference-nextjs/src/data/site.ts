// Site Decade (Next.js) : pages et groupes du portail. Même contenu que src/data/site.json de la branche HTML.
export type Page = { id: string; href: string; title: string; group: string };
export type Group = { title: string; icon: string; text: string };

export const site = {
  name: "Client",
  stackLabel: "Next.js / React",
  dsVersion: "1.0.0",
  repo: "",
  logo: "", // optionnel : ex. "/images/logo.svg" (affiché en haut du portail)
  groups: [
    { title: "Catalogue", icon: "Store", text: "Accueil, liste produits, fiche produit." },
    { title: "Tunnel d’achat", icon: "ShoppingCart", text: "Panier, livraison, paiement, confirmation." },
    { title: "Compte", icon: "User", text: "Connexion, création de compte, espace client." },
  ] satisfies Group[],
  pages: [
    { id: "home", href: "/accueil", title: "Accueil", group: "Catalogue" },
    { id: "listing", href: "/liste-produits", title: "Liste produits", group: "Catalogue" },
    { id: "product", href: "/fiche-produit", title: "Fiche produit", group: "Catalogue" },
    { id: "cart", href: "/panier", title: "Panier", group: "Tunnel d’achat" },
    { id: "login", href: "/connexion", title: "Connexion", group: "Compte" },
  ] satisfies Page[],
};
