// Tokens : lus dans design/ds-export/tokens.json, au format de l’export Claude Design :
// { color: { themes, tokens: [{ name, value: { light, dark } | "#…", usage }] }, type: { families, groups: [{ name, family, styles }] },
//   spacing | radius | shadow | motion | … : { tokens: [...] } }. Accepte aussi l’ancien format { famille: [...] }.
import type { CSSProperties } from "react";
import { Hero } from "@/docs/Hero";
import { readJson } from "@/docs/read";

type Val = string | number | { [theme: string]: string };
type Token = { name: string; value: Val; usage?: string; type?: string };
type Style = { name: string; fontSize?: string; lineHeight?: string | number; fontWeight?: string | number; sample?: string; usage?: string };
type Group = { name: string; family?: string; note?: string; styles?: Style[] };
type Raw = Record<string, unknown>;

const META = new Set(["name", "version", "meta", "type", "$schema"]);
const LABEL: Record<string, string> = { color: "Couleurs", spacing: "Espacements", radius: "Rayons", shadow: "Ombres", motion: "Mouvement", zIndex: "Superpositions (z-index)", size: "Tailles", breakpoint: "Points de rupture", opacity: "Opacités" };
const tokensOf = (v: unknown): Token[] | null =>
  Array.isArray(v) ? (v as Token[]) : v && typeof v === "object" && Array.isArray((v as Raw).tokens) ? ((v as Raw).tokens as Token[]) : null;
const show = (v: Val) => (typeof v === "object" ? Object.entries(v).map(([k, x]) => `${k} ${x}`).join(" · ") : String(v));
const first = (v: Val) => (typeof v === "object" ? Object.values(v)[0] : String(v));

// Une valeur « {autre-token} » est un alias : on affiche la couleur du token visé, dans le même thème.
const resolver = (tokens: Token[]) => {
  const byName = new Map(tokens.map((t) => [t.name, t.value]));
  const res = (v: string, th: string, depth = 0): string => {
    const m = /^\{([^}]+)\}$/.exec(v.trim());
    if (!m || depth > 5) return v;
    const target = byName.get(m[1]);
    if (target === undefined) return v;
    return res(typeof target === "object" ? (target[th] ?? Object.values(target)[0]) : String(target), th, depth + 1);
  };
  return res;
};

function Colors({ tokens, themes }: { tokens: Token[]; themes: { id: string; name: string }[] }) {
  const res = resolver(tokens);
  return (
    <div className="doc-swatches">
      {tokens.map((t) => {
        const vals = typeof t.value === "object" ? t.value : { [themes[0]?.id ?? "light"]: String(t.value) };
        return (
          <div key={t.name} className="doc-swatch">
            <div style={{ display: "flex", gap: 4 }}>
              {Object.entries(vals).map(([th, c]) => <span key={th} className="doc-swatch__chip" title={th} style={{ background: res(String(c), th), width: Object.keys(vals).length > 1 ? 28 : 56 }} />)}
            </div>
            <div><code>{t.name}</code><span className="doc-swatch__val">{show(t.value)}</span>{t.usage && <p>{t.usage}</p>}</div>
          </div>
        );
      })}
    </div>
  );
}

function Typography({ type }: { type: { families?: Record<string, string>; groups?: Group[] } }) {
  return (
    <>
      {(type.groups ?? []).map((g) => (
        <div key={g.name} className="doc-section">
          <h3>{g.name}</h3>
          {g.note && <p className="doc-lead" style={{ fontSize: 14 }}>{g.note}</p>}
          <div className="doc-type">
            {(g.styles ?? []).map((st) => {
              const style: CSSProperties = { fontFamily: type.families?.[g.family ?? ""] ?? "inherit", fontSize: st.fontSize, lineHeight: st.lineHeight as CSSProperties["lineHeight"], fontWeight: st.fontWeight as CSSProperties["fontWeight"], margin: 0 };
              return (
                <div key={st.name} className="doc-type__row">
                  <div className="doc-type__meta"><code>{st.name}</code><span>{st.fontSize} / {String(st.lineHeight ?? "")} · {String(st.fontWeight ?? "")}</span></div>
                  <p style={style}>{st.sample ?? "Portez-vous bien, mangez des légumes."}</p>
                  {st.usage && <p className="doc-type__use">{st.usage}</p>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

function Table({ fam, tokens }: { fam: string; tokens: Token[] }) {
  return (
    <div className="doc-table" role="region" tabIndex={0} aria-label={`Tokens ${LABEL[fam] ?? fam}`}>
      <table><thead><tr><th scope="col">Token</th><th scope="col">Valeur</th>{fam === "spacing" && <th scope="col">Aperçu</th>}<th scope="col">Usage</th></tr></thead>
        <tbody>{tokens.map((t) => (
          <tr key={t.name}>
            <td><code>{t.name}</code></td><td><code>{show(t.value)}</code></td>
            {fam === "spacing" && <td><span className="doc-space" style={{ width: first(t.value) }} /></td>}
            <td>{t.usage}</td>
          </tr>
        ))}</tbody></table>
    </div>
  );
}

export default function Tokens() {
  const raw = readJson<Raw>("design/ds-export/tokens.json", {});
  const color = raw.color as { themes?: { id: string; name: string }[] } | undefined;
  const families = Object.entries(raw).filter(([k]) => !META.has(k)).map(([k, v]) => [k, tokensOf(v)] as const).filter((e): e is readonly [string, Token[]] => !!e[1] && e[1].length > 0);
  const type = raw.type as { families?: Record<string, string>; groups?: Group[] } | undefined;
  const pills = [...families.map(([f, l]) => `${LABEL[f] ?? f} · ${l.length}`), ...(type?.groups ? [`Typographie · ${type.groups.reduce((n, g) => n + (g.styles?.length ?? 0), 0)}`] : [])];
  return (
    <>
      <Hero kicker="Prise en main" title="Tokens" lead={`Les valeurs du design system${raw.version ? ` (version ${String(raw.version)})` : ""}, à utiliser partout à la place des valeurs écrites en dur : var(--nom).`} pills={pills} />
      {families.length === 0 && !type && <p>Aucun token lisible dans design/ds-export/tokens.json.</p>}
      {families.map(([fam, list]) => fam === "color" ? (
        <section key={fam} className="doc-section"><h2>{LABEL.color}</h2>{color?.themes && <p className="doc-lead" style={{ fontSize: 14 }}>Thèmes : {color.themes.map((t) => t.name).join(", ")}</p>}<Colors tokens={list} themes={color?.themes ?? []} /></section>
      ) : null)}
      {type?.groups && <section className="doc-section"><h2>Typographie</h2><Typography type={type} /></section>}
      {families.filter(([f]) => f !== "color").map(([fam, list]) => (
        <section key={fam} className="doc-section"><h2>{LABEL[fam] ?? fam}</h2><Table fam={fam} tokens={list} /></section>
      ))}
    </>
  );
}
