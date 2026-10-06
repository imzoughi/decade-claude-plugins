// Guide de marque : README du design system exporté de Claude Design, rendu par le parseur Markdown du kit.
import { Hero } from "@/docs/Hero";
import { Markdown } from "@/docs/Markdown";
import { readText } from "@/docs/read";
import { site } from "@/data/site";

export default function Brand() {
  const readme = readText("design/ds-export/README.md");
  return (
    <>
      <Hero kicker="Prise en main" title="Guide de marque" lead={`Les règles du design system ${site.name}, telles que validées dans Claude Design.`} pills={[`v${site.dsVersion}`]} />
      {readme ? <Markdown source={readme} label="Guide de marque" /> : <p>Le README du design system n’est pas encore importé.</p>}
    </>
  );
}
