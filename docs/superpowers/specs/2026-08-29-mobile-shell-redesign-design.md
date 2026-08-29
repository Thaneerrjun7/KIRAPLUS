# Mobile-first shell split + rise-design visual system

Status: approved by Aliff (2026-08-29), ready for implementation planning.

## Problem

Today the whole frontend renders through one `RootLayout` with a single global `<Nav />`
(`frontend/components/Nav.tsx`) shared by all seven pages — `/`, `/about`, `/profile`,
`/commitments`, `/dashboard`, `/simulator`. There's no distinction between the two marketing pages
(landing, about — no user data, meant to convert) and the four product pages (profile, commitments,
dashboard, simulator — meant to be used repeatedly, ideally mobile-first). Confirmed by inspection:
`app/layout.tsx` renders `<Nav />` once, and every page under `app/` shares it.

Separately, the current visual system (`frontend/docs/design.md`'s "Brand system") — warm paper
background (`#FBFAF7`), Bricolage Grotesque/Source Serif 4/IBM Plex Mono triple type system, sharp
corners — reads as generic AI-tool ("Claude-ish") rather than a calm financial product. Aliff picked
`frontend/docs/rise-design.md` (an Open Collective-style reference, inspired by rise.com) as the
target system: near-white canvas, one accent color doing the chromatic work, single Inter type
family, 12px radii, hairline borders, minimal elevation.

This spec covers both: splitting the app into a marketing shell and a product shell, and adopting
rise-design.md's full system (not just its background color) while keeping every KIRA+ brand hex
`design.md` already defines (navy, teal, jade, gold, risk colors) — those are functional/semantic,
not decorative, and rise-design.md is a structural/tonal reference, not a hex palette to copy
literally.

## Non-goals

- No auth. The MVP has no login; see "Marketing nav" below for how the shell handles that gap.
- No change to `lib/api.ts`, `lib/format.ts`, or any data-fetching/state logic — this is
  presentation-layer only, per `frontend/CLAUDE.md`'s scope boundary.
- No change to warning copy, verdict wording, band thresholds, or any other contract-frozen text or
  logic (`docs/API-CONTRACT.md`, `design.md`'s "Verdict banner rules" / "Warning copy" tables).
- No change to `ScoreGauge`'s hand-rolled SVG arc or `FactorBreakdown`'s Recharts bar chart as chart
  *choices* — `design.md`'s "Chart choices" decision stands. Only their fonts/colors update.

## A. Shell architecture

Two Next.js route groups, each with its own layout. Route groups don't affect URLs.

```
frontend/app/
  layout.tsx                  — html/body, Inter font load, <SyntheticDataNotice /> (stays global —
                                 "persistent on every page" per design.md's UI rules)
  (marketing)/
    layout.tsx                 — renders <MarketingNav />
    page.tsx                   — landing (moved from app/page.tsx)
    about/
      page.tsx                 — moved from app/about/page.tsx
  (app)/
    layout.tsx                 — renders <AppNav />
    profile/page.tsx           — moved from app/profile/page.tsx
    commitments/page.tsx       — moved from app/commitments/page.tsx
    dashboard/page.tsx         — moved from app/dashboard/page.tsx
    simulator/page.tsx         — moved from app/simulator/page.tsx
```

`RootLayout` stops rendering a single global `<Nav />`. Each group layout renders its own nav
component instead. `page.test.tsx` files move with their pages (same directory).

## B. Navigation components

**`MarketingNav`** — `/`, `/about`:
- Left: `KIRA+` wordmark, links to `/`.
- Center (desktop, `≥768px`): single `About` link.
- Right: one filled primary button, **"Dashboard"** (→ `/dashboard`) — stands in for the login slot
  rise-design's nav pattern reserves for auth. There's no auth yet, so a returning user's most useful
  nav-level action is jumping straight to their data; `/dashboard` already renders "Save a profile
  first on the Profile page to see your score." gracefully if none exists yet, so this is always a
  safe link. The hero's existing "Get started → /profile" button is unchanged and stays the separate
  new-user conversion CTA — the two aren't redundant.
- Mobile (`<768px`): collapses to logo + hamburger icon; expanding shows `About` and the `Dashboard`
  button stacked vertically.

**`AppNav`** — `/profile`, `/commitments`, `/dashboard`, `/simulator`. One component, two children
toggled by Tailwind breakpoint classes (`hidden md:flex` / `md:hidden`) — not `matchMedia`, to avoid
hydration mismatches:
- **Desktop (`≥768px`):** top bar, `justify-between` — logo pinned left, the four nav links
  (with their existing Heroicons: `UserCircleIcon`, `ListBulletIcon`, `ChartBarIcon`,
  `CalculatorIcon`) pushed to the far right. (This is a layout change from today's `Nav.tsx`, which
  clusters logo + links together on the left.)
- **Mobile (`<768px`):** fixed bottom bar, four icon+label tabs, same four Heroicons, active tab in
  navy. Page content needs bottom padding (`pb-16` or measured equivalent) so the fixed bar never
  covers the last content row; bar itself respects `env(safe-area-inset-bottom)` for notched phones.

`About` remains reachable from the app shell via `SyntheticDataNotice`'s global footer — it doesn't
need its own entry in `AppNav`.

## C. Design tokens

### Typography

Single Inter family (weights 400–800) replaces Bricolage Grotesque / Source Serif 4 / IBM Plex Mono
everywhere. Money figures and other tabular data keep column alignment via
`font-variant-numeric: tabular-nums` (a CSS feature applied where figures render, e.g. `StatTile`
values, `ScoreGauge`'s center number, table/card monetary cells) rather than a dedicated mono face.

### Colors

Every existing KIRA+ hex from `design.md` is unchanged:

```ts
navy: '#0B1F2A', teal: '#0F5C56', jade: '#1E8E7E', gold: '#B7791B',
risk: { low: '#1E8E7E', moderate: '#B7791B', high: '#B5533C' },
```

New neutral scale, added alongside the above (not replacing it), each derived by blending navy
toward white so the scale reads as in-family with the brand rather than an imported gray — approved
via the visual-companion swatch check on 2026-08-29:

```ts
surface:    '#FFFFFF', // page canvas, card fill — replaces `paper` (#FBFAF7)
surfaceAlt: '#F4F5F5', // subtle elevated/alternate band — replaces `bg-navy/[0.02]` sections
border:     '#E2E4E5', // hairline borders, dividers, input borders — replaces `navy/10`, `navy/15`
mist:       '#919A9F', // muted/tertiary text, disabled chrome — replaces `navy/40`, `navy/60`
slate:      '#606D75', // secondary body text, captions — replaces `navy/70`, `navy/75`
// primary text stays `navy` (#0B1F2A) itself — "ink" role, not pure black
```

`paper` is removed from `tailwind.config.ts` once every reference to `bg-paper` is migrated to
`bg-surface`.

### Radii, shadows, spacing

- 12px radius on every button, card, input, and badge (was sharp/no radius).
- Single card shadow, rise-design's value: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)`.
- 8px spacing scale — KIRA+'s current Tailwind defaults already roughly follow this; no config
  change needed beyond what radii/shadow additions require.

## D. Component restyle scope

| Component | Change |
|---|---|
| `Button` | Two variants: filled primary (navy fill, white text, 12px radius) and ghost (transparent, text-only, no border). Audit call sites (nav CTA, hero "Get started", "Save profile", "Add commitment") to assign the right variant to each. |
| `Card` | 12px radius, border → `border` token, background → `surface`. Mono corner label becomes an Inter uppercase tracked label, not monospace. |
| `Badge` | 12px radius, same `bg-risk-*`/`text-risk-*` logic (unchanged), Inter font + rise-design pill padding. |
| `StatTile` | Same leader-dot label/value pattern; new tokens/fonts; `tabular-nums` on values. |
| `ScoreGauge` | SVG arc unchanged (decided chart choice). Center score number: mono → Inter + `tabular-nums`. |
| `FactorBreakdown` | Recharts bar chart unchanged (decided chart choice) beyond token colors (already `risk.*`, no change needed). Ledger-line list: fonts/tokens only. |
| `WarningList`, `VerdictBanner` | Fonts/tokens only — warning-level logic and copy are contract-frozen, untouched. |
| `SimulatorPanel` | Fonts/tokens only, plus one real layout fix: its Before/After block uses a fixed `grid-cols-2` with no breakpoint — confirmed by inspection during planning to already force two cramped columns at mobile widths today. Stacks to one column below `md`. |
| `ProfileForm` | Inputs get 12px radius; full-width below `md`, labels always visible (already true). |
| `CommitmentsTable` | **Desktop (`≥768px`):** today's table, restyled to new tokens/radii. **Mobile (`<768px`):** new stacked-card layout, one card per commitment — header row (label + provider, kind badge top-right), 2×2 field grid (Monthly / Outstanding / Months left / Next due), "Remove commitment" button bottom-left. Approved via visual-companion mockup on 2026-08-29. Summary and Obligations-breakdown cards above the table/cards are unchanged structurally, tokens only. |

## E. Mobile-first responsiveness

- Design at 375px first, `md:` (768px) as the wider layout — enforced mobile-outward.
- `FactorBreakdown`: confirm the Recharts bar chart stacks above the ledger list below `md` (six
  horizontal bars need real width to stay legible).
- `SimulatorPanel`'s before/after two-column stat block stacks to one column below `md`. Tenure
  `<input type="range">` is already touch-friendly, no change needed.
- Touch targets: bottom-nav tabs and icon-only buttons get a 44×44px minimum hit area (iOS HIG /
  WCAG 2.5.5) — verify against the current icon+label nav link sizing during implementation.

## F. Testing

- `Nav.test.tsx` → replaced by `MarketingNav.test.tsx` and `AppNav.test.tsx`. Since jsdom doesn't
  evaluate real CSS media queries, `AppNav`'s test asserts both the desktop and mobile nav render in
  the DOM with the correct `hidden md:flex` / `md:hidden` classes, not actual visibility.
- `CommitmentsTable.test.tsx` gains cases for the mobile card-stack render path alongside the
  existing desktop-table cases (same data, two render paths).
- No changes to any `lib/*` test or backend/service-layer test — presentation-only change.
- Manual verification: re-run a Playwright pass (as used earlier this session to verify
  dashboard/simulator against the mock backend) at both a mobile (375×667) and desktop (1280×800)
  viewport once implemented, covering all seven pages.

## Decisions log (this spec)

Resolved by Aliff (2026-08-29), via text + visual-companion review:

- **rise-design.md adoption scope:** full system (Inter, 12px radii, ghost/filled buttons, neutral
  scale) — not just the background color — while keeping every KIRA+ brand hex unchanged.
- **App-shell desktop nav:** top nav (evolution of today's `Nav.tsx`), not bottom-nav-always or a
  left sidebar. Logo left, links right (`justify-between`) — a layout change from today's
  left-clustered nav.
- **Marketing nav CTA:** single "Dashboard" button replaces the login slot; "Get started" stays the
  separate hero CTA.
- **Neutral scale hex values:** `surface #FFFFFF`, `surfaceAlt #F4F5F5`, `border #E2E4E5`,
  `mist #919A9F`, `slate #606D75` — approved via swatch-in-context mockup.
- **Commitments mobile layout:** stacked cards, one per commitment, confirmed via mockup comparison
  against the forced-horizontal-scroll table.
