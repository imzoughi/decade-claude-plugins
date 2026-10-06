// Architecture : arborescence et cycle de vie d’un composant (identique pour tous les projets Decade Next.js).
import { Hero } from "@/docs/Hero";
import { CodeBlock } from "@/docs/CodeBlock";

const tree = `src/
  app/            routes du site (pages) et de la doc (/docs)
  components/ui/  composants de base : un dossier par composant (tsx, module.scss, stories)
  components/blocks/  sections de page composées des composants de base
  styles/         tokens.css (généré depuis le design system), globals, mixins
  data/ mocks/    données de démonstration, séparées des composants
  docs/           kit de documentation (Markdown, CodeBlock, catalogue)
design/ds-export/ design system validé dans Claude Design (lecture seule)`;

export default function Architecture() {
  return (
    <>
      <Hero kicker="Prise en main" title="Architecture" lead="Où se trouve chaque chose, et comment un composant passe du design system au site." />
      <section className="doc-section"><h2>Arborescence</h2><CodeBlock lang="text" label="Arborescence" code={tree} /></section>
      <section className="doc-section">
        <h2>Cycle de vie d’un composant</h2>
        <div className="doc-flow">
          {[["Claude Design", "design system validé"], ["/import-ds", "tokens et composant"], ["Story", "un exemple = un test"], ["Contrôle QA", "VERT ou ROUGE"], ["Doc", "fiche générée"]].map(([t, s]) => <div key={t}><strong>{t}</strong><span>{s}</span></div>)}
        </div>
      </section>
    </>
  );
}
