"use client";

import { useEffect, useRef, useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";

type Message = { from: "bot" | "user"; text: string; time: string };

function now() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

const WELCOME: Message[] = [
  {
    from: "bot",
    text: "Ola! Sou o assistente do SNESDev. Posso te ajudar a encontrar tutoriais, tirar duvidas sobre o SNES ou te direcionar para a comunidade no Discord.",
    time: now(),
  },
  {
    from: "bot",
    text: "O que voce quer saber?",
    time: now(),
  },
];

const AUTO_REPLIES: { pattern: RegExp; reply: string }[] = [
  { pattern: /discord/i,       reply: "Nosso Discord esta em discord.gg/snesdev — la voce encontra canais de duvidas, projetos e a jam ativa." },
  { pattern: /jam/i,           reply: "A SNESJam 2026 esta ativa com o tema Mundos Subaquaticos. Inscricoes abertas ate 18 de agosto." },
  { pattern: /comecar|inicio|tutorial/i, reply: "Recomendo comecar pelo modulo 01 — Fundamentos de hardware. Esta na secao Trilha de aprendizado." },
  { pattern: /assembly|asm|65816/i,      reply: "O SNES usa o processador 65816 (derivado do 6502). Temos uma secao de arquitetura com todos os detalhes." },
  { pattern: /rom|jogo/i,      reply: "Os ROMs da comunidade estao na secao Projetos. Voce tambem pode submeter o seu via Discord." },
  { pattern: /audio|spc|musica/i, reply: "O audio do SNES e gerado pelo SPC700 — um coprocessador dedicado com 8 canais stereo. Tem um modulo inteiro sobre isso." },
  { pattern: /ppu|grafic|sprite|tile/i,  reply: "A PPU do SNES suporta 8 modos de background e ate 128 sprites simultaneos. O modulo 04 cobre tudo isso." },
];

export function ChatWidget() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>(WELCOME);
  const [input,    setInput]    = useState("");
  const [typing,   setTyping]   = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { from: "user", text, time: now() }]);
    setTyping(true);

    const match = AUTO_REPLIES.find((r) => r.pattern.test(text));
    const reply = match?.reply ?? "Boa pergunta. Para respostas mais detalhadas, o melhor canal e o Discord — la a comunidade responde rapidinho.";

    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: "bot", text: reply, time: now() }]);
    }, 900 + Math.random() * 600);
  }

  return (
    <>
      {/* panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 80, right: 24, zIndex: 300,
          width: 320, height: 440,
          background: "var(--color-background)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column",
          fontFamily: "var(--font-sans)",
        }}>
          {/* header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-surface)",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>SNESDev Chat</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-muted)", letterSpacing: "0.04em" }}>
                  assistente online
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar chat"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--color-muted)", fontSize: 18, lineHeight: 1,
                padding: "2px 4px",
              }}
            ><FaTimes size={12} aria-hidden="true" /></button>
          </div>

          {/* messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "16px 14px",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.from === "user" ? "flex-end" : "flex-start",
                gap: 3,
              }}>
                <div style={{
                  maxWidth: "82%",
                  padding: "8px 12px",
                  background: msg.from === "user" ? "var(--color-accent)" : "var(--color-surface)",
                  color: msg.from === "user" ? "#fff" : "var(--color-foreground)",
                  fontSize: 12,
                  lineHeight: 1.55,
                  border: msg.from === "bot" ? "1px solid var(--color-border)" : "none",
                }}>
                  {msg.text}
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-muted)" }}>
                  {msg.from === "bot" ? "SNESDev · " : ""}{msg.time}
                </span>
              </div>
            ))}

            {typing && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
                <div style={{
                  padding: "8px 14px",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  fontSize: 12, color: "var(--color-muted)",
                  letterSpacing: "0.15em",
                }}>
                  . . .
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* input */}
          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid var(--color-border)",
            display: "flex", gap: 8,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Digite sua duvida..."
              style={{
                flex: 1, background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                padding: "8px 10px", fontSize: 12,
                color: "var(--color-foreground)",
                outline: "none", fontFamily: "var(--font-sans)",
              }}
            />
            <button
              onClick={send}
              style={{
                background: "var(--color-accent)", color: "#fff",
                border: "none", cursor: "pointer",
                padding: "0 14px",
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      {/* toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Fechar chat" : "Abrir chat"}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 300,
          width: 48, height: 48,
          background: open ? "var(--color-foreground)" : "var(--color-accent)",
          color: "#fff",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "50%",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}
      >
        {open
          ? <FaTimes size={20} aria-hidden="true" />
          : <FaRobot size={24} aria-hidden="true" />
        }
      </button>
    </>
  );
}
