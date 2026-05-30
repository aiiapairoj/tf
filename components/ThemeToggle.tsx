"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = (localStorage.getItem("tf-theme") as "light" | "dark") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("tf-theme", next);
  }

  return (
    <button
      onClick={toggle}
      className={`iconbtn w-11 h-11 rounded-2xl grid place-items-center text-xl ${className}`}
      aria-label="สลับโหมดสว่าง/มืด"
      title="โหมดสว่าง/มืด"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
