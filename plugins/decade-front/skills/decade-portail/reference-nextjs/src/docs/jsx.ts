// Code d’un exemple : `parameters.docs.source.code` de la story s’il existe, sinon JSX reconstruit depuis ses args.
type Arg = unknown;
const attr = (k: string, v: Arg): string | null => {
  if (v === undefined || v === null || v === false) return null;
  if (v === true) return k;
  if (typeof v === "string") return `${k}="${v.replace(/"/g, "&quot;")}"`;
  if (typeof v === "function") return `${k}={() => {}}`;
  return `${k}={${JSON.stringify(v)}}`;
};
export function storyCode(title: string, story: { args?: Record<string, Arg>; parameters?: { docs?: { source?: { code?: string } } } }): string {
  const given = story.parameters?.docs?.source?.code;
  if (given) return given.trim();
  const { children, ...rest } = story.args ?? {};
  const props = Object.entries(rest).map(([k, v]) => attr(k, v)).filter(Boolean) as string[];
  const open = props.length > 2 ? `<${title}\n  ${props.join("\n  ")}\n` : `<${title}${props.length ? " " + props.join(" ") : ""}`;
  return typeof children === "string" ? `${open}>${children}</${title}>` : `${open}${props.length > 2 ? "" : " "}/>`;
}
