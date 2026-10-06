// Coloration du code au build (Shiki, thème sombre comme la doc Intersport) : aucun JavaScript envoyé au visiteur.
import { createHighlighter, type Highlighter } from "shiki";

export const CODE_THEME = "github-dark-default";
const LANGS = ["tsx", "ts", "jsx", "js", "json", "scss", "css", "html", "bash", "md"] as const;
let hl: Promise<Highlighter> | undefined;

export async function highlight(code: string, lang = "tsx"): Promise<string> {
  hl ??= createHighlighter({ themes: [CODE_THEME], langs: [...LANGS] });
  const h = await hl;
  const l = (LANGS as readonly string[]).includes(lang) ? lang : "text";
  return h.codeToHtml(code.replace(/\n$/, ""), { lang: l, theme: CODE_THEME });
}
