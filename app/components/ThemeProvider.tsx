"use client";

import { useEffect } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const applyTheme = () => {
      try {
        const stored = localStorage.getItem("semprexa_theme");
        if (stored) {
          document.body.setAttribute("data-theme", stored);
        } else {
          document.body.removeAttribute("data-theme");
        }
      } catch {}
    };

    applyTheme();

    const handleStorage = () => applyTheme();
    window.addEventListener("storage", handleStorage);

    const origSetItem = localStorage.setItem;
    localStorage.setItem = function (key: string, value: string) {
      origSetItem.call(this, key, value);
      if (key === "semprexa_theme") applyTheme();
    };

    return () => {
      window.removeEventListener("storage", handleStorage);
      localStorage.setItem = origSetItem;
    };
  }, []);

  return <>{children}</>;
}
