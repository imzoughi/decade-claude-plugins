// Fiche composant (kit Decade) : règles du design system (Markdown), exemples vivants avec leur code, import, fichiers, hooks.
import { notFound } from "next/navigation";
import { components } from "@/docs/catalog";
import { CodeBlock } from "@/docs/CodeBlock";
import { Markdown } from "@/docs/Markdown";
import { Hero } from "@/docs/Hero";
import { readText } from "@/docs/read";

export function generateStaticParams() { return components.map((c) => ({ id: c.id })); }

export default async function ComponentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = components.find((x) => x.id === id);
  if (!c) notFound();
  const rules = c.ds ? readText(`design/ds-export/components/${c.ds}.md`) || readText(`design/ds-export/components/${c.ds}/README.md`) : "";
  return (
    <>
      <Hero kicker={c.group} title={c.title} pills={[`${c.examples.length} exemple${c.examples.length > 1 ? "s" : ""}`, ...(c.page ? [`Utilisé dans ${c.page}`] : [])]} />
      {rules && <section className="doc-section"><h2>Règles du design system</h2><Markdown source={rules} shift={1} label={c.title} /></section>}
      <section className="doc-section">
        <h2>Exemples</h2>
        {c.examples.map(({ name, Render, code }) => (
          <div key={name} className="doc-example">
            <h3 className="doc-example__title">{name}</h3>
            <div className="doc-demo" role="region" tabIndex={0} aria-label={`Exemple ${name}`}><Render /></div>
            <CodeBlock code={code} label={`Code de l’exemple ${name}`} />
          </div>
        ))}
      </section>
      <section className="doc-section">
        <h2>Import</h2>
        <CodeBlock label={`Import de ${c.title}`} code={`import { ${c.title} } from "@/${c.files[0].replace(/^src\//, "").replace(/\.tsx$/, "")}";`} />
      </section>
      <section className="doc-section"><h2>Fichiers</h2><ul className="doc-list">{c.files.map((f) => <li key={f}><code>{f}</code></li>)}</ul></section>
      {c.hooks?.length ? <section className="doc-section"><h2>Hooks et API</h2><ul className="doc-hooks">{c.hooks.map((h) => <li key={h}><code>{h}</code></li>)}</ul></section> : null}
    </>
  );
}
