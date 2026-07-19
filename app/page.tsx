import type { ReactNode } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { Breadcrumb } from "./components/Breadcrumb";
import { TerminalShowcase } from "./components/TerminalBlock";
import { AnimatedSection } from "./components/AnimatedSection";

// ─── icons ────────────────────────────────────────────────────────────────────

function ControllerIcon() {
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" fill="none" aria-hidden="true">
      <rect x="4" y="8" width="40" height="18" rx="9" fill="#e5e5e5" />
      <rect x="11" y="12" width="4" height="10" rx="1" fill="#1a1a1a" />
      <rect x="9" y="14" width="8" height="6" rx="1" fill="#1a1a1a" />
      <circle cx="34" cy="14" r="2.5" fill="#e4000f" />
      <circle cx="39" cy="17" r="2.5" fill="#6b6b6b" />
      <circle cx="34" cy="20" r="2.5" fill="#6b6b6b" />
      <circle cx="29" cy="17" r="2.5" fill="#6b6b6b" />
      <rect x="19" y="16" width="4" height="2" rx="1" fill="#6b6b6b" />
      <rect x="25" y="16" width="4" height="2" rx="1" fill="#6b6b6b" />
      <rect x="6" y="5" width="10" height="5" rx="2" fill="#d0d0d0" />
      <rect x="32" y="5" width="10" height="5" rx="2" fill="#d0d0d0" />
    </svg>
  );
}

function PixelDot({ color = "#e4000f" }: { color?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{ display: "inline-block", width: 6, height: 6, background: color, imageRendering: "pixelated" }}
    />
  );
}

function DiscordIcon({ size = 14 }: { size?: number }) {
  return <FaDiscord size={size} aria-hidden="true" />;
}

function GitHubIcon({ size = 14 }: { size?: number }) {
  return <FaGithub size={size} aria-hidden="true" />;
}

function CRTMonitor() {
  const lines: { y: number; tokens: { text: string; fill: string; italic?: boolean }[] }[] = [
    { y: 54,  tokens: [{ text: "Reset:", fill: "#fcd34d" }] },
    { y: 71,  tokens: [{ text: "  sei", fill: "#c084fc" }, { text: "       ; desativa IRQ", fill: "#6b7280", italic: true }] },
    { y: 88,  tokens: [{ text: "  clc", fill: "#c084fc" }] },
    { y: 105, tokens: [{ text: "  xce", fill: "#c084fc" }, { text: "       ; modo nativo",  fill: "#6b7280", italic: true }] },
    { y: 122, tokens: [] },
    { y: 139, tokens: [{ text: "  lda", fill: "#c084fc" }, { text: " #$0F",   fill: "#86efac" }] },
    { y: 156, tokens: [{ text: "  sta", fill: "#c084fc" }, { text: " $2100",  fill: "#86efac" }, { text: "  ; PPU on", fill: "#6b7280", italic: true }] },
  ];

  return (
    <svg viewBox="0 0 280 230" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "100%", maxWidth: 280 }}>
      {/* shell */}
      <rect x="4" y="4" width="272" height="192" rx="14" fill="#c8c4bc" />
      <rect x="4" y="4" width="272" height="192" rx="14" stroke="#a8a49c" strokeWidth="1.5" />
      {/* bezel */}
      <rect x="18" y="16" width="244" height="164" rx="8" fill="#1c1c1c" />
      {/* screen */}
      <rect x="24" y="22" width="232" height="152" rx="2" fill="#191919" />

      {/* title bar */}
      <rect x="24" y="22" width="232" height="18" fill="#2d2d2d" />
      <circle cx="36" cy="31" r="4" fill="#ff5f57" />
      <circle cx="48" cy="31" r="4" fill="#febc2e" />
      <circle cx="60" cy="31" r="4" fill="#28c840" />
      <text x="140" y="35" fontFamily="monospace" fontSize="9" fill="#666666" textAnchor="middle">src/main.asm</text>

      {/* line number gutter */}
      <rect x="24" y="40" width="24" height="120" fill="#141414" />
      <line x1="48" y1="40" x2="48" y2="160" stroke="#222222" strokeWidth="1" />
      {lines.map((l, i) => (
        <text key={i} x="44" y={l.y} fontFamily="monospace" fontSize="9" fill="#3a3a3a" textAnchor="end">{i + 1}</text>
      ))}

      {/* code */}
      {lines.map((l, i) =>
        l.tokens.length === 0 ? null : (
          <text key={i} fontFamily="monospace" fontSize="10">
            {l.tokens.map((t, j) => (
              <tspan key={j} x={j === 0 ? 54 : undefined} y={j === 0 ? l.y : undefined}
                fill={t.fill} fontStyle={t.italic ? "italic" : undefined}>
                {t.text}
              </tspan>
            ))}
          </text>
        )
      )}

      {/* blinking cursor after last token on line 7 */}
      <rect className="asm-cursor" x="178" y="145" width="6" height="12" fill="#c084fc" />

      {/* status bar */}
      <rect x="24" y="160" width="232" height="14" fill="#e4000f" />
      <text x="30" y="170" fontFamily="monospace" fontSize="8" fill="white">⊙ 65816 Assembly</text>
      <text x="252" y="170" fontFamily="monospace" fontSize="8" fill="white" textAnchor="end">Ln 7</text>

      {/* controls */}
      <rect x="100" y="188" width="80" height="6" rx="2" fill="#a8a49c" />
      <circle cx="248" cy="191" r="4" fill="#1c1c1c" />
      <circle cx="260" cy="191" r="3" fill="#908c84" />
      {/* stand */}
      <rect x="118" y="196" width="44" height="18" rx="3" fill="#b8b4ac" />
      <rect x="94" y="212" width="92" height="10" rx="4" fill="#a8a49c" />
    </svg>
  );
}

