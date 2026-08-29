import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SplashScreen } from "./SplashScreen";

function mockMatchMedia(reducedMotion: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? reducedMotion : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  window.sessionStorage.clear();
  mockMatchMedia(false);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("SplashScreen", () => {
  it("includes the splash in the very first render, before any effect has run", () => {
    // Next's static export prerenders with react-dom/server, which never runs useEffect --
    // renderToStaticMarkup exercises exactly that: a single synchronous render, no effects.
    // If the splash's visibility depends on an effect to turn it "on", it will be completely
    // absent from this output -- which is exactly the bug this test catches: the prerendered
    // HTML (what the browser paints first) would show the real page with no splash at all.
    const html = renderToStaticMarkup(
      <SplashScreen>
        <p>Real page content</p>
      </SplashScreen>
    );
    expect(html).toContain('data-testid="splash-screen"');
  });

  it("renders children alongside the splash overlay", () => {
    render(
      <SplashScreen>
        <p>Real page content</p>
      </SplashScreen>
    );
    expect(screen.getByText("Real page content")).toBeInTheDocument();
    expect(screen.getByTestId("splash-screen")).toBeInTheDocument();
  });

  it("skips the splash entirely if already shown this session", () => {
    window.sessionStorage.setItem("kira_splash_shown", "1");
    render(
      <SplashScreen>
        <p>Real page content</p>
      </SplashScreen>
    );
    expect(screen.getByText("Real page content")).toBeInTheDocument();
    expect(screen.queryByTestId("splash-screen")).not.toBeInTheDocument();
  });

  it("skips the splash if the visitor prefers reduced motion", () => {
    mockMatchMedia(true);
    render(
      <SplashScreen>
        <p>Real page content</p>
      </SplashScreen>
    );
    expect(screen.queryByTestId("splash-screen")).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem("kira_splash_shown")).toBe("1");
  });

  it("hides itself automatically after the bounce and leave animation finish", async () => {
    vi.useFakeTimers();
    render(
      <SplashScreen>
        <p>Real page content</p>
      </SplashScreen>
    );
    expect(screen.getByTestId("splash-screen")).toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(1900);

    expect(screen.queryByTestId("splash-screen")).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem("kira_splash_shown")).toBe("1");
  });
});
