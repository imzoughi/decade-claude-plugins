// Lighthouse CI Decade — seuils lus dans decade.config.json (performance.*). Copié à la racine du projet par /build-front.
const cfg = require("./decade.config.json");
const p = cfg.performance || {};
const level = p.bloquant ? "error" : "warn";
const stack = cfg.stack;
const pages = (cfg.pages || []).map((slug) => (stack === "html" ? `/${slug}.html` : `/${slug}`));
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      ...(stack === "html"
        ? { staticDistDir: "./dist", url: pages }
        : { startServerCommand: stack === "nextjs" ? "npm run start" : "npm run preview", url: pages.map((u) => "http://localhost:" + (stack === "nextjs" ? 3000 : 4173) + u) }),
      settings: { preset: "desktop" },
    },
    assert: {
      assertions: {
        "categories:performance": [level, { minScore: (p.scoreMin ?? 85) / 100 }],
        "largest-contentful-paint": [level, { maxNumericValue: p.lcpMs ?? 2500 }],
        "cumulative-layout-shift": [level, { maxNumericValue: p.cls ?? 0.1 }],
        "total-blocking-time": [level, { maxNumericValue: p.tbtMs ?? 300 }],
        "resource-summary:script:size": [level, { maxNumericValue: (p.jsKo ?? 300) * 1024 }],
        "resource-summary:image:size": [level, { maxNumericValue: (p.imagesKo ?? 200) * 1024 }],
      },
    },
    upload: { target: "filesystem", outputDir: "./qa/lighthouse" },
  },
};