// ─── data ─────────────────────────────────────────────────────────────────────

type Level = "Iniciante" | "Intermediário" | "Avançado";

const levelStyle: Record<Level, { bg: string; color: string }> = {
  Iniciante:     { bg: "#f0f0f0", color: "#6b6b6b" },
  Intermediário: { bg: "#1a1a1a", color: "#ffffff" },
  Avançado:      { bg: "#e4000f", color: "#ffffff" },
};

const roadmapSteps: { number: string; title: string; description: string; tags: string[]; level: Level }[] = [
  {
    number: "01",
    title: "Fundamentos de hardware",
    description: "Binário, hexadecimal, registradores, flags e modos de endereçamento do 65816.",
    tags: ["Binário & Hex", "CPU 65816", "Registradores", "Flags"],
    level: "Iniciante",
  },
  {
    number: "02",
    title: "Ambiente de desenvolvimento",
    description: "Assembler, emulador com debugger e editor. Compile seu primeiro ROM em 10 minutos.",
    tags: ["ca65", "Asar", "BSNES", "Mesen-S"],
    level: "Iniciante",
  },
  {
    number: "03",
    title: "Seu primeiro ROM",
    description: "Header SNES, mapa de memória, inicialização do PPU e o loop principal.",
    tags: ["ROM header", "Memory map", "PPU init", "Game loop"],
    level: "Iniciante",
  },
  {
    number: "04",
    title: "Gráficos: tiles e sprites",
    description: "VRAM, paletas (CGRAM), modos de background 0–7 e o sistema de sprites via OAM.",
    tags: ["Tiles 8×8", "VRAM", "CGRAM", "OAM", "BG modes"],
    level: "Intermediário",
  },
  {
    number: "05",
    title: "Input e gameplay",
    description: "Leitura de joypad, física básica, scrolling de câmera e colisão por hitbox.",
    tags: ["Joypad", "Scrolling", "Colisão", "Física"],
    level: "Intermediário",
  },
  {
    number: "06",
    title: "Áudio com o SPC700",
    description: "Coprocessador de áudio dedicado: drivers de som, efeitos sonoros e música BRR.",
    tags: ["SPC700", "BRR samples", "AddMusicK", "Sound FX"],
    level: "Intermediário",
  },
  {
    number: "07",
    title: "Técnicas avançadas",
    description: "DMA, HDMA para efeitos por scanline, Mode 7 e chips especiais como SuperFX e SA-1.",
    tags: ["DMA", "HDMA", "Mode 7", "SuperFX", "SA-1"],
    level: "Avançado",
  },
  {
    number: "08",
    title: "Publicar seu jogo",
    description: "Teste em hardware via flashcart, distribua no itch.io e SMWCentral.",
    tags: ["Flashcart", "itch.io", "SMWCentral"],
    level: "Avançado",
  },
];

type JamStatus = "ativo" | "em-breve" | "encerrado";

const jamStatusStyle: Record<JamStatus, { bg: string; color: string; label: string }> = {
  "ativo":     { bg: "#e4000f", color: "#ffffff", label: "ATIVO" },
  "em-breve":  { bg: "#1a1a1a", color: "#ffffff", label: "EM BREVE" },
  "encerrado": { bg: "#f0f0f0", color: "#6b6b6b", label: "ENCERRADA" },
};

