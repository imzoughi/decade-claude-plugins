// Journal des versions : design/CHANGELOG.md, écrit à chaque /import-ds, rendu en Markdown (jamais en texte brut).
import { Hero } from "@/docs/Hero";
import { Markdown } from "@/docs/Markdown";
import { readText } from "@/docs/read";

export default function Versions() {
  const log = readText("design/CHANGELOG.md");
  return (
    <>
      <Hero kicker="Prise en main" title="Journal des versions" lead="Chaque version du design system importée dans le projet." />
      {log ? <Markdown source={log} label="Journal des versions" /> : <p>Aucune version pour l’instant.</p>}
    </>
  );
}
