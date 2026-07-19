"use client";

import { useEffect, useState } from "react";

// ─── data ─────────────────────────────────────────────────────────────────────

type Token = { text: string; fill: string; italic?: boolean };

function makeLine(y: number, tokens: Token[]) {
  return { y, fullText: tokens.map((t) => t.text).join(""), tokens };
}
function makeBuild(segs: Token[]) {
  return { fullText: segs.map((s) => s.text).join(""), segs };
}

const CODE_LINES = [
  makeLine(56,  [{ text: "Reset:", fill: "#fcd34d" }]),
  makeLine(73,  [{ text: "  sei",  fill: "#c084fc" }]),
  makeLine(90,  [{ text: "  clc",  fill: "#c084fc" }]),
  makeLine(107, [{ text: "  xce",  fill: "#c084fc" }, { text: "    ; modo nativo", fill: "#6b7280", italic: true }]),
  makeLine(124, []),                                                              // blank
  makeLine(141, [{ text: "  lda",  fill: "#c084fc" }, { text: " #$8F",    fill: "#86efac" }]),
  makeLine(158, [{ text: "  sta",  fill: "#c084fc" }, { text: " INIDISP", fill: "#86efac" }]),
];

const BUILD_LINES = [
  makeBuild([{ text: "$ ", fill: "#e4000f" }, { text: "asar main.asm game.sfc", fill: "#e2e8f0" }]),
  makeBuild([{ text: "Pass 1/2...  ", fill: "#abb2bf" }, { text: "OK", fill: "#86efac" }]),
  makeBuild([{ text: "Pass 2/2...  ", fill: "#abb2bf" }, { text: "OK", fill: "#86efac" }]),
  makeBuild([{ text: "✓ Done em 0.04s", fill: "#86efac" }]),
  makeBuild([]),                                                                  // blank
  makeBuild([{ text: "$ ", fill: "#e4000f" }, { text: "bsnes game.sfc", fill: "#e2e8f0" }]),
  makeBuild([{ text: "✓ ROM ativa — 60 FPS", fill: "#86efac" }]),
];

const CHAR_W = 6; // px per char in monospace fontSize=10

// ─── helpers ──────────────────────────────────────────────────────────────────

function renderPartial(tokens: Token[], y: number, x0: number, charCount: number) {
  const nodes: React.ReactNode[] = [];
  let rem = charCount;
  let first = true;
  for (const tok of tokens) {
    if (rem <= 0) break;
    const shown = rem >= tok.text.length ? tok.text : tok.text.slice(0, rem);
    rem -= tok.text.length;
    nodes.push(
      <tspan key={nodes.length}
        x={first ? x0      : undefined}
        y={first ? y       : undefined}
        fill={tok.fill}
        fontStyle={tok.italic ? "italic" : undefined}>
        {shown}
      </tspan>
    );
    first = false;
  }
  return nodes;
}

// ─── component ────────────────────────────────────────────────────────────────

