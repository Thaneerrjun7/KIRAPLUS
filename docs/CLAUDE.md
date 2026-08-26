# CLAUDE.md — docs/

Four different kinds of document live here, and they don't get the same treatment.

## What's authoritative vs. historical

- **`API-CONTRACT.md`** — frozen, authoritative. Wins over everything else on any conflict. §1-§8
  don't change without explicit sign-off from both developers (root `CLAUDE.md`'s frozen-contract
  rule, §8 of the contract itself). §9 (HTTP transport) is additive and can grow without a
  `contract_version` bump as long as it doesn't change what a §2-§5 function returns.
- **`MASTER-PACKAGE.md`** — the original business/pitch document. Looser than the contract, and
  occasionally inconsistent with it (e.g. Appendix C's ringgit floats vs. the contract's integer
  sen). It's a historical record of the original plan — don't edit it to match later decisions;
  record contradictions elsewhere (`HANDOFF.md`, `superpowers/`) instead of rewriting it.
- **`HANDOFF.md`** — living. Update it when ownership or the backend/frontend split changes.
- **`superpowers/`** — living spec/test-plan docs for individual architecture decisions (e.g. the
  Next.js + FastAPI migration). Add a new file here for the next big structural decision rather than
  growing `HANDOFF.md` or the contract to cover it.

## Adding a new doc here

Decide which of the four categories above it is before writing it — that decides whether it's ever
allowed to go stale (`MASTER-PACKAGE.md`), must never contradict §1-§8 (`API-CONTRACT.md`), or is
expected to be kept current as things change (`HANDOFF.md`, `superpowers/`).
