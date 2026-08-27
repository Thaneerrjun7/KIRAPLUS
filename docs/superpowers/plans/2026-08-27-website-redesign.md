# Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply one shared design system (typography scale, `Button`/`Card`/`Badge`/`StatTile` primitives, Heroicons for functional icons only) across the landing page, nav, and all five MVP pages, per the approved mockup and design spec.

**Architecture:** Four new presentational primitives in `frontend/components/ui/`, each with zero dependency on `lib/api.ts` or data flow. Nav and the landing page are rebuilt using them. Each of the five existing app pages/components is restyled in place — same props, same data flow, new markup and classes only.

**Tech Stack:** Next.js App Router, Tailwind CSS (existing `tailwind.config.ts` tokens only — no new colors), `@heroicons/react` (new dependency), Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-27-website-redesign-design.md`. Visual reference: the approved mockup (landing + Dashboard) published during brainstorming — reproduce its ledger-line pattern (label, dotted leader rule, mono value), mono bracket badges (`[STRONG]`), and hairline-bordered panels exactly.

## Global Constraints

- Colors: only `frontend/tailwind.config.ts`'s existing tokens (`navy`, `teal`, `jade`, `gold`, `paper`, `risk.{low,moderate,high}`). No new colors.
- Fonts: unchanged — `font-display` (Bricolage Grotesque), `font-body` (Source Serif 4, the `<body>` default), `font-mono` (IBM Plex Mono) for every monetary/score figure.
- No changes to `lib/api.ts`, service call shapes, or any `lib/*` pure function's behavior (`format.ts`, `theme.ts`, `verdict.ts`, `factorConfig.ts`, `aggregateCommitments.ts`, `validateProfile.ts`).
- No content/copy changes beyond what each task explicitly adds (persona quotes, step descriptions) — all sourced from `lib/fixtures.ts` or already-existing strings, never invented facts.
- TDD throughout: write the failing test, watch it fail, implement, watch it pass, commit. Where an existing test breaks because markup changed, fix the assertion to match the new (still-correct) structure — never delete or weaken an assertion to make it pass.
- Every task run: `cd frontend && npm test`, `npm run lint`, `npx tsc --noEmit` must all be clean before moving to the next task.
- Keep `data-testid`/`data-weakest` attributes already relied on by tests (`FactorBreakdown`) unless a task explicitly changes them.

---

### Task 1: `Button` primitive

**Files:**
- Create: `frontend/components/ui/Button.tsx`
- Test: `frontend/components/ui/Button.test.tsx`

**Interfaces:**
- Produces: `Button({ variant?: "primary" | "secondary", href?: string, className?: string, children, ...rest })` — renders `<button type="button">` normally, or a Next.js `<Link>` when `href` is given. Used by Task 6 (landing CTA) and later page-restyle tasks (Save/Add/Remove buttons).

- [ ] **Step 1: Write the failing test**

```tsx
// frontend/components/ui/Button.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button element by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("applies primary variant classes by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-teal");
  });

  it("applies secondary variant classes when specified", () => {
    render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-navy/20");
  });

  it("renders as a link when href is given", () => {
    render(<Button href="/profile">Get started</Button>);
    expect(screen.getByRole("link", { name: "Get started" })).toHaveAttribute(
      "href",
      "/profile"
    );
  });

  it("forwards onClick to the underlying button", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- ui/Button.test.tsx`
Expected: FAIL — cannot resolve `./Button`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// frontend/components/ui/Button.tsx
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-teal text-paper hover:bg-navy",
  secondary: "border border-navy/20 text-navy hover:bg-navy/5",
};

const BASE_CLASSES =
  "inline-flex items-center gap-2 px-5 py-2.5 font-display text-sm font-semibold transition-colors";

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = "primary", children, className = "", ...rest }: ButtonProps) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`.trim();

  if (rest.href) {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const { href: _href, ...buttonRest } = rest as ButtonAsButton;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- ui/Button.test.tsx`
Expected: PASS, 5/5.

- [ ] **Step 5: Lint and typecheck**

Run: `cd frontend && npm run lint && npx tsc --noEmit`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add frontend/components/ui/Button.tsx frontend/components/ui/Button.test.tsx
git commit -m "feat(frontend): add Button primitive"
```

---

### Task 2: `Card` primitive

**Files:**
- Create: `frontend/components/ui/Card.tsx`
- Test: `frontend/components/ui/Card.test.tsx`

**Interfaces:**
- Produces: `Card({ children, className?: string, label?: string })` — a hairline-bordered panel; `label` renders a small mono corner tag (the "ledger account code" motif from the mockup). Used by every page-restyle task from Task 7 onward.

- [ ] **Step 1: Write the failing test**

```tsx
// frontend/components/ui/Card.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders its children", () => {
    render(<Card>Hello</Card>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders a corner label when given", () => {
    render(<Card label="SCORE">Hello</Card>);
    expect(screen.getByText("SCORE")).toBeInTheDocument();
  });

  it("renders no label element when omitted", () => {
    const { container } = render(<Card>Hello</Card>);
    expect(container.querySelectorAll("span").length).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- ui/Card.test.tsx`
Expected: FAIL — cannot resolve `./Card`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// frontend/components/ui/Card.tsx
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  label?: string;
};

export function Card({ children, className = "", label }: Props) {
  return (
    <div className={`relative border border-navy/10 bg-paper p-6 ${className}`.trim()}>
      {label && (
        <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-wider text-navy/40">
          {label}
        </span>
      )}
      <div className={label ? "pt-4" : ""}>{children}</div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- ui/Card.test.tsx`
Expected: PASS, 3/3.

- [ ] **Step 5: Lint and typecheck, then commit**

```bash
cd frontend && npm run lint && npx tsc --noEmit
git add frontend/components/ui/Card.tsx frontend/components/ui/Card.test.tsx
git commit -m "feat(frontend): add Card primitive"
```

---

### Task 3: `Badge` primitive

**Files:**
- Create: `frontend/components/ui/Badge.tsx`
- Test: `frontend/components/ui/Badge.test.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `Badge({ children: string, risk?: "low" | "moderate" | "high" | "neutral" })` — renders `[TEXT]` in mono, colored by risk. Used by Task 8 (Commitments kind tags), Task 10 (FactorBreakdown Strength column).

- [ ] **Step 1: Write the failing test**

```tsx
// frontend/components/ui/Badge.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders the text wrapped in brackets", () => {
    render(<Badge>STRONG</Badge>);
    expect(screen.getByText("[STRONG]")).toBeInTheDocument();
  });

  it("colors a high-risk badge with the risk-high token", () => {
    render(<Badge risk="high">CRITICAL</Badge>);
    expect(screen.getByText("[CRITICAL]")).toHaveClass("text-risk-high");
  });

  it("colors a low-risk badge with the risk-low token", () => {
    render(<Badge risk="low">STRONG</Badge>);
    expect(screen.getByText("[STRONG]")).toHaveClass("text-risk-low");
  });

  it("defaults to a neutral color when risk is omitted", () => {
    render(<Badge>ADEQUATE</Badge>);
    expect(screen.getByText("[ADEQUATE]")).toHaveClass("text-navy/50");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- ui/Badge.test.tsx`
Expected: FAIL — cannot resolve `./Badge`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// frontend/components/ui/Badge.tsx
type RiskLevel = "low" | "moderate" | "high" | "neutral";

const RISK_CLASSES: Record<RiskLevel, string> = {
  low: "text-risk-low",
  moderate: "text-risk-moderate",
  high: "text-risk-high",
  neutral: "text-navy/50",
};

type Props = {
  children: string;
  risk?: RiskLevel;
};

export function Badge({ children, risk = "neutral" }: Props) {
  return (
    <span className={`font-mono text-xs font-medium uppercase tracking-wide ${RISK_CLASSES[risk]}`}>
      [{children}]
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- ui/Badge.test.tsx`
Expected: PASS, 4/4.

- [ ] **Step 5: Lint and typecheck, then commit**

```bash
cd frontend && npm run lint && npx tsc --noEmit
git add frontend/components/ui/Badge.tsx frontend/components/ui/Badge.test.tsx
git commit -m "feat(frontend): add Badge primitive"
```

---

### Task 4: `StatTile` primitive

**Files:**
- Create: `frontend/components/ui/StatTile.tsx`
- Test: `frontend/components/ui/StatTile.test.tsx`

**Interfaces:**
- Produces: `StatTile({ label: string, value: string, valueClassName?: string })` — a leader-dot label/value row (the mockup's "Monthly buffer ⋯⋯⋯ RM950" pattern). Used by Task 6 (landing hero), Task 8 (Commitments), Task 11 (Simulator).

- [ ] **Step 1: Write the failing test**

```tsx
// frontend/components/ui/StatTile.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatTile } from "./StatTile";

describe("StatTile", () => {
  it("renders the label and value as separately queryable text", () => {
    render(<StatTile label="Monthly buffer" value="RM950" />);
    expect(screen.getByText("Monthly buffer")).toBeInTheDocument();
    expect(screen.getByText("RM950")).toBeInTheDocument();
  });

  it("applies a custom value class when given", () => {
    render(<StatTile label="After purchase" value="RM750" valueClassName="text-risk-high" />);
    expect(screen.getByText("RM750")).toHaveClass("text-risk-high");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- ui/StatTile.test.tsx`
Expected: FAIL — cannot resolve `./StatTile`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// frontend/components/ui/StatTile.tsx
type Props = {
  label: string;
  value: string;
  valueClassName?: string;
};

export function StatTile({ label, value, valueClassName = "" }: Props) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-sm">{label}</span>
      <span className="mb-0.5 flex-1 border-b border-dotted border-navy/30" />
      <span className={`font-mono text-sm ${valueClassName}`.trim()}>{value}</span>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- ui/StatTile.test.tsx`
Expected: PASS, 2/2.

- [ ] **Step 5: Lint and typecheck, then commit**

```bash
cd frontend && npm run lint && npx tsc --noEmit
git add frontend/components/ui/StatTile.tsx frontend/components/ui/StatTile.test.tsx
git commit -m "feat(frontend): add StatTile primitive"
```

---

### Task 5: Install `@heroicons/react`, restyle `Nav` with icons and active-route highlighting

**Files:**
- Modify: `frontend/package.json`, `frontend/package-lock.json` (via `npm install`)
- Modify: `frontend/components/Nav.tsx`
- Modify: `frontend/components/Nav.test.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `Nav` unchanged signature (no props), but now client-side (`usePathname`) and highlights the active route.

Current `Nav.tsx` and `Nav.test.tsx` are the plain-link version from `fix/missing-navigation` (already in `main`) — this task replaces both.

- [ ] **Step 1: Install the icon package**

Run: `cd frontend && npm install @heroicons/react`

- [ ] **Step 2: Write the failing test**

```tsx
// frontend/components/Nav.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }));

import { Nav } from "./Nav";

describe("Nav", () => {
  it("links to all five MVP pages", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /profile/i })).toHaveAttribute("href", "/profile");
    expect(screen.getByRole("link", { name: /commitments/i })).toHaveAttribute(
      "href",
      "/commitments"
    );
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByRole("link", { name: /simulator/i })).toHaveAttribute(
      "href",
      "/simulator"
    );
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute("href", "/about");
  });

  it("highlights the current route and not the others", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveClass("border-teal");
    expect(screen.getByRole("link", { name: /profile/i })).not.toHaveClass("border-teal");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd frontend && npm test -- components/Nav.test.tsx`
Expected: FAIL — current `Nav` renders plain links with exact-text names (still matches `/profile/i` etc. so links-test passes), but no element has class `border-teal` yet, so the highlighting test fails.

- [ ] **Step 4: Write minimal implementation**

```tsx
// frontend/components/Nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalculatorIcon,
  ChartBarIcon,
  InformationCircleIcon,
  ListBulletIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType } from "react";

const LINKS: { href: string; label: string; Icon: ComponentType<{ className?: string }> }[] = [
  { href: "/profile", label: "Profile", Icon: UserCircleIcon },
  { href: "/commitments", label: "Commitments", Icon: ListBulletIcon },
  { href: "/dashboard", label: "Dashboard", Icon: ChartBarIcon },
  { href: "/simulator", label: "Simulator", Icon: CalculatorIcon },
  { href: "/about", label: "About", Icon: InformationCircleIcon },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-navy/10 bg-paper px-4 py-3"
    >
      <Link href="/" className="font-display text-lg font-semibold text-navy">
        KIRA+
      </Link>
      {LINKS.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 border-b-2 pb-1 text-sm ${
              active ? "border-teal font-semibold text-navy" : "border-transparent text-navy/70"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd frontend && npm test -- components/Nav.test.tsx`
Expected: PASS, 2/2.

- [ ] **Step 6: Run the full suite** — confirm nothing else broke (page tests that render full pages don't import `Nav`, so this should be isolated).

Run: `cd frontend && npm test`
Expected: all passing.

- [ ] **Step 7: Lint and typecheck, then commit**

```bash
cd frontend && npm run lint && npx tsc --noEmit
git add frontend/package.json frontend/package-lock.json frontend/components/Nav.tsx frontend/components/Nav.test.tsx
git commit -m "feat(frontend): add icons and active-route highlighting to Nav"
```

---

### Task 6: Rebuild the landing page

**Files:**
- Modify: `frontend/app/page.tsx`
- Modify: `frontend/app/page.test.tsx`

**Interfaces:**
- Consumes: `Button` (Task 1), `StatTile` (Task 4), `ScoreGauge` (existing, `frontend/components/ScoreGauge.tsx` — props `{ score: number, band: Band }`), `AISYAH`/`DANIEL` from `@/lib/fixtures` (existing — `.quote: string`, `.label: string`, `.expected.score`, `.expected.band`, `.expected.features.buffer_sen`), `fmtRm` from `@/lib/format`.

Current `page.tsx` is three lines of prose plus one CTA (from `fix/missing-navigation`). This task replaces it with the hero, 3-step process, and persona-quote sections from the approved mockup.

- [ ] **Step 1: Write the failing tests** (append to the existing file; keep the existing "Get started" test)

```tsx
// frontend/app/page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("links to the Profile page as the entry point", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /get started/i })).toHaveAttribute(
      "href",
      "/profile"
    );
  });

  it("shows the live score-gauge preview using Aisyah's fixture score", () => {
    render(<Home />);
    expect(screen.getByText("68")).toBeInTheDocument();
    expect(screen.getByText("MODERATE RISK")).toBeInTheDocument();
  });

  it("lists the three-step process in order", () => {
    render(<Home />);
    const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(headings).toEqual(["Consolidate", "Score", "Simulate"]);
  });

  it("shows real persona quotes, not placeholder copy", () => {
    render(<Home />);
    expect(
      screen.getByText(/I always know I can pay it/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/AISYAH, 26/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- app/page.test.tsx`
Expected: 3 new tests FAIL (current page has none of this content); the "Get started" test still passes.

- [ ] **Step 3: Write the implementation**

```tsx
// frontend/app/page.tsx
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Button } from "@/components/ui/Button";
import { StatTile } from "@/components/ui/StatTile";
import { AISYAH, DANIEL } from "@/lib/fixtures";
import { fmtRm } from "@/lib/format";

// The purchase example matches docs/API-CONTRACT.md §7's own published fixture:
// Aisyah + price_sen=240000, tenure_months=12 -> monthly_sen 20000, buffer 95000 -> 75000.
const EXAMPLE_MONTHLY_SEN = 20000;

const STEPS = [
  {
    number: "01",
    title: "Consolidate",
    description:
      "List every BNPL plan and loan in one place -- the total picture no single provider shows you.",
  },
  {
    number: "02",
    title: "Score",
    description:
      "Six published, weighted factors become one 0-100 KIRA Score -- every weight and formula shown.",
  },
  {
    number: "03",
    title: "Simulate",
    description:
      "Try a purchase before you make it. See exactly what it costs your score and your monthly slack.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
      <section className="grid gap-14 py-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal">
            Financial health, audited
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
            Kira Dulu.
            <br />
            Baru Commit.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-navy/75">
            See the consequences before you commit. KIRA+ consolidates every BNPL plan and loan
            into one score you can audit -- then shows what a new purchase would cost it, before
            you make it.
          </p>
          <Button href="/profile" className="mt-8">
            Get started
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative border border-navy/10 bg-paper p-6">
          <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-wider text-navy/40">
            KIRA score -- live preview
          </span>
          <div className="flex flex-col items-center pt-6">
            <ScoreGauge score={AISYAH.expected.score} band={AISYAH.expected.band} />
          </div>
          <div className="mt-5 flex flex-col gap-2.5 border-t border-dashed border-navy/15 pt-4">
            <StatTile
              label="Monthly buffer"
              value={fmtRm(AISYAH.expected.features.buffer_sen)}
            />
            <StatTile
              label="After RM2,400 / 12 months"
              value={fmtRm(AISYAH.expected.features.buffer_sen - EXAMPLE_MONTHLY_SEN)}
              valueClassName="text-risk-high"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="font-display text-2xl">How it works</h2>
        <p className="mt-2 max-w-md text-navy/70">
          Three steps, in order -- each one feeds the next.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="border-t-2 border-navy pt-4">
              <span className="font-mono text-sm text-navy/40">{step.number}</span>
              <h3 className="mt-1.5 font-display text-lg">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/75">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-y border-navy/10 bg-navy/[0.02] py-12 md:grid-cols-2">
        <blockquote className="m-0">
          <p className="font-body text-lg italic leading-relaxed">&ldquo;{AISYAH.quote}&rdquo;</p>
          <cite className="mt-3 block font-mono text-xs not-italic tracking-wide text-navy/50">
            {AISYAH.label.toUpperCase()}
          </cite>
        </blockquote>
        <blockquote className="m-0">
          <p className="font-body text-lg italic leading-relaxed">&ldquo;{DANIEL.quote}&rdquo;</p>
          <cite className="mt-3 block font-mono text-xs not-italic tracking-wide text-navy/50">
            {DANIEL.label.toUpperCase()}
          </cite>
        </blockquote>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- app/page.test.tsx`
Expected: PASS, 4/4.

- [ ] **Step 5: Lint and typecheck, then commit**

```bash
cd frontend && npm run lint && npx tsc --noEmit
git add frontend/app/page.tsx frontend/app/page.test.tsx
git commit -m "feat(frontend): rebuild the landing page with hero, process steps, and persona quotes"
```

---

### Task 7: Restyle the Profile page

**Files:**
- Modify: `frontend/components/ProfileForm.tsx`
- Modify: `frontend/components/ProfileForm.test.tsx`

**Interfaces:**
- Consumes: `Card` (Task 2), `Button` (Task 1), `AISYAH`/`DANIEL`/`WEIJIAN`/`FARAH` from `@/lib/fixtures` for demo persona quotes.
- Produces: same `ProfileForm` props (`initialProfile?`, `onSave`, `onLoadDemo`) — unchanged, consumed by `app/profile/page.tsx` with no changes needed there.

Demo persona buttons currently show only the label (`Aisyah, 26`). This task shows the persona's real quote too, and wraps the field group and demo-persona group each in a `Card`.

- [ ] **Step 1: Write the failing test** (add to the existing file, keep all existing tests)

```tsx
// add to frontend/components/ProfileForm.test.tsx, inside the existing describe block
it("shows each demo persona's real quote, not just their name", () => {
  render(<ProfileForm onSave={vi.fn()} onLoadDemo={vi.fn()} />);
  expect(
    screen.getByText(/I always know I can pay it/i)
  ).toBeInTheDocument();
});
```

Add the import at the top if not already present: `import { AISYAH } from "@/lib/fixtures";` is not needed in the test itself since the assertion checks rendered text directly.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- components/ProfileForm.test.tsx`
Expected: FAIL — quote text not rendered yet.

- [ ] **Step 3: Write the implementation**

Replace the whole file:

```tsx
// frontend/components/ProfileForm.tsx
"use client";

import { useState } from "react";
import type { Profile } from "@/lib/fixtures";
import { AISYAH, DANIEL, FARAH, WEIJIAN } from "@/lib/fixtures";
import { toSen } from "@/lib/format";
import { validateProfile } from "@/lib/validateProfile";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export type DemoPersonaId = "aisyah" | "daniel" | "weijian" | "farah";

const DEMO_PERSONAS: { id: DemoPersonaId; label: string; quote: string }[] = [
  { id: "aisyah", label: AISYAH.label, quote: AISYAH.quote },
  { id: "daniel", label: DANIEL.label, quote: DANIEL.quote },
  { id: "weijian", label: WEIJIAN.label, quote: WEIJIAN.quote },
  { id: "farah", label: FARAH.label, quote: FARAH.quote },
];

type Props = {
  initialProfile?: Profile;
  onSave: (profile: Profile) => void;
  onLoadDemo: (name: DemoPersonaId) => void;
};

type FieldValues = {
  label: string;
  income: string;
  fixedExpenses: string;
  varExpenses: string;
  savings: string;
  loanMonthly: string;
};

function toFieldValues(profile?: Profile): FieldValues {
  const ringgit = (sen: number) => String(sen / 100);
  return {
    label: profile?.label ?? "",
    income: profile ? ringgit(profile.income_sen) : "",
    fixedExpenses: profile ? ringgit(profile.fixed_expenses_sen) : "",
    varExpenses: profile ? ringgit(profile.var_expenses_sen) : "",
    savings: profile ? ringgit(profile.savings_sen) : "",
    loanMonthly: profile ? ringgit(profile.loan_monthly_sen) : "",
  };
}

export function ProfileForm({ initialProfile, onSave, onLoadDemo }: Props) {
  const [values, setValues] = useState<FieldValues>(() => toFieldValues(initialProfile));
  const [commitments] = useState(initialProfile?.commitments ?? []);
  const [error, setError] = useState<{ field: string; message: string } | null>(null);

  const set = (field: keyof FieldValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: Profile = {
      profile_id: initialProfile?.profile_id ?? null,
      label: values.label,
      income_sen: toSen(Number(values.income) || 0),
      fixed_expenses_sen: toSen(Number(values.fixedExpenses) || 0),
      var_expenses_sen: toSen(Number(values.varExpenses) || 0),
      savings_sen: toSen(Number(values.savings) || 0),
      loan_monthly_sen: toSen(Number(values.loanMonthly) || 0),
      commitments,
    };
    const validationError = validateProfile(profile);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSave(profile);
  };

  const inputClasses =
    "mt-1 w-full border border-navy/15 bg-paper px-3 py-2 text-sm focus:border-teal focus:outline-none";
  const labelClasses = "block text-sm font-medium text-navy/80";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card label="DEMO PERSONAS">
        <h2 className="font-display text-lg">Load a demo persona</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {DEMO_PERSONAS.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => onLoadDemo(persona.id)}
              className="border border-navy/10 p-4 text-left hover:border-teal"
            >
              <p className="font-display text-sm font-semibold">{persona.label}</p>
              <p className="mt-1.5 text-sm italic text-navy/70">&ldquo;{persona.quote}&rdquo;</p>
            </button>
          ))}
        </div>
      </Card>

      <Card label="YOUR PROFILE">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="profile-label" className={labelClasses}>
              Label
            </label>
            <input
              id="profile-label"
              value={values.label}
              onChange={set("label")}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="profile-income" className={labelClasses}>
              Income (RM/month)
            </label>
            <input
              id="profile-income"
              type="number"
              value={values.income}
              onChange={set("income")}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="profile-fixed-expenses" className={labelClasses}>
              Fixed expenses (RM/month)
            </label>
            <input
              id="profile-fixed-expenses"
              type="number"
              value={values.fixedExpenses}
              onChange={set("fixedExpenses")}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="profile-var-expenses" className={labelClasses}>
              Variable expenses (RM/month)
            </label>
            <input
              id="profile-var-expenses"
              type="number"
              value={values.varExpenses}
              onChange={set("varExpenses")}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="profile-savings" className={labelClasses}>
              Savings (RM)
            </label>
            <input
              id="profile-savings"
              type="number"
              value={values.savings}
              onChange={set("savings")}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="profile-loan-monthly" className={labelClasses}>
              Loan monthly repayment (RM/month)
            </label>
            <input
              id="profile-loan-monthly"
              type="number"
              value={values.loanMonthly}
              onChange={set("loanMonthly")}
              className={inputClasses}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-risk-high">
              {error.message}
            </p>
          )}

          <Button type="submit" className="self-start">
            Save profile
          </Button>
        </div>
      </Card>
    </form>
  );
}
```

Note: `Button`'s `type="submit"` needs to pass through — check `Button`'s `ButtonAsButton` type already extends `ButtonHTMLAttributes<HTMLButtonElement>`, which includes `type`, and the implementation spreads `...buttonRest` onto the `<button>`, which currently also hardcodes `type="button"` before the spread — reorder so a passed `type` prop wins:

```tsx
// in frontend/components/ui/Button.tsx, Step 3 of Task 1 — adjust the button branch to:
  const { href: _href, ...buttonRest } = rest as ButtonAsButton;
  return (
    <button type="button" {...buttonRest} className={classes}>
      {children}
    </button>
  );
```

(`{...buttonRest}` after `type="button"` but before `className` lets an explicit `type="submit"` override the default, while `className` stays the computed one regardless of what's spread.)

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- components/ProfileForm.test.tsx`
Expected: PASS, all tests including the new one. If any pre-existing test fails (e.g. a `getByRole("button", { name: /aisyah/i })` match becoming ambiguous), fix the assertion to target the persona card's heading text specifically (`screen.getByRole("button", { name: /aisyah, 26/i })` still matches since the button's accessible name concatenates its text content, label first).

- [ ] **Step 5: Run the full suite, lint, typecheck**

Run: `cd frontend && npm test && npm run lint && npx tsc --noEmit`
Expected: all clean. `app/profile/page.test.tsx` should be unaffected (it mocks `@/lib/api`, not `ProfileForm`, and queries by label text which is unchanged).

- [ ] **Step 6: Commit**

```bash
git add frontend/components/ui/Button.tsx frontend/components/ProfileForm.tsx frontend/components/ProfileForm.test.tsx
git commit -m "feat(frontend): restyle the Profile page with Card grouping and persona quotes"
```

---

### Task 8: Restyle the Commitments page

**Files:**
- Modify: `frontend/components/CommitmentsTable.tsx`
- Modify: `frontend/components/CommitmentsTable.test.tsx`

**Interfaces:**
- Consumes: `Card` (Task 2), `StatTile` (Task 4), `Badge` (Task 3).
- Produces: same `CommitmentsTable` props (`commitments`, `onChange`) — unchanged.

- [ ] **Step 1: Update the existing test assertions that target the old `<strong>`-wrapped summary text**

The existing test `"renders the aggregate card matching the sum of Aisyah's commitments"` uses `screen.getByText("RM350")` and `screen.getByText("RM9100")` against `<strong>` tags — `StatTile` already isolates the value into its own `<span>`, so these assertions keep passing unchanged. Add one new test for the kind `Badge`:

```tsx
// add to frontend/components/CommitmentsTable.test.tsx, inside the existing describe block
it("renders each commitment's kind as a badge", () => {
  render(<CommitmentsTable commitments={AISYAH.profile.commitments} onChange={vi.fn()} />);
  expect(screen.getAllByText("[BNPL]").length).toBeGreaterThan(0);
  expect(screen.getByText("[LOAN]")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- components/CommitmentsTable.test.tsx`
Expected: the new test FAILS (no `[BNPL]`/`[LOAN]` text yet); existing tests still pass against current markup.

- [ ] **Step 3: Write the implementation**

Replace the whole file:

```tsx
// frontend/components/CommitmentsTable.tsx
"use client";

import type { Commitment, CommitmentKind } from "@/lib/fixtures";
import { summarizeCommitments } from "@/lib/aggregateCommitments";
import { fmtRm, toSen } from "@/lib/format";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { StatTile } from "./ui/StatTile";

type Props = {
  commitments: Commitment[];
  onChange: (commitments: Commitment[]) => void;
};

const KINDS: CommitmentKind[] = ["bnpl", "loan", "card", "other"];

type EditableField = "label" | "provider" | "kind" | "monthly_sen" | "outstanding_sen" | "months_left" | "next_due";

export function CommitmentsTable({ commitments, onChange }: Props) {
  const summary = summarizeCommitments(commitments);

  const updateField = (index: number, field: EditableField, rawValue: string) => {
    onChange(
      commitments.map((commitment, i) => {
        if (i !== index) return commitment;
        switch (field) {
          case "monthly_sen":
          case "outstanding_sen":
            return { ...commitment, [field]: toSen(Number(rawValue) || 0) };
          case "months_left":
            return { ...commitment, months_left: Number(rawValue) || 0 };
          case "next_due":
            return { ...commitment, next_due: rawValue || null };
          default:
            return { ...commitment, [field]: rawValue };
        }
      })
    );
  };

  const removeRow = (index: number) => {
    onChange(commitments.filter((_, i) => i !== index));
  };

  const addRow = () => {
    const nextId = Math.min(0, ...commitments.map((c) => c.commitment_id)) - 1;
    onChange([
      ...commitments,
      {
        commitment_id: nextId,
        label: "",
        provider: "",
        kind: "bnpl",
        monthly_sen: 0,
        outstanding_sen: 0,
        months_left: 0,
        next_due: null,
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card label="SUMMARY">
        <div className="flex flex-col gap-2.5">
          <StatTile label="Commitments" value={String(summary.count)} />
          <StatTile label="Monthly total" value={fmtRm(summary.monthlyTotalSen)} />
          <StatTile label="Outstanding total" value={fmtRm(summary.outstandingTotalSen)} />
          <StatTile label="Next due" value={summary.nextDue ?? "None"} />
        </div>
      </Card>

      <Card label="OBLIGATIONS BREAKDOWN">
        <div className="flex flex-col gap-2.5">
          {KINDS.map((kind) => (
            <div key={kind} className="flex items-center gap-2 text-sm">
              <Badge>{kind.toUpperCase()}</Badge>
              <span className="text-navy/70">
                {summary.byKind[kind].count} commitments,{" "}
                {fmtRm(summary.byKind[kind].monthlyTotalSen)}/month
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card label="EDIT COMMITMENTS">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-navy/50">
              <th className="pb-2">Label</th>
              <th className="pb-2">Provider</th>
              <th className="pb-2">Kind</th>
              <th className="pb-2">Monthly (RM)</th>
              <th className="pb-2">Outstanding (RM)</th>
              <th className="pb-2">Months left</th>
              <th className="pb-2">Next due</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {commitments.length === 0 && (
              <tr>
                <td colSpan={8} className="py-4 text-navy/60">
                  No commitments yet.
                </td>
              </tr>
            )}
            {commitments.map((commitment, index) => (
              <tr key={commitment.commitment_id} className="border-t border-navy/10">
                <td className="py-2">
                  <input
                    aria-label={`Label ${index + 1}`}
                    value={commitment.label}
                    onChange={(e) => updateField(index, "label", e.target.value)}
                    className="w-full border border-navy/15 px-2 py-1"
                  />
                </td>
                <td className="py-2">
                  <input
                    aria-label={`Provider ${index + 1}`}
                    value={commitment.provider}
                    onChange={(e) => updateField(index, "provider", e.target.value)}
                    className="w-full border border-navy/15 px-2 py-1"
                  />
                </td>
                <td className="py-2">
                  <select
                    aria-label={`Kind ${index + 1}`}
                    value={commitment.kind}
                    onChange={(e) => updateField(index, "kind", e.target.value)}
                    className="border border-navy/15 px-2 py-1"
                  >
                    {KINDS.map((kind) => (
                      <option key={kind} value={kind}>
                        {kind}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2">
                  <input
                    aria-label={`Monthly ${index + 1}`}
                    type="number"
                    value={commitment.monthly_sen / 100}
                    onChange={(e) => updateField(index, "monthly_sen", e.target.value)}
                    className="w-24 border border-navy/15 px-2 py-1"
                  />
                </td>
                <td className="py-2">
                  <input
                    aria-label={`Outstanding ${index + 1}`}
                    type="number"
                    value={commitment.outstanding_sen / 100}
                    onChange={(e) => updateField(index, "outstanding_sen", e.target.value)}
                    className="w-24 border border-navy/15 px-2 py-1"
                  />
                </td>
                <td className="py-2">
                  <input
                    aria-label={`Months left ${index + 1}`}
                    type="number"
                    value={commitment.months_left}
                    onChange={(e) => updateField(index, "months_left", e.target.value)}
                    className="w-20 border border-navy/15 px-2 py-1"
                  />
                </td>
                <td className="py-2">
                  <input
                    aria-label={`Next due ${index + 1}`}
                    type="date"
                    value={commitment.next_due ?? ""}
                    onChange={(e) => updateField(index, "next_due", e.target.value)}
                    className="border border-navy/15 px-2 py-1"
                  />
                </td>
                <td className="py-2">
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="text-xs text-risk-high hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button variant="secondary" onClick={addRow} className="mt-4">
          Add commitment
        </Button>
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- components/CommitmentsTable.test.tsx`
Expected: PASS, all tests.

- [ ] **Step 5: Run the full suite, lint, typecheck**

Run: `cd frontend && npm test && npm run lint && npx tsc --noEmit`
Expected: clean. `app/commitments/page.test.tsx` is unaffected (queries by label text and role, unchanged).

- [ ] **Step 6: Commit**

```bash
git add frontend/components/CommitmentsTable.tsx frontend/components/CommitmentsTable.test.tsx
git commit -m "feat(frontend): restyle the Commitments page with StatTile summary and kind badges"
```

---

### Task 9: Restyle `WarningList` and `VerdictBanner` with severity icons

**Files:**
- Modify: `frontend/components/WarningList.tsx`
- Modify: `frontend/components/WarningList.test.tsx`
- Modify: `frontend/components/VerdictBanner.tsx`
- Modify: `frontend/components/VerdictBanner.test.tsx`

**Interfaces:**
- Consumes: `@heroicons/react/24/outline`'s `ExclamationTriangleIcon` (red/high) and `ExclamationCircleIcon` (amber/moderate).
- Produces: same props for both components — unchanged.

- [ ] **Step 1: Write the failing tests**

```tsx
// add to frontend/components/WarningList.test.tsx, inside the existing describe block
it("renders a severity icon for a red-level warning", () => {
  const { container } = render(
    <WarningList
      warnings={[
        { code: "LOW_BUFFER", level: "red", title: "t", detail: "d", lever: "" },
      ]}
    />
  );
  expect(container.querySelector("svg")).toBeInTheDocument();
});
```

```tsx
// add to frontend/components/VerdictBanner.test.tsx, inside the existing describe block
it("renders a severity icon", () => {
  const { container } = render(
    <VerdictBanner verdict={{ level: "red", headline: "h", detail: "d" }} />
  );
  expect(container.querySelector("svg")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd frontend && npm test -- components/WarningList.test.tsx components/VerdictBanner.test.tsx`
Expected: both new tests FAIL — neither component renders an `<svg>` yet.

- [ ] **Step 3: Write the implementations**

```tsx
// frontend/components/WarningList.tsx
// Ordered warning list. Renders exactly what the backend sends (title, detail, level) with no
// per-code switch, so an unrecognized code (docs/API-CONTRACT.md §3) is handled generically for
// free rather than needing a special case.

import { ExclamationCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { Warning } from "@/lib/api";
import { warningLevelToRisk } from "@/lib/theme";

type Props = {
  warnings: Warning[];
};

export function WarningList({ warnings }: Props) {
  if (warnings.length === 0) {
    return <p>No warnings -- nothing needs your attention right now.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {warnings.map((warning) => {
        const Icon = warning.level === "red" ? ExclamationTriangleIcon : ExclamationCircleIcon;
        return (
          <li
            key={warning.code}
            className={`flex gap-3 border-l-4 border-risk-${warningLevelToRisk(warning.level)} pl-3`}
          >
            <Icon
              className={`mt-0.5 h-5 w-5 shrink-0 text-risk-${warningLevelToRisk(warning.level)}`}
            />
            <div>
              <p className="font-display font-semibold">{warning.title}</p>
              <p>{warning.detail}</p>
              {warning.lever && <p className="text-sm text-navy/70">{warning.lever}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
```

```tsx
// frontend/components/VerdictBanner.tsx
import { ExclamationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import type { Verdict } from "@/lib/verdict";
import { verdictLevelToRisk } from "@/lib/theme";

type Props = {
  verdict: Verdict;
};

const ICONS = {
  red: ExclamationTriangleIcon,
  amber: ExclamationCircleIcon,
  green: CheckCircleIcon,
} as const;

export function VerdictBanner({ verdict }: Props) {
  const risk = verdictLevelToRisk(verdict.level);
  const Icon = ICONS[verdict.level];
  return (
    <div className={`flex gap-3 border-l-4 border-risk-${risk} bg-risk-${risk}/10 p-4`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 text-risk-${risk}`} />
      <div>
        <h3 className="font-display font-semibold">{verdict.headline}</h3>
        {verdict.detail !== verdict.headline && <p>{verdict.detail}</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd frontend && npm test -- components/WarningList.test.tsx components/VerdictBanner.test.tsx`
Expected: PASS, all tests.

- [ ] **Step 5: Run the full suite, lint, typecheck**

Run: `cd frontend && npm test && npm run lint && npx tsc --noEmit`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add frontend/components/WarningList.tsx frontend/components/WarningList.test.tsx frontend/components/VerdictBanner.tsx frontend/components/VerdictBanner.test.tsx
git commit -m "feat(frontend): add severity icons to WarningList and VerdictBanner"
```

---

### Task 10: Restyle the Dashboard (`FactorBreakdown`, page layout)

**Files:**
- Modify: `frontend/components/FactorBreakdown.tsx`
- Modify: `frontend/components/FactorBreakdown.test.tsx`
- Modify: `frontend/app/dashboard/page.tsx`

**Interfaces:**
- Consumes: `Card` (Task 2), `Badge` (Task 3), keeps existing Recharts bar chart (per the "keep both" decision — do not remove `recharts` usage).
- Produces: same `FactorBreakdown` props — unchanged. Same `DashboardPage` behavior — unchanged.

- [ ] **Step 1: Update the existing test's Strength assertion**

The current test only checks `data-weakest` and the `bg-risk-high/10` class on the row. Add one assertion for the new `Badge` rendering:

```tsx
// add to frontend/components/FactorBreakdown.test.tsx, inside the existing describe block
it("renders each factor's strength as a badge", () => {
  render(
    <FactorBreakdown
      subscores={AISYAH.expected.subscores}
      contributions={{
        debt_burden: 23.26,
        bnpl_exposure: 16.05,
        disposable_income: 14.07,
        emergency_buffer: 1.58,
        repayment_capacity: 12.0,
        savings_resilience: 1.33,
      }}
      features={AISYAH.expected.features}
    />
  );
  expect(screen.getByText("[STRONG]")).toBeInTheDocument();
  expect(screen.getByText("[CRITICAL]")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- components/FactorBreakdown.test.tsx`
Expected: new test FAILS (no `[STRONG]`/`[CRITICAL]` text yet — current version renders `Strong`/`Critical` as plain `<td>` text, not bracketed).

- [ ] **Step 3: Write the implementation**

Replace the whole file:

```tsx
// frontend/components/FactorBreakdown.tsx
// Six-factor breakdown: sub-score, weight, contribution, the user's own raw figure per factor.
// The ledger-line list below is the correctness-bearing element; the Recharts horizontal bar
// (design.md's "Chart choices") is kept alongside it as a quick visual comparison (2026-08-27
// decision: keep both rather than dropping the chart in favor of the ledger lines alone).

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { Features, Subscores } from "@/lib/fixtures";
import { classifyStrength, FACTORS, type Strength } from "@/lib/factorConfig";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";

type Props = {
  subscores: Subscores;
  contributions: Record<string, number>;
  features: Features;
};

const STRENGTH_RISK: Record<Strength, "high" | "moderate" | "neutral" | "low"> = {
  Critical: "high",
  Weak: "moderate",
  Adequate: "neutral",
  Strong: "low",
};

export function FactorBreakdown({ subscores, contributions, features }: Props) {
  const rows = FACTORS.map((factor) => ({
    ...factor,
    subscore: subscores[factor.key],
    contribution: contributions[factor.key],
    lostContribution: factor.weight - contributions[factor.key],
    rawValue: features[factor.featureKey],
  }));

  const weakestKeys = new Set(
    [...rows]
      .sort((a, b) => b.lostContribution - a.lostContribution)
      .slice(0, 2)
      .map((row) => row.key)
  );

  return (
    <Card label="SIX-FACTOR BREAKDOWN">
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={rows} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="label" width={140} />
            <Bar dataKey="subscore" fill="#0F5C56" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <div className="flex items-baseline font-mono text-[11px] text-navy/40">
          <span className="flex-1">FACTOR &middot; WEIGHT &middot; SUB-SCORE</span>
          <span className="w-20 text-right">CONTRIB.</span>
          <span className="w-24 text-right">STRENGTH</span>
        </div>
        {rows.map((row) => {
          const strength = classifyStrength(row.subscore);
          const weakest = weakestKeys.has(row.key);
          return (
            <div
              key={row.key}
              data-testid={`factor-${row.key}`}
              data-weakest={weakest}
              className={`flex items-baseline gap-1.5 ${weakest ? "bg-risk-high/10 font-semibold" : ""}`}
            >
              <span className="text-sm">
                {row.label}{" "}
                <span className="font-mono text-[11px] text-navy/45">
                  w{row.weight} &middot; sub {row.subscore.toFixed(2)}
                </span>
              </span>
              <span className="mb-0.5 flex-1 border-b border-dotted border-navy/30" />
              <span className="w-20 text-right font-mono text-sm">
                {row.contribution >= 0 ? "+" : ""}
                {row.contribution.toFixed(2)}
              </span>
              <span className="w-24 text-right">
                <Badge risk={STRENGTH_RISK[strength]}>{strength.toUpperCase()}</Badge>
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
```

Note: `classifyStrength`'s return type `Strength` must be exported from `frontend/lib/factorConfig.ts` — it already is (`export type Strength = ...`), confirm the import compiles.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- components/FactorBreakdown.test.tsx`
Expected: PASS, all tests including the pre-existing weakest-factor ones (the `data-testid`/`data-weakest`/`bg-risk-high/10` markers are preserved on the row `div`).

- [ ] **Step 5: Update the Dashboard page to wrap the gauge and other sections in `Card`**

```tsx
// frontend/app/dashboard/page.tsx — replace the final return block (everything after the loading/error early returns stays the same)
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
      <h1 className="font-display text-3xl">Dashboard</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
        <Card label="SCORE">
          <div className="flex flex-col items-center">
            <ScoreGauge score={assessment.score} band={assessment.band} />
          </div>
          <p className="mt-5 border-t border-dashed border-navy/15 pt-3.5 text-xs leading-relaxed text-navy/60">
            {assessment.disclaimer}
          </p>
        </Card>
        <FactorBreakdown
          subscores={assessment.subscores}
          contributions={assessment.contributions}
          features={assessment.features}
        />
      </div>
      <Card label="WARNINGS" className="mt-6">
        <WarningList warnings={assessment.warnings} />
      </Card>
      {explanation && (
        <Card label="WHAT THIS MEANS" className="mt-6">
          <p className="leading-relaxed">{explanation}</p>
        </Card>
      )}
    </main>
  );
```

Add the import: `import { Card } from "@/components/ui/Card";` at the top of `frontend/app/dashboard/page.tsx`. Leave every hook, state variable, and the three early-return blocks (`profile === null`, `error`, `assessment === null`) exactly as they are — only the final successful-render JSX changes.

- [ ] **Step 6: Run the full suite, lint, typecheck**

Run: `cd frontend && npm test && npm run lint && npx tsc --noEmit`
Expected: clean. `app/dashboard/page.test.tsx` queries by text content (`"68"`, `"MODERATE RISK"`, warning detail text, explanation text) which are all still present, just re-wrapped — should pass unchanged.

- [ ] **Step 7: Commit**

```bash
git add frontend/components/FactorBreakdown.tsx frontend/components/FactorBreakdown.test.tsx frontend/app/dashboard/page.tsx
git commit -m "feat(frontend): restyle Dashboard with ledger-line factor breakdown and Card layout"
```

---

### Task 11: Restyle the Simulator page (`SimulatorPanel`, page layout)

**Files:**
- Modify: `frontend/components/SimulatorPanel.tsx`
- Modify: `frontend/components/SimulatorPanel.test.tsx`
- Modify: `frontend/app/simulator/page.tsx`

**Interfaces:**
- Consumes: `Card` (Task 2), `StatTile` (Task 4).
- Produces: same `SimulatorPanel` props — unchanged.

- [ ] **Step 1: Update the test's before/after assertions**

The existing tests query `screen.getByText("RM200")`, `screen.getByText("RM750")` etc. against `<td>` cells — `StatTile` isolates each value into its own `<span>`, so these keep passing. The alternatives test already targets `getByRole("heading", { name: "Alternatives" }).parentElement`; since alternatives become `Card`s inside a wrapping section, update it to search the whole rendered container instead:

```tsx
// replace the "surfaces alternatives..." test body in frontend/components/SimulatorPanel.test.tsx
it("surfaces alternatives at 6/12/18/24 months excluding the current tenure", () => {
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
  expect(container.textContent).toContain("6 months");
  expect(container.textContent).toContain("score 39");
  expect(container.textContent).toContain("18 months");
  expect(container.textContent).toContain("score 59");
  expect(container.textContent).toContain("24 months");
  expect(container.textContent).toContain("score 62");
  expect(container.textContent).not.toContain("12 months");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- components/SimulatorPanel.test.tsx`
Expected: this test still passes against the OLD markup too (it's a behavior-preserving rewrite, not a new assertion) — confirm it passes now, then proceed; the real red/green cycle for this task is the verdict-icon test already added in Task 9 plus visual restructuring, which has no new assertions of its own. Skip ahead to Step 3.

- [ ] **Step 3: Write the implementation**

```tsx
// frontend/components/SimulatorPanel.tsx
// Purely presentational: receives the already-fetched 36-entry grid and reads grid[tenure - 1]
// locally -- no backend call happens here, which is what makes "no further requests while
// dragging the tenure slider" (architecture.md) true regardless of how often onTenureChange fires.

import type { GridEntry } from "@/lib/api";
import type { Band } from "@/lib/fixtures";
import { fmtRm } from "@/lib/format";
import { computeVerdict } from "@/lib/verdict";
import { Card } from "./ui/Card";
import { StatTile } from "./ui/StatTile";
import { VerdictBanner } from "./VerdictBanner";

const ALTERNATIVE_TENURES = [6, 12, 18, 24];

type Props = {
  grid: GridEntry[];
  tenure: number;
  onTenureChange: (tenure: number) => void;
  bandBefore: Band;
  scoreBefore: number;
  bufferBeforeSen: number;
};

export function SimulatorPanel({
  grid,
  tenure,
  onTenureChange,
  bandBefore,
  scoreBefore,
  bufferBeforeSen,
}: Props) {
  const current = grid[tenure - 1];
  const bufferAfterSen = bufferBeforeSen - current.monthly_sen;
  const verdict = computeVerdict({
    bandBefore,
    bandAfter: current.band,
    deltaScore: current.delta,
    bufferBeforeSen,
    monthlySen: current.monthly_sen,
  });

  const alternatives = ALTERNATIVE_TENURES.filter((t) => t !== tenure).map((t) => grid[t - 1]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <label htmlFor="tenure-slider" className="text-sm font-medium text-navy/80">
          Tenure: {tenure} months
        </label>
        <input
          id="tenure-slider"
          role="slider"
          type="range"
          min={1}
          max={36}
          value={tenure}
          onChange={(e) => onTenureChange(Number(e.target.value))}
          className="mt-2 w-full"
        />

        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <p className="font-mono text-[11px] uppercase text-navy/40">Before</p>
            <div className="mt-2 flex flex-col gap-2">
              <StatTile label="Score" value={String(scoreBefore)} />
              <StatTile label="Band" value={bandBefore} />
              <StatTile label="Buffer" value={fmtRm(bufferBeforeSen)} />
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase text-navy/40">After</p>
            <div className="mt-2 flex flex-col gap-2">
              <StatTile label="Monthly payment" value={fmtRm(current.monthly_sen)} />
              <StatTile label="Score" value={String(current.score)} />
              <StatTile label="Band" value={current.band} />
              <StatTile
                label="Buffer"
                value={fmtRm(bufferAfterSen)}
                valueClassName={bufferAfterSen < bufferBeforeSen ? "text-risk-high" : ""}
              />
            </div>
          </div>
        </div>
      </Card>

      <VerdictBanner verdict={verdict} />

      <div>
        <h3 className="font-display text-lg">Alternatives</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {alternatives.map((alt) => (
            <Card key={alt.tenure_months} className="p-4">
              <p className="font-mono text-sm">{alt.tenure_months} months</p>
              <p className="mt-1 text-sm text-navy/70">{fmtRm(alt.monthly_sen)}/month</p>
              <p className="mt-1 font-mono text-sm">
                score {alt.score} ({alt.delta >= 0 ? "+" : ""}
                {alt.delta})
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- components/SimulatorPanel.test.tsx`
Expected: PASS, all tests.

- [ ] **Step 5: Update the Simulator page wrapper**

```tsx
// frontend/app/simulator/page.tsx — replace the final successful-render return block only
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
      <h1 className="font-display text-3xl">Simulator</h1>
      <div className="mt-6 max-w-xs">
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
      </div>

      <div className="mt-6">
        {baseline && grid ? (
          <SimulatorPanel
            grid={grid}
            tenure={tenure}
            onTenureChange={setTenure}
            bandBefore={baseline.band}
            scoreBefore={baseline.score}
            bufferBeforeSen={baseline.bufferSen}
          />
        ) : (
          <p>Loading&hellip;</p>
        )}
      </div>
    </main>
  );
```

Leave every hook and the two early-return blocks (`profile === null && error === null`, `error`) exactly as they are.

- [ ] **Step 6: Run the full suite, lint, typecheck**

Run: `cd frontend && npm test && npm run lint && npx tsc --noEmit`
Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add frontend/components/SimulatorPanel.tsx frontend/components/SimulatorPanel.test.tsx frontend/app/simulator/page.tsx
git commit -m "feat(frontend): restyle Simulator with two-column before/after and card alternatives"
```

---

### Task 12: Restyle the About page

**Files:**
- Modify: `frontend/app/about/page.tsx`
- Modify: `frontend/app/about/page.test.tsx`

**Interfaces:**
- Consumes: `Card` (Task 2). No new icon usage required (per spec, icons on About are a nice-to-have, not load-bearing — skip to keep this task focused, `InformationCircleIcon`-per-limitation is optional polish, not tested here).

- [ ] **Step 1: Confirm existing tests still describe the right content** — no new assertions needed; this task is pure restyling of already-tested content (all four existing tests query by text substring via `container.textContent`, which survives re-wrapping in `Card`).

- [ ] **Step 2: Write the implementation**

```tsx
// frontend/app/about/page.tsx
// Scoring methodology, factor weights table, synthetic-data disclosure, limitations.
// No backend calls -- static content, published in README.md and
// docs/MASTER-PACKAGE.md's own Limitations section (reused verbatim, not paraphrased).

import { FACTORS } from "@/lib/factorConfig";
import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
      <h1 className="font-display text-3xl">About KIRA+</h1>

      <Card label="SCORING METHODOLOGY" className="mt-6">
        <p className="text-navy/80">
          Published in full, because a score you cannot audit is a score you should not trust.
          Six factors, each scored 0-100 against a fixed anchor, then combined by weight.
        </p>

        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-navy/50">
              <th className="pb-2">Factor</th>
              <th className="pb-2">Feature</th>
              <th className="pb-2">Weight</th>
              <th className="pb-2">Scores 0 at</th>
              <th className="pb-2">Scores 100 at</th>
            </tr>
          </thead>
          <tbody>
            {FACTORS.map((factor) => (
              <tr key={factor.key} className="border-t border-navy/10">
                <td className="py-2">{factor.label}</td>
                <td className="py-2 text-navy/70">{factor.featureDescription}</td>
                <td className="py-2 font-mono">{factor.weight}</td>
                <td className="py-2 font-mono">{factor.zeroAt}</td>
                <td className="py-2 font-mono">{factor.fullAt}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <pre className="mt-4 overflow-x-auto border border-navy/10 bg-navy/[0.02] p-4 font-mono text-xs leading-relaxed">
          {`sub(x, zero_at, full_at) = clamp(100 x (x - zero_at) / (full_at - zero_at), 0, 100)
weighted   = sum(weight_i x sub_i) / 100
penalty    = min(10, 3 x max(0, n_bnpl - 3))
KIRA Score = round(clamp(weighted - penalty, 0, 100))

band = LOW >= 70  ·  MODERATE 45-69  ·  HIGH < 45`}
        </pre>

        <p className="mt-4 text-sm text-navy/70">
          Weights and anchor points are the team&rsquo;s judgement, not a fitted model -- see
          Limitations below.
        </p>
      </Card>

      <Card label="SYNTHETIC DATA" className="mt-6">
        <p className="text-navy/80">
          Every profile in this demo, including the four named personas, is synthetic. These
          profiles are constructed to exercise every branch of the scoring engine. They are not
          real people and not research subjects. No real consumer financial data appears anywhere
          in this application.
        </p>
      </Card>

      <Card label="LIMITATIONS" className="mt-6">
        <dl className="flex flex-col gap-5">
          <div>
            <dt className="font-display font-semibold">No real financial data</dt>
            <dd className="mt-1 text-navy/75">
              Every profile is synthetic. Every model metric is measured against a simulated
              target. We make no claim about real-world predictive accuracy.
            </dd>
          </div>

          <div>
            <dt className="font-display font-semibold">No user research</dt>
            <dd className="mt-1 text-navy/75">
              No survey, no interviews, no pilot. All behavioural claims are reasoned.
            </dd>
          </div>

          <div>
            <dt className="font-display font-semibold">Weights and anchors are our judgement</dt>
            <dd className="mt-1 text-navy/75">
              The six weights and their anchor points are informed by publicly discussed
              debt-service practice and standard emergency-fund guidance, but they are not
              empirically fitted. Real outcome data would refit them and the score would move.
            </dd>
          </div>

          <div>
            <dt className="font-display font-semibold">Entirely manual entry</dt>
            <dd className="mt-1 text-navy/75">
              No BNPL, bank, CTOS, CCRIS or open-banking connectivity. The consolidated view is
              only as complete and as accurate as what you choose to type.
            </dd>
          </div>

          <div>
            <dt className="font-display font-semibold">No legal determination</dt>
            <dd className="mt-1 text-navy/75">
              Privacy-by-design principles are implemented; PDPA compliance is not established.
              Our position relative to the Consumer Credit Commission&rsquo;s regime requires
              legal advice we have not obtained.
            </dd>
          </div>

          <div>
            <dt className="font-display font-semibold">BNPL-first, deliberately narrow</dt>
            <dd className="mt-1 text-navy/75">
              Credit cards, mortgages, hire purchase and business credit are out of scope. A user
              with a large credit-card balance will find their score incomplete. That is a
              choice, not an oversight.
            </dd>
          </div>
        </dl>
      </Card>
    </main>
  );
}
```

- [ ] **Step 3: Run test to verify it still passes**

Run: `cd frontend && npm test -- app/about/page.test.tsx`
Expected: PASS, all 4 existing tests unchanged (content and semantic structure — `<dt>`/`<dd>` pairs, table cells — are identical, only wrapped in `Card` and styled).

- [ ] **Step 4: Run the full suite, lint, typecheck**

Run: `cd frontend && npm test && npm run lint && npx tsc --noEmit`
Expected: clean, full suite green.

- [ ] **Step 5: Commit**

```bash
git add frontend/app/about/page.tsx
git commit -m "feat(frontend): restyle About page with Card sections"
```

---

### Task 13: Final full-site verification

**Files:** none (verification only).

- [ ] **Step 1: Run the complete test suite**

Run: `cd frontend && npm test`
Expected: all tests across all files pass.

- [ ] **Step 2: Lint and typecheck**

Run: `cd frontend && npm run lint && npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Manual browser walkthrough**

Start both servers (`cd backend && uvicorn app.main:app --reload`, `cd frontend && npm run dev`), and visit `/`, `/profile`, `/commitments`, `/dashboard`, `/simulator`, `/about` in a real browser. Confirm:
- Nav shows icons and highlights the current page on every route.
- Landing hero shows the live gauge preview and both persona quotes.
- Profile demo-persona buttons show quotes.
- Commitments summary uses leader-dot lines; kind badges show `[BNPL]`/`[LOAN]`/etc.
- Dashboard shows both the Recharts bar and the ledger-line list with `[STRONG]`/`[CRITICAL]` badges; the two weakest factors are still highlighted.
- Simulator's before/after is two columns of leader-dot lines; alternatives are cards; verdict banner shows an icon and the correct color per band change (test at tenure 6 for the red band-worsens case, per `docs/API-CONTRACT.md` §7's Aisyah fixture).
- About page methodology table and limitations render inside cards, content unchanged from before.

Take a screenshot of each page for the record; note anything that doesn't match the approved mockup and fix it (loop back into the relevant task's component, following TDD for any behavior change, or a plain style tweak for a pure visual miss).

- [ ] **Step 4: Update `frontend/docs/design.md`'s "Chart choices" section** to record the FactorBreakdown decision from this plan (kept both Recharts and the ledger-line list) and the new primitives:

Add a line under "Decisions log":
```markdown
- **Redesign (2026-08-27):** shared design system added (`Button`/`Card`/`Badge`/`StatTile` in
  `components/ui/`), Heroicons for functional icons, ledger-line pattern for factor/stat display.
  FactorBreakdown keeps both the Recharts bar and the new ledger-line list (not a replacement) --
  see `docs/superpowers/specs/2026-08-27-website-redesign-design.md`.
```

- [ ] **Step 5: Commit the design.md update**

```bash
git add frontend/docs/design.md
git commit -m "docs(frontend): record redesign decisions in design.md"
```
