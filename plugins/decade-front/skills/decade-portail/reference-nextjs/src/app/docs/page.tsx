// Démarrage : prise en main de la doc et du projet.
import Link from "next/link";
import { Hero } from "@/docs/Hero";
import { CodeBlock } from "@/docs/CodeBlock";
import { components } from "@/docs/catalog";
import { site } from "@/data/site";

export default function Start() {
  return (
    <>
      <Hero small={false} kicker="Documentation front" title={`${site.name} · maquettes ${site.stackLabel}`}
        lead={`Composants, tokens et pages construits à partir du design system ${site.name}, version ${site.dsVersion}.`}
        pills={[`${components.length} composants`, `${site.pages.length} pages`, `Design system v${site.dsVersion}`]} />
      <section className="doc-section">
        <h2>Par où commencer</h2>
        <div className="doc-cards">
          <Link className="doc-card" href="/docs/marque"><strong>Guide de marque</strong><span>Ton, couleurs, typographie : les règles du design system.</span></Link>
          <Link className="doc-card" href="/docs/tokens"><strong>Tokens</strong><span>Toutes les valeurs, en clair et en sombre.</span></Link>
          <Link className="doc-card" href={`/docs/composants/${components[0]?.id ?? ""}`}><strong>Composants</strong><span>Exemples vivants et code à copier.</span></Link>
          <Link className="doc-card" href="/docs/pages"><strong>Pages & maquettes</strong><span>Chaque page, en bureau et en mobile.</span></Link>
        </div>
      </section>
      <section className="doc-section">
        <h2>Lancer le projet</h2>
        <CodeBlock lang="bash" label="Commandes npm" code={"npm install\nnpm run dev        # site et doc sur http://localhost:3000\nnpm run storybook  # composants isolés (port 6006)\nnpm run check      # lint, types, build"} />
      </section>
    </>
  );
}
