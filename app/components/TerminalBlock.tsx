"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─── configs ──────────────────────────────────────────────────────────────────

type TermLang = "asm" | "sh";

interface TermConfig {
  id: string;
  filename: string;
  lang: TermLang;
  startDelay: number;
  code: string;
  showLineNums?: boolean;
  showStatus?: boolean;
}

const CONFIGS: TermConfig[] = [
  {
    id: "code",
    filename: "src/main.asm",
    lang: "asm",
    startDelay: 400,
    showLineNums: true,
    showStatus: true,
    code:
`Reset:
  sei       ; desativa IRQ
  clc
  xce       ; modo nativo

  lda #$0F
  sta $2100 ; PPU on`,
  },
  {
    id: "build",
    filename: "~/super-plataforma",
    lang: "sh",
    startDelay: 3200,
    code:
`$ make build
Pass 1/2...  OK
Pass 2/2...  OK
✓ build OK em 0.04s

$ mesen-s rom.sfc
✓ ROM ativa — 60 FPS
$`,
  },
];

// ─── colors ───────────────────────────────────────────────────────────────────

const C = {
  dir:   "#7dd3fc",
  lbl:   "#fcd34d",
  op:    "#c084fc",
  val:   "#86efac",
  cmt:   "#6b7280",
  sep:   "#333",
  dim:   "#abb2bf",
  bright:"#e2e8f0",
  red:   "#e4000f",
  err:   "#f87171",
};

// ─── tokenizers ───────────────────────────────────────────────────────────────

type Tok = { s: string; c?: string; italic?: boolean };

function tokenizeASM(line: string): Tok[] {
  const lead = line.match(/^(\s*)/)?.[1] ?? "";
  const body = line.slice(lead.length);
  if (!body) return [{ s: "" }];
  const si = body.indexOf(";");
  const code = si >= 0 ? body.slice(0, si) : body;
  const cmt  = si >= 0 ? body.slice(si)    : "";
  const clean = code.trimEnd();
  const trail = code.slice(clean.length);
  const cmtToks: Tok[] = cmt ? [{ s: trail + cmt, c: C.cmt, italic: true }] : trail ? [{ s: trail }] : [];
  if (!clean) return cmt ? [{ s: lead }, { s: cmt, c: C.cmt, italic: true }] : [{ s: "" }];
  if (clean.endsWith(":")) return [{ s: lead }, { s: clean, c: C.lbl }, ...cmtToks];
  const sp = clean.search(/\s/);
  if (sp < 0) return [{ s: lead }, { s: clean, c: C.op }, ...cmtToks];
  const mnem = clean.slice(0, sp), aft = clean.slice(sp), spc = aft.match(/^(\s+)/)?.[1] ?? "";
  return [{ s: lead }, { s: mnem, c: C.op }, { s: spc }, { s: aft.slice(spc.length), c: C.val }, ...cmtToks];
}

function tokenizeSH(line: string): Tok[] {
  if (!line) return [{ s: "" }];
  if (line === "$") return [{ s: "$", c: C.red }];
  if (line.startsWith("$ ")) return [{ s: "$ ", c: C.red }, { s: line.slice(2), c: C.bright }];
  if (line.startsWith("✓")) return [{ s: line, c: C.val }];
  if (line.startsWith("✗")) return [{ s: line, c: C.err }];
  const kv = line.match(/^(\w[\w ]*?:\s{2,})(.+)$/);
  if (kv) return [{ s: kv[1], c: C.dir }, { s: kv[2], c: C.dim }];
  const ok = line.match(/^(.+?\s{2,})(OK|FAIL)$/);
  if (ok) return [{ s: ok[1], c: C.dim }, { s: ok[2], c: ok[2] === "OK" ? C.val : C.err }];
  return [{ s: line, c: C.dim }];
}

function tokenize(line: string, lang: TermLang): Tok[] {
  return lang === "asm" ? tokenizeASM(line) : tokenizeSH(line);
}

// ─── code area ────────────────────────────────────────────────────────────────

const LH = "1.5rem";
const FS = 11;

