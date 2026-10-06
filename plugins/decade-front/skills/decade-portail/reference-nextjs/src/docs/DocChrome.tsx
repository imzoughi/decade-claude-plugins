"use client";
// Barre du haut + navigation de la doc (kit Decade, même apparence que la doc HTML Intersport) :
// page courante (aria-current), filtre des composants, menu mobile, thème clair / sombre.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ExternalLink, LayoutGrid, Menu, SunMoon } from "lucide-react";

export type NavGroup = { title: string; items: { href: string; label: string }[] };

export function DocChrome({ brand, siteHref, nav, children }: { brand: string; siteHref: string; nav: NavGroup[]; children: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { try { const t = localStorage.getItem("doc-theme"); if (t) document.documentElement.dataset.theme = t; } catch {} }, []);
  const toggleTheme = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("doc-theme", next); } catch {}
  };
  const current = (href: string) => (path === href || path === `${href}/` ? "page" : undefined);
  const match = (label: string) => !q || label.toLowerCase().includes(q.toLowerCase());
  return (
    <div className="doc">
      <a className="skip-link" href="#doc-main">Aller au contenu</a>
      <header className="doc-top">
        <button type="button" className="doc-top__menu doc-iconbtn" aria-label="Menu de la documentation" aria-expanded={open} aria-controls="doc-nav" onClick={() => setOpen(!open)}><Menu size={22} aria-hidden /></button>
        <Link className="doc-top__brand" href="/docs"><strong>{brand}</strong><span>Front · Documentation</span></Link>
        <div className="doc-top__search"><input type="search" placeholder="Filtrer les composants…" aria-label="Filtrer la navigation" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="doc-top__actions">
          <Link className="doc-btn" href="/"><LayoutGrid size={16} aria-hidden />Toutes les pages</Link>
          <Link className="doc-btn doc-btn--primary" href={siteHref}><ExternalLink size={16} aria-hidden />Voir le site</Link>
          <button type="button" className="doc-iconbtn" aria-label="Basculer le thème clair / sombre" onClick={toggleTheme}><SunMoon size={20} aria-hidden /></button>
        </div>
      </header>
      <div className="doc-shell">
        <nav className={`doc-nav${open ? " is-open" : ""}`} aria-label="Documentation" id="doc-nav">
          {nav.map((g) => {
            const items = g.items.filter((i) => match(i.label));
            if (!items.length) return null;
            return (
              <div key={g.title}>
                <p className="doc-nav__title">{g.title}</p>
                <ul>{items.map((i) => <li key={i.href}><Link href={i.href} aria-current={current(i.href)}>{i.label}</Link></li>)}</ul>
              </div>
            );
          })}
        </nav>
        <main className="doc-main" id="doc-main" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}
