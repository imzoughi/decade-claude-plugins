"use client";
// Bouton « Copier » des blocs de code (seul morceau interactif d’un bloc de code).
import { useState } from "react";

export function CopyButton({ code, label }: { code: string; label: string }) {
  const [done, setDone] = useState(false);
  const copy = () => navigator.clipboard.writeText(code).then(() => { setDone(true); setTimeout(() => setDone(false), 1500); }).catch(() => {});
  return (
    <button type="button" className="doc-copy" onClick={copy} aria-label={done ? "Copié" : `Copier : ${label}`}>
      {done ? "Copié" : "Copier"}
    </button>
  );
}
