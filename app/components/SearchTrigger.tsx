"use client";

export function SearchTrigger() {
  return (
    <button
      onClick={() =>
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true })
        )
      }
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
      style={{ border: "1px solid var(--color-border)", fontFamily: "var(--font-mono)" }}
    >
      <span>Buscar</span>
      <kbd style={{ fontSize: 9, opacity: 0.6 }}>Ctrl K</kbd>
    </button>
  );
}
