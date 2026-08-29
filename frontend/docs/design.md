# Frontend design

Status: draft, generated from `docs/MASTER-PACKAGE.md` Part I §2 (Brand system) and Part II §6, §14,
§15 (Frontend rules, Simulator verdict rules, Early-Warning wording). **This is the file Aliff most
expects to tune** — the brand system below is the team's decision, not mine; treat the rest as a
first pass to edit against, not a spec to implement blindly.

## Brand system

Carried over verbatim from the Master Package — the brand doesn't change with the framework swap.
**Note:** this file predates the mobile-shell redesign. The Palette and Typography rows below were
updated to match what actually shipped; for the full current token list and rationale, see
`docs/superpowers/specs/2026-08-29-mobile-shell-redesign-design.md`, not this file.

| Element | Decision | Reasoning |
|---|---|---|
| Name | KIRA+ | *Kira* = to calculate, in Malay. Verb, not noun. The *plus* signals augmentation. |
| Tagline | "Kira Dulu. Baru Commit." | Manglish rhythm read in the user's own voice. Instructional, not moralising. |
| Support line | See the consequences before you commit. | English-first, for institutional/government audiences. |
| Positioning | Government-grade trust, consumer-grade simplicity. | Two audiences, one product. |
| Personality | Modern · Malaysian · trustworthy · intelligent · approachable · inclusive | A calm advisor, not an alarm. |
| Palette | Deep petrol navy `#0B1F2A` · sea teal `#0F5C56` · jade `#1E8E7E` · songket gold `#B7791B`, layered on a near-white `surface` canvas (`#FFFFFF`) plus a neutral scale (`surface`/`surface-alt`/`border`/`mist`/`slate`) — the redesign spec has the full token list. | Teal-biased navy avoids generic banking blue. Risk states use clay red, never emergency red. |
| Typography | A single Inter family for display, body, and data — `font-display`/`font-body`/`font-mono` still exist as Tailwind class names, they just all resolve to Inter now. See the redesign spec for why. | One typeface reduces visual noise in the mobile shell. Inter is on Google Fonts. |
| Iconography | Line icons, 1.75px stroke, rounded caps — gauge, ledger rule, tally, arrow-into-future | Measuring instruments, not shopping bags. |
| Tone of voice | Second person, present tense, no jargon, no shame — "This would leave you RM750 a month," not "you cannot afford this" | We inform a decision; the user makes it. |

**Must not look like:** childish, overly corporate, generic banking blue, an AI robot, or a BNPL
shopping app.

## Risk / band colors — decided

Reuse two colors already in the palette rather than inventing a generic traffic-light set, and add
exactly one new one:

| Band | Color | Hex | Source |
|---|---|---|---|
| LOW RISK (green) | Jade | `#1E8E7E` | Already in the palette — reads as calm/trustworthy, not a foreign green. |
| MODERATE RISK (amber) | Songket gold | `#B7791B` | Already in the palette. |
| HIGH RISK (clay red) | Clay red | `#B5533C` | New. A burnt terracotta, warm against the gold, deliberately not a saturated alert red (`#FF0000`) that would clash with the calm/trustworthy tone. |

**Centralize these in `frontend/tailwind.config.ts`**, not scattered as raw hex in components:

```ts
colors: {
  navy: '#0B1F2A', teal: '#0F5C56', jade: '#1E8E7E', gold: '#B7791B',
  risk: { low: '#1E8E7E', moderate: '#B7791B', high: '#B5533C' },
}
```

Components use `bg-risk-low` / `text-risk-high` etc., never a hardcoded hex. Add one small helper
alongside `lib/format.ts` — e.g. `bandToRisk(band: Band): "low" | "moderate" | "high"` — so the
`"LOW RISK" → jade` mapping itself lives in exactly one place, the same "one conversion point"
principle the unit rule already applies to currency.

## Chart choices — decided

| Element | Choice | Why |
|---|---|---|
| Score gauge | Hand-rolled SVG semicircle arc (no charting library) | A gauge is one arc + a fill percentage — a library adds weight for something this simple, and a custom SVG gets exact brand control (Inter for the number, `risk.*` fill color, matches the "measuring instrument" iconography directly). |
| Six-factor breakdown | **Recharts** horizontal bar chart | Mature, good Next.js support, matches the Master Package's own original suggestion (Plotly horizontal bar), and naturally colors each bar by the Strong/Adequate/Weak/Critical classification using the same `risk.*` tokens. |

Recharts is the only charting dependency this adds — don't reach for a second library for the gauge.

## UI rules

Adapted from the Master Package's Streamlit-era "Frontend rules" — the intent is unchanged, the
mechanism is now React/Next.js instead of `st.*` calls.

- **One currency formatter, no exceptions.** Every ringgit figure goes through `fmtRm`/`fmtRmCents`
  in `lib/format.ts`. Inconsistent currency formatting is the fastest way for the demo to look
  unfinished.
- **Colour encodes band, always the same way.** Green ≥70 (LOW RISK), amber 45–69 (MODERATE RISK),
  red <45 (HIGH RISK). Never use red for anything that isn't a risk state.
- **Every number on screen carries its unit and period.** `"RM950"` is ambiguous; `"RM950 / month"`
  is not.