export function CRTMonitor() {
  const [phase,      setPhase]      = useState<"code" | "build">("code");
  const [codeLine,   setCodeLine]   = useState(0);
  const [codeChars,  setCodeChars]  = useState(0);
  const [buildLine,  setBuildLine]  = useState(0);
  const [buildChars, setBuildChars] = useState(0);

  // ─ code phase ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "code") return;
    const line = CODE_LINES[codeLine];
    if (!line) {
      // All code typed — pause then switch to build
      const t = setTimeout(() => { setPhase("build"); setBuildLine(0); setBuildChars(0); }, 2200);
      return () => clearTimeout(t);
    }
    if (codeChars < line.fullText.length) {
      const ch = line.fullText[codeChars];
      const delay = codeLine === 0 && codeChars === 0 ? 900
        : ch === " " ? 22 : 60;
      const t = setTimeout(() => setCodeChars((c) => c + 1), delay);
      return () => clearTimeout(t);
    } else {
      // Line done — advance
      const pause = line.fullText.length === 0 ? 380 : 170;
      const t = setTimeout(() => { setCodeLine((l) => l + 1); setCodeChars(0); }, pause);
      return () => clearTimeout(t);
    }
  }, [phase, codeLine, codeChars]);

  // ─ build phase ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "build") return;
    const line = BUILD_LINES[buildLine];
    if (!line) {
      // All build lines done — pause then restart code
      const t = setTimeout(() => { setPhase("code"); setCodeLine(0); setCodeChars(0); }, 2500);
      return () => clearTimeout(t);
    }
    if (buildChars < line.fullText.length) {
      const ch = line.fullText[buildChars];
      const delay = ch === " " ? 14 : 38;
      const t = setTimeout(() => setBuildChars((c) => c + 1), delay);
      return () => clearTimeout(t);
    } else {
      const pause = line.fullText.length === 0 ? 280
        : line.fullText.startsWith("✓") ? 700 : 110;
      const t = setTimeout(() => { setBuildLine((l) => l + 1); setBuildChars(0); }, pause);
      return () => clearTimeout(t);
    }
  }, [phase, buildLine, buildChars]);

  const isCode   = phase === "code";
  const filename = isCode ? "src/main.asm" : "~/super-plataforma";

  // cursor position
  const activeLine  = isCode ? CODE_LINES[codeLine]  : BUILD_LINES[buildLine];
  const activeChars = isCode ? codeChars              : buildChars;
  const lineText    = activeLine?.fullText.slice(0, activeChars) ?? "";
  const curX = isCode ? 54 + lineText.length * CHAR_W : 30 + lineText.length * CHAR_W;
  const curY = isCode
    ? (CODE_LINES[codeLine]?.y ?? CODE_LINES[CODE_LINES.length - 1].y) - 10
    : 56 + buildLine * 17 - 10;
  const curColor = isCode ? "#c084fc" : "#e4000f";

  return (
    <svg viewBox="0 0 280 230" fill="none" xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true" style={{ width: "100%", maxWidth: 280 }}>

      {/* shell */}
      <rect x="4"  y="4"  width="272" height="192" rx="14" fill="#c8c4bc" />
      <rect x="4"  y="4"  width="272" height="192" rx="14" stroke="#a8a49c" strokeWidth="1.5" />
      <rect x="18" y="16" width="244" height="164" rx="8"  fill="#1c1c1c" />
      <rect x="24" y="22" width="232" height="152" rx="2"  fill="#191919" />

      {/* title bar */}
      <rect x="24" y="22" width="232" height="18" fill="#2d2d2d" />
      <circle cx="36" cy="31" r="4" fill="#ff5f57" />
      <circle cx="48" cy="31" r="4" fill="#febc2e" />
      <circle cx="60" cy="31" r="4" fill="#28c840" />
      <text x="140" y="35" fontFamily="monospace" fontSize="9" fill="#666666" textAnchor="middle">
        {filename}
      </text>

      {isCode ? (
        <>
          {/* gutter */}
          <rect x="24" y="40" width="24" height="120" fill="#141414" />
          <line x1="48" y1="40" x2="48" y2="160" stroke="#222222" strokeWidth="1" />
          {CODE_LINES.map((l, i) => (
            <text key={i} x="44" y={l.y} fontFamily="monospace" fontSize="9" fill="#3a3a3a" textAnchor="end">
              {i + 1}
            </text>
          ))}
          {/* code with character-by-character reveal */}
          {CODE_LINES.map((line, i) => {
            if (i > codeLine) return null;
            const chars = i === codeLine ? codeChars : line.fullText.length;
            if (chars === 0 || line.tokens.length === 0) return null;
            return (
              <text key={i} fontFamily="monospace" fontSize="10">
                {renderPartial(line.tokens, line.y, 54, chars)}
              </text>
            );
          })}
          {/* status bar appears after all code is typed */}
          {codeLine >= CODE_LINES.length && (
            <>
              <rect x="24" y="160" width="232" height="14" fill="#e4000f" />
              <text x="30"  y="170" fontFamily="monospace" fontSize="8" fill="white">⊙ 65816 Assembly</text>
              <text x="252" y="170" fontFamily="monospace" fontSize="8" fill="white" textAnchor="end">Ln 7</text>
            </>
          )}
        </>
      ) : (
        <>
          {/* build output with character-by-character reveal */}
          {BUILD_LINES.map((bline, i) => {
            if (i > buildLine) return null;
            const chars = i === buildLine ? buildChars : bline.fullText.length;
            if (chars === 0 || bline.segs.length === 0) return null;
            return (
              <text key={i} fontFamily="monospace" fontSize="10">
                {renderPartial(bline.segs, 56 + i * 17, 30, chars)}
              </text>
            );
          })}
        </>
      )}

      {/* blinking cursor */}
      <rect className="asm-cursor" x={curX} y={curY} width="6" height="12" fill={curColor} />

      {/* hardware controls */}
      <rect x="100" y="188" width="80" height="6" rx="2" fill="#a8a49c" />
      <circle cx="248" cy="191" r="4" fill="#1c1c1c" />
      <circle cx="260" cy="191" r="3" fill="#908c84" />
      <rect x="118" y="196" width="44" height="18" rx="3" fill="#b8b4ac" />
      <rect x="94"  y="212" width="92" height="10" rx="4" fill="#a8a49c" />
    </svg>
  );
}