const gamejams: {
  name: string; theme: string; period: string; status: JamStatus;
  participants: number | null; description: string | null; winner?: string;
}[] = [
  { name: "SNESJam 2026", theme: "Mundos Subaquáticos", period: "18 jul – 18 ago 2026", status: "ativo",     participants: 7,    description: "Crie um jogo com temática aquática. Plataforma, aventura, puzzle — o que importa é a ambientação. Qualquer chip é permitido." },
  { name: "1KRom Challenge", theme: "Livre",           period: "1–30 set 2026",         status: "em-breve",  participants: null, description: "Seu ROM não pode ultrapassar 1 kilobyte. Criatividade máxima dentro de restrições extremas." },
  { name: "SNES Pixel Jam",  theme: "4 cores",         period: "nov 2026",              status: "em-breve",  participants: null, description: "Use no máximo 4 cores na paleta inteira do jogo." },
  { name: "SNESJam 2025",    theme: "Nostalgia",       period: "jul 2025",              status: "encerrado", participants: 23,   description: null, winner: "Mata Atlântica Quest" },
  { name: "SNES Winter Jam", theme: "Frio & Inverno",  period: "jun 2025",              status: "encerrado", participants: 11,   description: null, winner: "Abismo Gelado" },
  { name: "Pixel Perfect Jam", theme: "Arte em 1-bit", period: "mar 2025",              status: "encerrado", participants: 8,    description: null, winner: "Sombras de Pedra" },
];

// ─── shared components ────────────────────────────────────────────────────────

function FeatureCard({ title, children, accent = false }: { title: string; children: ReactNode; accent?: boolean }) {
  return (
    <div
      className="p-6 bg-white border border-[var(--color-border)]"
      style={accent ? { borderLeftWidth: 3, borderLeftColor: "var(--color-accent)" } : {}}
    >
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-muted)] leading-relaxed">{children}</p>
    </div>
  );
}

