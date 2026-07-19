"use client";

import { useEffect, useRef, useState } from "react";

type Crumb = { label: string; href: string; current?: boolean };

const SECTIONS: { id: string; crumbs: Crumb[] }[] = [
  {
    id: "hero",
    crumbs: [
      { label: "SNESDev", href: "/" },
      { label: "início", href: "#hero", current: true },
    ],
  },
  {
    id: "sobre",
    crumbs: [
      { label: "SNESDev", href: "/" },
      { label: "sobre", href: "#sobre" },
      { label: "o-que-é", href: "#sobre", current: true },
    ],
  },
  {
    id: "missao",
    crumbs: [
      { label: "SNESDev", href: "/" },
      { label: "sobre", href: "#sobre" },
      { label: "missão", href: "#missao", current: true },
    ],
  },
  {
    id: "para-quem",
    crumbs: [
      { label: "SNESDev", href: "/" },
      { label: "sobre", href: "#sobre" },
      { label: "para-quem-é", href: "#para-quem", current: true },
    ],
  },
  {
    id: "docs",
    crumbs: [
      { label: "SNESDev", href: "/" },
      { label: "docs", href: "#docs" },
      { label: "primeiros-passos", href: "#docs" },
      { label: "seu-primeiro-rom", href: "#docs", current: true },
    ],
  },
  {
    id: "roadmap",
    crumbs: [
      { label: "SNESDev", href: "/" },
      { label: "docs", href: "#docs" },
      { label: "trilha-de-aprendizado", href: "#roadmap", current: true },
    ],
  },
  {
    id: "jams",
    crumbs: [
      { label: "SNESDev", href: "/" },
      { label: "comunidade", href: "#comunidade" },
      { label: "game-jams", href: "#jams", current: true },
    ],
  },
  {
    id: "comunidade",
    crumbs: [
      { label: "SNESDev", href: "/" },
      { label: "comunidade", href: "#comunidade" },
      { label: "discord", href: "#comunidade", current: true },
    ],
  },
];

export function Breadcrumb() {
  const [activeId, setActiveId] = useState("hero");
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      const midY = window.innerHeight * 0.4;
      let bestId = SECTIONS[0].id;
      let bestDist = Infinity;

      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - midY);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = id;
        }
      });

      setActiveId(bestId);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const active = SECTIONS.find((s) => s.id === activeId) ?? SECTIONS[0];

  return (
    <div style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <ol
          key={activeId}
          className="breadcrumb-path flex items-center h-8 gap-0"
          style={{ listStyle: "none", margin: 0, padding: 0 }}
          aria-label="Localização atual"
        >
          {active.crumbs.map((crumb, i) => (
            <li key={i} className="flex items-center">
              {i > 0 && (
                <span
                  className="font-mono text-[11px] px-1.5 select-none"
                  style={{ color: "var(--color-border)" }}
                >
                  /
                </span>
              )}
              {crumb.current ? (
                <span
                  className="font-mono text-[11px] font-semibold"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {crumb.label}
                </span>
              ) : (
                <a
                  href={crumb.href}
                  className="font-mono text-[11px] transition-colors hover:text-[var(--color-foreground)]"
                  style={{ color: "var(--color-muted)" }}
                >
                  {crumb.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
