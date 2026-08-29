# PDPA / legal review — scoping checklist

Status: not started. This is a **scoping checklist for whoever conducts the actual review**
(a lawyer or appointed data protection contact), not a legal opinion, and not a substitute for one.
Nothing in this repo should ever be described as "PDPA compliant" — see the exact wording rule below.

## Why this exists

`docs/MASTER-PACKAGE.md`'s risk register (R6) flags PDPA compliance as **not formally established**,
severity High, likelihood Likely. The MVP's mitigation is architectural (see "What's already true"
below) — the actual compliance work (R6's stated mitigation) is "formal PDPA review; appointed data
protection contact; documented lawful basis, consent records and cross-border position." This
document exists so that review has a concrete starting scope instead of starting from zero.

**This is a gate, not a task on the engineering roadmap.** It doesn't block building anything in this
repo — it blocks ever putting *real user data* into what's built here. See root `CLAUDE.md`'s
git/production-readiness context and `docs/HANDOFF.md` for how this fits the rest of the path to
production.

## Exact wording rule (from `MASTER-PACKAGE.md`, do not soften)

> "The prototype follows privacy-by-design principles and would require formal PDPA and legal review
> before production deployment."

Never say "PDPA compliant", "fully compliant", or "we comply with PDPA" anywhere — pitch materials,
README, marketing copy, or in conversation with anyone in financial regulation. There has been no
legal review. Claiming compliance that doesn't exist is explicitly called out in `MASTER-PACKAGE.md`
as the single most damaging thing this team could say.

## What's already true (architectural mitigations already in place)

From `MASTER-PACKAGE.md`'s Privacy Architecture section — a reviewer should verify these claims
against the actual code, not just take them on faith:

- **Collect nothing not scored.** The `Profile` type (`docs/API-CONTRACT.md` §1) is seven numeric
  fields plus commitments — no name, no IC/passport number, no phone, no email, no identifiers of
  any kind.
- **No real user data today.** Every profile in the running app is either synthetic (the four demo
  personas) or hand-typed by whoever is using the demo. Nothing is collected from real users because
  there is no real-user flow yet (no auth — see the "Auth" row in `MASTER-PACKAGE.md`'s Future
  Technical Architecture table).
- **No third parties.** No analytics, no advertising pixels, no third-party scripts, no LLM call
  containing raw profile data (`llm_service.explain`'s payload is pre-reduced factor names/numbers,
  never the raw `Profile`).
- **User controls their data.** Profile view/edit/save already exist as first-class actions on
  `/profile`. Hard delete does not yet exist as a user-facing action anywhere in the app — flag this
  gap to the reviewer explicitly, since "Deletion is a hard delete with cascade, not a soft flag" is
  stated as a principle in `MASTER-PACKAGE.md` but isn't yet built as a UI affordance.

## What the review needs to cover

Pulled directly from the risk register (R4, R5, R6) and Privacy Architecture section — a lawyer or
DPO should treat this as the minimum scope, not the full scope:

- [ ] **Lawful basis** for processing whatever data the product collects once real users exist
      (consent? contract? something else under Malaysia's PDPA?).
- [ ] **Consent records** — the architecture "reserves a consent ledger for the point at which [a
      third party] exists" (`MASTER-PACKAGE.md`), but no consent-capture mechanism exists yet. Needs
      designing before Phase 4 (consent-based data integration) or any auth/real-data milestone.
- [ ] **Cross-border data position** — where is data hosted, processed, and does that cross a
      border PDPA cares about? (Relevant once real hosting/DB decisions are made — see the Database
      row in `MASTER-PACKAGE.md`'s Future Technical Architecture table.)
- [ ] **Appointed data protection contact** — a named person/role, not a shared responsibility.
- [ ] **Retention limits** — how long does data live once real user data exists? Not yet decided
      anywhere in the docs.
- [ ] **User-initiated deletion and export** — principle is documented (see above); the actual
      delete/export UI and backend cascade-delete logic do not exist yet.
- [ ] **Field-level encryption for financial values** — R5's stated future mitigation; not yet
      implemented (today's SQLite has no encryption at rest at all — see `docs/HANDOFF.md`'s
      ownership table for who owns `backend/database/`).
- [ ] **Financial-advice liability review (R4)** — separate from PDPA but adjacent: legal review of
      all user-facing copy (warning text, verdict banner wording) to confirm it stays consequence-
      framing, never advice/recommendation framing, per `docs/API-CONTRACT.md` and
      `frontend/docs/design.md`'s banned-phrase rules.

## When this actually needs to happen

Before any of the following, all of which are still gated on "first real user data" per
`MASTER-PACKAGE.md`'s roadmap and Future Technical Architecture table:

- Building real authentication (currently deferred by design — see `MASTER-PACKAGE.md`'s
  "Authentication" section)
- Migrating off SQLite to a database that will hold real user records
- Any Phase 4 (consent-based data integration) work

It does **not** need to happen before continuing to build features against synthetic/demo data, and
starting it early (in parallel with engineering work, not blocking it) is the whole point of listing
it here — legal review has a long lead time and isn't on the same clock as writing code.
