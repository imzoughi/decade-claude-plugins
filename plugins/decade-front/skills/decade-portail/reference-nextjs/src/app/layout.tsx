// Layout racine Decade (Next.js). suppressHydrationWarning sur <html> et <body> : les extensions du navigateur
// (LanguageTool, QuillBot, Grammarly…) et le bouton de thème de la doc (data-theme) changent leurs attributs avant React.
// Ne masque que les attributs de ces deux balises : les erreurs d’hydratation des composants restent signalées.
import type { Metadata } from "next";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Client — maquettes front",
  description: "Maquettes et documentation du design system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