function CodeArea({ code, lang, lineNums, cursor, totalLines }: {
  code: string; lang: TermLang; lineNums: boolean; cursor: boolean; totalLines: number;
}) {
  const lines = code.split("\n");
  return (
    <div style={{ display: "flex", flex: 1, background: "#191919", overflow: "hidden", minHeight: 0 }}>
      {lineNums && (
        <div aria-hidden="true" style={{
          background: "#191919", color: "#3a3a3a",
          fontFamily: "var(--font-mono)", fontSize: FS,
          lineHeight: LH, padding: "10px 8px 10px 10px",
          textAlign: "right", minWidth: 30,
          borderRight: "1px solid #222",
          userSelect: "none", flexShrink: 0,
        }}>
          {Array.from({ length: totalLines }, (_, i) => (
            <div key={i} style={{ color: i < lines.length ? "#3a3a3a" : "transparent" }}>{i + 1}</div>
          ))}
        </div>
      )}
      <pre style={{
        flex: 1, margin: 0, padding: "10px 14px",
        fontSize: FS, lineHeight: LH,
        fontFamily: "var(--font-mono)", background: "transparent",
        color: C.dim, overflow: "hidden",
      }}>
        {Array.from({ length: totalLines }, (_, i) => {
          const line = lines[i] ?? "";
          const toks = tokenize(line, lang);
          const isLast = i === lines.length - 1;
          return (
            <span key={i} style={{ display: "block", minHeight: LH }}>
              {i < lines.length && (
                <>
                  {toks.map((t, j) => (
                    <span key={j} style={{ color: t.c ?? C.dim, fontStyle: t.italic ? "italic" : undefined }}>
                      {t.s}
                    </span>
                  ))}
                  {cursor && isLast && (
                    <span className="asm-cursor" style={{
                      display: "inline-block", width: 2, height: "0.82em",
                      background: lang === "asm" ? C.op : C.red,
                      verticalAlign: "text-bottom", marginLeft: 1,
                    }} />
                  )}
                </>
              )}
            </span>
          );
        })}
      </pre>
    </div>
  );
}

// ─── single terminal ──────────────────────────────────────────────────────────

function TypingTerminal({ config, inView, skip }: {
  config: TermConfig; inView: boolean; skip: boolean;
}) {
  const posRef   = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [chars, setChars] = useState(0);
  const [done, setDone]   = useState(false);
  const [loopKey, setLoopKey] = useState(0);
  const totalLines = config.code.split("\n").length;

  const finish = useCallback(() => {
    clearTimeout(timerRef.current);
    posRef.current = config.code.length;
    setChars(config.code.length);
    setDone(true);
  }, [config.code.length]);

  useEffect(() => {
    if (!inView || done) return;
    const delay = loopKey === 0 ? config.startDelay : 800;
    const outer = setTimeout(() => {
      const type = () => {
        if (posRef.current >= config.code.length) { setDone(true); return; }
        posRef.current++;
        setChars(posRef.current);
        const ch = config.code[posRef.current - 1];
        const d = ch === "\n" ? 120 + Math.random() * 160 : 22 + Math.random() * 34;
        timerRef.current = setTimeout(type, d);
      };
      type();
    }, delay);
    return () => { clearTimeout(outer); clearTimeout(timerRef.current); };
  }, [inView, done, config.code, config.startDelay, loopKey]);

  useEffect(() => {
    if (!done || skip) return;
    const t = setTimeout(() => {
      posRef.current = 0;
      setChars(0);
      setDone(false);
      setLoopKey((k) => k + 1);
    }, 3000);
    return () => clearTimeout(t);
  }, [done, skip]);

  useEffect(() => { if (skip && !done) finish(); }, [skip, done, finish]);

  const displayCode = done ? config.code : config.code.slice(0, chars);

  return (
    <div
      onClick={() => { if (!done) finish(); }}
      style={{
        borderRadius: 10, overflow: "hidden",
        display: "flex", flexDirection: "column", flex: 1,
        boxShadow: "0 20px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.05)",
        cursor: done ? "default" : "pointer",
      }}
    >
      {/* title bar */}
      <div style={{
        background: "linear-gradient(180deg, #3d3d3d 0%, #323232 100%)",
        height: 36, display: "flex", alignItems: "center",
        padding: "0 12px", flexShrink: 0,
        borderBottom: "1px solid #1a1a1a",
      }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57", display: "inline-block", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.18)" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e", display: "inline-block", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.18)" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840", display: "inline-block", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.18)" }} />
        </div>
        <div style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 10, color: "#6a6a6a", fontWeight: 500 }}>
          {config.filename}
        </div>
      </div>

      {/* code */}
      <CodeArea
        code={displayCode}
        lang={config.lang}
        lineNums={config.showLineNums ?? false}
        cursor={true}
        totalLines={totalLines}
      />

      {/* status bar (ASM only) */}
      {config.showStatus && (
        <div style={{
          background: "#e4000f", height: 16, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 10px", flexShrink: 0,
          fontFamily: "var(--font-mono)", fontSize: 9, color: "#fff", letterSpacing: "0.04em",
        }}>
          <span>⊙ 65816 Assembly</span>
          <span>Ln {totalLines}</span>
        </div>
      )}
    </div>
  );
}

// ─── showcase ─────────────────────────────────────────────────────────────────

export function TerminalShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "stretch", height: 230 }}>
        <TypingTerminal config={CONFIGS[0]} inView={inView} skip={skip} />
        <TypingTerminal config={CONFIGS[1]} inView={inView} skip={skip} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {inView && !skip && (
          <button onClick={() => setSkip(true)} style={{
            fontFamily: "var(--font-mono)", fontSize: 10,
            color: "var(--color-muted)", background: "none", border: "none",
            cursor: "pointer", padding: 0,
            textDecoration: "underline", textDecorationStyle: "dotted",
          }}>
            pular animação →
          </button>
        )}
      </div>
    </div>
  );
}