function RoadmapCard({ step }: { step: (typeof roadmapSteps)[number] }) {
  const badge = levelStyle[step.level];
  return (
    <div className="p-4 bg-white border border-[var(--color-border)] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono font-bold text-xl text-[var(--color-accent)]">{step.number}</span>
        <span className="font-mono text-[9px] font-semibold tracking-widest uppercase px-1.5 py-0.5" style={{ background: badge.bg, color: badge.color }}>
          {step.level}
        </span>
      </div>
      <h3 className="text-sm font-semibold leading-snug">{step.title}</h3>
      <p className="text-xs text-[var(--color-muted)] leading-relaxed flex-1">{step.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {step.tags.map((tag) => (
          <span key={tag} className="font-mono text-[10px] px-1.5 py-0.5 border border-[var(--color-border)] text-[var(--color-muted)]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function ActiveJamCard({ jam }: { jam: (typeof gamejams)[number] }) {
  const badge = jamStatusStyle[jam.status];
  return (
    <div className="p-6 bg-white border border-[var(--color-border)]" style={{ borderLeftWidth: 4, borderLeftColor: "var(--color-accent)" }}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] font-bold tracking-widest uppercase px-2 py-1" style={{ background: badge.bg, color: badge.color }}>
              {badge.label}
            </span>
            <span className="font-mono text-xs text-[var(--color-muted)]">{jam.period}</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">{jam.name}</h3>
            <p className="text-sm text-[var(--color-muted)] mt-0.5">
              Tema: <span className="font-semibold text-[var(--color-foreground)]">{jam.theme}</span>
            </p>
          </div>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-lg">{jam.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {jam.participants != null && (
            <>
              <span className="font-mono font-bold text-3xl">{jam.participants}</span>
              <span className="font-mono text-[10px] text-[var(--color-muted)] tracking-wide uppercase">inscritos</span>
            </>
          )}
          <a href="https://discord.gg/snesdev" target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-xs font-semibold hover:bg-[var(--color-accent-hover)] transition-colors">
            <DiscordIcon size={12} />
            Participar
          </a>
        </div>
      </div>
    </div>
  );
}

function UpcomingJamCard({ jam }: { jam: (typeof gamejams)[number] }) {
  const badge = jamStatusStyle[jam.status];
  return (
    <div className="p-4 bg-white border border-[var(--color-border)] flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-sm">{jam.name}</span>
        <span className="font-mono text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 shrink-0" style={{ background: badge.bg, color: badge.color }}>
          {badge.label}
        </span>
      </div>
      <p className="text-xs text-[var(--color-muted)]">
        Tema: <span className="font-medium text-[var(--color-foreground)]">{jam.theme}</span>
        <span className="mx-2">·</span>{jam.period}
      </p>
      <p className="text-xs text-[var(--color-muted)] leading-relaxed">{jam.description}</p>
    </div>
  );
}

function SectionLabel({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <PixelDot color={dark ? "#1a1a1a" : "#e4000f"} />
      <span className="font-mono text-xs text-[var(--color-muted)] tracking-widest uppercase">{children}</span>
    </div>
  );
}

// ─── architecture data ────────────────────────────────────────────────────────

const snesChips: { code: string; label: string; sub: string; mhz: string; color: string; description: string; specs: string[] }[] = [
  {
    code: "5A22",
    label: "CPU Principal",
    sub: "Ricoh 5A22 / 65816",
    mhz: "3.58 MHz",
    color: "#e4000f",
    description: "Derivado do 65816 da WDC. Opera em modos 8-bit e 16-bit. Barramento de endereço de 24 bits acessa até 16 MB de memória.",
    specs: ["Acumulador 8 ou 16-bit", "Registradores X / Y", "Modo nativo 65816", "Interrupts NMI · IRQ · BRK"],
  },
  {
    code: "PPU",
    label: "Gráficos",
    sub: "PPU1 + PPU2 (Sony / Nintendo)",
    mhz: "21.47 MHz",
    color: "#1a1a1a",
    description: "Dois chips dedicados a vídeo. Suportam 8 modos de background com diferentes profundidades de cor e o famoso Mode 7 com rotação e escala 3D.",
    specs: ["8 modos de BG (0–7)", "128 sprites simultâneos", "32.768 cores disponíveis", "64 KB VRAM"],
  },
  {
    code: "SPC700",
    label: "Áudio",
    sub: "Sony SPC700 + DSP",
    mhz: "1.024 MHz",
    color: "#1a1a1a",
    description: "Coprocessador de áudio 100% independente da CPU. Executa seu próprio código, gerencia 8 canais de samples BRR com echo e reverb integrados.",
    specs: ["8 canais estéreo", "Samples BRR 4-bit", "Echo + pitch modulation", "64 KB RAM dedicada"],
  },
  {
    code: "DMA",
    label: "Transferência",
    sub: "GP-DMA · HDMA",
    mhz: "Até 2.68 MB/s",
    color: "#6b6b6b",
    description: "DMA de propósito geral para cópias rápidas. O HDMA atualiza registradores do PPU a cada scanline, base de gradientes, parallax e efeitos Mode 7.",
    specs: ["8 canais DMA", "HDMA por scanline", "Sem custo de CPU", "Efeitos visuais avançados"],
  },
];

const memoryMap: { range: string; label: string; size: string; note: string }[] = [
  { range: "$7E0000–$7FFFFF", label: "Work RAM",      size: "128 KB",    note: "RAM principal da CPU" },
  { range: "$000000–$3FFFFF", label: "ROM (LoROM)",   size: "até 4 MB",  note: "Mapeada em bancos de 32 KB" },
  { range: "$2100–$213F",     label: "PPU Registers", size: "64 bytes",  note: "Controle de vídeo (INIDISP, BGMODE…)" },
  { range: "$2140–$2143",     label: "APU I/O",       size: "4 bytes",   note: "Comunicação CPU ↔ SPC700" },
  { range: "$4200–$421F",     label: "CPU Regs",      size: "32 bytes",  note: "Interrupts, timers, joypad" },
  { range: "$4300–$437F",     label: "DMA Regs",      size: "128 bytes", note: "Configuração dos 8 canais DMA" },
];

function ChipCard({ chip }: { chip: (typeof snesChips)[number] }) {
  return (
    <div className="p-4 bg-white border border-[var(--color-border)] flex flex-col gap-3">
      <div>
        <span className="font-mono font-bold text-2xl" style={{ color: chip.color }}>{chip.code}</span>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-semibold">{chip.label}</span>
          <span className="font-mono text-[10px] text-[var(--color-muted)]">{chip.mhz}</span>
        </div>
        <p className="font-mono text-[10px] text-[var(--color-muted)] mt-0.5">{chip.sub}</p>
      </div>
      <p className="text-xs text-[var(--color-muted)] leading-relaxed flex-1">{chip.description}</p>
      <div className="flex flex-col gap-1">
        {chip.specs.map((s) => (
          <span key={s} className="font-mono text-[10px] text-[var(--color-muted)] border-l-2 pl-2" style={{ borderColor: chip.color }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

const publishers: { name: string; logo: string }[] = [
  { name: "Squaresoft", logo: "/publishers/squaresoft.svg" },
  { name: "Capcom",     logo: "/publishers/capcom.svg" },
  { name: "Konami",     logo: "/publishers/konami.svg" },
  { name: "Kemco",      logo: "/publishers/kemco.svg" },
  { name: "Namco",      logo: "/publishers/namco.svg" },
  { name: "Activision", logo: "/publishers/activision.svg" },
  { name: "Rare",       logo: "/publishers/rare.svg" },
  { name: "Enix",       logo: "/publishers/enix.svg" },
  { name: "Sunsoft",    logo: "/publishers/sunsoft.svg" },
  { name: "Ocean",      logo: "/publishers/ocean.png" },
  { name: "Acclaim",    logo: "/publishers/acclaim.svg" },
  { name: "Nintendo",   logo: "/publishers/nintendo.svg" },
];

const communityROMs: { title: string; genre: string; author: string; color: string; year: number; status: "completo" | "em-dev" }[] = [
  { title: "Mata Atlântica Quest", genre: "RPG",         author: "rafaelDev",  color: "#1a5c1a", year: 2025, status: "completo" },
  { title: "Abismo Gelado",        genre: "Plataforma",  author: "camilaSNES", color: "#0c3060", year: 2025, status: "completo" },
  { title: "Sombras de Pedra",     genre: "Puzzle",      author: "pedroASM",   color: "#4a1060", year: 2025, status: "completo" },
  { title: "Turbo Veredas",        genre: "Shoot'em up", author: "luisROM",    color: "#601a08", year: 2025, status: "completo" },
  { title: "Lenda do Cerrado",     genre: "Aventura",    author: "anaPixel",   color: "#5a4a00", year: 2026, status: "em-dev" },
  { title: "Sintonia 7",           genre: "Puzzle",      author: "thomasBit",  color: "#200060", year: 2026, status: "em-dev" },
  { title: "Corrida Neon",         genre: "Racing",      author: "grupo65816", color: "#004040", year: 2026, status: "em-dev" },
  { title: "Dragão de Bronze",     genre: "RPG",         author: "marcoASM",   color: "#601800", year: 2026, status: "em-dev" },
];

function RomCard({ rom }: { rom: (typeof communityROMs)[number] }) {
  return (
    <div style={{ background: "white", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{
        background: rom.color,
        height: 130,
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        padding: "0 12px 10px",
        flexShrink: 0,
        backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 0, transparent 50%)",
        backgroundSize: "10px 10px",
      }}>
        {rom.status === "em-dev" && (
          <span style={{
            position: "absolute", top: 8, right: 8,
            fontFamily: "var(--font-mono)", fontSize: 9,
            background: "rgba(0,0,0,0.5)", color: "#fcd34d",
            padding: "2px 6px", letterSpacing: "0.06em",
          }}>EM DEV</span>
        )}
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.9)",
          padding: "3px 8px",
        }}>{rom.genre}</span>
      </div>
      <div style={{ height: 10, background: "#1a1a1a", display: "flex", alignItems: "center", gap: 3, padding: "0 10px", flexShrink: 0 }}>
        {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ flex: 1, height: 5, background: "#2e2e2e" }} />)}
      </div>
      <div style={{ padding: "10px 12px 12px", display: "flex", flexDirection: "column", gap: 3, flex: 1, borderLeft: "1px solid var(--color-border)", borderRight: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
        <p style={{ fontWeight: 600, fontSize: 12, lineHeight: 1.3 }}>{rom.title}</p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-muted)" }}>{rom.author}</p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-muted)", marginTop: "auto", paddingTop: 4 }}>{rom.year}</p>
      </div>
    </div>
  );
}

function PublisherCard({ pub }: { pub: (typeof publishers)[number] }) {
  return (
    <div className="bg-white flex items-center justify-center p-6 overflow-hidden group" style={{ minHeight: 120 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pub.logo}
        alt={pub.name}
        className="transition-transform duration-200 ease-out group-hover:scale-110"
        style={{ maxHeight: 48, maxWidth: 110, objectFit: "contain", filter: "grayscale(100%) brightness(1.8)", opacity: 0.45 }}
      />
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const activeJam   = gamejams.find((j) => j.status === "ativo");
  const upcomingJams = gamejams.filter((j) => j.status === "em-breve");
  const pastJams    = gamejams.filter((j) => j.status === "encerrado");

  return (
    <>
      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header className="bg-white sticky top-0 z-10" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-mono font-bold text-sm tracking-widest">
            <PixelDot />
            <span>SNESDEV</span>
          </a>
          <nav className="flex items-center gap-6 text-sm text-[var(--color-muted)]">
            <a href="#docs"      className="hover:text-[var(--color-foreground)] transition-colors">Docs</a>
            <a href="#roadmap"   className="hover:text-[var(--color-foreground)] transition-colors">Roadmap</a>
            <a href="#jams"      className="hover:text-[var(--color-foreground)] transition-colors">Jams</a>
            <a href="#comunidade" className="hover:text-[var(--color-foreground)] transition-colors">Comunidade</a>
            <a href="https://github.com/snesdev" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-foreground)] transition-colors">GitHub</a>
            <a href="https://discord.gg/snesdev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--color-accent)] text-white text-xs font-semibold tracking-wide hover:bg-[var(--color-accent-hover)] transition-colors">
              <DiscordIcon size={12} />
              Discord
            </a>
          </nav>
        </div>
        {/* breadcrumb dinâmico — atualiza conforme o scroll */}
        <Breadcrumb />
      </header>

      <main className="flex-1">
        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section id="hero" className="border-b border-[var(--color-border)] bg-white">
          <div className="max-w-5xl mx-auto px-6 pt-8 pb-14">
            <div className="grid md:grid-cols-[1fr_300px] gap-12 items-center">
              {/* left */}
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-3">
                  <ControllerIcon />
                  <span className="font-mono text-xs text-[var(--color-muted)] tracking-widest uppercase">
                    Comunidade Brasileira · SNES Homebrew
                  </span>
                </div>
                <h1 className="text-5xl font-bold leading-tight tracking-tight max-w-2xl">
                  Faça jogos para o{" "}
                  <span className="text-[var(--color-accent)]">Super Nintendo</span>
                  <br />em português.
                </h1>
                <p className="text-lg text-[var(--color-muted)] max-w-xl leading-relaxed">
                  SNESDev é uma comunidade brasileira de desenvolvedores, entusiastas e curiosos
                  construindo jogos reais para o hardware clássico do SNES. Documentação,
                  ferramentas e suporte — tudo em português.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a href="https://discord.gg/snesdev" target="_blank" rel="noopener noreferrer"
                    className="pixel-border-red flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors">
                    <DiscordIcon size={15} />
                    Entrar no Discord
                  </a>
                  <a href="#docs" className="pixel-border px-6 py-3 bg-white text-[var(--color-foreground)] font-semibold text-sm hover:bg-[var(--color-surface)] transition-colors">
                    Ver documentação
                  </a>
                </div>
              </div>
              {/* right: CRT + flow */}
              <div className="hidden md:flex flex-col items-center gap-5">
                <CRTMonitor />
                <div className="flex items-center gap-1">
                  {(["Editor", "ROM", "SNES"] as const).map((step, i) => (
                    <span key={step} className="flex items-center gap-1">
                      <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-[var(--color-border)] text-[var(--color-muted)]">
                        {step}
                      </span>
                      {i < 2 && <span className="font-mono text-xs text-[var(--color-muted)] px-0.5">→</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PUBLISHERS ──────────────────────────────────────────────────── */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <PixelDot color="#1a1a1a" />
                <span className="font-mono text-xs text-[var(--color-muted)] tracking-widest uppercase">Publishers que definiram o SNES</span>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-px bg-[var(--color-border)]">
              {publishers.map((pub) => (
                <PublisherCard key={pub.name} pub={pub} />
              ))}
            </div>
          </div>
        </section>

        {/* ── O QUE É ─────────────────────────────────────────────────────── */}
        <section id="sobre" className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto px-6 py-16">
              <SectionLabel dark>O que é SNESDev</SectionLabel>
              <div className="grid md:grid-cols-3 gap-px bg-[var(--color-border)]">
                <FeatureCard title="Aprenda desenvolvimento SNES" accent>
                  Do zero ao ROM funcional. Cobrimos 65816 assembly, gráficos em tiles, modos
                  de vídeo, áudio SPC700 e muito mais — com exemplos que rodam em hardware.
                </FeatureCard>
                <FeatureCard title="Ferramentas e bibliotecas">
                  Guias para ca65, SNES-SDK, Asar, BSNES e outros compiladores e emuladores
                  usados pela comunidade homebrew global.
                </FeatureCard>
                <FeatureCard title="Comunidade ativa">
                  Discord com devs de todos os níveis. Faça perguntas, compartilhe projetos,
                  receba code review e acompanhe lançamentos homebrew.
                </FeatureCard>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ── MISSÃO ──────────────────────────────────────────────────────── */}
        <section id="missao" className="border-b border-[var(--color-border)] bg-white">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto px-6 py-16">
              <SectionLabel>Nossa missão</SectionLabel>
              <div className="max-w-2xl">
                <blockquote className="text-2xl font-semibold leading-snug tracking-tight mb-6">
                  "Tornar o desenvolvimento para Super Nintendo acessível a qualquer
                  desenvolvedor brasileiro, independente do nível de experiência."
                </blockquote>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  O ecossistema de homebrew para SNES existe há décadas, mas quase toda
                  documentação de qualidade está em inglês. SNESDev nasce para mudar isso:
                  traduzindo, adaptando e criando conteúdo original para quem pensa, programa
                  e sonha em português.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ── PARA QUEM ───────────────────────────────────────────────────── */}
        <section id="para-quem" className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto px-6 py-16">
              <SectionLabel dark>Para quem é</SectionLabel>
              <div className="grid md:grid-cols-2 gap-px bg-[var(--color-border)]">
                <FeatureCard title="Desenvolvedores de software" accent>
                  Você já sabe programar e quer entender como os jogos clássicos funcionavam
                  por baixo do capô. Assembly 65816 é surpreendentemente acessível.
                </FeatureCard>
                <FeatureCard title="Fãs de retrocomputação">
                  Cresceu jogando Super Nintendo e sempre quis criar algo para o console que
                  marcou sua infância? Este é o lugar certo para começar.
                </FeatureCard>
                <FeatureCard title="Game developers">
                  Quer entender as restrições que moldaram os jogos dos anos 90? Desenvolver
                  para hardware real te dá perspectiva única sobre otimização e design.
                </FeatureCard>
                <FeatureCard title="Curiosos e entusiastas">
                  Não precisa querer lançar um jogo. Muita gente aqui aprende por curiosidade
                  pura — como o hardware funciona, como a música é gerada.
                </FeatureCard>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ── CÓDIGO ──────────────────────────────────────────────────────── */}
        <section id="docs" className="border-b border-[var(--color-border)] bg-white">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto px-6 py-16">
              <div className="grid md:grid-cols-[2fr_3fr] gap-12 items-center">
                {/* left: description */}
                <div>
                  <SectionLabel>Uma amostra</SectionLabel>
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Do código ao ROM</h2>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-6">
                    O primeiro programa de qualquer dev SNES: escrever o código assembly,
                    compilar com o Asar e rodar no emulador. Parece simples, mas já
                    envolve inicialização do PPU, modos de vídeo e o loop principal.
                  </p>
                  <p className="text-xs text-[var(--color-muted)] font-mono">
                    → Clique nos terminais para pular a animação.
                  </p>
                </div>
                {/* right: two terminals side by side */}
                <TerminalShowcase />
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ── ROADMAP ─────────────────────────────────────────────────────── */}
        <section id="roadmap" className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto px-6 py-16">
              <SectionLabel dark>Trilha de aprendizado</SectionLabel>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Do zero ao ROM publicado</h2>
                <div className="flex items-center gap-3 shrink-0">
                  {(Object.keys(levelStyle) as Level[]).map((lvl) => (
                    <span key={lvl} className="font-mono text-[9px] font-bold tracking-widest uppercase px-2 py-1"
                      style={{ background: levelStyle[lvl].bg, color: levelStyle[lvl].color }}>
                      {lvl}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border)]">
                {roadmapSteps.map((step) => (
                  <RoadmapCard key={step.number} step={step} />
                ))}
              </div>

              {/* vision */}
              <div className="mt-10 grid md:grid-cols-2 gap-px bg-[var(--color-border)]">
                <div className="bg-white p-6">
                  <p className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase mb-5">2026 — Fundação</p>
                  <div className="flex flex-col gap-3">
                    {["Portal", "Docs", "Discord"].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[var(--color-accent)]">✔</span>
                        <span className="text-sm font-semibold">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[var(--color-surface)] p-6">
                  <p className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase mb-5">2027 — Expansão</p>
                  <div className="flex flex-col gap-3">
                    {["SNES Studio", "Engine nativa", "Marketplace", "Emulator integrado", "Publicador de ROM"].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="font-mono text-sm text-[var(--color-muted)]">□</span>
                        <span className="text-sm text-[var(--color-muted)]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ── ARQUITETURA ─────────────────────────────────────────────────── */}
        <section id="arquitetura" className="border-b border-[var(--color-border)] bg-white">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto px-6 py-16">
              <SectionLabel>Arquitetura</SectionLabel>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Como o SNES funciona por dentro</h2>
                  <p className="text-[var(--color-muted)] text-sm mt-2 max-w-xl leading-relaxed">
                    O Super Nintendo é uma máquina multi-processada. Cada chip tem sua responsabilidade,
                    e entender como eles se comunicam é o segredo para extrair o máximo do hardware.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border)] mb-10">
                {snesChips.map((chip) => (
                  <ChipCard key={chip.code} chip={chip} />
                ))}
              </div>

              <div>
                <p className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase mb-3">Mapa de memória (simplificado)</p>
                <div className="overflow-x-auto border border-[var(--color-border)]">
                  <table className="w-full text-sm border-collapse bg-white">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                        <th className="text-left font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase px-4 py-2 pr-6">Endereço</th>
                        <th className="text-left font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase px-4 py-2 pr-6">Região</th>
                        <th className="text-right font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase px-4 py-2 pr-6">Tamanho</th>
                        <th className="text-left font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase px-4 py-2">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memoryMap.map((r) => (
                        <tr key={r.range} className="border-b border-[var(--color-border)] last:border-0">
                          <td className="px-4 py-2.5 pr-6 font-mono text-[11px] text-[var(--color-accent)]">{r.range}</td>
                          <td className="px-4 py-2.5 pr-6 text-xs font-semibold">{r.label}</td>
                          <td className="px-4 py-2.5 pr-6 text-right font-mono text-xs text-[var(--color-muted)]">{r.size}</td>
                          <td className="px-4 py-2.5 text-xs text-[var(--color-muted)]">{r.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ── GAME JAMS ───────────────────────────────────────────────────── */}
        <section id="jams" className="border-b border-[var(--color-border)] bg-white">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto px-6 py-16">
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <SectionLabel>Game Jams</SectionLabel>
                  <h2 className="text-3xl font-bold tracking-tight">Construa. Compita. Aprenda.</h2>
                </div>
                <a href="https://discord.gg/snesdev" target="_blank" rel="noopener noreferrer"
                  className="shrink-0 text-xs font-mono text-[var(--color-muted)] underline underline-offset-2 hover:text-[var(--color-foreground)] transition-colors mt-1">
                  Propor uma jam →
                </a>
              </div>

              {activeJam && (
                <div className="mb-6">
                  <ActiveJamCard jam={activeJam} />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-px bg-[var(--color-border)]">
                <div className="bg-[var(--color-surface)] p-5 flex flex-col gap-3">
                  <p className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase mb-1">Próximas jams</p>
                  {upcomingJams.map((jam) => <UpcomingJamCard key={jam.name} jam={jam} />)}
                </div>
                <div className="bg-[var(--color-surface)] p-5">
                  <p className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase mb-4">Edições anteriores</p>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border)]">
                        <th className="text-left font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase pb-2 pr-4">Jam</th>
                        <th className="text-left font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase pb-2 pr-4 hidden sm:table-cell">Vencedor</th>
                        <th className="text-right font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase pb-2">Devs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastJams.map((jam) => (
                        <tr key={jam.name} className="border-b border-[var(--color-border)] last:border-0">
                          <td className="py-2.5 pr-4">
                            <p className="font-semibold text-xs">{jam.name}</p>
                            <p className="text-[var(--color-muted)] text-xs">{jam.theme} · {jam.period}</p>
                          </td>
                          <td className="py-2.5 pr-4 text-xs text-[var(--color-muted)] hidden sm:table-cell">{jam.winner ?? "—"}</td>
                          <td className="py-2.5 text-right font-mono text-xs font-bold">{jam.participants}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ── PROJETOS DA COMUNIDADE ──────────────────────────────────────── */}
        <section id="projetos" className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto px-6 py-16">
              <SectionLabel dark>Projetos da comunidade</SectionLabel>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <h2 className="text-3xl font-bold tracking-tight">ROMs feitos aqui</h2>
                <a href="https://discord.gg/snesdev" target="_blank" rel="noopener noreferrer"
                  className="shrink-0 text-xs font-mono text-[var(--color-muted)] underline underline-offset-2 hover:text-[var(--color-foreground)] transition-colors">
                  Submeter seu projeto →
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-border)]">
                {communityROMs.map((rom) => (
                  <RomCard key={rom.title} rom={rom} />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ── DISCORD CTA ─────────────────────────────────────────────────── */}
        <section id="comunidade" className="bg-white">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">
              <SectionLabel>Comunidade</SectionLabel>
              <h2 className="text-4xl font-bold tracking-tight max-w-lg">Pronto para começar?</h2>
              <p className="text-[var(--color-muted)] max-w-md leading-relaxed">
                Entre no Discord, apresente-se no canal{" "}
                <code className="px-1.5 py-0.5 bg-[var(--color-surface)] text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                  #apresentações
                </code>{" "}
                e diga qual jogo de SNES te marcou mais. A comunidade vai te guiar pelos próximos passos.
              </p>
              <a href="https://discord.gg/snesdev" target="_blank" rel="noopener noreferrer"
                className="pixel-border-red flex items-center gap-2 px-8 py-4 rounded-lg bg-[var(--color-accent)] text-white font-bold text-base hover:bg-[var(--color-accent-hover)] transition-colors">
                <DiscordIcon size={18} />
                Entrar na comunidade
              </a>
              <p className="text-xs text-[var(--color-muted)] font-mono">
                Gratuito · Em português · Aberto a todos os níveis
              </p>
            </div>
          </AnimatedSection>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-muted)] font-mono">
          <div className="flex items-center gap-2">
            <PixelDot color="#1a1a1a" />
            <span>SNESDEV · Comunidade Brasileira</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/docs" className="hover:text-[var(--color-foreground)] transition-colors">Docs</a>
            <a href="https://github.com/snesdev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[var(--color-foreground)] transition-colors">
              <GitHubIcon size={12} />
              GitHub
            </a>
            <a href="https://discord.gg/snesdev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[var(--color-foreground)] transition-colors">
              <DiscordIcon size={12} />
              Discord
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
