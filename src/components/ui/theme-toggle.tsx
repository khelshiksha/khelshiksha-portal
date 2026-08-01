"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useDictionary } from "@/lib/i18n/locale-context";

type Theme = "light" | "dark";

/**
 * The theme lives in localStorage, an external system, so it is read with
 * useSyncExternalStore rather than mirrored into component state via an
 * effect. That avoids the cascading render an effect-plus-setState causes.
 *
 * The OS preference is deliberately NOT consulted. Light is the default for
 * everyone and dark is opt-in — see the note at the top of theme.css. This
 * component and the CSS have to agree on that, or the icon would show a sun
 * on a light page.
 *
 * getServerSnapshot returns null: the server cannot read localStorage, and
 * guessing would render the wrong icon for anyone who has chosen dark.
 */
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle({ className }: { className?: string }) {
  const t = useDictionary();
  const theme = useSyncExternalStore<Theme | null>(
    subscribe,
    getSnapshot,
    () => null,
  );

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;

    /* Keep the browser chrome in step. The meta tag is static in the document
       because light is the default; without this the address bar stays cream
       behind a dark page on Android and iOS. */
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#12131A" : "#FDFBF6");

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
      className={`text-ink-muted hover:bg-sunken hover:text-ink inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] transition-colors ${className ?? ""}`}
    >
      {theme === "dark" ? (
        <Sun size={19} aria-hidden="true" />
      ) : (
        <Moon size={19} aria-hidden="true" />
      )}
    </button>
  );
}
