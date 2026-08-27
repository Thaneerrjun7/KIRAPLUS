# Website redesign — design system + page treatment

Status: approved by Aliff (2026-08-27), mockup pending before implementation.

## Why

Every page currently renders with correct data and passing tests, but zero visual structure:
plain `<main>`/`<table>`/`<p>` tags throughout, no card grouping, no icons, inconsistent
typography scale, and (until `fix/missing-navigation`) no way to move between pages at all.
The brand system in `frontend/docs/design.md` (palette, fonts, chart choices, risk colors) is
wired up but never actually *applied* beyond raw color/font tokens. This spec covers restyling
the whole site — landing page, nav, and all five MVP pages — into something that reads as the
"government-grade trust, consumer-grade simplicity" financial-literacy product the master
package describes, without touching data flow, `lib/api.ts`, or component prop contracts.

## Constraints (given, not decided here)

- Colors are frozen to `frontend/docs/design.md`'s palette (navy/teal/jade/gold/paper, plus
  `risk.{low,moderate,high}`) — no new colors introduced.
- Fonts, chart choices (hand-rolled SVG gauge, Recharts bar), and the sen/ringgit formatting
  boundary (`lib/format.ts`) are already decided and unchanged.
- Visual direction: **minimal, data-forward** — whitespace and real numbers/charts carry the
  page, icons stay small and functional (labels, buttons, warning severity), no decorative
  illustration.
- Presentation-only: no content/copy changes, no changes to `lib/api.ts` request/response
  shapes, no changes to component prop interfaces beyond what's needed to add visual structure
  around existing content.

## Design system foundation

**Typography scale** (Tailwind utility classes, applied via the primitives below rather than
ad hoc per page):
- Page title (`h1`): `text-3xl md:text-4xl font-display`
- Section header (`h2`): `text-xl md:text-2xl font-display`
- Card/subsection header (`h3`): `text-lg font-display`
- Body copy: `font-body text-base` (unchanged — already the `<body>` default)
- Meta/caption text: `text-sm text-navy/70`
- Every monetary or score figure: `font-mono` (already the rule in `fmtRm`/`fmtRmCents`
  consumers; this pass makes it consistent everywhere a raw number is shown, e.g. weights,
  sub-scores, tenure counts)

**New shared primitives** (`frontend/components/ui/`):
- `Button` — `variant: "primary" | "secondary"`. Primary: `bg-teal text-paper`, hover `bg-navy`.
  Secondary: `border border-navy/20 text-navy`, hover `bg-navy/5`.
- `Card` — a bordered, padded container (`rounded-lg border border-navy/10 bg-paper p-6`) used
  to group every logical section on every page (currently everything is a flat `<div>`).
- `Badge` — small pill (`rounded-full px-2 py-0.5 text-xs font-medium`), colored via
  `bg-risk-{low,moderate,high}/15 text-risk-{low,moderate,high}`. Used for: risk bands, warning
  levels, `FactorBreakdown`'s Strength column, commitment `kind`.
- `StatTile` — label + large mono figure, for aggregate numbers currently rendered as plain
  `<p>Label: value</p>` (Commitments summary, Simulator before/after).

**Icons**: `@heroicons/react` (outline, 24px stroke). Usage is deliberately narrow —
navigation items, button icons (e.g. arrow on CTAs), warning severity
(`ExclamationTriangleIcon` red / `ExclamationCircleIcon` amber), and one icon per section
header where it aids scanning (e.g. `ChartBarIcon` on Dashboard, `CalculatorIcon` on
Simulator, `BookOpenIcon` on About). Never purely decorative.

**Layout**: every page wrapped in a consistent container
(`mx-auto max-w-5xl px-4 py-10 md:py-12`), sections spaced with `space-y-10`. Two-column
layouts on `lg:` breakpoints where content naturally splits (Dashboard: gauge+bands beside the
factor table; Simulator: inputs+verdict beside alternatives).

## Page-by-page treatment

- **Nav**: sticky header, icon+label per item, active-route highlight (current route's link
  gets `text-navy font-semibold` + a bottom border; others `text-navy/70`).
- **Landing (`/`)**: real hero (headline, tagline, CTA button with arrow icon) plus a 3-step
  "Consolidate → Score → Simulate" feature section using `Card`, mirroring the core feature
  loop from the master package's own product description. Still links to `/profile` as the
  entry point.
- **Profile**: form fields grouped in a `Card`; demo persona buttons become small `Card`s
  showing the persona's name + one-line quote (already written, currently unused in the UI)
  rather than a bare `<button>`; validation error stays inline as today.
- **Commitments**: aggregate numbers become `StatTile`s in a `Card`; obligations breakdown by
  kind gets a `Badge` per kind; the editable table keeps its current fields, restyled with
  `Card` wrapping and consistent spacing.
- **Dashboard**: `ScoreGauge` in its own `Card`; `FactorBreakdown`'s Strength column becomes
  `Badge`s, weakest-factor highlighting keeps its existing red tint; `WarningList` items get a
  severity icon; explanation text in its own `Card`.
- **Simulator**: before/after comparison becomes a two-column layout of `StatTile`s instead of
  a plain table; `VerdictBanner` gets a matching severity icon; alternatives become small
  `Card`s in a row instead of a bullet list.
- **About**: methodology table restyled inside a `Card`; limitations list keeps its `<dl>`
  semantics but each entry gets a category icon and `Card` treatment.

## Testing and rollout

- No changes to `lib/api.ts`, service call shapes, or `lib/*` pure functions (`format.ts`,
  `theme.ts`, `verdict.ts`, `factorConfig.ts`, `aggregateCommitments.ts`) — this is additive UI
  structure around existing data and existing tests' `getByRole`/`getByLabelText`/`getByText`
  queries should mostly keep passing unchanged.
- Where restructuring changes what's queryable (e.g. wrapping a value in a new element),
  update the affected test alongside the component change — standard TDD, not a blanket
  re-write.
- New primitives (`Button`, `Card`, `Badge`, `StatTile`) each get their own component test
  before use, same as every other component built this project.
- Order: mockup (landing + nav + Dashboard) for visual sign-off → build the four primitives →
  apply across nav, landing, then the five app pages in the order a user encounters them
  (Profile → Commitments → Dashboard → Simulator → About).