- **The synthetic-data notice is persistent**, visible on every page, never a dismissible modal.
- **Cache what doesn't change per interaction** — the equivalent of `@st.cache_resource` here is:
  don't refetch the demo persona fixtures or re-run `/simulate/grid` on every render; fetch once,
  read from state.
- **Responsive design is mandatory, not a stretch goal.** Use Tailwind's default breakpoints —
  `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px — and design every screen to hold up from mobile
  through the 1280×720 projector target, not just the projector resolution. Next.js doesn't have
  Streamlit's single-fixed-layout constraint, so there's no excuse to design for one viewport only.

## Verdict banner rules (Simulator)

| Condition | Banner | Wording |
|---|---|---|
| Band worsens | Red | "This would move you from MODERATE to HIGH risk." |
| Score drops ≥ 10, band held | Amber | "Higher financial stress — this costs you *n* points." |
| Score drops < 10 | Green | "Manageable impact — this costs you *n* points." |
| Buffer would go negative | Red | "This commitment exceeds your monthly slack by RM *n*." |

**Banned wording, this component specifically:** "You cannot afford this." / "You should not buy
this." / "We recommend against…" / "Bad decision." Every banner states a consequence with a number;
the user decides. This is both the product principle and the regulatory boundary (see
`docs/MASTER-PACKAGE.md` Part I §2, "Say this exactly, every time").

**Always show alternatives.** Stretching the same purchase over a longer tenure costing fewer points
than a shorter one over more months is the single most persuasive interaction in the demo — the
`POST /simulate/grid` response already has all 36 tenures, so this is a rendering decision, not a
new backend call.

## Warning copy (Dashboard)

Each warning code has a fixed message template with the triggering figure interpolated — never a
generic "you're at risk." From `docs/API-CONTRACT.md` §3 / `docs/MASTER-PACKAGE.md` §15:

| Code | Level | Message template |
|---|---|---|
| `HIGH_BNPL` | red | "BNPL repayments are *n*% of your income. Above 15%, a single missed month tends to cascade." |
| `LOW_BUFFER` | red | "Your savings cover *n* months of spending. An unplanned RM1,000 expense would have to be financed." |
| `THIN_SLACK` | amber | "You have RM *n* left after all commitments — *n*% of income." |
| `MULTI_COMMIT` | amber | "*n* active commitments totalling RM *n* a month across *n* due dates." |
| `OVERCOMMITTED` | red | "*n*% of your income is already committed before any discretionary spending." |
| `MODEL_STRESS` | amber | "Profiles similar to yours ran short of cash within 12 months in *n*% of simulated paths." |

Note the precise phrasing on `MODEL_STRESS`: "profiles similar to yours, in simulated paths" — never
"you have an n% chance of financial distress." The model's target is a simulation outcome, not an
observed real-world probability; overclaiming it is a defensibility problem, not just a copy nit.

## Five-screen content spec

| Screen | Contents |
|---|---|
| Profile | Seven-field form, four one-click demo personas, validation messages, save confirmation. |
| Commitments | Editable commitment table, aggregate card, upcoming repayments, obligations breakdown. |
| Dashboard | Score gauge, band, six-factor breakdown, warning flags, plain-language explanation. |
| Simulator | Purchase input, before/after comparison, delta table, verdict banner, tenure alternatives. |
| About | Methodology, factor weights, synthetic-data disclosure, limitations. |

## Decisions log

Resolved by Aliff (2026-08-26):

- **Risk colors:** reuse Jade/Songket gold for low/moderate, one new clay red (`#B5533C`) for high —
  see "Risk / band colors" above. Centralized in `tailwind.config.ts`, not scattered as raw hex.
- **Charts:** hand-rolled SVG arc for the score gauge, Recharts horizontal bar for the six-factor
  breakdown — see "Chart choices" above.
- **Responsive design:** mandatory, all breakpoints, not just the projector resolution.

Resolved by Aliff (2026-08-27), whole-site redesign:

- **Design system added:** shared primitives in `components/ui/` — `Button`, `Card` (hairline-
  bordered panel with a small mono corner label), `Badge` (`[TEXT]` in mono, colored by risk),
  `StatTile` (leader-dot label/value row). Heroicons (`@heroicons/react`) for functional icons only
  — nav items, button icons, warning/verdict severity — never decorative.
- **FactorBreakdown keeps both** the existing Recharts bar chart and the new ledger-line list
  (weight/sub-score/your-figure/contribution/strength per row) — a mockup draft dropped the chart
  in favor of the ledger lines alone, but Aliff chose to keep both rather than replace one with the
  other. See `docs/superpowers/specs/2026-08-27-website-redesign-design.md` for the full spec.
- **Dynamic Tailwind risk classes are safelisted:** `text-risk-*`/`border-risk-*`/`stroke-risk-*`/
  `bg-risk-*` built via template literals (e.g. `` `text-risk-${risk}` ``) aren't resolvable by
  Tailwind's JIT scanner on their own — `tailwind.config.ts` now has an explicit `safelist` pattern
  covering every combination, found necessary during the redesign's pre-flight review.

No open questions remain in this file as of this pass — if a new one comes up while building, add it
here rather than deciding silently.
