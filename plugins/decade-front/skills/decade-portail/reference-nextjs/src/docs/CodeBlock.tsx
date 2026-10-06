// Bloc de code de la doc : coloré au build par Shiki, bouton Copier, défilement au clavier (région nommée).
// Ne jamais afficher du code dans un <pre> brut : toujours passer par ce composant.
import { highlight } from "./highlight";
import { CopyButton } from "./CopyButton";

export async function CodeBlock({ code, lang = "tsx", label = "Code" }: { code: string; lang?: string; label?: string }) {
  const html = await highlight(code, lang);
  const pre = html.replace(/\s*tabindex="0"/, "").replace("<pre ", `<pre role="region" tabindex="0" aria-label="${label.replace(/"/g, "&quot;")}" `);
  return (
    <div className="doc-codeblock">
      <CopyButton code={code} label={label} />
      <div dangerouslySetInnerHTML={{ __html: pre }} />
    </div>
  );
}
