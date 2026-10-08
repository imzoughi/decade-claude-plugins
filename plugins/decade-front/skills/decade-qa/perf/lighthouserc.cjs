// Lighthouse CI — seuils lus dans decade.config.json (performance.*). Copié à la racine du projet par /build-front.
// Outil : @lhci/cli, installé dans les devDependencies du projet (npm run perf = lhci autorun). Rapports gardés en local.
const fs = require("fs");
const cfg = require("./decade.config.json");
const p = cfg.performance || {};
const level = p.bloquant ? "error" : "warn";
const stack = cfg.stack;

// Next.js en export statique (output: "export", ex. GitHub Pages) : `next start` ne marche pas, on sert out/ en local.
const nextConfig = ["next.config.ts", "next.config.mjs", "next.config.js"].map((f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "")).join("\n");
const nextExport = stack === "nextjs" && /output\s*:\s*["'`]export["'`]/.test(nextConfig);

// Chemins mesurés : performance.urls s’il est rempli (ex. ["/", "/panier"]), sinon un chemin par page de la config.
const paths = Array.isArray(p.urls) && p.urls.length ? p.urls : (cfg.pages || []).map((slug) => (stack === "html" ? `/${slug}.html` : `/${slug}`));

let collect;
if (stack === "html") collect = { staticDistDir: "./dist", url: paths };
else if (nextExport) collect = { startServerCommand: "node scripts/serve-static.mjs out 3000", startServerReadyPattern: "prêt", url: paths.map((u) => "http://localhost:3000" + u) };
else if (stack === "nextjs") collect = { startServerCommand: "npm run start", url: paths.map((u) => "http://localhost:3000" + u) };
else collect = { startServerCommand: "npm run preview", url: paths.map((u) => "http://localhost:4173" + u) };

module.exports = {
  ci: {
    collect: { numberOfRuns: 3, settings: { preset: "desktop" }, ...collect },
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
    upload: { target: "filesystem", outputDir: "./qa/lighthouse" }, // jamais « temporary-public-storage »
  },
};
