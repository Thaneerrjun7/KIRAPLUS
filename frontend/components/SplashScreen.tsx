"use client";

// One-time app splash: logo bounces in place, then leaps off-screen to reveal the real page.
// Shown once per browser session (sessionStorage flag) -- not on every page navigation, and not
// again on a reload within the same session. Skips entirely if the visitor prefers reduced motion.
// See docs/superpowers/specs/2026-08-29-mobile-shell-redesign-design.md's sibling spec work and the
// visual-companion review this was approved against (2026-08-29) for why: leap-away was chosen over
// a plain fade so the exit continues the same bounce physics as the entrance.

import { useEffect, useState, type ReactNode } from "react";

const SESSION_KEY = "kira_splash_shown";
const BOUNCE_MS = 1400;
const LEAVE_MS = 500;

type Phase = "hidden" | "bouncing" | "leaving";

type Props = {
  children: ReactNode;
};

export function SplashScreen({ children }: Props) {
  // Defaults to "bouncing", not "hidden" -- this is the value baked into the static export's
  // prerendered HTML (react-dom/server never runs effects) and into the client's very first paint,
  // before hydration. Gating the splash's initial visibility behind an effect meant it was entirely
  // absent from that first paint, so the real page was visible with nothing covering it until
  // hydration finished and the effect ran. Defaulting to visible and using the effect only to hide
  // it early (below) closes that gap: the splash is what's on screen from the very first frame.
  const [phase, setPhase] = useState<Phase>("bouncing");

  useEffect(() => {
    // Whether to skip the splash depends on sessionStorage/matchMedia, both browser-only --
    // unavailable during prerender, so this can't be decided any earlier than an effect. Hiding
    // synchronously here (not queueMicrotask/setTimeout) keeps the already-seen-this-session case
    // as close to invisible as possible -- it flashes for at most one paint, not a full bounce.
    if (window.sessionStorage.getItem(SESSION_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above the effect
      setPhase("hidden");
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("hidden");
      return;
    }

    const toLeaving = setTimeout(() => setPhase("leaving"), BOUNCE_MS);
    const toHidden = setTimeout(() => {
      setPhase("hidden");
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }, BOUNCE_MS + LEAVE_MS);

    return () => {
      clearTimeout(toLeaving);
      clearTimeout(toHidden);
    };
  }, []);

  return (
    <>
      {children}
      {phase !== "hidden" && (
        <div
          data-testid="splash-screen"
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-2.5 bg-surface transition-opacity duration-500 delay-150 ${
            phase === "leaving" ? "opacity-0" : "opacity-100"
          }`}
        >
          <img
            src="/logo.png"
            alt="KIRA+"
            className={
              phase === "bouncing"
                ? "w-64 animate-[kira-splash-jump_900ms_cubic-bezier(0.45,0,0.55,1)_infinite]"
                : "w-64 animate-[kira-splash-leap_500ms_cubic-bezier(0.4,0,1,1)_forwards]"
            }
          />
          <div
            className={`h-3 w-28 rounded-full bg-navy/10 transition-opacity duration-200 ${
              phase === "bouncing"
                ? "animate-[kira-splash-shadow_900ms_cubic-bezier(0.45,0,0.55,1)_infinite]"
                : "opacity-0"
            }`}
          />
        </div>
      )}
    </>
  );
}
