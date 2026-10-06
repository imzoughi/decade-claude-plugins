// Mouvement Decade — suit le réglage « réduire les animations » en direct.
const query = window.matchMedia("(prefers-reduced-motion: reduce)");
export function prefersReducedMotion() { return query.matches; }
export function onReducedMotionChange(callback) {
  const handler = (e) => callback(e.matches);
  query.addEventListener("change", handler);
  return () => query.removeEventListener("change", handler);
}
// Exemple : carrousel auto (niveau 1) — pas de défilement automatique en mode réduit, bouton pause toujours présent.
