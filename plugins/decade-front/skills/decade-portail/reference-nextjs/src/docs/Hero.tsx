// En-tête de page de la doc (kit Decade) : sur-titre, titre (le seul h1 de la page), chapeau, pastilles.
import type { ReactNode } from "react";
export function Hero({ kicker, title, lead, pills, small = true }: { kicker?: string; title: ReactNode; lead?: ReactNode; pills?: ReactNode[]; small?: boolean }) {
  return (
    <header className={`doc-hero${small ? " doc-hero--s" : ""}`}>
      {kicker && <p className="doc-kicker">{kicker}</p>}
      <h1>{title}</h1>
      {lead && <p className="doc-lead">{lead}</p>}
      {pills?.length ? <div className="doc-meta">{pills.map((p, i) => <span key={i} className="doc-pill">{p}</span>)}</div> : null}
    </header>
  );
}
