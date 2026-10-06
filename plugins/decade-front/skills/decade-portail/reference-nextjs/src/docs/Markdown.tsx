// Rendu Markdown de la doc (README du design system, fiches, journal) par un vrai parseur : GFM (tableaux, listes imbriquées,
// cases à cocher, liens auto), ancres sur les titres, code coloré par Shiki. Interdit : un parseur maison (source des erreurs de rendu).
import { MarkdownAsync, type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";

type HNode = { type: string; value?: string; tagName?: string; properties?: Record<string, unknown>; children?: HNode[] };
const textOf = (n?: HNode): string => !n ? "" : n.type === "text" ? n.value ?? "" : (n.children ?? []).map(textOf).join("");

/** Le « # Titre » du fichier est retiré (la page a déjà son h1) ; `shift` décale les autres titres : 0 → « ## » devient h2 (page entière), 1 → h3 (dans une section h2). */
export async function Markdown({ source, shift = 0, label = "Contenu" }: { source: string; shift?: number; label?: string }) {
  const heading = (level: number) => function H({ children, id }: { children?: ReactNode; id?: string }) {
    const n = Math.min(6, level + shift);
    const Tag = `h${n}` as "h2";
    return <Tag id={id}>{children}{id && <a className="anchor" href={`#${id}`} aria-label="Lien vers cette section">#</a>}</Tag>;
  };
  const components: Components = {
    h1: heading(1), h2: heading(2), h3: heading(3), h4: heading(4), h5: heading(5), h6: heading(6),
    table: ({ children }) => <div className="doc-table" role="region" tabIndex={0} aria-label={`Tableau (${label})`}><table>{children}</table></div>,
    pre: ({ node }) => {
      const code = (node?.children?.[0] ?? undefined) as HNode | undefined;
      const cls = String((code?.properties?.className as string[] | undefined)?.find((c) => c.startsWith("language-")) ?? "");
      return <CodeBlock code={textOf(code)} lang={cls.replace("language-", "") || "text"} label={`Code (${label})`} />;
    },
    img: ({ src, alt }) => <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} loading="lazy" />,
  };
  // Le rendu de premier niveau (# Titre) d’un README est déjà le titre de la page : on le retire.
  const body = source.replace(/\r\n/g, "\n").replace(/^# .*\n+/, "");
  return (
    <div className="doc-prose">
      <MarkdownAsync remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>{body}</MarkdownAsync>
    </div>
  );
}
