"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { getDictionary } from "@/lib/i18n";

type Theme = "light" | "dark";

/**
 * The theme lives in two external systems — localStorage and the OS media
 * query — so it is read with useSyncExternalStore rather than mirrored into
 * component state via an effect. That avoids the cascading render an
 * effect-plus-setState would cause, and keeps the toggle correct if the OS
 * preference changes mid-session.
 *
 * getServerSnapshot returns null: the server cannot know the preference, and
 * guessing would render the wrong icon for half of visitors before swapping.
 */
function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "dark" || explicit === "light") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle({ className }: { className?: string }) {
  const t = getDictionary();
  const theme = useSyncExternalStore<Theme | null>(
    subscribe,
    getSnapshot,
    () => null,
  );

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("ks-theme", next);
    } catch {
      /* Private browsing — the toggle still works for this session. */
    }
    /* `storage` does not fire in the tab that wrote it, so nudge subscribers. */
    window.dispatchEvent(new Event("storage"));
  }, []);

  if (theme === null) {
    /* Reserve the exact final size so there is no layout shift on mount. */
    return <div className={className} style={{ width: 44, height: 44 }} />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? t.theme.toLight : t.theme.toDark}
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
