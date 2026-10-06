// Performance : mesures Lighthouse du site construit, lues dans qa/perf.json (écrit par /qa).
import { Hero } from "@/docs/Hero";
import { readJson } from "@/docs/read";

type Row = { page: string; score: number; lcpMs: number; cls: number; tbtMs: number; jsKo: number; imagesKo: number; ok: boolean };
export default function Performance() {
  const rows = readJson<Row[]>("qa/perf.json", []);
  return (
    <>
      <Hero kicker="Qualité" title="Performance" lead="Lighthouse sur le site construit, médiane de 3 passages, par page." />
      {rows.length === 0 ? <p>Aucune mesure pour l’instant : lancer /decade-front:qa all.</p> : (
        <div className="doc-table" role="region" tabIndex={0} aria-label="Mesures de performance">
          <table><thead><tr><th scope="col">Page</th><th scope="col">Score</th><th scope="col">LCP</th><th scope="col">CLS</th><th scope="col">TBT</th><th scope="col">JS</th><th scope="col">Images</th><th scope="col">Statut</th></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.page}><td>{r.page}</td><td>{r.score}</td><td>{r.lcpMs} ms</td><td>{r.cls}</td><td>{r.tbtMs} ms</td><td>{r.jsKo} Ko</td><td>{r.imagesKo} Ko</td><td><span className="doc-pill">{r.ok ? "VERT" : "ROUGE"}</span></td></tr>
            ))}</tbody></table>
        </div>
      )}
    </>
  );
}
