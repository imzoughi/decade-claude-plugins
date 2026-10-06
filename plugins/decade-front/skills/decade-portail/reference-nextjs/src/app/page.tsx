// Portail Decade (Next.js) : même page que le portail HTML — hero, un bloc par parcours, bloc documentation.
// Styles : kit commun (docs/docs.scss pour les variables --doc-* du projet, docs/portal.scss pour la mise en page).
// Ne pas styler cette page avec les tokens du projet directement : seules les correspondances de _doc-theme.scss changent.
import Link from "next/link";
import * as Icons from "lucide-react";
import { site } from "@/data/site";
import { components } from "@/docs/catalog";
import "./docs/docs.scss";
import "./docs/portal.scss";

const docs: [string, string][] = [["/docs", "Démarrage"], ["/docs/architecture", "Architecture"], ["/docs/marque", "Guide de marque"], ["/docs/tokens", "Tokens"],
  [`/docs/composants/${components[0]?.id ?? ""}`, "Composants"], ["/docs/pages", "Pages & maquettes"], ["/docs/versions", "Journal des versions"], ["/docs/performance", "Performance"]];
const icon = (name: string) => (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Folder;
const Arrow = () => <Icons.ArrowRight className="portal__arrow" aria-hidden size={16} />;

export default function Portal() {
  const logo = (site as { logo?: string }).logo; // optionnel : chemin du logo dans public/ (préfixé du basePath si besoin)
  const first = site.pages[0]?.href ?? "/";
  return (
    <div className="doc portal-page">
      <main className="portal">
        <header className="portal__hero">
          {logo ? <img className="portal__logo" src={logo} alt={site.name} height={24} /> : <p className="portal__kicker">{site.name}</p>}
          <h1 className="portal__title">Maquettes front et documentation</h1>
          <p className="portal__lead">{site.pages.length} pages {site.stackLabel} construites à partir du design system {site.name}. Chaque page est interactive.</p>
          <div className="portal__meta">
            <span className="portal__pill">Design system v{site.dsVersion}</span>
            <span className="portal__pill">{site.stackLabel}</span>
            <span className="portal__pill">{site.pages.length} pages</span>
          </div>
          <div className="portal__ctas">
            <Link className="portal__btn portal__btn--primary" href={first}><Icons.Store aria-hidden size={18} />Voir le site</Link>
            <Link className="portal__btn" href="/docs"><Icons.BookOpen aria-hidden size={18} />Documentation</Link>
            {site.repo ? <a className="portal__btn" href={site.repo} rel="noopener"><Icons.GitBranch aria-hidden size={18} />Code source</a> : null}
          </div>
        </header>
        <div className="portal__groups">
          {site.groups.map((g, i) => {
            const Icon = icon(g.icon);
            return (
              <section key={g.title} className="portal__group" aria-labelledby={`pg-${i}`}>
                <div className="portal__ghead">
                  <span className="portal__gicon" aria-hidden><Icon size={22} /></span>
                  <div><h2 className="portal__gtitle" id={`pg-${i}`}>{g.title}</h2><p className="portal__gtext">{g.text}</p></div>
                </div>
                <ul className="portal__pages">
                  {site.pages.filter((p) => p.group === g.title).map((p) => (
                    <li key={p.id}><Link href={p.href}><span>{p.title}</span><code>{p.href}</code><Arrow /></Link></li>
                  ))}
                </ul>
              </section>
            );
          })}
          <section className="portal__group portal__group--docs" aria-labelledby="pg-docs">
            <div className="portal__ghead">
              <span className="portal__gicon" aria-hidden><Icons.BookOpen size={22} /></span>
              <div><h2 className="portal__gtitle" id="pg-docs">Documentation</h2><p className="portal__gtext">Architecture, guide de marque, tokens, composants vivants avec leur code, pages, versions, performance.</p></div>
            </div>
            <ul className="portal__pages">
              {docs.map(([href, label]) => <li key={href}><Link href={href}><span>{label}</span><Arrow /></Link></li>)}
            </ul>
          </section>
        </div>
        <p className="portal__foot">Maquettes de démonstration : contenus, produits et prix sont fictifs · design system {site.name} v{site.dsVersion}.</p>
      </main>
    </div>
  );
}
