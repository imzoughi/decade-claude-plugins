// Catalogue de la documentation (Next.js / React) : une entrée par composant, tenue à jour par /import-ds.
// Source unique : les stories. Une story = un exemple du portail = un test (Storybook test-run), avec son code dessous.
// composeStories (portable stories de Storybook) rend chaque story utilisable hors de Storybook.
import type { ComponentType } from "react";
import { composeStories } from "@storybook/react";
import * as ButtonStories from "@/components/ui/Button.stories";
import * as BadgeStories from "@/components/ui/Badge.stories";
import { storyCode } from "./jsx";

export type Example = { name: string; Render: ComponentType; code: string };
export type Entry = { id: string; title: string; group: string; ds?: string; files: string[]; hooks?: string[]; page?: string; examples: Example[] };

type Composed = ComponentType & { storyName?: string; args?: Record<string, unknown>; parameters?: { docs?: { source?: { code?: string } } } };
const toExamples = (title: string, mod: Record<string, unknown>): Example[] =>
  Object.entries(composeStories(mod as never) as unknown as Record<string, Composed>)
    .map(([name, S]) => ({ name: S.storyName ?? name, Render: S, code: storyCode(title, S) }));

export const groups = ["Fondations", "Navigation", "Actions & formulaires", "Produit", "Listes & catalogue", "Couches (drawers)"];

export const components: Entry[] = [
  { id: "badge", title: "Badge", group: "Fondations", ds: "Badge", files: ["src/components/ui/Badge.tsx", "Badge.module.scss", "Badge.stories.tsx"], examples: toExamples("Badge", BadgeStories) },
  { id: "button", title: "Button", group: "Actions & formulaires", ds: "Button", files: ["src/components/ui/Button.tsx", "Button.module.scss", "Button.stories.tsx"], examples: toExamples("Button", ButtonStories) },
];
