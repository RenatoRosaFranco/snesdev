"use client";

import { useRef, useCallback } from "react";

type FeedItem = { user: string; action: string; title: string; time: string; type: string };

function avatarBg(_type: string) {
  return "#eeeeee";
}
function typeLabel(type: string) {
  return type === "tutorial" ? "Tutorial"
    : type === "rom" ? "ROM"
    : type === "jam" ? "Jam"
    : type === "translate" ? "Tradução" : "Membro";
}
function accentColor(type: string) {
  return type === "tutorial" ? "#e4000f"
    : type === "rom" ? "var(--color-foreground)"
    : type === "jam" ? "#c084fc" : "var(--color-muted)";
}

export function FeedSlider({ items }: { items: FeedItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    drag.current = { active: true, startX: e.pageX - ref.current.offsetLeft, scrollLeft: ref.current.scrollLeft };
    ref.current.style.cursor = "grabbing";
    ref.current.style.userSelect = "none";
  }, []);

  const onMouseUp = useCallback(() => {
    if (!ref.current) return;
    drag.current.active = false;
    ref.current.style.cursor = "grab";
    ref.current.style.userSelect = "";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!drag.current.active || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - drag.current.startX) * 1.2;
    ref.current.scrollLeft = drag.current.scrollLeft - walk;
  }, []);

  const scroll = useCallback((dir: -1 | 1) => {
    ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* scroll buttons */}
      <button
        aria-label="Anterior"
        onClick={() => scroll(-1)}
        style={{
          position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
          zIndex: 2, width: 32, height: 32,
          background: "var(--color-background)", border: "1px solid var(--color-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 14,
          color: "var(--color-foreground)",
        }}
      >‹</button>
      <button
        aria-label="Próximo"
        onClick={() => scroll(1)}
        style={{
          position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
          zIndex: 2, width: 32, height: 32,
          background: "var(--color-background)", border: "1px solid var(--color-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 14,
          color: "var(--color-foreground)",
        }}
      >›</button>

      {/* scrollable strip */}
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch" as never,
          cursor: "grab",
          paddingLeft: 40,
          paddingRight: 40,
          paddingBottom: 2,
          gap: 0,
          scrollbarWidth: "none" as never,
          msOverflowStyle: "none" as never,
        }}
      >
        {items.map((item, idx) => (
          <div key={item.user + item.title}
            style={{
              minWidth: 280,
              maxWidth: 280,
              scrollSnapAlign: "start",
              flexShrink: 0,
              background: "var(--color-background)",
              border: "1px solid var(--color-border)",
              borderLeft: idx === 0 ? "1px solid var(--color-border)" : "none",
              padding: "20px 20px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              pointerEvents: "none",
            }}>
            {/* tweet header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: avatarBg(item.type),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: "#6b6b6b", flexShrink: 0,
                }}>{item.user[0].toUpperCase()}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{item.user}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-muted)", letterSpacing: "0.04em" }}>@{item.user.toLowerCase()}</span>
                </div>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-muted)" }}>{item.time}</span>
            </div>
            {/* tweet body */}
            <p style={{ fontSize: 13, color: "var(--color-muted)", lineHeight: 1.5, flex: 1 }}>
              {item.action}{item.title ? " " : ""}
              {item.title && <strong style={{ color: "var(--color-foreground)" }}>{item.title}</strong>}
            </p>
            {/* hashtag */}
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: accentColor(item.type),
            }}># {typeLabel(item.type)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
