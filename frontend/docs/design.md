# Frontend design

Status: draft, generated from `docs/MASTER-PACKAGE.md` Part I §2 (Brand system) and Part II §6, §14,
§15 (Frontend rules, Simulator verdict rules, Early-Warning wording). **This is the file Aliff most
expects to tune** — the brand system below is the team's decision, not mine; treat the rest as a
first pass to edit against, not a spec to implement blindly.

## Brand system

Carried over verbatim from the Master Package — the brand doesn't change with the framework swap.

| Element | Decision | Reasoning |
|---|---|---|
| Name | KIRA+ | *Kira* = to calculate, in Malay. Verb, not noun. The *plus* signals augmentation. |
| Tagline | "Kira Dulu. Baru Commit." | Manglish rhythm read in the user's own voice. Instructional, not moralising. |
| Support line | See the consequences before you commit. | English-first, for institutional/government audiences. |
| Positioning | Government-grade trust, consumer-grade simplicity. | Two audiences, one product. |
| Personality | Modern · Malaysian · trustworthy · intelligent · approachable · inclusive | A calm advisor, not an alarm. |
| Palette | Deep petrol navy `#0B1F2A` · sea teal `#0F5C56` · jade `#1E8E7E` · songket gold `#B7791B` · warm paper `#FBFAF7` | Teal-biased navy avoids generic banking blue. Risk states use clay red, never emergency red. |
| Typography | Display: Bricolage Grotesque · Body: Source Serif 4 · Data: IBM Plex Mono | Instrument-panel grotesque for headings, serif for reading gravity, mono for every ringgit figure. All three are on Google Fonts. |
| Iconography | Line icons, 1.75px stroke, rounded caps — gauge, ledger rule, tally, arrow-into-future | Measuring instruments, not shopping bags. |
| Tone of voice | Second person, present tense, no jargon, no shame — "This would leave you RM750 a month," not "you cannot afford this" | We inform a decision; the user makes it. |

**Must not look like:** childish, overly corporate, generic banking blue, an AI robot, or a BNPL
shopping app.

**Clay red, not emergency red**, for HIGH risk / red warnings — a specific enough distinction to
tune once real hex values are picked (the palette above doesn't name a clay-red hex; pick one that
reads as "attention" rather than "system error").

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
- **Design for the actual demo conditions**: a projector at 1280×720 is the historical target from
  the Streamlit build and still worth checking, alongside normal responsive breakpoints (mobile,
  tablet, desktop) since Next.js doesn't have Streamlit's single-fixed-layout constraint anymore —
  Aliff should decide how much responsive polish is worth the time versus the demo-day target.

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

## Open questions for Aliff to tune

- Exact clay-red / amber / green hex values (palette above only names the neutral/brand colours).
- Whether the score gauge is a radial gauge, a simple bar, or something else — Master Package doesn't
  mandate a chart type, only that band + score + six factors are all visible together.
- How much responsive design investment is worth it given the demo-day target is a fixed projector
  resolution.
