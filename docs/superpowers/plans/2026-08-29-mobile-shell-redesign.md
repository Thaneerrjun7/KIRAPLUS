# KIRA+ Mobile-First Shell Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split KIRA+'s Next.js frontend into a marketing shell (`/`, `/about`) and a product shell
(`/profile`, `/commitments`, `/dashboard`, `/simulator`) with distinct, mobile-first navigation, and
replace the current visual system with a near-white, Inter-based system inspired by
`frontend/docs/rise-design.md`, while keeping every existing KIRA+ brand color unchanged.

**Architecture:** Foundation first (Tailwind tokens, font consolidation), then new leaf components
(shared UI primitives, the two nav components) with their own tests, then the structural rewire
(route groups + layouts), then a per-page/per-component token sweep ordered by shell, finishing with
the one genuinely new interaction (CommitmentsTable's mobile card layout) and a cleanup + full
verification pass.

**Tech Stack:** Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind CSS 3,
Vitest + Testing Library, Playwright (manual verification only, not part of the automated suite).

**Spec:** `docs/superpowers/specs/2026-08-29-mobile-shell-redesign-design.md`

## Global Constraints

- All work is under `frontend/` — no changes to `backend/`, `lib/api.ts`'s request/response shapes,
  or any contract-frozen copy (warning templates, verdict wording, band thresholds).
- Every existing KIRA+ brand hex stays exactly as defined: `navy #0B1F2A`, `teal #0F5C56`,
  `jade #1E8E7E`, `gold #B7791B`, `risk.low #1E8E7E`, `risk.moderate #B7791B`, `risk.high #B5533C`.
- New neutral scale (from the spec, already approved via visual review): `surface #FFFFFF`,
  `surfaceAlt #F4F5F5`, `border #E2E4E5`, `mist #919A9F`, `slate #606D75`. Primary text keeps using
  `navy` (the "ink" role) — no new "ink" token, reuse `navy`.
- Radius: `rounded-xl` (Tailwind's default 12px) on every button, card, input, badge introduced or
  touched by this plan.
- Font: single Inter family via one `next/font/google` load bound to `--font-sans`; Tailwind's
  `font-display`/`font-body`/`font-mono` families all resolve to `var(--font-sans)` — call sites
  using those class names do **not** need to change (this is the mechanism, see Task 2).
- Money/data figures get Tailwind's built-in `tabular-nums` utility class wherever they render.
- No test may rely on real CSS media-query evaluation (jsdom doesn't evaluate them) — breakpoint
  behavior is asserted via Tailwind class presence (`hidden`, `md:flex`, etc.), never via visibility.
- Run `npm test` (Vitest) and `npm run build` from `frontend/` after every task; both must pass
  before committing.

---

### Task 1: Tailwind design tokens

**Files:**
- Modify: `frontend/tailwind.config.ts`

**Interfaces:**
- Produces: Tailwind color utilities `bg-surface`/`text-surface`/`border-surface`,
  `bg-surfaceAlt`/`border-surfaceAlt`, `border-border`, `text-mist`/`border-mist`/`stroke-mist`,
  `text-slate`/`border-slate`, and `shadow-card` — consumed by every later task. `paper`, `navy`,
  `teal`, `jade`, `gold`, `risk.*` are unchanged and still available.

- [ ] **Step 1: Edit `tailwind.config.ts`'s `colors` block**

Add five new keys alongside the existing ones (don't remove `paper` yet — later tasks still
reference it until migrated):

```ts
colors: {
  navy: "#0B1F2A",
  teal: "#0F5C56",
  jade: "#1E8E7E",
  gold: "#B7791B",
  paper: "#FBFAF7",
  surface: "#FFFFFF",
  surfaceAlt: "#F4F5F5",
  border: "#E2E4E5",
  mist: "#919A9F",
  slate: "#606D75",
  risk: {
    low: "#1E8E7E",
    moderate: "#B7791B",
    high: "#B5533C",
  },
},
```

- [ ] **Step 2: Add the card shadow token**

In the same `theme.extend` object, alongside `colors`, add:

```ts
boxShadow: {
  card: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
},
```

- [ ] **Step 3: Verify the build picks up the new tokens**

Run: `cd frontend && npm run build`
Expected: build succeeds (Tailwind only fails the build on invalid config syntax, not on unused
tokens — this confirms the config file itself is valid TypeScript/Tailwind config).

- [ ] **Step 4: Commit**

```bash
cd frontend
git add tailwind.config.ts
git commit -m "feat(frontend): add neutral color scale and card shadow token"
```

---

### Task 2: Root layout — single Inter font family

**Files:**
- Modify: `frontend/app/layout.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `--font-sans` CSS variable on `<html>`; `font-display`/`font-body`/`font-mono` Tailwind
  classes (used throughout the codebase already) all resolve to Inter from this point on. No other
  file needs to change to pick this up.

- [ ] **Step 1: Replace the three Google Font loaders with one Inter load**

In `frontend/app/layout.tsx`, replace:

```ts
import { Bricolage_Grotesque, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
```

and the three `const display = ...` / `const body = ...` / `const mono = ...` declarations, with:

```ts
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});
```

Update the `<html>` tag's `className` from `` `${display.variable} ${body.variable} ${mono.variable}` ``
to `inter.variable`.

- [ ] **Step 2: Point every font family to the one variable**

In `frontend/tailwind.config.ts`, inside `theme.extend.fontFamily`, change:

```ts
fontFamily: {
  display: ["var(--font-display)", "sans-serif"],
  body: ["var(--font-body)", "serif"],
  mono: ["var(--font-mono)", "monospace"],
},
```

to:

```ts
fontFamily: {
  display: ["var(--font-sans)", "sans-serif"],
  body: ["var(--font-sans)", "sans-serif"],
  mono: ["var(--font-sans)", "sans-serif"],
},
```

- [ ] **Step 3: Verify Inter is actually bundled**

Run: `cd frontend && npm run build`
Then: `grep -ril "inter" .next/static/css/ | head -1`
Expected: build succeeds and at least one generated CSS file matches (confirms the Inter
`@font-face` rule is present in the build output, not just referenced in source).

- [ ] **Step 4: Run the full test suite to confirm nothing broke**

Run: `cd frontend && npm test`
Expected: all existing tests still pass — no test asserts on `font-display`/`font-body`/`font-mono`
class names or on Bricolage/Serif/Plex-Mono specifically (confirmed by inspection before writing
this plan).

- [ ] **Step 5: Commit**

```bash
cd frontend
git add app/layout.tsx tailwind.config.ts
git commit -m "feat(frontend): consolidate on a single Inter font family"
```

---

### Task 3: Shared UI primitives — Button, Card, Badge, StatTile

**Files:**
- Modify: `frontend/components/ui/Button.tsx`, `frontend/components/ui/Button.test.tsx`
- Modify: `frontend/components/ui/Card.tsx`, `frontend/components/ui/Card.test.tsx`
- Modify: `frontend/components/ui/Badge.tsx`, `frontend/components/ui/Badge.test.tsx`
- Modify: `frontend/components/ui/StatTile.tsx`, `frontend/components/ui/StatTile.test.tsx`

**Interfaces:**
- Consumes: `bg-surface`, `border-border`, `text-mist`, `text-slate`, `shadow-card` (Task 1).
- Produces: no prop/signature changes to any of the four components — only their rendered classes
  change. Every later task that renders `<Button>`, `<Card>`, `<Badge>`, `<StatTile>` gets the new
  look automatically, with no call-site changes required.

This task changes `Button`'s **primary** variant fill from teal to navy (rise-design's "one
saturated CTA color" rule — navy is KIRA+'s primary brand color; teal remains the secondary accent
used elsewhere, e.g. `AppNav`'s active-link underline, unchanged). It does not add a third "ghost"
variant — nothing in this plan needs one (the marketing nav's one CTA is a `primary` button; there is
no login/ghost-button consumer without auth).

- [ ] **Step 1: Update `Button.test.tsx`'s two color assertions (write the failing tests first)**

Change:

```ts
  it("applies primary variant classes by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-teal");
  });

  it("applies secondary variant classes when specified", () => {
    render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-navy/20");
  });
