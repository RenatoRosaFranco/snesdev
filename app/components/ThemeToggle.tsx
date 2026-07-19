"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("snesdev-theme");
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(stored ? stored === "dark" : sysDark);
  }, []);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("snesdev-theme", next);
    setDark(!dark);
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
      style={{
        background: "none", border: "none", cursor: "pointer",
        color: "var(--color-muted)", display: "flex", alignItems: "center",
        padding: 4, borderRadius: 4,
      }}
    >
      {dark ? <FaSun size={14} /> : <FaMoon size={14} />}
    </button>
  );
}
