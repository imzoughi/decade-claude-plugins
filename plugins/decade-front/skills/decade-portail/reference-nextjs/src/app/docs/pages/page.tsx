// Pages & maquettes : aperçu de chaque page (bureau), lien vers la page réelle.
import Link from "next/link";
import { Hero } from "@/docs/Hero";
import { site } from "@/data/site";

export default function Pages() {
  return (
    <>
      <Hero kicker="Prise en main" title="Pages & maquettes" lead={`${site.pages.length} pages, regroupées par parcours.`} />
      {site.groups.map((g) => (
        <section key={g.title} className="doc-section">
          <h2>{g.title}</h2>
          <div className="doc-pages">
            {site.pages.filter((p) => p.group === g.title).map((p) => (
              <article key={p.id} className="doc-page">
                <div className="doc-page__thumb"><iframe src={p.href} title={`Aperçu : ${p.title}`} loading="lazy" tabIndex={-1} aria-hidden /></div>
                <div className="doc-page__body"><h3><Link href={p.href}>{p.title}</Link></h3><code className="doc-page__file">{p.href}</code></div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
