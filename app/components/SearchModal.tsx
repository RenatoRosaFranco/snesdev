"use client";

import { useEffect, useRef, useState } from "react";

// ─── searchable index ─────────────────────────────────────────────────────────

type Result = { type: string; label: string; href: string };

const INDEX: Result[] = [
  { type: "Seção",    label: "Trilha de aprendizado",       href: "#roadmap" },
  { type: "Seção",    label: "Arquitetura do SNES",         href: "#arquitetura" },
  { type: "Seção",    label: "Game Jams",                   href: "#jams" },
  { type: "Seção",    label: "Projetos da comunidade",      href: "#projetos" },
  { type: "Seção",    label: "Comunidade",                  href: "#comunidade" },
  { type: "Tutorial", label: "Fundamentos de hardware",     href: "#roadmap" },
  { type: "Tutorial", label: "Ambiente de desenvolvimento", href: "#roadmap" },
  { type: "Tutorial", label: "Seu primeiro ROM",            href: "#roadmap" },
  { type: "Tutorial", label: "Gráficos: tiles e sprites",   href: "#roadmap" },
  { type: "Tutorial", label: "Input e gameplay",            href: "#roadmap" },
  { type: "Tutorial", label: "Áudio com o SPC700",          href: "#roadmap" },
  { type: "Tutorial", label: "Técnicas avançadas",          href: "#roadmap" },
  { type: "Tutorial", label: "Publicar seu jogo",           href: "#roadmap" },
  { type: "Hardware", label: "CPU 5A22 / 65816",            href: "#arquitetura" },
  { type: "Hardware", label: "PPU — Gráficos",              href: "#arquitetura" },
  { type: "Hardware", label: "SPC700 — Áudio",              href: "#arquitetura" },
  { type: "Hardware", label: "DMA / HDMA",                  href: "#arquitetura" },
  { type: "Jam",      label: "SNESJam 2026",                href: "#jams" },
  { type: "Jam",      label: "1KRom Challenge",             href: "#jams" },
  { type: "Jam",      label: "SNES Pixel Jam",              href: "#jams" },
  { type: "ROM",      label: "Mata Atlântica Quest",        href: "#projetos" },
  { type: "ROM",      label: "Abismo Gelado",               href: "#projetos" },
  { type: "ROM",      label: "Sombras de Pedra",            href: "#projetos" },
  { type: "ROM",      label: "Turbo Veredas",               href: "#projetos" },
];

const TYPE_COLOR: Record<string, string> = {
  Seção:    "#6b6b6b",
  Tutorial: "#e4000f",
  Hardware: "#c084fc",
  Jam:      "#fcd34d",
  ROM:      "#86efac",
};

// ─── component ────────────────────────────────────────────────────────────────

export function SearchModal() {
  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState("");
  const [active,  setActive]  = useState(0);
  const inputRef  = useRef<HTMLInputElement>(null);

  const results = query.trim().length === 0
    ? INDEX.slice(0, 8)
    : INDEX.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.type.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);

  // Open with Ctrl/Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keyboard navigation inside modal
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === "Enter" && results[active]) navigate(results[active]);
  };

  const navigate = (r: Result) => {
    setOpen(false);
    window.location.hash = r.href;
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "15vh",
      }}
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 560,
          background: "var(--color-background)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          overflow: "hidden",
          margin: "0 16px",
        }}
        onKeyDown={handleKey}
      >
        {/* input */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px", borderBottom: "1px solid var(--color-border)",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--color-muted)" }}>⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            placeholder="Buscar documentação..."
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontFamily: "var(--font-sans)", fontSize: 14,
              color: "var(--color-foreground)",
            }}
          />
          <kbd style={{
            fontFamily: "var(--font-mono)", fontSize: 10,
            background: "var(--color-surface)", border: "1px solid var(--color-border)",
            color: "var(--color-muted)", padding: "2px 6px", borderRadius: 3,
          }}>esc</kbd>
        </div>

        {/* results */}
        <div style={{ maxHeight: 360, overflowY: "auto" }}>
          {results.length === 0 ? (
            <p style={{
              padding: "24px 16px", textAlign: "center",
              fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-muted)",
            }}>Nenhum resultado para &ldquo;{query}&rdquo;</p>
          ) : (
            results.map((r, i) => (
              <button key={i} onClick={() => navigate(r)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 16px", background: i === active ? "var(--color-surface)" : "transparent",
                  border: "none", cursor: "pointer", textAlign: "left",
                  borderLeft: i === active ? `3px solid ${TYPE_COLOR[r.type] ?? "#e4000f"}` : "3px solid transparent",
                }}
                onMouseEnter={() => setActive(i)}
              >
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: TYPE_COLOR[r.type] ?? "var(--color-muted)",
                  minWidth: 56,
                }}>{r.type}</span>
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: 13,
                  color: "var(--color-foreground)",
                }}>{r.label}</span>
              </button>
            ))
          )}
        </div>

        {/* footer */}
        <div style={{
          padding: "8px 16px", borderTop: "1px solid var(--color-border)",
          display: "flex", gap: 12,
          fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-muted)",
        }}>
          <span>↑↓ navegar</span>
          <span>↵ selecionar</span>
          <span>esc fechar</span>
        </div>
      </div>
    </div>
  );
}