```

to:

```ts
  it("applies primary variant classes by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-navy", "rounded-xl");
  });

  it("applies secondary variant classes when specified", () => {
    render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-border", "rounded-xl");
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd frontend && npx vitest run components/ui/Button.test.tsx`
Expected: FAIL — current classes are `bg-teal` / `border-navy/20`, neither matches.

- [ ] **Step 3: Update `Button.tsx`**

Change:

```ts
const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-teal text-paper hover:bg-navy",
  secondary: "border border-navy/20 text-navy hover:bg-navy/5",
};

const BASE_CLASSES =
  "inline-flex items-center gap-2 px-5 py-2.5 font-display text-sm font-semibold transition-colors";
```

to:

```ts
const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-navy text-surface hover:opacity-90",
  secondary: "border border-border text-navy hover:bg-surface-alt",
};

const BASE_CLASSES =
  "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-display text-sm font-semibold transition-colors";
```

Note: Tailwind reads `bg-surface-alt` as the `surfaceAlt` token (camelCase keys map to
hyphen-cased utility names) — use `bg-surface-alt`, not `bg-surfaceAlt`, in every class string.

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd frontend && npx vitest run components/ui/Button.test.tsx`
Expected: PASS, all 5 tests.

- [ ] **Step 5: Card — add a radius assertion, then implement**

In `Card.test.tsx`, add a new test:

```ts
  it("uses the surface background, hairline border, and 12px radius", () => {
    const { container } = render(<Card>Hello</Card>);
    expect(container.firstChild).toHaveClass("bg-surface", "border-border", "rounded-xl");
  });
```

Run: `cd frontend && npx vitest run components/ui/Card.test.tsx` — expect this new test to FAIL.

Update `Card.tsx`'s className from:

```ts
`relative border border-navy/10 bg-paper ${className}`
```

to:

```ts
`relative rounded-xl border border-border bg-surface ${className}`
```

and its label span from `text-navy/40` to `text-mist`.

Run the file again — expect all tests, including the new one, to PASS.

- [ ] **Step 6: Badge — neutral color token, then implement**

In `Badge.test.tsx`, change:

```ts
  it("defaults to a neutral color when risk is omitted", () => {
    render(<Badge>ADEQUATE</Badge>);
    expect(screen.getByText("[ADEQUATE]")).toHaveClass("text-navy/50");
  });
```

to:

```ts
  it("defaults to a neutral color when risk is omitted", () => {
    render(<Badge>ADEQUATE</Badge>);
    expect(screen.getByText("[ADEQUATE]")).toHaveClass("text-mist");
  });
```

Run: `cd frontend && npx vitest run components/ui/Badge.test.tsx` — expect FAIL.

Update `Badge.tsx`'s `RISK_CLASSES.neutral` from `"text-navy/50"` to `"text-mist"`, and add
`rounded-xl` to the badge's className (it's currently `"font-mono text-xs font-medium uppercase
tracking-wide ${RISK_CLASSES[risk]}"` — add `rounded-xl` even though the badge has no visible
background/border today; this keeps the class present for when a background tint is added later
without another edit).

Run the file again — expect PASS.

- [ ] **Step 7: StatTile — tabular-nums on the value**

In `StatTile.test.tsx`, add:

```ts
  it("renders the value with tabular figures", () => {
    render(<StatTile label="Monthly buffer" value="RM950" />);
    expect(screen.getByText("RM950")).toHaveClass("tabular-nums");
  });
```

Run: `cd frontend && npx vitest run components/ui/StatTile.test.tsx` — expect the new test to FAIL.

Update `StatTile.tsx`'s value span className from `` `font-mono text-sm ${valueClassName}` `` to
`` `font-mono text-sm tabular-nums ${valueClassName}` ``, and its divider span from
`"mb-0.5 flex-1 border-b border-dotted border-navy/30"` to
`"mb-0.5 flex-1 border-b border-dotted border-mist"`.

Run the file again — expect PASS.

- [ ] **Step 8: Run the whole suite**

Run: `cd frontend && npm test`
Expected: all tests pass.

- [ ] **Step 9: Commit**

