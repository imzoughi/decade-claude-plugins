// Documentation Decade (Next.js) : kit de documentation commun (skill decade-portail, doc-kit/) — mêmes classes et même
// apparence que la doc HTML du projet de référence Intersport. Styles : docs.scss et _doc-theme.scss copiés depuis le kit.
import type { ReactNode } from "react";
import { DocChrome, type NavGroup } from "@/docs/DocChrome";
import { groups, components } from "@/docs/catalog";
import { site } from "@/data/site";
import "./docs.scss";

const start: NavGroup = {
  title: "Prise en main",
  items: [["/docs", "Démarrage"], ["/docs/architecture", "Architecture"], ["/docs/marque", "Guide de marque"], ["/docs/tokens", "Tokens"],
    ["/docs/pages", "Pages & maquettes"], ["/docs/versions", "Journal des versions"], ["/docs/performance", "Performance"]]
    .map(([href, label]) => ({ href, label })),
};

export default function DocsLayout({ children }: { children: ReactNode }) {
  const nav: NavGroup[] = [start, ...groups.map((g) => ({
    title: g, items: components.filter((c) => c.group === g).map((c) => ({ href: `/docs/composants/${c.id}`, label: c.title })),
  }))];
  return (
    <DocChrome brand={site.name} siteHref={site.pages[0]?.href ?? "/"} nav={nav}>
      {children}
      <footer className="doc-foot">{site.name} front · généré depuis le design system {site.name} (Claude Design) · version {site.dsVersion}</footer>
    </DocChrome>
  );
}
