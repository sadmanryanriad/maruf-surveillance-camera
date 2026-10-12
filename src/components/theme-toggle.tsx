"use client";

import { useSyncExternalStore, useRef } from "react";

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot() {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr ? attr === "dark" : true;
}

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const runningRef = useRef(false);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const dark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    () => true
  );

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    if (runningRef.current) return;
    const isCurrentlyDark = document.documentElement.getAttribute("data-theme") === "dark";
    const nextDark = !isCurrentlyDark;
    const value = nextDark ? "dark" : "light";

    const doc = document as Document & {
      startViewTransition?: (callback: () => Promise<void> | void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };

    const applyTheme = () => {
      document.documentElement.setAttribute("data-theme", value);
      document.documentElement.classList.toggle("dark", nextDark);
      document.documentElement.style.colorScheme = value;
      // Persist for the server to read on the next load (1 year).
      document.cookie = `theme=${value}; path=/; max-age=31536000; SameSite=Lax`;
    };

    if (!doc.startViewTransition) {
      applyTheme();
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const marker = reduced ? "theme-fade" : "theme-wave";

    const rect = buttonRef.current?.getBoundingClientRect();
    const fromButton = e.detail === 0 && rect;
    const x = fromButton ? rect.left + rect.width / 2 : e.clientX;
    const y = fromButton ? rect.top + rect.height / 2 : e.clientY;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    runningRef.current = true;
    root.classList.add(marker);

    const transition = doc.startViewTransition(() => {
      applyTheme();
    });

    transition.finished
      .catch(() => {})
      .finally(() => {
        root.classList.remove(marker);
        runningRef.current = false;
      });

    if (reduced) return;

    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 450,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {});
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-10 w-10 items-center justify-center rounded-lg border border-line text-foreground transition-colors hover:border-primary hover:text-primary-strong cursor-pointer ${className}`}
    >
      {/* Render icon only after mount so SSR and client markup match. */}
      {mounted &&
        (dark ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
        ))}
    </button>
  );
}