```bash
cd frontend
git add components/ui/Button.tsx components/ui/Button.test.tsx \
        components/ui/Card.tsx components/ui/Card.test.tsx \
        components/ui/Badge.tsx components/ui/Badge.test.tsx \
        components/ui/StatTile.tsx components/ui/StatTile.test.tsx
git commit -m "feat(frontend): restyle shared UI primitives to the new token system"
```

---

### Task 4: `MarketingNav` component

**Files:**
- Create: `frontend/components/MarketingNav.tsx`
- Create: `frontend/components/MarketingNav.test.tsx`

**Interfaces:**
- Consumes: `usePathname` from `next/navigation`, `Bars3Icon`/`XMarkIcon` from
  `@heroicons/react/24/outline`, `bg-surface`/`border-border`/`text-slate`/`bg-navy`/`text-surface`
  (Task 1).
- Produces: `export function MarketingNav(): JSX.Element` — no props. Consumed by Task 6's
  `app/(marketing)/layout.tsx`.

- [ ] **Step 1: Write the failing test**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

import { MarketingNav } from "./MarketingNav";

describe("MarketingNav", () => {
  it("links the wordmark to the landing page", () => {
    render(<MarketingNav />);
    expect(screen.getByRole("link", { name: "KIRA+" })).toHaveAttribute("href", "/");
  });

  it("links About to /about and Dashboard to /dashboard", () => {
    render(<MarketingNav />);
    expect(screen.getAllByRole("link", { name: "About" })[0]).toHaveAttribute("href", "/about");
    expect(screen.getAllByRole("link", { name: "Dashboard" })[0]).toHaveAttribute(
      "href",
      "/dashboard"
    );
  });

  it("hides the mobile menu until the hamburger is toggled open", () => {
    render(<MarketingNav />);
    const toggle = screen.getByRole("button", { name: /toggle menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("link", { name: "About" }).length).toBeGreaterThan(1);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd frontend && npx vitest run components/MarketingNav.test.tsx`
Expected: FAIL with "Cannot find module './MarketingNav'".

- [ ] **Step 3: Implement `MarketingNav.tsx`**

```tsx
"use client";

// Marketing shell nav: /, /about. Collapsible on mobile. The single "Dashboard" button stands in
// for the login slot rise-design.md reserves for auth -- there's no auth yet, and a returning
// user's most useful nav-level action is jumping straight to their data. /dashboard already
// renders "Save a profile first..." gracefully with no saved profile, so this is always a safe
// link. See docs/superpowers/specs/2026-08-29-mobile-shell-redesign-design.md section B.

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export function MarketingNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const aboutActive = pathname === "/about";
  const aboutClasses = aboutActive ? "font-semibold text-navy" : "text-slate";

  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-10 border-b border-border bg-surface px-4 py-3"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold text-navy">
          KIRA+
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/about" className={`text-sm ${aboutClasses}`}>
            About
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-surface"
          >
            Dashboard
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="md:hidden"
        >
          {open ? (
            <XMarkIcon className="h-6 w-6 text-navy" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-navy" />
          )}
        </button>
      </div>

      {open && (
        <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3 md:hidden">
          <Link href="/about" onClick={() => setOpen(false)} className={`text-sm ${aboutClasses}`}>
            About
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="rounded-xl bg-navy px-4 py-2 text-center text-sm font-semibold text-surface"
          >
            Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd frontend && npx vitest run components/MarketingNav.test.tsx`
Expected: PASS, all 3 tests.

- [ ] **Step 5: Commit**

```bash
cd frontend
git add components/MarketingNav.tsx components/MarketingNav.test.tsx
git commit -m "feat(frontend): add collapsible MarketingNav for the marketing shell"
```

---

### Task 5: `AppNav` component (replaces `Nav`)

**Files:**
- Create: `frontend/components/AppNav.tsx`
- Create: `frontend/components/AppNav.test.tsx`
- Delete: `frontend/components/Nav.tsx`
- Delete: `frontend/components/Nav.test.tsx`

**Interfaces:**
- Consumes: `usePathname`, the four existing Heroicons (`UserCircleIcon`, `ListBulletIcon`,
  `ChartBarIcon`, `CalculatorIcon`), `border-border`/`text-slate`/`bg-surface` (Task 1).
- Produces: `export function AppNav(): JSX.Element` — no props. Renders **two** `<nav aria-label="Main">`
  elements (desktop top bar, mobile bottom bar), toggled by Tailwind breakpoint classes, not
  `matchMedia` (avoids SSR/hydration mismatches). Consumed by Task 6's `app/(app)/layout.tsx`.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }));

import { AppNav } from "./AppNav";

const PAGES = [
  ["Profile", "/profile"],
  ["Commitments", "/commitments"],
  ["Dashboard", "/dashboard"],
  ["Simulator", "/simulator"],
] as const;

describe("AppNav", () => {
  it("renders both a desktop top nav and a mobile bottom nav, toggled by breakpoint classes", () => {
    render(<AppNav />);
    const navs = screen.getAllByRole("navigation", { name: "Main" });
    expect(navs).toHaveLength(2);
    expect(navs[0]).toHaveClass("hidden", "md:flex");
    expect(navs[1]).toHaveClass("md:hidden");
  });

  it("links to all four app-shell pages from both navs", () => {
    render(<AppNav />);
    for (const [name, href] of PAGES) {
      const links = screen.getAllByRole("link", { name });
      expect(links).toHaveLength(2);
      for (const link of links) expect(link).toHaveAttribute("href", href);
    }
  });

  it("highlights the current route in both navs and not the others", () => {
    render(<AppNav />);
    for (const link of screen.getAllByRole("link", { name: "Dashboard" })) {
      expect(link).toHaveClass("text-navy");
    }
    for (const link of screen.getAllByRole("link", { name: "Profile" })) {
      expect(link).not.toHaveClass("text-navy");
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd frontend && npx vitest run components/AppNav.test.tsx`
Expected: FAIL with "Cannot find module './AppNav'".

- [ ] **Step 3: Implement `AppNav.tsx`**

```tsx
"use client";

// App shell nav: /profile, /commitments, /dashboard, /simulator. Desktop (>=768px): top bar, logo
// left, links right. Mobile (<768px): fixed bottom tab bar. Both render always; Tailwind
// breakpoint classes (not matchMedia) pick which is visible, so there's no hydration mismatch.
// See docs/superpowers/specs/2026-08-29-mobile-shell-redesign-design.md section B.

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalculatorIcon,
  ChartBarIcon,
  ListBulletIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const LINKS: { href: string; label: string; Icon: ComponentType<{ className?: string }> }[] = [
  { href: "/profile", label: "Profile", Icon: UserCircleIcon },
  { href: "/commitments", label: "Commitments", Icon: ListBulletIcon },
  { href: "/dashboard", label: "Dashboard", Icon: ChartBarIcon },
  { href: "/simulator", label: "Simulator", Icon: CalculatorIcon },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <>
      <nav
        aria-label="Main"
        className="sticky top-0 z-10 hidden items-center justify-between border-b border-border bg-surface px-4 py-3 md:flex"
      >
        <Link href="/" className="font-display text-lg font-semibold text-navy">
          KIRA+
        </Link>
        <div className="flex items-center gap-6">
          {LINKS.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 border-b-2 pb-1 text-sm ${
                  active ? "border-teal font-semibold text-navy" : "border-transparent text-slate"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-10 flex border-t border-border bg-surface md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {LINKS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
                active ? "text-navy" : "text-slate"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd frontend && npx vitest run components/AppNav.test.tsx`
Expected: PASS, all 3 tests.

- [ ] **Step 5: Delete the superseded `Nav` component**

```bash
cd frontend
git rm components/Nav.tsx components/Nav.test.tsx
```

- [ ] **Step 6: Run the whole suite**

Run: `cd frontend && npm test`
Expected: all tests pass (no other file imports `Nav` — it was only ever used by `app/layout.tsx`,
which Task 6 rewires).

- [ ] **Step 7: Commit**

```bash
cd frontend
git add components/AppNav.tsx components/AppNav.test.tsx
git commit -m "feat(frontend): add AppNav (desktop top bar / mobile bottom bar), remove Nav"
```

---

### Task 6: Shell restructure — route groups and layouts

**Files:**
- Modify: `frontend/app/layout.tsx`
- Create: `frontend/app/(marketing)/layout.tsx`
- Create: `frontend/app/(app)/layout.tsx`
- Move: `frontend/app/page.tsx` → `frontend/app/(marketing)/page.tsx`
- Move: `frontend/app/page.test.tsx` → `frontend/app/(marketing)/page.test.tsx`
- Move: `frontend/app/about/page.tsx` → `frontend/app/(marketing)/about/page.tsx`
- Move: `frontend/app/about/page.test.tsx` → `frontend/app/(marketing)/about/page.test.tsx`
- Move: `frontend/app/profile/page.tsx` → `frontend/app/(app)/profile/page.tsx`
- Move: `frontend/app/profile/page.test.tsx` → `frontend/app/(app)/profile/page.test.tsx`
- Move: `frontend/app/commitments/page.tsx` → `frontend/app/(app)/commitments/page.tsx`
- Move: `frontend/app/commitments/page.test.tsx` → `frontend/app/(app)/commitments/page.test.tsx`
- Move: `frontend/app/dashboard/page.tsx` → `frontend/app/(app)/dashboard/page.tsx`
- Move: `frontend/app/dashboard/page.test.tsx` → `frontend/app/(app)/dashboard/page.test.tsx`
- Move: `frontend/app/simulator/page.tsx` → `frontend/app/(app)/simulator/page.tsx`
- Move: `frontend/app/simulator/page.test.tsx` → `frontend/app/(app)/simulator/page.test.tsx`

**Interfaces:**
- Consumes: `MarketingNav` (Task 4), `AppNav` (Task 5), `SyntheticDataNotice` (existing, unchanged
  props — `export function SyntheticDataNotice(): JSX.Element`).
- Produces: URLs are unchanged (`(marketing)`/`(app)` are route groups — they don't appear in the
  URL). `SyntheticDataNotice` moves from the root layout into each shell layout, so it still renders
  on every page, but its own bottom margin now lives with the shell that needs it (see Step 3 — this
  is what stops the app shell's fixed bottom nav from covering it on mobile).

- [ ] **Step 1: Move the page files, preserving history**

```bash
cd frontend
mkdir -p "app/(marketing)/about" "app/(app)/profile" "app/(app)/commitments" \
         "app/(app)/dashboard" "app/(app)/simulator"

git mv app/page.tsx "app/(marketing)/page.tsx"
git mv app/page.test.tsx "app/(marketing)/page.test.tsx"
git mv app/about/page.tsx "app/(marketing)/about/page.tsx"
git mv app/about/page.test.tsx "app/(marketing)/about/page.test.tsx"

git mv app/profile/page.tsx "app/(app)/profile/page.tsx"
git mv app/profile/page.test.tsx "app/(app)/profile/page.test.tsx"
git mv app/commitments/page.tsx "app/(app)/commitments/page.tsx"
git mv app/commitments/page.test.tsx "app/(app)/commitments/page.test.tsx"
git mv app/dashboard/page.tsx "app/(app)/dashboard/page.tsx"
git mv app/dashboard/page.test.tsx "app/(app)/dashboard/page.test.tsx"
git mv app/simulator/page.tsx "app/(app)/simulator/page.tsx"
git mv app/simulator/page.test.tsx "app/(app)/simulator/page.test.tsx"

rmdir app/about app/profile app/commitments app/dashboard app/simulator
```

- [ ] **Step 2: Create `app/(marketing)/layout.tsx`**

```tsx
import type { ReactNode } from "react";
import { MarketingNav } from "@/components/MarketingNav";
import { SyntheticDataNotice } from "@/components/SyntheticDataNotice";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNav />
      {children}
      <SyntheticDataNotice />
    </>
  );
}
```

- [ ] **Step 3: Create `app/(app)/layout.tsx`**

```tsx
import type { ReactNode } from "react";
import { AppNav } from "@/components/AppNav";
import { SyntheticDataNotice } from "@/components/SyntheticDataNotice";

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppNav />
      {/* pb-20 clears the fixed mobile bottom nav (AppNav) so it never covers page content or
          the synthetic-data footer; not needed on desktop, where AppNav is a normal top bar. */}
      <div className="pb-20 md:pb-0">
        {children}
        <SyntheticDataNotice />
      </div>
    </>
  );
}
```

- [ ] **Step 4: Simplify the root layout**

Replace `frontend/app/layout.tsx`'s body entirely — it no longer renders any nav or the footer
notice (both shells now own their own):

```tsx
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "KIRA+",
  description: "Kira Dulu. Baru Commit.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-surface font-body text-navy">{children}</body>
    </html>
  );
}
```

(This absorbs Task 2's font-loader change if it hasn't already landed in this exact form — confirm
the diff matches; don't duplicate the `Inter(...)` call.)

- [ ] **Step 5: Run the full test suite**

Run: `cd frontend && npm test`
Expected: all tests pass — every moved `page.test.tsx` imports its sibling `./page` by relative
path, which still resolves after the move.

- [ ] **Step 6: Verify the build and route URLs**

Run: `cd frontend && npm run build`
Expected: build succeeds. Route groups don't appear in the URL — confirm by checking the build's
route manifest output (`.next/` route list, printed in the `next build` summary) still lists `/`,
`/about`, `/profile`, `/commitments`, `/dashboard`, `/simulator` with no `(marketing)`/`(app)`
segment.

- [ ] **Step 7: Commit**

```bash
cd frontend
git add -A
git commit -m "feat(frontend): split app into marketing and app-shell route groups"
```

---

### Task 7: Marketing pages — token sweep (landing + about)

**Files:**
- Modify: `frontend/app/(marketing)/page.tsx`
- Modify: `frontend/app/(marketing)/about/page.tsx`

**Interfaces:**
- Consumes: `border-border`, `bg-surface`, `bg-surface-alt`, `text-slate`, `text-mist`,
  `shadow-card` (Task 1). No component signatures involved — plain className edits.

- [ ] **Step 1: Landing page (`app/(marketing)/page.tsx`) — token/radius sweep**

Replace this block:

```tsx
        <div className="relative border border-navy/10 bg-paper p-6">
          <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-wider text-navy/40">
            KIRA score -- live preview
          </span>
          <div className="flex flex-col items-center pt-6">
            <ScoreGauge score={AISYAH.expected.score} band={AISYAH.expected.band} />
          </div>
          <div className="mt-5 flex flex-col gap-2.5 border-t border-dashed border-navy/15 pt-4">
```

with:

```tsx
        <div className="relative rounded-xl border border-border bg-surface p-6 shadow-card">
          <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-wider text-mist">
            KIRA score -- live preview
          </span>
          <div className="flex flex-col items-center pt-6">
            <ScoreGauge score={AISYAH.expected.score} band={AISYAH.expected.band} />
          </div>
          <div className="mt-5 flex flex-col gap-2.5 border-t border-dashed border-border pt-4">
```

Then, in the same file:
- Hero paragraph: `text-navy/75` → `text-slate`
- "How it works" intro paragraph: `text-navy/70` → `text-slate`
- Step `<span>` number: `text-navy/40` → `text-mist`
- Step description: `text-navy/75` → `text-slate`
- Quotes `<section>`: `border-y border-navy/10 bg-navy/[0.02]` → `border-y border-border bg-surface-alt`
- Quote `<cite>`: `text-navy/50` → `text-mist`

Leave the `border-t-2 border-navy` step-marker rule and the `StatTile`'s `text-risk-high`
`valueClassName` unchanged — both are intentional accent colors, not neutral-scale text.

- [ ] **Step 2: About page (`app/(marketing)/about/page.tsx`) — token/radius sweep**

- Methodology paragraph: `text-navy/80` → `text-slate`
- Table header row: `text-navy/50` → `text-mist`
- Table body rows: `border-t border-navy/10` → `border-t border-border`; feature description cell
  `text-navy/70` → `text-slate`
- The formula `<pre>` block: `border border-navy/10 bg-navy/[0.02] p-4` →
  `rounded-xl border border-border bg-surface-alt p-4`
- Closing paragraph after the table: `text-navy/70` → `text-slate`
- All six `<dd>` elements in the Limitations list: `text-navy/75` → `text-slate`

- [ ] **Step 3: Run the tests for both pages**

Run: `cd frontend && npx vitest run "app/(marketing)/page.test.tsx" "app/(marketing)/about/page.test.tsx"`
Expected: all pass unchanged — neither test file asserts on any of the classes just edited (confirmed
by inspection before writing this plan).

- [ ] **Step 4: Commit**

```bash
cd frontend
git add "app/(marketing)/page.tsx" "app/(marketing)/about/page.tsx"
git commit -m "feat(frontend): restyle landing and about pages to the new token system"
```

---

### Task 8: App-shell shared components — token sweep

**Files:**
- Modify: `frontend/app/(app)/dashboard/page.tsx`
- Modify: `frontend/app/(app)/simulator/page.tsx`
- Modify: `frontend/components/ScoreGauge.tsx`
- Modify: `frontend/components/FactorBreakdown.tsx`
- Modify: `frontend/components/SyntheticDataNotice.tsx`

**Interfaces:**
- Consumes: `border-border`, `text-mist`, `text-slate`, `bg-surface` (Task 1).
- Produces: no prop/signature changes anywhere in this task.

`WarningList.tsx` and `VerdictBanner.tsx` need **no changes** — both were checked and use only
`risk-*` classes plus unstyled default text, no `navy`/`paper` opacity classes to migrate.

- [ ] **Step 1: Dashboard page — disclaimer paragraph**

In `app/(app)/dashboard/page.tsx`, change:

```tsx
          <p className="mt-5 border-t border-dashed border-navy/15 pt-3.5 text-xs leading-relaxed text-navy/60">
```

to:

```tsx
          <p className="mt-5 border-t border-dashed border-border pt-3.5 text-xs leading-relaxed text-mist">
```

- [ ] **Step 2: Simulator page — label and input**

In `app/(app)/simulator/page.tsx`, change:

```tsx
        <label htmlFor="purchase-price" className="block text-sm font-medium text-navy/80">
          Purchase price (RM)
        </label>
        <input
          id="purchase-price"
          type="number"
          value={priceRinggit}
          onChange={(e) => setPriceRinggit(e.target.value)}
          className="mt-1 w-full border border-navy/15 bg-paper px-3 py-2 text-sm focus:border-teal focus:outline-none"
        />
```

to:

```tsx
        <label htmlFor="purchase-price" className="block text-sm font-medium text-slate">
          Purchase price (RM)
        </label>
        <input
          id="purchase-price"
          type="number"
          value={priceRinggit}
          onChange={(e) => setPriceRinggit(e.target.value)}
          className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm tabular-nums focus:border-teal focus:outline-none"
        />
```

- [ ] **Step 3: `ScoreGauge.tsx` — tabular figure**

Change the center score `<text>` element's className from `"font-mono text-3xl fill-navy"` to
`"font-mono text-3xl tabular-nums fill-navy"`. Leave `stroke-navy/10` (the gauge's background
track) unchanged — it's a chart color, not body text/border.

- [ ] **Step 4: `FactorBreakdown.tsx` — neutral tokens and tabular figure**

Change:
- Header row: `text-navy/40` → `text-mist`
- Per-row meta text (`w{weight} · sub ... · fig ...`): `text-navy/45` → `text-mist`
- Divider span: `border-dotted border-navy/30` → `border-dotted border-mist`
- Contribution figure span: `"w-20 text-right font-mono text-sm"` →
  `"w-20 text-right font-mono text-sm tabular-nums"`

Leave the Recharts `<Bar fill="#0F5C56" />` and `<CartesianGrid>` untouched — chart colors, not
typography/neutral tokens, and `design.md`'s chart-choice decision is out of scope for this plan.

- [ ] **Step 5: `SyntheticDataNotice.tsx`**

Change:

```tsx
    <footer className="border-t border-navy/10 bg-paper px-4 py-2 text-center text-sm text-navy/70">
```

to:

```tsx
    <footer className="border-t border-border bg-surface px-4 py-2 text-center text-sm text-slate">
```

- [ ] **Step 6: Run the affected tests**

Run:
```bash
cd frontend
npx vitest run "app/(app)/dashboard/page.test.tsx" "app/(app)/simulator/page.test.tsx" \
  components/ScoreGauge.test.tsx components/FactorBreakdown.test.tsx \
  components/WarningList.test.tsx
```
Expected: all pass unchanged (none of these test files assert on the classes just edited — confirmed
by inspection before writing this plan).

- [ ] **Step 7: Commit**

```bash
cd frontend
git add "app/(app)/dashboard/page.tsx" "app/(app)/simulator/page.tsx" \
        components/ScoreGauge.tsx components/FactorBreakdown.tsx components/SyntheticDataNotice.tsx
git commit -m "feat(frontend): restyle dashboard/simulator shared components to the new token system"
```

---

### Task 9: `SimulatorPanel` — token sweep + mobile column stacking

**Files:**
- Modify: `frontend/components/SimulatorPanel.tsx`
- Modify: `frontend/components/SimulatorPanel.test.tsx`

**Interfaces:**
- Consumes: `text-slate`, `text-mist` (Task 1).
- Produces: no prop/signature changes — `{ grid, tenure, onTenureChange, bandBefore, scoreBefore,
  bufferBeforeSen }` is unchanged.

Discovered during planning: the Before/After block currently renders
`<div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3">` — a **fixed** two-column grid with no
responsive breakpoint at all, so it's already forcing two cramped columns even at 375px today. This
task fixes that alongside the token sweep.

- [ ] **Step 1: Write a failing test for the mobile stacking behavior**

Add this test to `SimulatorPanel.test.tsx`:

```tsx
  it("stacks the Before/After columns to one column below the md breakpoint", () => {
    const { container } = render(
      <SimulatorPanel
        grid={AISYAH_GRID}
        tenure={12}
        onTenureChange={vi.fn()}
        bandBefore="MODERATE RISK"
        scoreBefore={68}
        bufferBeforeSen={95000}
      />
    );
    const beforeLabel = screen.getByText("Before");
    const grid = beforeLabel.parentElement;
    expect(grid).toHaveClass("grid-cols-1", "md:grid-cols-2");
  });
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd frontend && npx vitest run components/SimulatorPanel.test.tsx`
Expected: FAIL — the current grid has `grid-cols-2`, not `grid-cols-1`/`md:grid-cols-2`.

- [ ] **Step 3: Implement the fix and the token sweep**

Change:

```tsx
        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <p className="font-mono text-[11px] uppercase text-navy/40">Before</p>
```

to:

```tsx
        <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2 md:gap-y-3">
          <div>
            <p className="font-mono text-[11px] uppercase text-mist">Before</p>
```

and the matching "After" label's `text-navy/40` to `text-mist` as well. Also change:
- Tenure `<label>`: `text-navy/80` → `text-slate`
- Alternative card's monthly-price line: `text-navy/70` → `text-slate`

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd frontend && npx vitest run components/SimulatorPanel.test.tsx`
Expected: PASS, all 6 tests.

- [ ] **Step 5: Commit**

```bash
cd frontend
git add components/SimulatorPanel.tsx components/SimulatorPanel.test.tsx
git commit -m "fix(frontend): stack SimulatorPanel's before/after columns on mobile"
```

---

### Task 10: Profile page & `ProfileForm` — token sweep

**Files:**
- Modify: `frontend/components/ProfileForm.tsx`
- Modify: `frontend/app/(app)/profile/page.tsx` (verify only — see Step 2)
- Modify: `frontend/app/(app)/commitments/page.tsx` (verify only — see Step 2)

**Interfaces:**
- Consumes: `border-border`, `bg-surface`, `text-slate` (Task 1).
- Produces: no prop/signature changes.

- [ ] **Step 1: `ProfileForm.tsx` — token/radius sweep**

Change:

```tsx
  const inputClasses =
    "mt-1 w-full border border-navy/15 bg-paper px-3 py-2 text-sm focus:border-teal focus:outline-none";
  const labelClasses = "block text-sm font-medium text-navy/80";
```

to:

```tsx
  const inputClasses =
    "mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm focus:border-teal focus:outline-none";
  const labelClasses = "block text-sm font-medium text-slate";
```

Change the demo-persona button's className from
`"border border-navy/10 p-4 text-left hover:border-teal"` to
`"rounded-xl border border-border p-4 text-left hover:border-teal"`, and its quote paragraph from
`"mt-1.5 text-sm italic text-navy/70"` to `"mt-1.5 text-sm italic text-slate"`.

- [ ] **Step 2: Verify `app/(app)/profile/page.tsx` and `app/(app)/commitments/page.tsx` need no edits**

Both pages only use `<h1 className="font-display text-3xl">`, `role="alert"`/`role="status"`
paragraphs with no color classes, and delegate all styled content to `ProfileForm` /
`CommitmentsTable`. Confirm by reading both files — if either has a stray `navy/`-opacity or
`bg-paper` class not caught here, apply the same substitution rules as Step 1 (border → `border-
border`, muted text → `text-slate` or `text-mist`, `bg-paper` → `bg-surface`).

- [ ] **Step 3: Run the affected tests**

Run:
```bash
cd frontend
npx vitest run components/ProfileForm.test.tsx \
  "app/(app)/profile/page.test.tsx" "app/(app)/commitments/page.test.tsx"
```
Expected: all pass unchanged.

- [ ] **Step 4: Commit**

```bash
cd frontend
git add components/ProfileForm.tsx "app/(app)/profile/page.tsx" "app/(app)/commitments/page.tsx"
git commit -m "feat(frontend): restyle ProfileForm to the new token system"
```

---

### Task 11: `CommitmentsTable` — token sweep + mobile stacked-card layout

**Files:**
- Modify: `frontend/components/CommitmentsTable.tsx`
- Modify: `frontend/components/CommitmentsTable.test.tsx`

**Interfaces:**
- Consumes: `border-border`, `bg-surface`, `text-slate`, `text-mist` (Task 1); `updateField`,
  `removeRow`, `KINDS` (existing internal helpers in this file — unchanged signatures).
- Produces: no change to the `{ commitments, onChange }` props. Desktop (`≥768px`) keeps the
  existing table; a new mobile (`<768px`) card-per-commitment view is added alongside it, both
  wrapped in `data-testid`-tagged containers so tests can disambiguate identical field labels that
  now exist in both views.

Desktop and mobile intentionally reuse the **same** `aria-label` text per field (e.g. `"Monthly 1"`,
`"Remove"`) — that's the correct real-world accessible name for the same conceptual action, and in a
real browser only one of the two is ever in the accessibility tree (the other has `display: none`
via the `hidden`/`md:hidden` Tailwind class). jsdom doesn't evaluate that, so tests scope with
`within(...)` on the `data-testid` wrapper instead of relying on visibility.

- [ ] **Step 1: Update existing tests to scope by `data-testid`, and add mobile-view tests**

Add `within` to the import:

```ts
import { fireEvent, render, screen, within } from "@testing-library/react";
```

Change the empty-state test from:

```ts
  it("renders an empty state, not an error, for zero commitments", () => {
    render(<CommitmentsTable commitments={[]} onChange={vi.fn()} />);
    expect(screen.getByText(/no commitments yet/i)).toBeInTheDocument();
  });
```

to:

```ts
  it("renders an empty state, not an error, for zero commitments", () => {
    render(<CommitmentsTable commitments={[]} onChange={vi.fn()} />);
    expect(screen.getAllByText(/no commitments yet/i)).toHaveLength(2);
  });
```

Change the "editing" test from:

```ts
  it("editing a commitment's monthly amount calls onChange with the sen-converted value", () => {
    const onChange = vi.fn();
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Monthly 1"), { target: { value: "200" } });
```

to:

```ts
  it("editing a commitment's monthly amount calls onChange with the sen-converted value", () => {
    const onChange = vi.fn();
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={onChange} />);
    const desktop = within(screen.getByTestId("commitments-desktop"));
    fireEvent.change(desktop.getByLabelText("Monthly 1"), { target: { value: "200" } });
```

Change the "removing" test from:

```ts
  it("removing a row calls onChange without that commitment", () => {
    const onChange = vi.fn();
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("button", { name: /remove/i })[0]);
```

to:

```ts
  it("removing a row calls onChange without that commitment", () => {
    const onChange = vi.fn();
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={onChange} />);
    const desktop = within(screen.getByTestId("commitments-desktop"));
    fireEvent.click(desktop.getAllByRole("button", { name: /remove/i })[0]);
```

Leave the aggregate-card, obligations-breakdown, and add-commitment tests untouched — they query
the shared summary cards or the single "Add commitment" button, neither of which is duplicated.

Then add three new tests at the end of the `describe` block:

```ts
  it("renders the same commitments as cards in the mobile view", () => {
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={vi.fn()} />);
    const mobile = within(screen.getByTestId("commitments-mobile"));
    expect(mobile.getByLabelText("Label 1")).toHaveValue("Apparel — Uniqlo & Zara");
  });

  it("editing a commitment in the mobile view calls onChange with the sen-converted value", () => {
    const onChange = vi.fn();
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={onChange} />);
    const mobile = within(screen.getByTestId("commitments-mobile"));
    fireEvent.change(mobile.getByLabelText("Monthly 1"), { target: { value: "200" } });
    expect(onChange).toHaveBeenCalledWith([
      { ...AISYAH.profile.commitments[0], monthly_sen: 20000 },
      AISYAH.profile.commitments[1],
      AISYAH.profile.commitments[2],
    ]);
  });

  it("removing a row from the mobile view calls onChange without that commitment", () => {
    const onChange = vi.fn();
    render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={onChange} />);
    const mobile = within(screen.getByTestId("commitments-mobile"));
    fireEvent.click(mobile.getAllByRole("button", { name: /remove/i })[0]);
    expect(onChange).toHaveBeenCalledWith([
      AISYAH.profile.commitments[1],
      AISYAH.profile.commitments[2],
    ]);
  });
```

- [ ] **Step 2: Run the tests to verify the new/changed ones fail**

Run: `cd frontend && npx vitest run components/CommitmentsTable.test.tsx`
Expected: FAIL — `getByTestId("commitments-desktop")` / `commitments-mobile"` don't exist yet, and
the mobile-view tests can't find their targets.

- [ ] **Step 3: Wrap the existing table in a desktop-only container, with token/radius updates**

Wrap the existing `<table>` element (everything from `<table className="w-full text-sm">` through
its closing `</table>`) in:

```tsx
        <div data-testid="commitments-desktop" className="hidden md:block">
          <table className="w-full text-sm">
            {/* ...unchanged table contents, except the token/radius edits below... */}
          </table>
        </div>
```

Within that table, apply these substitutions (same pattern as every prior sweep task):
- Header row: `text-left text-xs uppercase text-navy/50` → `text-left text-xs uppercase text-mist`
- Empty-state `<td>`: `py-4 text-navy/60` → `py-4 text-slate`
- Row: `border-t border-navy/10` → `border-t border-border`
- All seven `input`/`select` elements' shared class fragment `border border-navy/15 px-2 py-1` →
  `rounded-xl border border-border px-2 py-1` (keep each element's own `w-*` width classes as they
  are today).

- [ ] **Step 4: Add the mobile card-stack view, right after the desktop `</div>`**

```tsx
        <div data-testid="commitments-mobile" className="flex flex-col gap-3 md:hidden">
          {commitments.length === 0 && <p className="text-slate">No commitments yet.</p>}
          {commitments.map((commitment, index) => (
            <div
              key={commitment.commitment_id}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <input
                    aria-label={`Label ${index + 1}`}
                    value={commitment.label}
                    onChange={(e) => updateField(index, "label", e.target.value)}
                    placeholder="Label"
                    className="w-full rounded-lg border border-border px-2 py-1 text-sm font-semibold"
                  />
                  <input
                    aria-label={`Provider ${index + 1}`}
                    value={commitment.provider}
                    onChange={(e) => updateField(index, "provider", e.target.value)}
                    placeholder="Provider"
                    className="mt-1 w-full rounded-lg border border-border px-2 py-1 text-xs text-slate"
                  />
                </div>
                <select
                  aria-label={`Kind ${index + 1}`}
                  value={commitment.kind}
                  onChange={(e) => updateField(index, "kind", e.target.value)}
                  className="rounded-xl border border-border px-2 py-1 text-xs uppercase"
                >
                  {KINDS.map((kind) => (
                    <option key={kind} value={kind}>
                      {kind}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase text-mist">Monthly (RM)</p>
                  <input
                    aria-label={`Monthly ${index + 1}`}
                    type="number"
                    value={commitment.monthly_sen / 100}
                    onChange={(e) => updateField(index, "monthly_sen", e.target.value)}
                    className="mt-0.5 w-full rounded-lg border border-border px-2 py-1 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-mist">Outstanding (RM)</p>
                  <input
                    aria-label={`Outstanding ${index + 1}`}
                    type="number"
                    value={commitment.outstanding_sen / 100}
                    onChange={(e) => updateField(index, "outstanding_sen", e.target.value)}
                    className="mt-0.5 w-full rounded-lg border border-border px-2 py-1 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-mist">Months left</p>
                  <input
                    aria-label={`Months left ${index + 1}`}
                    type="number"
                    value={commitment.months_left}
                    onChange={(e) => updateField(index, "months_left", e.target.value)}
                    className="mt-0.5 w-full rounded-lg border border-border px-2 py-1 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-mist">Next due</p>
                  <input
                    aria-label={`Next due ${index + 1}`}
                    type="date"
                    value={commitment.next_due ?? ""}
                    onChange={(e) => updateField(index, "next_due", e.target.value)}
                    className="mt-0.5 w-full rounded-lg border border-border px-2 py-1 text-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="mt-3 text-xs text-risk-high hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
```

`KINDS`, `updateField`, and `removeRow` are the same functions already defined earlier in this
component — no new imports needed.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `cd frontend && npx vitest run components/CommitmentsTable.test.tsx`
Expected: PASS, all 11 tests (5 original desktop tests + the empty-state update + 3 new mobile
tests, with the editing/removing tests now scoped to `commitments-desktop`).

- [ ] **Step 6: Run the whole suite and the build**

Run: `cd frontend && npm test && npm run build`
Expected: both succeed.

- [ ] **Step 7: Commit**

```bash
cd frontend
git add components/CommitmentsTable.tsx components/CommitmentsTable.test.tsx
git commit -m "feat(frontend): add mobile stacked-card layout to CommitmentsTable"
```

---

### Task 12: Cleanup + full verification pass

**Files:**
- Modify: `frontend/tailwind.config.ts` (only if Step 1 finds `paper` fully unused)

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new — this task only removes dead config and verifies the whole plan.

- [ ] **Step 1: Confirm `paper` is no longer referenced anywhere in `frontend/`**

Run:
```bash
cd frontend
grep -rn "paper" app components lib --include="*.tsx" --include="*.ts" | grep -v "\.test\."
```

Expected: no output (every `bg-paper`/`text-paper` call site was migrated in Tasks 3, 7, 8, 9). If
anything remains, apply the same substitution rules as the earlier sweep tasks (`bg-paper` →
`bg-surface`) before continuing.

- [ ] **Step 2: Remove the unused `paper` token**

In `frontend/tailwind.config.ts`, delete the `paper: "#FBFAF7",` line from `colors`.

- [ ] **Step 3: Full automated verification**

Run, from `frontend/`:
```bash
npm run lint
npm test
npm run build
```
Expected: all three succeed with zero errors.

- [ ] **Step 4: Manual Playwright verification, mobile and desktop**

Using the Playwright MCP tools (as used earlier this session to verify the dashboard/simulator
against the mock backend): start `npm run dev`, then for **both** a mobile viewport (375×667) and a
desktop viewport (1280×800), visit all seven routes — `/`, `/about`, `/profile`, `/commitments`,
`/dashboard`, `/simulator` (the last two need a saved demo profile first, same as earlier this
session) — and confirm:
- Marketing shell shows `MarketingNav` (collapsible hamburger on mobile, inline links + Dashboard
  button on desktop); app shell shows `AppNav` (bottom tabs on mobile, top bar with links on the
  right on desktop).
- No page shows the old warm-paper background — every page canvas is `#FFFFFF`.
- The `CommitmentsTable` renders as stacked cards on mobile and as the table on desktop.
- The `SyntheticDataNotice` footer is visible (not covered by the fixed mobile bottom nav) on every
  app-shell page.

Take screenshots at both viewports for at least the landing page, dashboard, and commitments pages,
and report any visual issue found back before considering this task done.

- [ ] **Step 5: Commit**

```bash
cd frontend
git add tailwind.config.ts
git commit -m "chore(frontend): remove unused paper color token after full token migration"
```
