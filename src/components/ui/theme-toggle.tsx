"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { getDictionary } from "@/lib/i18n";

type Theme = "light" | "dark";

/**
 * Renders nothing until mounted. The server cannot know the user's OS
 * preference, so rendering an icon during SSR guarantees it is wrong for half
 * of visitors and then visibly swaps — worse than a brief absence.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const t = getDictionary();
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ks-theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      return;
    }
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    );
  }, []);

  if (theme === null) {
    /* Reserve the exact final size so there is no layout shift on mount. */
    return <div className={className} style={{ width: 44, height: 44 }} />;
  }

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("ks-theme", next);
        } catch {
          /* Private browsing — the toggle still works for this session. */
        }
        setTheme(next);
      }}
      aria-label={next === "dark" ? t.theme.toDark : t.theme.toLight}
      className={`inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] text-ink-muted transition-colors hover:bg-sunken hover:text-ink ${className ?? ""}`}
    >
      {theme === "dark" ? (
        <Sun size={19} aria-hidden="true" />
      ) : (
        <Moon size={19} aria-hidden="true" />
      )}
    </button>
  );
}
