"use client";

import { useState, useEffect } from "react";
import { getThemeBg } from "../lib/themeHelpers";

export function useTheme() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      try { setTheme(localStorage.getItem("semprexa_theme")); } catch {}
    };
    read();
    const handler = () => read();
    window.addEventListener("storage", handler);
    const orig = localStorage.setItem;
    localStorage.setItem = function (k: string, v: string) { orig.call(this, k, v); if (k === "semprexa_theme") read(); };
    return () => { window.removeEventListener("storage", handler); localStorage.setItem = orig; };
  }, []);

  return {
    theme,
    bg: getThemeBg(theme),
  };
}
