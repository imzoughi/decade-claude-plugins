// Decade : joue chaque story Storybook comme un test (rendu, fonction play, accessibilité axe, débordement),
// en clair et en sombre, à la plus petite et à la plus grande largeur de decade.config.json.
// Copié par /build-front dans tests/. Ne pas modifier dans le projet : les règles viennent du plugin.
//
//   npm run test:stories                    toutes les stories
//   npm run test:stories -- -g "Drawer"     les stories d'un composant (filtre sur le titre)
//
// Storybook doit tourner (npm run storybook). Sinon le test échoue tout de suite avec « STORYBOOK INJOIGNABLE » :
// le contrôleur QA rend alors le verdict BLOQUÉ, jamais VERT.
import { test, expect, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

test.describe.configure({ mode: 'parallel' });

const SB = process.env.STORYBOOK_URL ?? 'http://localhost:6006';

type Entry = { id: string; title: string; name: string; type: string; tags?: string[] };

function config(): { breakpoints?: number[] } {
  try {
    return JSON.parse(readFileSync('decade.config.json', 'utf8'));
  } catch {
    return {};
  }
}

function storyIndex(): { entries: Entry[] } | null {
  // Lecture synchrone : Playwright doit connaître la liste des tests avant de les lancer.
  const script = `fetch(${JSON.stringify(SB + '/index.json')}).then(r => r.ok ? r.text() : Promise.reject(r.status)).then(t => process.stdout.write(t), () => process.exit(2))`;
  try {
    return JSON.parse(execFileSync(process.execPath, ['-e', script], { encoding: 'utf8', timeout: 15000 }));
  } catch {
    return null;
  }
}

const bp = (config().breakpoints ?? [375, 1280]).slice().sort((a, b) => a - b);
const LARGEURS = [...new Set([bp[0], bp[bp.length - 1]])];
const THEMES = ['light', 'dark'];
const index = storyIndex();

if (!index) {
  test('STORYBOOK INJOIGNABLE', () => {
    throw new Error(`Storybook ne répond pas sur ${SB}. Lance « npm run storybook » et laisse-le ouvert, puis relance. Verdict : BLOQUÉ.`);
  });
} else {
  const stories = Object.values(index.entries).filter((e) => e.type === 'story' && !(e.tags ?? []).includes('skip-test'));
  for (const s of stories) {
    for (const largeur of LARGEURS) {
      for (const theme of THEMES) {
        test(`${s.title} › ${s.name} · ${largeur} · ${theme}`, async ({ page }) => {
          const r = await jouer(page, s.id, largeur, theme);
          expect(r.problemes, r.problemes.join('\n')).toEqual([]);
        });
      }
    }
  }
}

async function jouer(page: Page, id: string, largeur: number, theme: string) {
  const problemes: string[] = [];
  page.on('pageerror', (e) => problemes.push(`erreur JavaScript : ${e.message}`));
  await page.setViewportSize({ width: largeur, height: 900 });
  await page.addInitScript(() => {
    const w = window as unknown as Record<string, unknown> & { __decade: { evenements: [string, unknown][] } };
    w.__decade = { evenements: [] };
    let canal: { emit: (n: string, ...a: unknown[]) => unknown } | undefined;
    Object.defineProperty(w, '__STORYBOOK_ADDONS_CHANNEL__', {
      configurable: true,
      get: () => canal,
      set: (v) => {
        canal = v;
        const emit = v.emit.bind(v);
        v.emit = (nom: string, ...args: unknown[]) => {
          if (/^(playFunctionThrewException|storyThrewException|storyErrored|storyMissing|storyFinished)$/.test(nom)) w.__decade.evenements.push([nom, args[0]]);
          return emit(nom, ...args);
        };
      },
    });
  });
  await page.goto(`${SB}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story&globals=theme:${theme}`);
  const fini = await page
    .waitForFunction(() => (window as any).__decade?.evenements.some((e: [string]) => e[0] === 'storyFinished'), null, { timeout: 30000 })
    .then(() => true, () => false);
  const evenements: [string, any][] = await page.evaluate(() => (window as any).__decade?.evenements ?? []);
  if (!fini) problemes.push('la story ne s’est pas terminée en 30 s (rendu bloqué ou fonction play qui attend)');
  for (const [nom, d] of evenements) {
    if (nom === 'playFunctionThrewException') problemes.push(`fonction play en échec : ${d?.message ?? d}`);
    if (nom === 'storyThrewException' || nom === 'storyErrored') problemes.push(`rendu en échec : ${d?.message ?? d?.title ?? d}`);
    if (nom === 'storyMissing') problemes.push('story introuvable');
    if (nom === 'storyFinished') {
      for (const rep of d?.reporters ?? []) {
        if (rep?.type !== 'a11y') continue;
        for (const v of rep?.result?.violations ?? []) {
          if (v.impact === 'serious' || v.impact === 'critical') {
            problemes.push(`accessibilité (${v.impact}) : ${v.id} — ${v.help} (${v.nodes?.length ?? 0} élément(s))`);
          }
        }
      }
    }
  }
  const deborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (deborde > 1) problemes.push(`débordement horizontal de ${deborde} px à ${largeur} px`);
  return { problemes };
}
