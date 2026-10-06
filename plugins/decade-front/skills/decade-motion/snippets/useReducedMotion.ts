"use client";
// Mouvement Decade — hook Next.js. État initial « mouvement » (false) côté serveur, synchronisé au montage.
import { useEffect, useState } from "react";
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(q.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    q.addEventListener("change", onChange);
    return () => q.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
