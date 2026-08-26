KIRA+

Master Package

Contents

Front matter

--Cover --How to use this document --Judging scorecard map

Part I * Concept & Strategy

1Executive Summary 2Product Overview 3Problem Statement 4Malaysian Context
5Problem Validation 6Target Users 7Personas 8User Journey 9Solution 10Core
Features 11USP 12Why AI? 13Business Model 14Stakeholder Value 15Market
Opportunity 16Competitor Landscape 17Commercialisation 18Government Adoption
19ESG & National Impact 20Scalability 21Roadmap 22Budget 23Risk Register
24Limitations 25Future Integrations 26Future Vision 27Conclusion

Part II * Technical & MVP Spec

1Technical Overview 2System Architecture 3Architecture Diagram 4Data Flow
5Component Architecture 6Frontend 7Backend 8Database 9ML Pipeline 10Feature
Engineering 11Model Architecture 12Scoring Methodology 13Explainability
14Affordability Simulator 15Early-Warning Engine 16LLM & RAG Layer 17API
Structure 18Database Schema 19Security Architecture 20Privacy Architecture
21Authentication 22Error Handling 23Testing Strategy 24Deployment 25GitHub
Structure 26Environment Variables 273-Day Technical Backlog 28Developer
Acceptance Criteria 29Future Technical Architecture

Part III * Pitch Deck

--12-Slide Structure --Pitch Scripts (30s-5min)

Part IV * Execution

--3-Day Playbook --Master Execution Board

Part V * Judge Q&A

--34 Questions & Answers

Part VI * Appendices

ASource Register BGlossary CReference Scoring Code DSelf-Review Against Brief

MAIC Nexus Challenge 2026 * Track T3 -- AI for Financial Services & Fintech

# KIRA+

"Kira Dulu. Baru Commit."

_See the consequences before you commit._ An AI-powered financial health,
affordability-simulation and BNPL early-warning platform for Malaysian
consumers.

Document

    Master Package v1.0

Contains

    Strategy * Tech Spec * Deck * Playbook * Q&A

Build window

    3 days * 2 developers

Team

    5 members * 5 workstreams

Status

    Ready to execute

◆

### How to use this document

This is the single source of truth for KIRA+ over the next three days. Every
person on the team has a lane in it, and nobody needs to read all of it.

Person 1 * Documentation

#### Parts I & VI

Problem, validation, market, competitors, sources. Everything you need for the
panel pack is written -- your job is to verify, extend and cite.

Person 2 * Branding / UX

#### §2, §7, §8, §10, Part III

Brand system, personas, user journey, screen inventory and the visual
direction for all 12 slides.

Person 3 * Pitch / Business

#### §11-§22, Parts III & V

Business model, market, commercialisation, the exact 12-slide deck, four pitch
scripts and 34 judge questions.

Developer 1 * Application

#### Part II §6-§8, §14, §17-§18, §24

Streamlit app, pages, database, API contracts, simulator UI, deployment. Start
at task `D2-01`.

Developer 2 * AI / Data

#### Part II §9-§16, §23

Synthetic data, scoring engine, Monte-Carlo labels, model, explainability, LLM
layer. Start at task `D1-01`.

Everyone

#### Part IV -- Execution board

One table, five workstreams, three days. If a task is not on that board, it is
not happening this week.

#### Source discipline

Every non-obvious claim in this document carries one of four tags. Panelists
will test the difference between what we know and what we assume, so we mark
it ourselves before they ask.

Tag| Meaning| How to defend it  
---|---|---  
Verified source| Published by a named institution, cited in Appendix A.| Quote
the figure, the body and the period.  
Team assumption| Our judgement, stated openly. Not published anywhere.|
Explain the reasoning and say it requires validation.  
Prototype assumption| True of the 3-day build only, not of a production
system.| Name the production path that replaces it.  
Future requirement| Deliberately out of scope now; on the roadmap.| Point at
the roadmap phase that owns it.  
  
Non-negotiable

If a figure is not in Appendix A, do not put it on a slide. Do not round a
number upward to make it land harder. A single fabricated statistic that a
fintech judge recognises costs more than every point the rest of the deck
earns.

◆

### Judging scorecard map

The evaluation weights below are as briefed to the team. Each row names where
in this document the evidence for that criterion lives, and the one thing that
most moves the score.

Criterion| Weight| Evidence in this document| What actually moves the mark  
---|---|---|---  
**Technical feasibility**|  25%| Part II §1-§18, §27-§28| A working demo, plus
honest metrics with a stated baseline.  
**Commercial viability**|  25%| §13, §15, §17, §22| A named first customer
type and why they pay, not a TAM pyramid.  
**Industry relevance**|  20%| §4, §5, §16, §18| The Consumer Credit Act 2025
tailwind -- regulation just created our buyer.  
**Scalability**|  15%| §20, §21, Part II §29| Cost per assessment falling as
volume rises; no per-user human cost.  
**ESG / national impact**|  15%| §19| Two named national KPIs from a published
2026-2030 strategy.  
Weights as briefed to the team Team assumption -- confirm against the official
MAIC rubric before the preliminary submission.

Part I

## Concept & Strategy

Written for competition panelists, judges, and business and government
stakeholders. A reader should be able to finish this part and understand KIRA+
completely without speaking to us.

1

### Executive Summary

Malaysians can now take on a financial commitment in about eleven seconds at a
checkout page. Understanding what that commitment does to the rest of their
month takes considerably longer -- and almost nothing in the market helps them
do it _before_ they tap.

**KIRA+ closes that gap.** A user enters their income, expenses, savings and
existing commitments once. KIRA+ returns a transparent 0-100 financial health
score with a full breakdown of why it is what it is, consolidates every Buy
Now Pay Later obligation into one view, and -- the feature the whole product
exists for -- lets them simulate a purchase they have not made yet and see the
consequence before they commit.

The name is the thesis. _Kira_ is Malay for _to calculate_. Kira dulu, baru
commit: calculate first, then commit.

8.0m

Active BNPL accounts in Malaysia, Q1 2026 -- up from 6.5m twelve months
earlier.

RM5.3bn

Outstanding BNPL balances at Q1 2026, up from RM3.8bn nine months earlier.

243m

BNPL transactions across 2025, worth RM21.3bn -- averaging RM91 each.

61%

of Malaysians have difficulty raising RM1,000 for an emergency -- up from 47%
in 2021.

Sources: Ministry of Finance (Q1 2026 and full-year 2025); Bank Negara
Malaysia Financial Stability Review 2H 2025; BNM Financial Capability &
Inclusion Demand Side Survey 2024. Full citations in Appendix A. Verified
source

#### What we are asking the panel to judge

The product

Six core features, all buildable in three days by two developers, demonstrated
live on realistic Malaysian financial profiles. Not a mockup -- a working
Streamlit application with a real scoring engine, a trained model and an
explanation layer.

The timing

The Consumer Credit Act 2025 now requires BNPL providers to run affordability
assessments that consider a consumer's _existing_ commitments. Every provider
in Malaysia suddenly needs the capability KIRA+ is built around. Regulation
created our buyer.

The business

B2B2C. Consumers use the core platform free. Institutions -- BNPL providers,
banks, e-wallets, employers, universities -- license the assessment layer, the
white-label journey and the aggregate analytics.

The national case

Malaysia's National Strategy for Financial Literacy 2026-2030 sets a target of
cutting the share of Malaysians unable to raise RM1,000 from 61% to 45% or
below. KIRA+ addresses that target directly, at the moment of decision.

The one-line version

Most financial tools tell you what you already spent. KIRA+ tells you what
your next decision will cost you -- while you can still change your mind.

2

### Product Overview

KIRA+ is

  * An AI-powered financial health assessment
  * A BNPL commitment aggregator
  * An affordability simulator for decisions not yet made
  * An early-warning system for financial stress
  * A plain-language explanation layer over a transparent model
  * Financial education delivered at the moment it matters

KIRA+ is not

  * A bank or a BNPL provider
  * A replacement for CTOS or CCRIS
  * A lending-decision or credit-approval engine
  * A CTOS score predictor
  * A generic AI chatbot
  * A source of regulated financial advice

Say this exactly, every time

"KIRA+ does not predict your CTOS score and does not approve or decline
credit. It assesses financial health from information you give us, and
explains what a new commitment would do to it." Any drift from that sentence
creates a regulatory question we cannot answer in a five-minute pitch.

#### Brand system

Element| Decision| Reasoning  
---|---|---  
**Name**|  KIRA+| _Kira_ = to calculate, in Malay. Instantly local, instantly
legible, verb not noun. The _plus_ signals augmentation, not another account.  
**Tagline**|  "Kira Dulu. Baru Commit."| Manglish rhythm a Malaysian reads in
their own voice. Instructional, not moralising.  
**Support line**|  See the consequences before you commit.| English-first line
for institutional and government audiences.  
**Positioning**|  Government-grade trust, consumer-grade simplicity.| Two
audiences, one product. The line resolves the tension rather than hiding it.  
**Personality**|  Modern * Malaysian * trustworthy * intelligent *
approachable * inclusive| A calm advisor, not an alarm. We show consequence
without shame.  
**Palette**|  Deep petrol navy `#0B1F2A` * sea teal `#0F5C56` * jade `#1E8E7E`
* songket gold `#B7791B` * warm paper `#FBFAF7`| Teal-biased navy avoids
generic banking blue. Gold reads Malaysian without using flag colours
literally. Risk states use clay red, never emergency red.  
**Typography**|  Display: Bricolage Grotesque * Body: Source Serif 4 * Data:
IBM Plex Mono| An instrument-panel grotesque for headings, a serif for reading
gravity, a mono for every ringgit figure. All three are open-licensed.  
**Iconography**|  Line icons, 1.75px stroke, rounded caps. Gauge, ledger rule,
tally, arrow-into-future.| Measuring instruments, not shopping bags.  
**Tone of voice**|  Second person, present tense, no jargon, no shame. "This
would leave you RM750 a month" -- not "you cannot afford this".| We inform a
decision; the user makes it.  
  
##### The branding must not look like

Childish (this handles real debt) * overly corporate (our user is 24, not a
compliance officer) * generic banking blue (indistinguishable, and we are not
a bank) * an AI robot (the AI is infrastructure, not the character) * a BNPL
shopping app (we are the counterweight to those).

##### Alternative taglines held in reserve

  * **" Kira dulu, baru commit."** -- primary. Local, memorable, instructional.
  * "Know the cost of yes." -- English-first, works for institutional decks.
  * "Every commitment has a shadow. See yours." -- strongest for a hook slide, weakest for a product page.
  * "Berapa lagi boleh tahan?" (How much more can you take?) -- highest local resonance, but too close to shaming. Rejected.

3

### Problem Statement

Core problem statement

Malaysian consumers can access digital credit far more easily than they can
understand the cumulative impact of the commitments they are accumulating.

#### Problem context

A BNPL offer is presented at the point of maximum desire and minimum
reflection, in the smallest possible unit: _RM100/month_. That framing is not
deceptive -- it is accurate. It is simply the wrong unit for the decision
being made. The relevant question is not "is RM100 a lot?" It is "what does
_another_ RM100 a month do to a household that already has four commitments,
RM950 of monthly slack and three weeks of savings?"

Nobody answers that question at checkout. Not the merchant, not the BNPL
provider, not the banking app, and not the consumer -- because answering it
requires assembling information that currently lives in six different places.

#### Root causes

Root cause| What is actually happening  
---|---  
**Fragmentation**|  Commitments sit across multiple BNPL apps, e-wallets, bank
accounts and cards. No single surface shows the total. The consumer is the
only integration layer, and they are integrating from memory.  
**Unit-of-decision mismatch**|  Credit is sold in monthly instalments;
financial health is experienced as monthly slack. The two are never shown
together at the moment of decision.  
**Reactive tooling**|  Budgeting apps, statements and dashboards are all
retrospective. They describe a decision after it has become irreversible.  
**Low friction by design**|  BNPL approval is near-instant and, until
recently, largely unassessed. Speed is the product feature; deliberation is
the casualty.  
**Assessment blind spot**|  Historically each provider saw only its own
exposure. A consumer could hold five commitments and appear low-risk to all
five.  
**Thin buffers**|  When 61% of Malaysians cannot raise RM1,000, a RM200
monthly commitment is not a rounding error -- it is a meaningful share of the
shock absorber.  
  
#### Why existing tools do not solve it

Tool class| What it does well| Why it leaves the gap open  
---|---|---  
Banking apps| Accurate balances and transaction history for that bank.| Bank-
siloed and retrospective. Non-bank BNPL commitments are largely invisible to
them.  
Budgeting apps| Categorise spending; set limits.| Backward-looking by
construction. They tell you the month you had, not the month a new commitment
would create.  
BNPL provider apps| Show that provider's own schedule clearly.| Single-
provider by definition, and structurally motivated toward more usage, not
less.  
CTOS / CCRIS| Authoritative credit reporting and history.| Report what has
already happened to a credit file. Not designed as a forward-looking personal
decision tool, and not a simulator.  
Generic AI assistants| Explain financial concepts fluently.| No grounded view
of the user's actual numbers, no deterministic model, and prone to confident
invention on figures.  
Financial literacy programmes| Build durable knowledge at scale.| Delivered in
classrooms and campaigns -- hours or years away from the checkout page where
the decision happens.  
Assessed on publicly observable product behaviour Team assumption. We claim a
_gap in combination_ , not that any competitor is incapable. Person 1 to
verify each row against live product documentation before the semi-final.

#### Who is affected, and what it costs them

Directly

BNPL users with two or more concurrent commitments; early-career workers; gig
and variable-income earners; households with less than one month of buffer.

Consequence for them

Repayment stacking, late fees, borrowing to service borrowing, and a shrinking
emergency buffer that turns an ordinary shock -- a repair, a medical bill, a
slow month -- into a default.

Consequence upstream

Providers assess affordability without seeing total exposure; regulators
supervise a fast-growing segment through periodic aggregate reporting;
employers absorb the productivity cost of financial stress.

Framing discipline

BNPL is not the villain of this pitch. It is a legitimate, regulated, useful
payment product, and BNM has stated that BNPL exposure remains modest at
roughly 0.3% of total household debt. Our problem is **visibility** , not the
existence of the instrument. Anyone on the team who says "BNPL causes poverty"
in front of a fintech judge has lost the room and deserved to.

4

### Malaysian Context

Three things are true at once in Malaysia right now, and the combination is
what makes KIRA+ timely rather than merely sensible.

#### 1\. BNPL is growing quickly from a small base

Measure| 1H 2025| 2H 2025| Q1 2026| Trend  
---|---|---|---|---  
Transactions| 102.6m| 140.3m| --| +36.7% h/h  
Transaction value| RM9.3bn| RM11.9bn| --| +28.0% h/h  
Active accounts| 6.5m (Jun)| 7.5m (Dec)| **8.0m**|  +23% in 9 months  
Outstanding balances| RM3.8bn (Jun)| RM4.9bn (Dec)| **RM5.3bn**|  +39% in 9
months  
Overdue share of outstanding| --| 3.3%| 3.4%| RM181m  
Share of total household debt| --| 0.3%| 0.3%| stable  
Bank Negara Malaysia, Financial Stability Review 2H 2025; Q1 2026 and overdue
quantum per Ministry of Finance. Full-year 2025: 243m transactions worth
RM21.3bn, averaging RM91. Verified source

Three derived figures follow directly from the table above and are worth
having on the tip of your tongue: the average BNPL transaction across 2025 was
**RM91** ; the average outstanding balance per account at Q1 2026 was about
**RM663** ; and the average account ran roughly **three BNPL transactions a
month**. Verified source (our arithmetic on BNM figures -- show the division
if asked)

Read this correctly

Volume is growing faster than value, and value is growing faster than
accounts. Malaysians are not mostly taking _larger_ BNPL commitments -- they
are taking _more_ of them. That is precisely the pattern a per-provider view
cannot see and a consolidated view can. It is also the single strongest
evidence sentence in our deck.

#### 2\. Household financial resilience is thin, and thinning

61%

have difficulty raising RM1,000 for an emergency (2021: 47%)

26%

feel they carry too much debt; 12% are highly indebted

26%

sometimes or always run short of money (2021: 14%)

58%

try to save for the future (2021: 67%)

BNM Financial Capability & Inclusion Demand Side Survey 2024, n = 3,587
Malaysians aged 15+. Verified source

Two further findings from the same survey matter for our design: 37% could
cover living costs for more than three months if income stopped, and only 18%
for more than six. And 92% of Malaysians now use digital financial services,
up from 74% in 2021 -- which is why a digital intervention is a realistic
channel rather than a wish.

#### 3\. Regulation just changed the market

The **Consumer Credit Act 2025** brings non-bank credit providers, BNPL
operators included, under formal oversight for the first time, administered by
a new **Consumer Credit Commission** under the Ministry of Finance. The
obligations reported publicly are the important part for us:

  * **Mandatory creditworthiness and affordability assessment** before credit is granted -- explicitly taking into account a consumer's _existing financial commitments_ and debt service ratio, not just the size of the single transaction in front of them.
  * **Licensing and registration** of BNPL and other non-bank credit providers with the Commission.
  * **Transparent disclosure** of repayment terms, fees and charges.
  * **Credit information sharing** is expected to be addressed through the Commission's forthcoming subsidiary regulations and conduct standards. Contested -- secondary sources disagree on whether the Act itself imposes a reporting duty, and BNPL commitments do _not_ currently appear in CCRIS or CTOS. Person 1 must settle this against the Act before it is said on stage.

Why this is the most important slide in the deck

Before this Act, an affordability-assessment layer was a nice idea somebody
might buy. After it, every BNPL provider in Malaysia has a statutory
obligation to assess affordability against a consumer's total commitments --
which is the exact computation KIRA+ performs. We are not asking institutions
to adopt a new philosophy. We are offering to help them meet a requirement
they already have.

Commencement and phasing as reported in trade and consumer press: Act in force
1 March 2026, compliance obligations from 1 June 2026, Commission operational
around mid-2026. Verified source for the existence and substance of the
obligations; Future requirement that Person 1 confirms exact commencement
dates against the gazetted Act and Commission guidance before the semi-final.
Do not quote a date on stage you have not checked.

5

### Problem Validation

The brief for this document was explicit: distinguish source data from
inference from assumption. Here is that separation done honestly, including
the places where we are weakest.

#### Source data -- published, citable, defensible

Finding| Body & period  
---|---  
8.0m active BNPL accounts; RM5.3bn outstanding; RM181m overdue (3.4%)|
Ministry of Finance, Q1 2026  
243m transactions worth RM21.3bn across 2025, averaging RM91; 140.3m worth
RM11.9bn in 2H 2025 alone| Ministry of Finance / BNM Financial Stability
Review 2H 2025  
BNPL is 0.3% of total household debt; 3.3% overdue at end-2025 (RM160.2m),
3.4% at Q1 2026 (RM181m)| BNM / Ministry of Finance  
More than 70% of BNPL users are from the B40 income group| Ministry of Finance
via Bernama, 2026 -- note this is a _household_ income classification, not an
individual salary threshold  
61% have difficulty raising RM1,000; 26% feel over-indebted; 26% run short of
money| BNM Financial Capability & Inclusion Survey 2024  
92% use digital financial services| BNM FCI Survey 2024  
47% living paycheck to paycheck; 39% of middle-income earners save RM500 or
less monthly; 26% unaware of credit scores| RinggitPlus Malaysian Financial
Literacy Survey 2025, n = 3,113  
Affordability-assessment and credit-reporting obligations on BNPL providers|
Consumer Credit Act 2025 / Consumer Credit Commission  
National target: reduce those unable to raise RM1,000 from 61% to ≤45% by
2030; reduce over-indebtedness perception from 26% to ≤15%| National Strategy
for Financial Literacy 2026-2030 (Financial Education Network)  
  
#### Inference -- reasoning from that data

  * Transaction count growing faster than transaction value (+36.7% vs +28.0%) implies **commitment multiplication rather than commitment enlargement**. Multiplication is the harder pattern for a consumer to track.
  * 7.5m accounts against roughly 3.1 transactions per account per month implies BNPL is becoming **habitual rather than exceptional** for a meaningful slice of users.
  * A 3.2% overdue rate on a base growing 29% per half-year means the aggregate looks calm **while individual exposure concentrates**. Portfolio-level comfort and household-level stress are not in conflict; they are the same number viewed from different ends.
  * A statutory duty to assess against existing commitments, in a market where no provider sees the others' exposure, implies **demand for a consumer-consented consolidated view**.

#### Assumption -- what we believe but have not proven

Assumption| Confidence| How we would test it  
---|---|---  
Consumers will manually enter their financial data in exchange for a score and
a simulator| Medium| Onboarding completion rate in a pilot; time-to-first-
score. This is the single biggest product risk.  
Seeing a projected score drop changes at least some purchase decisions|
Medium| A/B test: simulator shown vs not, measure stated intent then actual
take-up.  
Institutions will pay for an assessment layer rather than build it internally|
Medium| Five structured interviews with BNPL and e-wallet product owners.  
A transparent rule-based score is more trusted than an opaque ML score in this
domain| Higher| Preference test in a pilot cohort; also the safer regulatory
posture regardless of the result.  
  
Our honest weakness -- own it before a judge finds it

We have **no primary user research**. No survey of our own, no interviews, no
pilot. Every behavioural assumption above is reasoned, not observed. If a
judge asks "how do you know people will use this?", the correct answer is: _"
We don't yet. Here is the specific test we would run in week one, here is the
metric that would falsify it, and here is what we would change if it failed."_
That answer scores. "We're confident users will love it" does not.

**Fastest validation available to us before the semi-final:** a short self-
administered questionnaire circulated to 100-150 Malaysian young adults
covering number of active BNPL commitments, whether they can name the total,
and whether they have ever been surprised by a month's total repayments.
Person 1 owns this. Even n = 100 of our own data changes the answer above from
a promise into a finding. Future requirement

6

### Target Users

Primary -- the people we build for

  * Young Malaysian adults, roughly 20-35
  * Digitally active consumers
  * Active BNPL users, especially with 2+ concurrent commitments
  * Early-career workers on their first stable income
  * Anyone juggling multiple financial commitments

Secondary -- the people who pay

  * BNPL providers
  * Banks and digital banks
  * E-wallets and super-apps
  * Employers running financial wellness benefits
  * Universities and colleges
  * Government financial literacy programmes

Institutional stakeholders

  * Financial institutions
  * Government agencies and regulators
  * Financial education organisations
  * Credit counselling bodies

**Beachhead for the MVP demo:** Malaysian adults aged 22-30, in their first
three to six years of work, with two or more active BNPL commitments and less
than three months of expenses saved. We choose this group because they carry
the pattern the product is designed for, they are the most digitally
reachable, and their habits are still forming -- which is where an
intervention has the most leverage. Team assumption

7

### Personas

Four profiles. Every number below is a real input to the KIRA+ scoring engine,
and every score shown is the actual output of the formula documented in Part
II §12 -- not an illustration. Developers can use these as fixtures; the pitch
team can use them on stage.

68

#### Aisyah, 26

Marketing executive * Kuala Lumpur * RM4,500/mo

Moderate risk

Inputs

    Fixed RM1,984 * Variable RM1,216 * BNPL RM250/mo across 2 commitments * Loan RM100/mo * Savings RM2,250
Derived

    Monthly buffer **RM950** * DSR 7.8% * BNPL/income 5.6% * Emergency runway **0.6 months**
Why 68

    Debt burden and repayment capacity are genuinely strong. The score is held down almost entirely by a 0.6-month emergency runway and savings of half a month's income.
Her words

    "I always know I _can_ pay it. I just never know what happens if something goes wrong that month."
What KIRA+ gives her

    The simulator. She is the exact user who is one impulsive commitment away from a materially worse position and cannot see it.

◆ This is our demo persona. Learn these numbers.

94

#### Daniel, 31

Process engineer * Penang * RM7,200/mo

Low risk

Inputs

    Fixed RM2,600 * Variable RM1,300 * No BNPL * Car + PTPTN RM850/mo * Savings RM26,000
Derived

    Monthly buffer **RM2,450** * DSR 11.8% * Emergency runway **5.5 months**
Why 94

    Every factor is strong. He loses points only on debt burden, where a conventional car loan sits above our best-case anchor.
His words

    "I don't need an app to tell me I'm fine. I need one that tells me the month I stop being fine."
What KIRA+ gives him

    Proof the product is not a shaming tool. Daniel exists in the demo to show a green score -- a scorer that only ever says "you are at risk" is not a scorer.

41

#### Wei Jian, 29

P-hailing rider * Johor Bahru * ~RM3,400/mo variable

High risk

Inputs

    Fixed RM1,500 * Variable RM900 * BNPL RM310/mo across 4 commitments * Motorcycle loan RM260/mo * Savings RM900
Derived

    Monthly buffer **RM430** * DSR 16.8% * Commitment ratio **87.4%** * Runway 0.3 months * −3 point multi-commitment penalty
Why 41

    Not catastrophic on any single factor -- but thin on all of them at once, with four concurrent commitments and almost no buffer. This is the profile a per-provider view scores as fine.
His words

    "Good week, no problem. Bad week, I'm choosing which one to pay late."
What KIRA+ gives him

    Consolidation and early warning. Variable income makes the buffer question urgent in a way a salaried view understates.

17

#### Farah, 23

Graduate trainee * Shah Alam * RM2,900/mo

High risk

Inputs

    Fixed RM1,450 * Variable RM780 * BNPL RM430/mo across 5 commitments * PTPTN RM180/mo * Savings RM350
Derived

    Monthly buffer **RM60** * BNPL/income 14.8% * Commitment ratio **97.9%** * Runway 0.1 months * −6 point penalty
Why 17

    RM60 of monthly slack against RM610 of monthly debt service. Any unplanned expense is financed by another commitment. Repayment capacity scores 4.9 out of 100.
Her words

    "Each one was only about a hundred ringgit a month. I genuinely didn't add them up."
What KIRA+ gives her

    The aggregate view she has never seen, a red early warning, and a repayment ordering that does not require her to earn more first.

On synthetic personas

These four are constructed, not interviewed. Income and expense levels are
plausible for their stated roles and locations but are Prototype assumption,
not survey data. We use them because they exercise every branch of the scoring
engine -- and we say so on stage rather than implying they are research
subjects.

8

### User Journey

Six steps, five minutes, one decision changed. The whole journey is
demonstrable live in the three minutes we get on stage.

STEP 01 Onboard Enter income, expenses, savings. ~90 seconds. STEP 02 Add
commitments Every BNPL plan and loan, in one list. Often the first time. STEP
03 See the score 0-100, with the six factors that produced it. STEP 04
Understand it Plain-language reasons, no jargon, no black box. STEP 05 ◆ THE
MOMENT Simulate the purchase "RM2,400 phone, 12 months." Before vs after, side
by side. Score 68 -> 54 STEP 06 Decide, informed Buy it anyway, defer it, or
restructure. KIRA+ never decides for the user.

Figure 1 -- The KIRA+ user journey. Steps 1-4 exist to make step 5 possible;
step 6 is deliberately left to the user.

#### Where the journey can fail

Step| Failure mode| Mitigation in the MVP  
---|---|---  
01-02| Manual entry is too long; the user abandons before seeing value.| Five
fields to a first score. Commitments can be added after. Pre-filled demo
profiles let a new user see the output before investing effort.  
03| A low score reads as judgement and the user closes the app.| Never a
single verdict word. Always score plus the two specific factors that would
move it most, phrased as levers rather than failures.  
04| The explanation sounds generic and trust collapses.| Explanations are
generated from that user's own factor contributions, quoting their own numbers
back to them.  
05| The simulated drop feels arbitrary.| Every simulation shows the four
quantities that changed -- buffer, commitment ratio, score, band -- and by how
much.  
  
9

### Solution

KIRA+ is a consumer-consented financial health layer that sits _between_ a
person and their next financial commitment. It does three things no single
existing product does together: it **consolidates** commitments the market
currently keeps siloed, it **quantifies** health transparently rather than as
an opaque credit verdict, and it **projects forward** from a decision that has
not been made yet.

Consolidate

#### One list, one total

Every BNPL plan, loan and recurring obligation in a single view. For many
users the aggregate monthly repayment figure is genuinely new information.

Quantify

#### A score you can audit

0-100 from six weighted factors, all published. A user -- or a regulator --
can reproduce the arithmetic by hand. No opaque credit verdict.

Project

#### The consequence, in advance

Enter a purchase you are considering. See the buffer, the ratio, the score and
the risk band recomputed before you commit to anything.

Design principle that governs every screen

**Consequence, not judgement.** KIRA+ never says "you cannot afford this." It
says "this would leave you RM750 a month instead of RM950, and move you from
68 to 54." The user keeps the decision. We are accountable for the arithmetic
and the clarity; they are accountable for the choice. This is also our
cleanest regulatory boundary: we quantify consequence, we do not advise.

10

### Core Features

Six features are core. Everything else is optional and does not get built
until all six work. Full engineering specifications, with owners and
acceptance criteria, are in Part II §5.

#| Feature| What the user gets| Owner| Priority  
---|---|---|---|---  
1| **Financial Profile**|  Enter income, fixed and variable expenses, savings,
BNPL commitments, loan repayments and upcoming repayments. Saved locally,
editable, re-scored instantly.| Dev 1| P0  
2| **BNPL Aggregator**|  Number of commitments, total monthly repayment, total
outstanding, next repayments due, and total monthly obligations -- in one
place.| Dev 1| P0  
3| **Financial Health Score**|  A 0-100 score with a LOW / MODERATE / HIGH
band, computed from six published factors.| Dev 2| P0  
4| **Risk Breakdown**|  Each of the six factors shown with its own sub-score,
weight and contribution. The score is never a black box.| Dev 2| P0  
5| **" Can I Afford This?" Simulator**| Enter a purchase, price and tenure.
See buffer, commitment ratio, score and band before vs after. **The reason the
product exists.**|  Dev 1 \+ Dev 2| P0  
6| **Early-Warning System**|  Green / amber / red flags for high BNPL
exposure, low buffer, rising obligations, multiple commitments and projected
stress.| Dev 2| P0  
  
#### Feature 5 in detail -- the demo that wins or loses the pitch

Aisyah is considering a RM2,400 phone on a 12-month BNPL plan. That is RM200 a
month -- a number that sounds entirely manageable, and is exactly the framing
the market gives her. Here is what KIRA+ shows her instead:

What changes| Before| After| Delta  
---|---|---|---  
Monthly disposable buffer| RM950| RM750| −RM200  
Commitment ratio (obligations ÷ income)| 78.9%| 83.3%| +4.4 pp  
BNPL exposure (BNPL ÷ income)| 5.6%| 10.0%| +4.4 pp  
Debt service ratio| 7.8%| 12.2%| +4.4 pp  
Repayment capacity (buffer ÷ debt service)| 2.71×| 1.36×| −50%  
**KIRA Score**| **68**| **54**| **− 14**  
Risk band| Moderate| Moderate| held  
Active commitments| 2| 3| +1  
Computed by the reference implementation in Appendix C. Reproducible by hand
from Part II §12.

⚠ Higher financial stress

"This commitment would halve your repayment capacity. You would still meet
your obligations, but a RM750 buffer against 0.6 months of savings leaves very
little room for a bad month. Stretching the same purchase to 24 months, or
waiting until your current plan ends in four months, would cost you 6 points
instead of 14."

#### Other scenarios, same engine

Aisyah considers…| Per month| Buffer| Score| Delta| Band  
---|---|---|---|---|---  
Headphones, RM600 over 6 months| RM100| RM850| 62| −6| Moderate  
Furniture, RM1,800 over 24 months| RM75| RM875| 64| −4| Moderate  
Phone, RM2,400 over 12 months| RM200| RM750| 54| −14| Moderate  
Laptop, RM3,600 over 12 months| RM300| RM650| 46| −22| Moderate  
Holiday, RM4,800 over 6 months| RM800| RM150| 18| −50| High  
Note the furniture row: a larger purchase over a longer tenure costs fewer
points than a smaller one over a shorter tenure. The model rewards structure,
not abstinence -- which is what makes it advice-adjacent without being advice.

#### Try it -- live simulator

This runs the actual KIRA+ scoring formula in your browser. Nothing is sent
anywhere. Adjust Aisyah's profile or the purchase and watch the score move.

Monthly income (RM)  Fixed expenses (RM)  Variable expenses (RM)  BNPL
repayments (RM/mo)  Other loan repayments (RM/mo)  Savings (RM)  Active BNPL
commitments  Purchase price (RM)  Tenure (months)

Before -- today

68

Moderate risk

buffer RM950  
commit 78.9%

After -- with this purchase

54

Moderate risk

buffer RM750  
commit 83.3%

Factor| Weight| Before| After| Contribution Δ  
---|---|---|---|---  
  
Reference implementation: Appendix C. The Python and JavaScript versions
produce identical scores -- parity is enforced by test `T-07`.

11

### Unique Selling Proposition

Primary USP -- use this one

Every other tool scores the commitments you already have. KIRA+ scores the one
you are about to make -- in the ninety seconds before you make it.

The differentiation is not any single feature. Each of our six exists
somewhere in the market. The defensible claim is the **combination, sequenced
around the moment of decision** : a consolidated multi-provider view, a
transparent score, and a forward simulator, delivered together, before the
commitment rather than after it.

#| USP| Why it holds| Defensibility  
---|---|---|---  
1| **Pre-decision, not post-mortem**|  The simulator operates on a commitment
that does not exist yet. Budgeting and credit tools structurally cannot --
they need a transaction to describe.| Strong  
2| **Cross-provider consolidation**|  A provider sees its own exposure. A bank
sees banked debt. The consumer, with consent, is the only party entitled to
assemble all of it -- so we build for the consumer and license the capability
upward.| Strong  
3| **Auditable by construction**|  Six published factors, published weights,
published anchors. A user, an institution or a regulator can reproduce any
score by hand. In a regulated-adjacent domain that is a commercial asset, not
a technical shortcut.| Strong  
4| **Built for the obligation the Act created**|  Affordability assessment
against _existing commitments_ is now a statutory duty for BNPL providers. Our
core computation is that duty.| Timing-dependent  
5| **Malaysian by design, not by translation**|  Ringgit-native, BNPL-first,
PTPTN-aware, built around Malaysian income and commitment structures and a
Malay-language decision frame. Global personal-finance apps treat BNPL as a
footnote.| Moderate  
  
What we must not claim

Not "the first," not "the only," not "nobody else does this." A fintech judge
will know of a product that does part of it, and one unverifiable superlative
discredits the rest of the deck. Claim the _combination_ , and say plainly
that individual components exist elsewhere.

12

### Why AI?

This is the question the technical judges will press hardest, because "AI" is
frequently decoration. Our answer has to survive the follow-up, so we draw the
line ourselves.

Layer 1 -- Deterministic

#### Rules compute the score

The KIRA Score is a published weighted formula. No model, no randomness, no
drift. It is reproducible by hand, testable to the point, and defensible to a
regulator. **This is deliberate, not a limitation.** Nobody should accept a
black box telling them their financial health.

Layer 2 -- Machine learning

#### A model predicts forward stress

A Random Forest trained on a Monte-Carlo simulation of 12-month household cash
paths predicts the probability that a profile runs out of cash within a year.
That target is _not_ a function of the score -- it depends on stochastic
shocks and an unobserved behavioural factor. The model does real work: held-
out ROC-AUC **0.923** against **0.844** for the score alone.

Layer 3 -- Language model

#### An LLM explains, and only explains

The LLM receives the computed numbers and turns them into plain Malaysian
English or Malay. It never computes a score, never sets a risk band, never
sees a figure it was not given. If the LLM is unavailable, the app falls back
to templated explanations and every core feature still works.

The sentence that answers "is the AI real?"

"Rules decide. The model predicts. The language model explains. We separated
those three on purpose, because the failure modes of an LLM are unacceptable
in the first two, and the opacity of a model is unacceptable in the first."

#### Where AI is genuinely necessary -- and where it is not

Capability| Approach| Why  
---|---|---  
Financial health score| Deterministic rules| Must be explainable, stable and
auditable. ML would add opacity and no accuracy we could honestly claim on
synthetic data.  
Risk breakdown| Deterministic decomposition| Contributions are exact by
construction -- no post-hoc attribution method required.  
Forward stress probability| **Supervised ML**|  The relationship between a
profile and its 12-month failure probability under stochastic shocks has no
closed form. This is a genuine learning problem.  
Early-warning triggers| Rules + model probability| Hard rules catch known
patterns; the calibrated probability catches combinations no rule was written
for.  
Explanation and education| **LLM + retrieval**|  Natural-language generation
grounded in a curated knowledge base -- exactly what language models are good
at, and a task with no numeric risk.  
Simulation arithmetic| Plain arithmetic| Recomputing a buffer is subtraction.
Using a model here would be dishonest.  
  
13

### Business Model

**B2B2C.** Consumers get the core platform free, because a tool that charges
financially stressed people to discover they are financially stressed is both
commercially and ethically broken. Institutions pay, because the assessment
layer now has a statutory purpose for them.

CONSUMERS Free forever Score, aggregator, simulator, warnings. KIRA+ PLATFORM
Assessment layer Scoring engine * simulator Early warning * explanation
Consent & audit ledger no identifiable data leaves without consent
INSTITUTIONS BNPL * banks * e-wallets Pay for the assessment layer PROGRAMMES
Employers * universities Pay per seat, per year consented data score + insight
API / white label seats + reporting

Figure 2 -- Consumers are the users; institutions are the customers.
Identifiable consumer data never crosses to an institution without that
consumer's explicit, revocable consent.

#### Revenue streams

Stream| Buyer| What they get| Basis| Timing  
---|---|---|---|---  
**SaaS licensing**|  BNPL providers, digital banks| Hosted affordability-
assessment layer supporting their statutory pre-approval assessment| Tiered
monthly fee + volume band| Phase 2-3  
**API / platform licensing**|  E-wallets, super-apps, merchants| Embedded
"check before you commit" call at checkout| Per assessment, tiered down with
volume| Phase 3-4  
**Institutional subscriptions**|  Employers, universities| White-labelled
financial wellness portal, anonymised cohort reporting| Per seat per year,
floor commitment| Phase 2  
**Financial wellness partnerships**|  Insurers, AKPK-adjacent bodies, NGOs|
Co-branded deployment into an existing programme| Programme fee| Phase 3+  
**Anonymised aggregate insight**|  Policy bodies, researchers| Cohort-level
financial resilience trends -- never individual records| Report or data
subscription| Phase 4+  
All pricing structures are Team assumption. We deliberately publish no ringgit
price points: inventing vendor pricing is the fastest way to lose a
commercially literate judge. If asked, say the model is validated but the
price points are not.

Hard commercial boundary

Institutions never receive identifiable user financial data without that
user's explicit consent. We do not sell user data, and we do not run a lead-
generation model that steers users toward credit products. Both would destroy
the trust the entire proposition rests on, and both would make our "we are on
the consumer's side" claim a lie.

14

### Stakeholder Value

Stakeholder| Value proposition| The measure they care about  
---|---|---  
**Consumers**|  See what a commitment does to you before you make it. One
place showing everything you owe each month. Plain language, no shame, no
upsell.| Fewer surprises; a buffer that survives the month.  
**BNPL providers**|  An affordability-assessment layer aligned with the
Consumer Credit Act's requirement to assess against existing commitments --
without building it in-house.| Compliance readiness; lower delinquency; lower
cost of assessment.  
**Banks & digital banks**| Visibility into non-bank commitments their own
systems cannot see, with customer consent. A financial wellness feature that
is not another product push.| Better risk view; engagement without acquisition
spend.  
**E-wallets & super-apps**| A responsible-usage layer that differentiates on
trust in a segment under regulatory attention.| Retention; regulatory posture.  
**Employers**|  A financial wellness benefit with anonymised cohort reporting
-- no visibility into any individual's finances.| Reduced financial stress;
lower salary-advance requests.  
**Universities**|  A practical tool for students entering credit for the first
time, usable inside existing financial literacy modules.| Literacy outcomes;
graduate debt behaviour.  
**Government & regulators**| A consumer-side instrument that advances
published national literacy targets, and anonymised aggregate resilience data
no single provider can produce.| Movement on NSFL 2026-2030 KPIs.  
**Financial education bodies**|  Education delivered at the point of decision
rather than in a classroom months earlier.| Behavioural change, not
attendance.  
  
15

### Market Opportunity

A deliberate choice

We do not present a ringgit TAM. Producing one would require inventing per-
assessment pricing for a market with no published benchmark, and an invented
number is worse than no number in front of a commercially literate panel.
Instead: the addressable population from verified sources, the units we would
charge for, and a sensitivity table with the price assumption stated as an
assumption.

#### Consumer side -- bottom-up from published figures

Layer| Size| Basis  
---|---|---  
Active BNPL accounts in Malaysia| 8.0m| Ministry of Finance, Q1 2026 Verified  
Unique BNPL users (accounts > users; many hold plans with 2-3 providers)|
<8.0m| Reported user counts run below account counts Assumption  
Users with 2+ concurrent commitments -- the consolidation problem| requires
validation| Not published. Our own survey is the fastest route to this number.  
Malaysians who struggle to raise RM1,000 -- the resilience problem| 61%| BNM
FCI Survey 2024 Verified  
Share of BNPL users in the B40 income group| >70%| Ministry of Finance via
Bernama Verified -- household classification, not a salary figure  
Malaysians using digital financial services -- the reachable channel| 92%| BNM
FCI Survey 2024 Verified  
  
The honest reading: the _consumer_ population is large, verified and growing
at roughly 15% per half-year on accounts. What is not published -- and what we
would establish first -- is how many of those users hold multiple concurrent
commitments. That single number sizes our beachhead, and we can obtain it
ourselves with a survey.

#### Institutional side -- where the revenue is

Our buyer population is defined by the Consumer Credit Commission's
registration regime: every BNPL and non-bank credit provider now required to
register, plus banks, e-wallets, employers and universities. The exact
registered count should be read off the Commission's public register rather
than estimated. Future requirement -- Person 1 to pull it before the semi-
final.

Segment| Unit we charge for| Why they buy| Sales cycle  
---|---|---|---  
BNPL providers| Assessment call| Statutory affordability duty; delinquency
reduction| Long -- procurement + risk sign-off  
Digital banks| Monthly active assessed user| Non-bank commitment visibility;
differentiation| Long  
E-wallets / super-apps| Assessment call| Trust positioning under regulatory
attention| Medium  
**Employers**|  Seat per year| Wellness benefit with cohort reporting, no
individual visibility| **Short -- our realistic first revenue**  
**Universities**|  Seat per year or programme fee| Practical tool inside
existing literacy modules| **Short -- and the easiest pilot to actually run**  
  
The answer to "who is your first customer?"

Not a bank. A **university or a mid-sized employer**. They have a defined
cohort, an existing financial literacy obligation, no core-banking integration
requirement, a short procurement cycle, and a reason to want anonymised cohort
reporting. One pilot there gives us the behavioural evidence that makes the
BNPL-provider conversation possible. Naming a bank as your first customer
signals you have never sold to one.

#### Illustrative unit economics -- assumptions, not forecasts

Scenario| Seats / assessments| Assumed unit price| Annual revenue  
---|---|---|---  
One university pilot| 5,000 seats| RM6 / seat / yr| RM30,000  
Five employers, mid-sized| 12,500 seats| RM12 / seat / yr| RM150,000  
One BNPL provider, moderate volume| 2.0m assessments| RM0.15 / assessment|
RM300,000  
One BNPL provider, high volume| 10.0m assessments| RM0.08 / assessment|
RM800,000  
Team assumption throughout. Every price above is invented for the purpose of
showing the _shape_ of the model. Say that out loud if a judge asks. What is
defensible is the structure: seats for programmes, per-call for providers,
unit price falling with volume.

16

### Competitor Landscape

Assessed on publicly observable product behaviour as of this document's date.
We claim a gap in _combination_ , never that a competitor is incapable of
building a feature.

Capability| KIRA+| Budgeting apps| Banking apps| BNPL apps| CTOS / CCRIS|
Generic AI| Literacy platforms  
---|---|---|---|---|---|---|---  
**Financial health score**| **Yes -- transparent, six factors**| Sometimes,
app-specific| Sometimes, bank-specific| No| Credit score, different construct|
No grounded score| Quiz-style, not computed  
**Multi-provider BNPL aggregation**| **Yes -- core**| Only if manually
entered| Bank products only| Own products only| Reported credit data only| No|
No  
**Pre-decision simulation**| **Yes -- the core feature**| Rare; usually goal-
based| Loan calculators, single product| Shows own instalment only| No|
Unreliable arithmetic, ungrounded| No  
**Predictive early warning**| **Yes -- rules + model**| Threshold alerts|
Balance alerts| Due-date reminders| No| No| No  
**Plain-language explanation**| **Yes -- grounded LLM**| Limited| Limited|
Limited| Report guidance| Strong, but ungrounded| Strong, but generic  
**Official credit score**| **No -- and never**| No| Some surface it| No| **Yes
-- authoritative**| No| No  
**Financial education**|  Yes -- contextual, at decision point| Some| Some|
Minimal| Some| Yes, generic| **Yes -- their core**  
**User control of data**| **Consent-first, revocable, exportable**|  Varies|
Bank T&Cs| Provider T&Cs| Statutory framework| Varies| Varies  
**Primary audience**|  Consumers, licensed to institutions| Consumers| Bank
customers| Shoppers| Lenders & consumers| Everyone| Learners  
Team assumption. Person 1 must verify each competitor row against live product
documentation before the semi-final and replace this caption with per-cell
citations. An unverified "No" against a named competitor is the most dangerous
cell in this document.

#### Where each competitor would beat us

  * **Banking apps** have the data we ask users to type. If open banking matures and a bank builds this, they start with verified data and we start with a form. Our answer is that they see only banked debt -- and consumer-side consolidation is a different product from bank-side reporting.
  * **BNPL providers** could build affordability assessment internally rather than license it. Our answer is that no single provider can see the others' exposure, which is the precise thing the Act asks them to assess against.
  * **CTOS** has authority, brand and statutory position we will never have. Our answer is that we are not competing -- we are a forward-looking consumer decision tool, not a credit bureau, and we should say so before anyone accuses us of pretending otherwise.

17

### Commercialisation Path

Stage| Objective| Proof required to move on| Revenue  
---|---|---|---  
**0 -- Now**| Working MVP on synthetic data; competition validation.| Six core
features demonstrable live; judges understand it without us.| None  
**1 -- Pilot**| One university or employer cohort, real users, real manual
entry.| Onboarding completion rate; do users return; does the simulator change
a stated decision.| Pilot fee or free  
**2 -- First paying cohort**| Three to five institutional seats-based
customers.| Renewal, not signature. A renewed pilot is the only real
evidence.| Seats  
**3 -- Provider integration**| One BNPL provider or e-wallet consuming the
assessment API.| Assessment latency and reliability at their volume; their
risk team signs off.| Per assessment  
**4 -- Consented data integration**| Replace manual entry with consented
provider-supplied data.| Regulatory clearance; a data-sharing agreement that
survives legal review.| Volume + platform  
**5 -- Infrastructure**| Programme-level deployment with public bodies.|
Measurable movement on a published national KPI.| Programme  
  
Say this if asked about revenue timing

"We do not expect revenue from a BNPL provider first. Their procurement and
risk sign-off is measured in quarters. Our first revenue is a seats-based
institutional pilot, because it is the fastest route to the behavioural
evidence that every later conversation depends on."

18

### Government & National Adoption

Malaysia has already published the strategy KIRA+ fits into. That is unusually
fortunate, and we should lean on it hard -- it converts "this could be
nationally useful" from an aspiration into an alignment claim we can cite.

#### National Strategy for Financial Literacy 2026-2030

Published by the Financial Education Network, whose members include Bank
Negara Malaysia, the Securities Commission, AKPK, EPF and the education
ministries. Five strategic priorities. KIRA+ operates directly inside two of
them.

| NSFL 2026-2030 priority| KIRA+ contribution  
---|---|---  
P1| Wise financial planning and preparation for retirement| Indirect --
protecting the monthly buffer is upstream of any long-term saving.  
**P2**| **Foster smart and responsible debt management**| **Direct.**
Consolidated commitment visibility, affordability simulation before
commitment, early warning on rising obligations.  
P3| Secure financial future with risk protection| Indirect -- the emergency-
buffer factor makes protection gaps visible.  
**P4**| **Safe, confident and meaningful use of digital financial services**|
**Direct.** A digital tool that builds informed usage of digital credit rather
than simply warning against it.  
P5| Encourage investments for wealth creation| Out of scope. We say so -- a
strategy claim that covers everything convinces nobody.  
Financial Education Network, National Strategy for Financial Literacy
2026-2030 Verified source

#### Published national targets KIRA+ is built to move

National KPI (NSFL 2026-2030)| Baseline| 2030 target| How KIRA+ contributes  
---|---|---|---  
Malaysians unable to raise RM1,000 for an emergency| 61%| ≤45%| Makes the
buffer a visible, tracked number and shows what each commitment costs it.  
Malaysians who feel over-indebted| 26%| ≤15%| Consolidated view plus pre-
decision simulation targets the accumulation pattern directly.  
Digital financial literacy index| 42.2| ≥55| Contextual education delivered
inside a digital credit decision.  
MYFLIC financial literacy index| 59.1| ≥65| Indirect, through repeated
practical exposure to affordability reasoning.  
  
The government-adoption sentence

"Malaysia has already set a target of reducing the share of citizens who
cannot raise RM1,000 from 61% to 45% by 2030. KIRA+ does not propose a new
national objective -- it is an instrument for one that already exists."

#### Realistic adoption route

  1. **Programme partner first, not policy.** An AKPK-adjacent or FEN-affiliated financial education programme deploying KIRA+ to a defined cohort is achievable. A national mandate is not, and asking for one signals naivety.
  2. **Contribute anonymised aggregate resilience data** that no single provider can produce -- cohort-level buffer and commitment-load distributions, useful to policy and impossible to reconstruct into individuals.
  3. **Align with the Consumer Credit Commission 's remit** as a consumer-side complement to provider-side supervision.
  4. **Only then** discuss infrastructure-layer positioning.

Do not say

Do not claim endorsement, partnership, pilot or discussion with BNM, MoF,
AKPK, FEN or the Consumer Credit Commission. We have none. Alignment with a
published strategy is a strong, true claim. Implied endorsement is a false
one, and it is trivially checkable.

19

### ESG & National Impact

Impact area| KIRA+ mechanism| Measurable indicator  
---|---|---  
**Financial inclusion**|  A free consumer tool requiring no bank relationship,
no credit history and no minimum income -- usable by gig workers, informal
earners and the thin-file.| Share of users outside formal salaried employment.  
**Financial literacy**|  Education at the moment of decision rather than in a
classroom months earlier. Every score is an explanation.| Pre/post
understanding of debt-service ratio and buffer within a cohort.  
**Financial resilience**|  Emergency buffer is a weighted scoring factor, so
it becomes visible and trackable rather than an afterthought.| Change in
median emergency runway across a cohort over 6 months.  
**Responsible borrowing**|  Consequence shown before commitment. The model
rewards better structure -- longer tenure, fewer concurrent plans -- not
abstinence.| Change in average concurrent commitments per active user.  
  
#### UN Sustainable Development Goals

SDG 1

#### No Poverty

Target 1.5 -- building the resilience of the poor and vulnerable to economic
shocks. Our emergency-buffer factor is a direct instrument for exactly that
resilience.

SDG 8

#### Decent Work & Growth

Target 8.10 -- strengthening capacity to expand access to financial services.
We contribute to _informed_ access, not merely access.

SDG 10

#### Reduced Inequalities

Financial decision-support of a quality normally reserved for advised, higher-
income households, provided free to everyone else.

SDG 12

#### Responsible Consumption

Target 12.8 -- information and awareness for sustainable lifestyles. Applied
to credit-financed consumption, where the friction is currently lowest.

Impact honesty

We have measured no impact. Every indicator above is a proposed measurement,
not a result. The correct formulation on stage is _" here is the mechanism,
here is the indicator we would measure, and here is the published national
target it maps to"_ -- never "KIRA+ improves financial resilience." Judges
scoring ESG at 15% are looking for a credible measurement plan, and are
practised at spotting impact language that has no measurement behind it.

20

### Scalability

Technical

#### Stateless, cheap, linear

A score is a pure function of a feature vector -- sub-millisecond, no I/O, no
model call. The ML inference is a single loaded Random Forest. The expensive
component is the optional LLM explanation, which is cacheable per band and per
factor pattern and is never on the critical path.

Economic

#### Marginal cost falls with volume

No human is in the loop for any assessment. Beyond hosting, marginal cost per
assessment is dominated by the LLM call -- which caching, templating and a
smaller model reduce as volume grows.

Product

#### The engine generalises

The same six factors, re-anchored, extend from BNPL to credit cards, personal
loans, PTPTN and hire purchase. Adding a commitment class is a data-model and
calibration exercise, not a rewrite.

Geographic

#### Portable with recalibration

Nothing in the architecture is Malaysia-specific; the _anchors_ are. A move to
Indonesia or the Philippines is a recalibration and localisation exercise.
Future requirement

Organisational

#### Honest constraint

Institutional sales, regulatory work and partner integration do not scale like
software. This is the real ceiling and we should name it rather than pretend
the whole business is a pure-software curve.

Prototype limit

The MVP is a single-process Streamlit app on SQLite. That is a deliberate
3-day choice, not an architecture. Part II §29 documents the production path:
FastAPI service, PostgreSQL, containerised deployment, model registry.

21

### Roadmap

Phase| Scope| What ships| Gate to the next phase  
---|---|---|---  
**1 -- Now**| **BNPL financial health MVP**|  Manual profile entry, BNPL
aggregation, KIRA Score, risk breakdown, affordability simulator, early
warnings, LLM explanation. Synthetic data.| Six core features working live.  
**2**|  Credit cards + personal loans| Extend the commitment model beyond
BNPL; re-anchor factors for revolving credit; minimum-payment trap modelling.|
Pilot cohort retained for 8 weeks.  
**3**|  Savings + emergency planning| Goal-based buffer building, runway
targets, contribution planning against the emergency-buffer factor.|
Measurable movement in cohort runway.  
**4**|  Consent-based data integration| Replace manual entry with consented
provider-supplied data. Real outcome labels become available -- the model
retrains on observed delinquency instead of simulation.| Legal + regulatory
clearance.  
**5**|  Institutional & government deployment| Assessment API, white-label
journey, anonymised cohort analytics, programme integration.| Model validated
on real outcomes.  
**6**|  Financial resilience ecosystem| Insurance and protection gaps, income
smoothing for variable earners, regional expansion.| --  
  
Phase 4 is the hinge

Everything genuinely predictive depends on Phase 4\. Until we have consented
real data with observed outcomes, our model is trained on simulation and can
only be honestly described as a demonstration of the pipeline. Judges will
find this if we hide it, and will respect it if we lead with it.

22

### Budget

#### Budget 1 -- the 3-day MVP

Item| Choice| Cost| Note  
---|---|---|---  
Hosting| Streamlit Community Cloud| RM0| Free tier, adequate for a demo.
Public app -- no real user data, ever.  
Database| SQLite, file-based| RM0| Ships inside the repository.  
Version control & CI| GitHub free tier| RM0| Public or private repo, Actions
free minutes.  
ML / data stack| scikit-learn, pandas, NumPy, Plotly| RM0| Open source.  
LLM API| Pay-as-you-go, capped| RM20-60| Estimate for development plus demo
volume. Hard spend cap set on day 1. Templated fallback if unavailable.  
Domain| Not required| RM0| Streamlit subdomain is sufficient. Skip this.  
Design| Figma free, open-licensed fonts| RM0| Bricolage Grotesque, Source
Serif 4, IBM Plex Mono are all open-licensed.  
Contingency| --| RM40| LLM overspend or an unexpected paid dependency.  
**Total**| | **RM60 -100**| The binding constraint on this build is developer hours, not money.  
  
#### Budget 2 -- extended prototype (approximately 3 months)

Item| Monthly| Note  
---|---|---  
Application hosting (small managed instance)| RM50-150| Estimate -- obtain
live quotes before publishing.  
Managed PostgreSQL| RM40-120| Estimate  
LLM API at pilot volume| RM150-500| Highly dependent on caching hit rate.  
Domain + TLS| RM10| Annual cost amortised.  
Monitoring & error tracking| RM0-80| Free tiers exist and are adequate at
pilot scale.  
**Total**| **RM250 -860 / month**| Excludes all people cost.  
  
#### Budget 3 -- production, indicative shape only

We deliberately do not put ringgit figures against production. Cost is
dominated by headcount -- engineering, a data scientist for real-data
validation, compliance and legal review, institutional sales -- and any number
we produce for those without a hiring plan would be fiction. The _cost
categories_ are: infrastructure and scaling, LLM inference at volume, security
audit and penetration testing, PDPA legal review, model validation on real
data, institutional integration engineering, and support. Team assumption

Costing discipline

Every figure above marked as an estimate is our estimate, not a vendor quote.
Do not present any of them as a quoted price. "Roughly RM60 to RM100, and the
real constraint is developer hours" is a strong, honest answer. A precise-
looking fabricated total is not.

23

### Risk Register

Thirteen risks, each with a severity, a likelihood, what we do about it inside
the 3-day MVP, and what a production system would do instead.

#| Risk| Severity| Likelihood| Mitigation in the MVP| Future mitigation  
---|---|---|---|---|---  
R1| **Synthetic data** -- profiles are generated, not observed| High| Certain|
Labelled on the app's landing screen, in the deck and in this document.
Generator parameters published. No accuracy claim made about the real world.|
Phase 4 consented real data; retrain on observed delinquency; formal
validation before any production claim.  
R2| **Model bias** against variable-income and informal earners| High| Likely|
No demographic features are used at all -- not age, gender, ethnicity,
postcode or occupation. Only cash-flow arithmetic. Generator includes gig-
income profiles.| Subgroup performance testing on real data; documented
fairness review; income-volatility as an explicit modelled feature rather than
noise.  
R3| **Model accuracy** misread as real-world predictive accuracy| High|
Likely| Every metric is reported with its simulated target named, plus the
majority-class and score-only baselines. We state that accuracy is the wrong
headline metric here.| Out-of-time validation; calibration monitoring;
published model card.  
R4| **Financial advice / liability** -- product read as regulated advice|
High| Possible| Persistent disclaimer; language reviewed to state consequence,
never recommendation; no product recommendations; no lending decision; no
approval or decline.| Legal review of all user-facing copy; explicit scope
statement in terms of service; regulatory counsel before any institutional
deployment.  
R5| **Data privacy** -- sensitive financial data at rest| High| Possible| MVP
stores no real user data. Demo profiles only. Session-scoped storage, no
analytics, no third-party trackers, no export.| Encryption at rest and in
transit; field-level encryption for financial values; retention limits; user-
initiated deletion and export.  
R6| **PDPA** compliance not formally established| High| Likely| We claim
privacy-_by-design principles_ , never compliance. The exact wording is fixed
in Part II §20 and must not be softened.| Formal PDPA review; appointed data
protection contact; documented lawful basis, consent records and cross-border
position.  
R7| **User adoption** -- manual entry is too much friction| High| Likely| Five
fields to a first score; commitments added afterwards; pre-filled demo
profiles so value is visible before effort is spent.| Consented data import
(Phase 4); receipt and SMS parsing; provider integrations. This is the largest
product risk we carry.  
R8| **Institutional adoption** -- providers build it in-house| Medium| Likely|
Position on the one thing they cannot build alone: a cross-provider consented
view. Target employers and universities first, where no in-house alternative
exists.| Network effects from consented multi-provider coverage;
certification-style positioning with the Commission's regime.  
R9| **API / integration complexity** with core banking and provider systems|
Medium| Likely| Explicitly out of scope. No live integrations are attempted in
three days -- and attempting one is how this build fails.| Phased integration;
sandbox-first; a documented stable assessment API with versioning.  
R10| **Cybersecurity** -- breach of financial profile data| High| Possible|
Minimal attack surface: no real data, no PII collected, no file uploads, no
user-supplied HTML. Secrets in environment variables, never in the repository.
Input validation on every numeric field.| Penetration test; dependency
scanning in CI; secrets management; audit logging; incident response plan.  
R11| **LLM hallucination** -- model invents a figure or gives advice| High|
Likely| The LLM never computes. It receives a fixed JSON payload of already-
computed values, is instructed to use only those numbers, and its output is
regex-checked for any numeral not present in the payload. Failed check falls
back to a template.| Structured output constraints; a retrieval corpus
restricted to curated, cited financial-literacy content; human review of
prompt changes.  
R12| **Commercial viability** -- willingness to pay unproven| Medium| Likely|
Acknowledged openly. No revenue projections presented as forecasts; unit
economics shown as clearly labelled assumptions.| Paid pilot as the validation
instrument; renewal -- not signature -- treated as the real signal.  
R13| **Regulatory** -- the Consumer Credit Commission's regime may cover us|
Medium| Possible| We do not provide credit, do not make lending decisions and
do not report to credit bureaus -- but we do not assert we fall outside any
regime. We say the position requires legal determination.| Regulatory counsel;
early engagement with the Commission; design so a registration requirement is
an adjustment, not an existential problem.  
  
#### Risk matrix

-- R4 * R5 * R10 R13* R1 * R2 * R3 R6 * R7 * R11 -- R9* R8 * R12 -- -- -- HIGH
MEDIUM LOW UNLIKELY POSSIBLE LIKELY SEVERITY LIKELIHOOD

Figure 3 -- Risk matrix. Items marked * sit in the Possible column on our
judgement, not on evidence. The upper-right cluster is where the pitch team
must be strongest: R1, R3, R7 and R11 are the four risks a judge is most
likely to probe.

24

### Limitations

Stated plainly and up front. In a competition, volunteering a limitation
before a judge finds it converts a weakness into evidence of rigour. Hiding
one converts it into evidence of the opposite.

Data

#### No real financial data

Every profile is synthetic. Every model metric is measured against a simulated
target. We make no claim about real-world predictive accuracy and will not
accept a framing that implies one.

Validation

#### No user research

No survey, no interviews, no pilot. All behavioural claims are reasoned. The
first validation is specified in §5 and is achievable before the semi-final.

Calibration

#### Weights and anchors are our judgement

The six weights and their anchor points are informed by publicly discussed
debt-service practice and standard emergency-fund guidance, but they are not
empirically fitted. Real outcome data would refit them and the score would
move.

Integration

#### Entirely manual entry

No BNPL, bank, CTOS, CCRIS or open-banking connectivity. The consolidated view
is only as complete and as accurate as what the user chooses to type.

Regulatory

#### No legal determination

Privacy-by-design principles are implemented; PDPA compliance is not
established. Our position relative to the Consumer Credit Commission's regime
requires legal advice we have not obtained.

Scope

#### BNPL-first, deliberately narrow

Credit cards, mortgages, hire purchase and business credit are out of scope
for Phase 1\. A user with a large credit-card balance will find their score
incomplete. That is a choice, not an oversight.

The sentence that turns this section into a strength

"We could have shown you a model with 97% accuracy. We chose not to, because
it would have been measured against labels our own rules generated. Here is
what we actually measured, what it means, and precisely what would make it a
real number."

25

### Future Integrations

Integration| Value unlocked| Prerequisite| Phase  
---|---|---|---  
BNPL provider APIs (consented)| Automatic commitment import; the consolidation
problem solved properly rather than by typing.| Commercial agreements +
consent framework| 4  
Bank / open banking APIs| Verified income and expense data; removes the
largest source of input error.| Open banking availability + licensing| 4-5  
E-wallet platforms| Distribution to tens of millions of existing users;
assessment at the point of checkout.| Partnership + API| 4-5  
Credit bureaus (CTOS / CCRIS)| Formal credit history alongside our forward-
looking view.| Regulatory clearance + user consent| 5  
Employer payroll / HR systems| Verified income for salaried cohorts;
frictionless onboarding for wellness programmes.| Employer agreement| 3-4  
Government literacy programmes| Distribution at national scale; contribution
to published NSFL indicators.| Programme partnership| 5-6  
AKPK / credit counselling referral| A responsible destination for users whose
scores indicate genuine distress.| Referral protocol| 3+  
  
Referral is an obligation, not a feature

If KIRA+ identifies a user in real distress, showing them a red gauge and
stopping is not good enough. A route to AKPK or equivalent credit counselling
belongs in the product early -- earlier than most items above. Person 2 should
design the referral surface even if it is not wired up in the 3-day build.

26

### Future Vision

The long-term ambition is that **no Malaysian makes a credit commitment
without first seeing what it does to them** -- and that this check is as
ordinary and as expected as checking a price.

In that world KIRA+ is not an app people remember to open. It is a consented
layer that appears at the moment of decision, wherever that decision happens:
inside an e-wallet checkout, inside a BNPL flow, inside a bank's app, inside a
university's student portal. The score travels with the person, under their
control, and the institution sees only what the person allows.

The national version of that ambition is a **financial resilience layer** :
anonymised, aggregate, consent-based visibility into how Malaysian households
are actually absorbing credit -- the kind of signal no individual provider can
generate and that arrives faster than a half-yearly report.

We are aware of how far that is from a Streamlit app running on synthetic
profiles. The distance is the roadmap in §21, and the honest gate is Phase 4\.
But the direction is coherent, the first step is buildable in three days, and
the regulatory environment is moving toward us rather than away.

27

### Conclusion

Malaysia's BNPL market ran 243 million transactions worth RM21.3 billion
across 2025, and by the first quarter of 2026 held 8.0 million active accounts
carrying RM5.3 billion in outstanding balances. In the same country, 61% of
people report difficulty raising RM1,000 for an emergency -- up from 47% four
years earlier. Those two facts are not a scandal. They are a **visibility
problem** : the ease of taking on a commitment has outpaced the ease of
understanding it.

KIRA+ addresses that specific gap, at the specific moment it matters. Six core
features, all buildable in three days: a financial profile, a BNPL aggregator,
a transparent 0-100 score, a full risk breakdown, an affordability simulator
for a purchase not yet made, and an early-warning system. Rules compute. A
model predicts. A language model explains. Each is scoped so its failure modes
are acceptable.

The commercial case rests on a change that has already happened: the Consumer
Credit Act 2025 requires BNPL providers to assess affordability against a
consumer's existing commitments -- the exact computation this product
performs. The national case rests on a target that has already been published:
cutting the share of Malaysians who cannot raise RM1,000 from 61% to 45% by
2030.

We are not claiming to have solved household debt. We are claiming something
narrower and defensible: that the moment before a commitment is the highest-
leverage moment in a person's financial life, that nothing currently occupies
it, and that we can build the thing that does -- starting this week.

Kira dulu. Baru commit.

Part II

## Technical Architecture & MVP Specification

Written for the two full-stack developers, technical judges and technical
reviewers. A developer should be able to open this and start writing code
without asking a single clarifying question.

1

### Technical Overview

A single-process Python application. Streamlit renders the interface, a pure-
Python domain layer computes the score, a scikit-learn model predicts forward
stress, SQLite persists profiles and an optional LLM call turns numbers into
sentences. No services, no containers, no queues, no orchestration.

The architectural principle for a 3-day build

**Every layer must be independently runnable and independently testable.** The
scoring engine is a pure function with no imports from Streamlit. The model
trainer is a script that writes an artefact to disk. The app imports both.
This means Developer 1 and Developer 2 can work in parallel from hour one
without blocking each other -- which is the only way two people ship six
features in three days.

Layer| Technology| Owner| Independently runnable?  
---|---|---|---  
Presentation| Streamlit 1.3x, Plotly| Dev 1| `streamlit run main.py`  
Application services| Plain Python modules| Dev 1| Importable, unit-tested  
Scoring engine| Pure Python, zero dependencies| Dev 2| `pytest
tests/test_scoring.py`  
ML pipeline| scikit-learn, pandas, NumPy| Dev 2| `python models/train.py`  
Explanation| LLM API + template fallback| Dev 2| `python
services/llm_service.py --demo`  
Persistence| SQLite via `sqlite3`| Dev 1| `python database/init_db.py`  
  
#### Non-functional targets for the MVP

Property| Target| Why this number  
---|---|---  
Score computation| < 5 ms| Pure arithmetic. If it is slower, something is
doing I/O it should not.  
Model inference| < 50 ms| One loaded Random Forest, single row.  
Full page interaction| < 1.5 s| Streamlit re-run overhead dominates; keep
heavy objects in `@st.cache_resource`.  
LLM explanation| < 4 s, non-blocking| Rendered after the score. Never gates
the numbers. Times out to template at 4 s.  
Cold start| < 10 s| Model artefact loaded once and cached.  
Demo reliability| 100% offline-capable| The app must fully work with the
network unplugged. On stage, assume it will be.  
  
2

### System Architecture

Four horizontal layers with a strict dependency direction: presentation
depends on services, services depend on the domain, the domain depends on
nothing. Nothing calls upward.

Layer| Responsibility| May import| Must never import  
---|---|---|---  
**Presentation**|  Streamlit pages, forms, charts, layout| services| models,
database directly  
**Services**|  Orchestration: profile CRUD, scoring calls, simulation,
warnings, LLM| domain, models, database| streamlit  
**Domain**|  Feature engineering, scoring rules, simulation arithmetic,
warning rules| nothing but the standard library| everything else  
**Infrastructure**|  SQLite access, model artefact loading, LLM HTTP client|
third-party libraries| domain, services  
  
The rule that saves the build

`utils/scoring.py` must not contain the word `streamlit`. If it ever does,
Developer 2 can no longer test the engine without launching the app, the test
suite slows to a crawl, and the two developers become coupled. This is the
single most important line in Part II.

3

### Architecture Diagram

PRESENTATION -- STREAMLIT 1\. Profileincome, expenses 2\. CommitmentsBNPL
aggregator 3\. Dashboardscore + breakdown 4\. Simulatorbefore / after 5\.
Warnings + Explainflags, plain language SERVICES -- ORCHESTRATION
profile_serviceCRUD, validation scoring_servicescore + predict + warn
simulation_servicebefore / after deltas llm_serviceexplain + fallback DOMAIN
-- PURE PYTHON, NO DEPENDENCIES features.py11 derived features scoring.py6
factors, weights simulate.pywhat-if arithmetic warnings.py explain.pyfactor
contributions -> reasons INFRASTRUCTURE SQLite -- kira.db stress_model.pkl
EXTERNAL -- OPTIONAL, NEVER ON THE CRITICAL PATH LLM API (explanation only)  *
financial literacy knowledge base (retrieval, local JSON)  *  if unavailable,
templates render instead

Figure 4 -- System architecture. The dark band is the domain layer: pure
Python with no third-party imports, fully unit-testable, and the only place a
KIRA Score is ever produced.

4

### Data Flow

User input7 raw values Validatebounds, types Features11 derived Rules -> KIRA
Scoredeterministic, 0-100 Model -> P(stress)Random Forest Warningsrules +
P(stress) LLM explainoptional layer numbers flow left to right -- the LLM
receives them and never produces them

Figure 5 -- Data flow. Every number reaching the user is computed before the
LLM is invoked. The dashed boundary marks where a failure degrades the
experience but never the correctness.

#### The exact payload handed to the LLM

    
    
    {
      "score": 68, "band": "MODERATE", "score_after": 54, "band_after": "MODERATE",
      "buffer_before": 950, "buffer_after": 750, "currency": "RM",
      "factors": [
        {"name":"Emergency buffer","sub":10.6,"weight":15,"contribution":1.58,"rank":1},
        {"name":"Savings resilience","sub":16.7,"weight":8,"contribution":1.33,"rank":2},
        {"name":"Disposable income","sub":70.4,"weight":20,"contribution":14.07,"rank":3}
      ],
      "warnings": ["LOW_BUFFER"],
      "p_stress_12m": 0.31,
      "purchase": {"price":2400,"tenure":12,"monthly":200}
    }
    
    SYSTEM: You explain pre-computed financial figures in plain Malaysian English.
    Use ONLY the numbers in the payload. Never compute, estimate or infer a figure.
    Never recommend a product. Never say "you should" or "you cannot afford".
    Describe consequence. Maximum 90 words. If a required value is missing, say so.

Output guard -- task `D3-06`

Extract every numeral from the LLM response. If any numeral is not present in
the payload (allowing for formatting of the same value), discard the response
and render the template instead. This single regex is the difference between
"we use an LLM" and "we use an LLM safely", and a technical judge will ask
which one we are.

5

### Component Architecture

Every MVP component, specified with purpose, input, process, output,
technology, owner, dependencies and acceptance criteria. If a component is not
listed here, it is not in the 3-day build.

C1 Financial Profile P0

Purpose

    Capture the seven raw values every downstream computation depends on.
Input

    Monthly income; fixed expenses; variable expenses; savings balance; BNPL monthly total; other loan repayments; count of active BNPL commitments. Optional: upcoming repayment dates.
Process

    Validate each field (non-negative; income > 0; expenses ≤ 10× income as a sanity bound); persist to SQLite; emit a normalised profile dict.
Output

    `Profile` dict with seven keys, plus `profile_id` and `updated_at`.
Technology

    Streamlit forms, `sqlite3`, dataclass
Owner

    Developer 1
Dependencies

    Database schema (`D1-08`)
Acceptance

    A profile survives a page reload. Negative income is rejected with a specific message. Four demo personas load with one click and produce scores 68, 94, 41 and 17 exactly.

C2 BNPL Aggregator P0

Purpose

    Show a user, in one view, the total they have committed to across every provider.
Input

    List of commitments: merchant/label, monthly repayment, outstanding balance, months remaining, next due date.
Process

    Sum monthly repayments; sum outstanding; count active; sort upcoming by due date; compute total monthly obligations including non-BNPL loans.
Output

    Aggregate card: _n_ commitments * RM _x_ /month * RM _y_ outstanding * next due * total monthly obligations. Plus a per-commitment table.
Technology

    Streamlit data editor, pandas, Plotly
Owner

    Developer 1
Dependencies

    C1
Acceptance

    Adding a commitment updates the total and the score in the same interaction. Zero commitments renders an empty state, not an error. Totals match the sum of the table to the ringgit.

Explicitly out of scope

No BNPL provider APIs. No screen scraping. No email or SMS parsing. Manual
entry only. Anyone who starts building an integration has misread this
document.

C3 KIRA Score Engine P0

Purpose

    Convert a profile into a transparent 0-100 financial health score and a risk band.
Input

    The seven raw profile values.
Process

    Derive 11 features (§10); map six of them through piecewise-linear anchors to 0-100 sub-scores; weight and sum; subtract the multi-commitment penalty; clamp and round. Fully specified in §12.
Output

    `{score:int, band:str, features:dict, subscores:dict, contributions:dict, penalty:float}`
Technology

    Pure Python. No third-party imports. No `streamlit` import, ever.
Owner

    Developer 2
Dependencies

    None -- this is the first thing built and the last thing that should change.
Acceptance

    The four persona fixtures return 68, 94, 41, 17. Score is always an integer in [0,100]. Same input always returns the same output. Unit tests cover every anchor boundary and the zero-debt and zero-income edge cases.

C4 Risk Breakdown P0

Purpose

    Show why the score is what it is. The score is never a black box.
Input

    The `subscores` and `contributions` from C3.
Process

    Rank the six factors by lost contribution (weight − contribution). Classify each as Strong / Adequate / Weak / Critical against fixed sub-score thresholds. Attach the underlying raw figure to each factor.
Output

    Six rows: factor, status, sub-score, weight, contribution, the user's own number, and the single lever that would move it most.
Technology

    Streamlit, Plotly horizontal bar
Owner

    Developer 2
Dependencies

    C3
Acceptance

    Contributions sum to the weighted total before penalty, to within rounding. The two weakest factors are visually distinguished. Every factor shows the user's own figure, not just an abstract score.

C5 Affordability Simulator P0 KILLER

Purpose

    Recompute the entire financial picture for a commitment the user has not yet made.
Input

    Current profile; purchase price; tenure in months. Optional: an explicit monthly amount overriding price ÷ tenure.
Process

    monthly = round(price / tenure). Clone the profile, add monthly to BNPL repayments, increment commitment count by one, re-score. Diff the two results.
Output

    Before/after pairs for: monthly buffer, commitment ratio, BNPL exposure, DSR, repayment capacity, score and band -- each with its delta. Plus a verdict banner and a plain-language explanation.
Technology

    Pure Python for the arithmetic; Streamlit + Plotly for the comparison view.
Owner

    Developer 1 (UI) + Developer 2 (engine)
Dependencies

    C3, C4
Acceptance

    RM2,400 over 12 months against the Aisyah fixture returns exactly 68 -> 54 and buffer RM950 -> RM750. Tenure 0 or negative is rejected. A purchase that improves nothing still renders without error. Recomputation is under 100 ms.

Build this first among the UI features

If the three days go badly and only one feature is polished, it must be this
one. It is the entire demo.

C6 Early-Warning Engine P0

Purpose

    Surface specific, named risks rather than a single undifferentiated score.
Input

    Feature dict from C3; predicted stress probability from C7.
Process

    Evaluate five deterministic rules (§15); add a model-driven flag when the predicted probability crosses its threshold; assign each flag green / amber / red.
Output

    Ordered list of `{code, level, title, detail, lever}`.
Technology

    Pure Python rules + loaded model
Owner

    Developer 2
Dependencies

    C3, C7
Acceptance

    Farah triggers four flags, two of them red. Wei Jian triggers two. Aisyah triggers one. Daniel triggers none. Every flag names the number that caused it. No flag ever uses the words "you should".

C7 Stress Prediction Model P1

Purpose

    Estimate the probability a profile runs out of cash within 12 months under simulated shocks.
Input

    Nine-element feature vector (§11).
Process

    Load `stress_model.pkl`; call `predict_proba`; return the positive-class probability.
Output

    `p_stress_12m` in [0,1].
Technology

    scikit-learn RandomForestClassifier, joblib
Owner

    Developer 2
Dependencies

    Synthetic dataset (`D1-02`), Monte-Carlo labels (`D1-04`)
Acceptance

    Held-out ROC-AUC ≥ 0.90 against the simulated target. Model card written. If the artefact is missing, the app runs without it and hides the probability rather than crashing.

P1, deliberately

The six core features must work without the model. If day 1 overruns, C7 is
the first thing that slips -- and the demo still stands.

C8 Explanation Layer (LLM + fallback) P1

Purpose

    Turn computed numbers into two or three sentences a 23-year-old actually reads.
Input

    The fixed JSON payload in §4\. Nothing else.
Process

    Call the LLM with the system prompt in §4, 4-second timeout. Run the numeral guard. On any failure, timeout, missing key or guard violation, render the deterministic template.
Output

    Explanation string plus a `source` flag of `"llm"` or `"template"`, shown in the UI.
Technology

    LLM HTTP API, `requests`, local template module
Owner

    Developer 2
Dependencies

    C3, C4
Acceptance

    With the API key removed, every screen still renders complete explanations. The guard rejects a response containing an invented figure -- proven by a unit test with a deliberately bad fixture.

6

### Frontend

Streamlit multipage. Five pages, no more. Every page must be reachable in one
click from the sidebar and must render something useful with an empty profile.

#| Page| Contents| Demo time  
---|---|---|---  
1| **Profile**|  Seven-field form, four one-click demo personas, validation
messages, save confirmation.| 20 s  
2| **Commitments**|  Editable commitment table, aggregate card, upcoming
repayments, monthly obligations donut.| 25 s  
3| **Dashboard**|  Score gauge, band, six-factor breakdown bar chart, warning
flags, plain-language explanation.| 40 s  
4| **Simulator**|  Purchase input, before/after gauges side by side, delta
table, verdict banner, tenure alternatives.| **60 s -- the demo**  
5| **About**|  Methodology, factor weights, synthetic-data disclosure,
limitations, team.| 15 s  
  
#### Frontend rules

  * **Every ringgit figure uses one formatter.** `fmt_rm(1234.5)` -> `"RM1,235"`. Inconsistent currency formatting is the fastest way to look unfinished on a projector.
  * **Colour encodes band, always the same way.** Green ≥70, amber 45-69, red <45\. Never use red for anything that is not a risk state.
  * **Every number on screen is accompanied by its unit and period.** "RM950" is ambiguous; "RM950 / month" is not.
  * **The synthetic-data notice is persistent** , in the sidebar footer, on every page. Not a modal anyone can dismiss.
  * **Use`st.session_state` for the working profile** and write to SQLite on explicit save. Do not hit the database on every widget interaction.
  * **Cache the model with`@st.cache_resource`** and the synthetic dataset with `@st.cache_data`. Without this, every interaction reloads the model and the demo feels broken.
  * **Plotly, not Matplotlib** , for anything the audience sees -- it renders crisply at projector resolution and is interactive.
  * **Test at 1280 ×720.** That is the resolution of the room, not your laptop.

7

### Backend

There is no separate backend process in the MVP. "Backend" here means the
service and domain modules that Streamlit imports -- deliberately written so
they could be lifted into a FastAPI service in Phase 2 without modification.

Module| Public functions| Notes  
---|---|---  
`services/profile_service.py`| `save_profile`, `load_profile`,
`list_profiles`, `load_demo(name)`| Only module that touches the profile
tables.  
`services/scoring_service.py`| `assess(profile) -> Assessment`| Orchestrates
features -> score -> model -> warnings. The single entry point the UI calls.  
`services/simulation_service.py`| `simulate(profile, price, tenure) ->
Simulation`| Returns before, after and deltas as one object.  
`services/llm_service.py`| `explain(payload) -> (text, source)`| Timeout,
numeral guard, template fallback, all inside this module.  
`utils/features.py`| `derive(profile) -> dict`| Pure. 11 features. No I/O.  
`utils/scoring.py`| `kira_score(**profile)`, `subscores`, `band`| Pure. The
reference implementation in Appendix C.  
`utils/warnings.py`| `evaluate(features, p_stress) -> list`| Pure. Five rules
plus the model flag.  
`utils/explain.py`| `template(payload) -> str`| Pure. The fallback that must
always work.  
  
8

### Database

SQLite, single file, committed to the repository as an empty schema and
created on first run. Chosen because it needs no server, no credentials and no
network -- three fewer things that can fail during a live demo.

Decision| Choice| Reasoning  
---|---|---  
Engine| SQLite 3| Bundled with Python. Zero configuration. Adequate for a
single-user demo.  
Access| `sqlite3` stdlib with parameterised queries| An ORM is overhead we
cannot justify in three days. Parameterised queries are non-negotiable
regardless.  
Money storage| Integer sen, or REAL with explicit rounding at the boundary|
Pick one on day 1 and write it in the README. Mixing them is a bug generator.  
Migrations| None. `init_db.py` drops and recreates.| No production data
exists. Reproducibility beats migration tooling here.  
Real user data| Never stored| The deployed demo holds demo profiles only. This
is a security decision, not a convenience one.  
  
9

### ML Pipeline

This is where a technical judge will look hardest, so the pipeline is built to
survive the hardest question: _" if your rules generate the labels, what is
the model actually learning?"_

Our answer -- and it is a good one

**The rules do not generate the labels.** The model's target is the outcome of
a Monte-Carlo simulation of twelve months of household cash flow, with random
income shocks, expense volatility, lumpy unplanned costs, commitments expiring
and new commitments being taken on -- driven partly by a behavioural factor
the model never sees. That target is not a deterministic function of the input
features, so learning it is a real supervised problem with irreducible noise.

1 Generate12,000 syntheticprofiles + latent 2 Derive9 model featuresno
demographics 3 Monte-Carlo label12-month cash pathshocks + latent 4
TrainRandomForeststratified 75/25 5 EvaluateAUC, F1, Briervs 2 baselines
.pklartefact the KIRA Score is NOT in this pipeline -- it is deterministic and
computed separately

Figure 6 -- ML pipeline. The gold stage is the one that makes this a real
learning problem: the label comes from simulation, not from the scoring rules.

#### Measured results

Produced by the reference pipeline on 12,000 synthetic profiles, held-out 25%
test split (n = 3,000), positive class rate 14.3%. These are the numbers to
quote -- and the caveats to quote with them.

0.923

ROC-AUC, held-out

0.921±.005

5-fold CV ROC-AUC -- stable

0.790

Recall on the stress class

0.097

Brier score -- probabilities are usable

Comparison| ROC-AUC| Accuracy| Reading  
---|---|---|---  
Majority-class baseline| 0.500| 0.857| Predicting "no stress" for everyone
scores 85.7% accuracy and is completely useless.  
KIRA Score alone (logistic)| 0.844| --| The deterministic score already
carries most of the signal -- which is a good result for the score.  
**Random Forest, 9 features**| **0.923**|  0.853| **+0.079 AUC over the score
alone.** That gap is what the model adds.  
  
Volunteer this before a judge finds it

Our model's accuracy (0.853) is _lower_ than the majority-class baseline
(0.857). That is not a failure -- it is what happens when you tune an
imbalanced classifier for recall, which is correct for an early-warning
system. We would rather raise a false alarm than miss a household heading for
trouble. This is exactly why we report ROC-AUC and recall as headline metrics
and treat accuracy as a footnote. Saying this first, unprompted, is worth more
than any number in the table.

And the caveat that must accompany every metric

"This prototype demonstrates the AI pipeline using synthetic data and
simulation-derived labels. Production deployment would require validation and
retraining using representative, consented and anonymised real-world data."
Say the whole sentence. Do not abbreviate it.

10

### Feature Engineering

Feature| Definition| Used by  
---|---|---  
`debt`| bnpl_monthly + loan_monthly| intermediate  
`outflow`| fixed + variable + debt| intermediate  
`buffer_rm`| income − outflow| UI, simulator  
`dsr`| debt ÷ income| score, model  
`bnpl_ratio`| bnpl_monthly ÷ income| score, model  
`buffer_ratio`| buffer_rm ÷ income| score, model  
`runway_months`| savings ÷ outflow| score, model  
`coverage`| buffer_rm ÷ debt  (99 when debt = 0)| score, model  
`savings_months`| savings ÷ income| score, model  
`commitment_ratio`| outflow ÷ income| model, warnings  
`n_bnpl`| count of active BNPL commitments| penalty, model, warnings  
  
What is deliberately absent

No age. No gender. No ethnicity. No postcode. No occupation. No education
level. No marital status. **Every feature is cash-flow arithmetic.** This is a
design decision about fairness, not an oversight, and it is the complete
answer to "how do you prevent your model discriminating?" -- a model cannot
discriminate on an attribute it has never been shown.

**Known limitation:** `income` is retained as a model feature. It correlates
with socioeconomic status and could in principle carry indirect bias. We keep
it because affordability is genuinely income-relative -- removing it would
make the model worse at the thing it exists to do -- but subgroup performance
testing on real data is a Phase 4 requirement, and we should say so rather
than claim the feature set is bias-free. Future requirement

11

### Model Architecture

Decision| Choice| Reasoning  
---|---|---  
Algorithm| RandomForestClassifier| Handles non-linear interactions and mixed
scales without preprocessing, gives feature importances free, trains in
seconds, and cannot silently diverge. XGBoost is a drop-in alternative if time
allows -- but it will not change the story.  
Trees / depth / leaf| 400 / max_depth 9 / min_samples_leaf 20| Depth and leaf
size constrained deliberately to prevent memorising a 12,000-row synthetic
set.  
Class weighting| `balanced_subsample`| Positive class is 14.3%. Unweighted,
the model learns to predict "fine" and scores 85.7% accuracy while being
useless.  
Features| 9 -- the model-facing subset from §10| All cash-flow derived.  
Target| `stress_12m` -- Monte-Carlo outcome| Not a rule output. See §9.  
Split| Stratified 75/25, seed 42| Plus 5-fold stratified CV to confirm
stability.  
Metrics| ROC-AUC (headline), recall, macro-F1, Brier| Accuracy is reported but
explicitly framed against the majority-class baseline.  
Artefact| `models/stress_model.pkl`, joblib| Committed to the repository so
the app runs without a training step.  
Reproducibility| All seeds fixed; `train.py` regenerates from scratch| A judge
should be able to clone and reproduce every number in this section.  
  
#### Feature importances -- a sanity check on the score design

Feature| Importance| Interpretation  
---|---|---  
`buffer_ratio`| 22.8%| Monthly slack relative to income is the dominant driver
-- consistent with our 20% weighting.  
`commitment_ratio`| 22.5%| Total obligations as a share of income. Not
directly scored, but present in the warning rules.  
`runway_months`| 15.9%| Savings runway. Validates giving the emergency buffer
real weight.  
`coverage`| 13.8%| Buffer relative to debt service.  
`savings_months`| 9.4%| Savings relative to income.  
`income`| 7.1%| Absolute level matters beyond the ratios -- a fixed shock
hurts a low income more.  
`dsr`| 5.8%| Lower than its 25% score weight. Worth investigating on real
data.  
`bnpl_ratio`| 2.0%| Low, because in simulation total obligations matter more
than their composition.  
`n_bnpl`| 0.7%| Count alone carries little once ratios are known -- the
penalty is a behavioural, not predictive, device.  
  
An honest observation to volunteer

DSR carries the largest score weight (25%) but only 5.8% model importance,
while `commitment_ratio` carries 22.5% importance and no score weight at all.
On real data that mismatch would be a reason to re-weight the score. We are
not re-weighting on simulated evidence -- but noticing it, and saying so, is
the kind of thing that separates a team that ran a pipeline from a team that
read its output.

12

### Scoring Methodology

Published in full, because a score a user cannot audit is a score a user
should not trust. Everything below is reproducible with a calculator.

#### Step 1 -- six factors, six weights

Factor| Feature| Weight| Score 0 at| Score 100 at| Anchor rationale  
---|---|---|---|---|---  
**Debt burden**| `dsr`| 25| 0.45| 0.05| Debt service ratio. Anchored below
common lending ceilings because this is a health measure, not an approval
test.  
**BNPL exposure**| `bnpl_ratio`| 20| 0.20| 0.02| BNPL specifically, weighted
separately from other debt because it is the fastest-accumulating and least-
visible class.  
**Disposable income**| `buffer_ratio`| 20| 0.00| 0.30| Monthly slack as a
share of income. Zero slack scores zero; 30% is a healthy target.  
**Emergency buffer**| `runway_months`| 15| 0.0| 6.0| Months of total outflow
covered by savings. Six months is the standard emergency-fund guideline.  
**Repayment capacity**| `coverage`| 12| 0.0| 2.0| Monthly buffer divided by
monthly debt service. 2× means comfortably covered. Zero debt scores 100.  
**Savings resilience**| `savings_months`| 8| 0.0| 3.0| Savings relative to
income. Complements runway, which is relative to spending.  
Weights and anchors are Team assumption, informed by publicly discussed debt-
service practice and standard emergency-fund guidance. They are not
empirically fitted, and real outcome data would refit them.

#### Step 2 -- the arithmetic

    
    
    sub(x, zero_at, full_at) = clamp(100 × (x − zero_at) / (full_at − zero_at), 0, 100)
    
    weighted   = Σ ( weightₕ × subₕ ) / 100
    penalty    = min(10, 3 × max(0, n_bnpl − 3))
    KIRA Score = round( clamp(weighted − penalty, 0, 100) )
    
    band = LOW RISK       if score ≥ 70
           MODERATE RISK  if 45 ≤ score < 70
           HIGH RISK      if score < 45

The **multi-commitment penalty** exists because holding many small commitments
carries a coordination and behavioural risk the ratios do not capture: more
due dates, more ways to miss one, and a documented tendency not to add them
up. It costs 3 points per commitment above three, capped at 10. It is a
behavioural device, deliberately small, and we describe it as such.

#### Step 3 -- worked example, Aisyah

Factor| Her figure| Sub-score| Weight| Contribution| Points lost  
---|---|---|---|---|---  
Debt burden| DSR 7.8%| 93.1| 25| 23.26| 1.74  
BNPL exposure| 5.6%| 80.2| 20| 16.05| 3.95  
Disposable income| 21.1%| 70.4| 20| 14.07| 5.93  
**Emergency buffer**| **0.63 months**|  10.6| 15| 1.58| **13.42**  
Repayment capacity| 2.71×| 100.0| 12| 12.00| 0.00  
**Savings resilience**| **0.50 months**|  16.7| 8| 1.33| **6.67**  
**Total**| | | **100**| **68.31**| **31.69**  
Penalty (2 commitments)| none -- threshold is 3| 0.00  
**KIRA Score**| | **68**  
  
Two rows carry 63% of everything Aisyah loses. Both are about savings, not
debt. That is a _useful_ finding for her and it is visible on the dashboard
without any interpretation layer -- which is what a transparent score buys
you.

#### Design constraints on the score

  * **Monotone in the right direction.** More income, more savings or less debt can never lower the score. Enforced by property tests `T-03` to `T-05`.
  * **Bounded and integral.** Always an integer in [0, 100].
  * **Deterministic.** No randomness, no model, no time dependence, no network call.
  * **Decomposable.** Contributions sum to the weighted total by construction -- no SHAP, no LIME, no post-hoc attribution required.
  * **Hand-reproducible.** A user with a calculator and this page can verify their own score.

13

### Explainability

Three tiers, each independently sufficient. The user can stop at any level and
still understand their score.

Tier 1 -- structural

#### Exact by construction

Contribution = weight × sub-score ÷ 100\. This is not an approximation of the
model's reasoning -- it _is_ the reasoning. Sums to the total, always.

Tier 2 -- templated

#### Deterministic sentences

Each factor maps to a sentence with the user's own figure interpolated: _"
Your savings cover 0.6 months of spending. Six months would score full marks
here; this factor is costing you 13.4 points."_ No LLM required. Always
available.

Tier 3 -- generated

#### Natural language

The LLM rewrites tiers 1 and 2 into two or three flowing sentences in English
or Malay. Purely a presentation upgrade. Guarded, timed out, and never load-
bearing.

Why not SHAP?

SHAP exists to explain models whose internals are not interpretable. Our score
has no internals to explain -- it is a weighted sum, so the exact attribution
is available for free. Adding SHAP to a linear rule engine would be theatre,
and a technical judge would recognise it as such. We do use feature
importances on the ML model in §11, which is the appropriate place for them.

14

### Affordability Simulator

    
    
    def simulate(profile, price, tenure_months):
        assert tenure_months >= 1 and price > 0
        monthly = round(price / tenure_months)
    
        before = kira_score(**profile)
        after_profile = {**profile,
                         "bnpl_monthly": profile["bnpl_monthly"] + monthly,
                         "n_bnpl":       profile["n_bnpl"] + 1}
        after = kira_score(**after_profile)
    
        return {
            "monthly": monthly,
            "before": before, "after": after,
            "delta_score":   after.score        - before.score,
            "delta_buffer":  after.buffer_rm    - before.buffer_rm,
            "band_changed":  after.band        != before.band,
            "alternatives":  [simulate_tenure(profile, price, t)
                              for t in (6, 12, 18, 24) if t != tenure_months],
        }

#### Verdict banner rules

Condition| Banner| Wording  
---|---|---  
Band worsens| Red| "This would move you from MODERATE to HIGH risk."  
Score drops ≥ 10, band held| Amber| "Higher financial stress -- this costs you
_n_ points."  
Score drops < 10| Green| "Manageable impact -- this costs you _n_ points."  
Buffer would go negative| Red| "This commitment exceeds your monthly slack by
RM _n_."  
  
Wording that is banned in this component

"You cannot afford this." * "You should not buy this." * "We recommend
against…" * "Bad decision." Every banner states a consequence with a number.
The user decides. This is both our product principle and our regulatory
boundary, and they happen to be the same line.

**Always show alternatives.** Stretching the same RM2,400 purchase from 12 to
24 months costs Aisyah 6 points rather than 14 -- RM100 a month instead of
RM200. Showing that turns the simulator from a warning device into a planning
tool -- and it is the single most persuasive interaction in the demo.

15

### Early-Warning Engine

Code| Trigger| Level| Message shown  
---|---|---|---  
HIGH_BNPL| `bnpl_ratio > 0.15`| Red| "BNPL repayments are _n_ % of your
income. Above 15%, a single missed month tends to cascade."  
LOW_BUFFER| `runway_months < 1.0`| Red| "Your savings cover _n_ months of
spending. An unplanned RM1,000 expense would have to be financed."  
THIN_SLACK| `buffer_ratio < 0.10`| Amber| "You have RM _n_ left after all
commitments -- _n_ % of income."  
MULTI_COMMIT| `n_bnpl >= 4`| Amber| "_n_ active commitments totalling RM _n_ a
month across _n_ due dates."  
OVERCOMMITTED| `commitment_ratio > 0.90`| Red| "_n_ % of your income is
already committed before any discretionary spending."  
MODEL_STRESS| `p_stress_12m > 0.50`| Amber| "Profiles similar to yours ran
short of cash within 12 months in _n_ % of simulated paths."  
  
Why the model flag is worded that way

"Profiles similar to yours, in _n_ % of _simulated_ paths" is precise, honest
and still meaningful. "You have a 62% chance of financial distress" would be a
claim about the real world that our training data cannot support. The
difference is one clause and it is the difference between a defensible product
and an indefensible one.

**Thresholds are Team assumption**, calibrated so that the four persona
fixtures produce a sensible spread: Daniel triggers nothing, Aisyah triggers
`LOW_BUFFER`, Wei Jian triggers two and Farah triggers four -- two of hers
red. Test `T-09` asserts exactly this, reading the expectations from
`data/mock-data.json`.

16

### LLM & RAG Layer

Aspect| Decision  
---|---  
Role| Explanation and education only. Never computation, never risk
classification, never product recommendation.  
Input| The fixed JSON payload in §4\. The LLM never sees a raw profile and
never sees anything it was not explicitly handed.  
Guard| Numeral extraction. Any figure in the output not present in the payload
voids the response.  
Timeout| 4 seconds, then template fallback. The explanation renders after the
numbers, never before.  
Fallback| Deterministic templates that always work. The app is fully
functional with no API key set.  
Languages| English first; Bahasa Malaysia if time allows (P2).  
Cost control| Response cached by (band, top-two-factor pattern). Hard monthly
spend cap configured on day 1.  
Key handling| Environment variable only. Never in the repository, never in a
Streamlit secret committed to git, never printed in a log or an error message.  
  
#### RAG -- deliberately minimal

A local JSON knowledge base of 20-40 short, curated financial-literacy
entries: what a debt service ratio is, why an emergency fund is measured in
months, how BNPL instalments compound across providers, what AKPK does and how
to reach them. Retrieval is keyword matching over titles and tags -- no vector
database, no embedding service, no index to build.

Justify the simplicity, do not apologise for it

A vector database for 40 documents is engineering theatre. Keyword retrieval
over a curated corpus is the correct choice at this scale, it is auditable, it
has no cold-start cost, and it removes an entire class of failure from a live
demo. If a judge asks why there is no vector store, that is the answer -- and
it is a better answer than having built one.

Every entry carries a source field. If the LLM cites a fact, it cites an entry
the team wrote and can defend. Nothing in the corpus is generated. Prototype
assumption

17

### API Structure

The MVP has no HTTP API -- Streamlit calls Python functions directly. But the
service signatures are written as if they were endpoints, so Phase 2 wraps
them in FastAPI without touching the domain layer. This is the contract both
developers code against from hour one.

Function| Future endpoint| Request| Response  
---|---|---|---  
`save_profile(p)`| `POST /v1/profiles`| 7 profile fields| `{profile_id,
updated_at}`  
`load_profile(id)`| `GET /v1/profiles/{id}`| --| Profile object  
`assess(p)`| `POST /v1/assess`| Profile| `{score, band, features, subscores,
contributions, warnings, p_stress_12m}`  
`simulate(p, price, tenure)`| `POST /v1/simulate`| `{profile, price,
tenure_months}`| `{monthly, before, after, deltas, band_changed,
alternatives}`  
`explain(payload)`| `POST /v1/explain`| Explanation payload| `{text, source,
language}`  
      
    
    // POST /v1/assess -- canonical response shape (Aisyah fixture)
    {
      "score": 68, "band": "MODERATE RISK", "penalty": 0.0,
      "features": { "buffer_rm": 950, "dsr": 0.0778, "bnpl_ratio": 0.0556,
                    "buffer_ratio": 0.2111, "runway_months": 0.634,
                    "coverage": 2.714, "savings_months": 0.5,
                    "commitment_ratio": 0.7889, "n_bnpl": 2 },
      "subscores":     { "debt_burden": 93.1, "bnpl_exposure": 80.2,
                         "disposable_income": 70.4, "emergency_buffer": 10.6,
                         "repayment_capacity": 100.0, "savings_resilience": 16.7 },
      "contributions": { "debt_burden": 23.26, "bnpl_exposure": 16.05,
                         "disposable_income": 14.07, "emergency_buffer": 1.58,
                         "repayment_capacity": 12.00, "savings_resilience": 1.33 },
      "warnings": [ { "code":"LOW_BUFFER", "level":"red",
                      "detail":"Savings cover 0.6 months of spending." } ],
      "p_stress_12m": 0.31,
      "disclaimer": "Assessment based on user-provided data. Not financial advice."
    }

Note the `disclaimer` field. It is part of the contract, not a UI decoration
-- any future institutional consumer of this API receives it and is expected
to surface it.

18

### Database Schema

    
    
    CREATE TABLE profiles (
        profile_id     INTEGER PRIMARY KEY AUTOINCREMENT,
        label          TEXT    NOT NULL,
        income         REAL    NOT NULL CHECK (income > 0),
        fixed_expenses REAL    NOT NULL CHECK (fixed_expenses >= 0),
        var_expenses   REAL    NOT NULL CHECK (var_expenses >= 0),
        savings        REAL    NOT NULL CHECK (savings >= 0),
        loan_monthly   REAL    NOT NULL DEFAULT 0 CHECK (loan_monthly >= 0),
        is_demo        INTEGER NOT NULL DEFAULT 0,
        created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
        updated_at     TEXT    NOT NULL DEFAULT (datetime('now'))
    );
    
    CREATE TABLE commitments (
        commitment_id  INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id     INTEGER NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
        label          TEXT    NOT NULL,
        kind           TEXT    NOT NULL CHECK (kind IN ('bnpl','loan','card','other')),
        monthly        REAL    NOT NULL CHECK (monthly >= 0),
        outstanding    REAL    NOT NULL DEFAULT 0 CHECK (outstanding >= 0),
        months_left    INTEGER NOT NULL DEFAULT 0 CHECK (months_left >= 0),
        next_due       TEXT
    );
    
    CREATE TABLE assessments (
        assessment_id  INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id     INTEGER NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
        score          INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
        band           TEXT    NOT NULL,
        features_json  TEXT    NOT NULL,
        subscores_json TEXT    NOT NULL,
        p_stress       REAL,
        engine_version TEXT    NOT NULL,
        created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
    );
    
    CREATE TABLE simulations (
        simulation_id  INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id     INTEGER NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
        price          REAL    NOT NULL CHECK (price > 0),
        tenure_months  INTEGER NOT NULL CHECK (tenure_months >= 1),
        score_before   INTEGER NOT NULL,
        score_after    INTEGER NOT NULL,
        created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
    );
    
    CREATE INDEX idx_commitments_profile  ON commitments(profile_id);
    CREATE INDEX idx_assessments_profile  ON assessments(profile_id, created_at DESC);

Why `engine_version` is in the schema on day 1

The moment the weights change, every stored score becomes incomparable with
every earlier one. Recording which version of the engine produced a score
costs one column now and saves a data-integrity problem later. A judge who
notices this column will read it as a team that has shipped something before.

19

### Security Architecture

Cybersecurity is a genuine team strength, so this section should be specific
rather than a list of good intentions. The strongest security property of the
MVP is architectural: **there is no real user data to steal.**

Control| MVP implementation| Production requirement  
---|---|---  
**Data minimisation**|  Seven numeric fields. No name, email, phone, IC
number, address, employer or bank details. Nothing collected that is not
scored.| Same principle, enforced by schema review at every change.  
**Input validation**|  Type and range checks on every numeric field at the
service boundary; DB-level `CHECK` constraints as a second line.| Schema
validation library; explicit rejection of out-of-range values with structured
errors.  
**Injection**|  Parameterised queries only. No string-formatted SQL anywhere
in the codebase -- grep for f-strings adjacent to `execute` before every
merge.| Static analysis in CI; ORM or query builder.  
**Secrets**|  Environment variables. `.env` in `.gitignore`, `.env.example`
committed with placeholder values only. No key ever printed in a log or
traceback.| Managed secrets store; automatic rotation; secret scanning in CI.  
**Dependencies**|  Pinned versions in `requirements.txt`; `pip-audit` run once
before submission.| Automated scanning; patch SLA.  
**Transport**|  HTTPS by default on Streamlit Cloud.| TLS 1.3, HSTS,
certificate management.  
**Encryption at rest**|  Not implemented -- and we say so, because no real
data is stored.| Field-level encryption for financial values; encrypted
volumes.  
**Authentication**|  None. See §21.| See §21.  
**Logging**|  Application events only. Financial values are never logged.
Errors are logged with a correlation ID, never with the payload.| Structured
logging; access audit trail; retention policy.  
**Attack surface**|  No file upload, no user-supplied HTML or markdown
rendering, no eval, no shell execution, no third-party embeds, no analytics
scripts.| Maintained as an explicit architectural constraint.  
  
#### Threat model -- STRIDE, abbreviated

Threat| Applies?| Position  
---|---|---  
**S** poofing| Low| No accounts in the MVP, so no identity to spoof. Becomes
material the moment authentication exists.  
**T** ampering| Medium| A user can enter false data about themselves -- and
the only person harmed is that user. Institutional deployment would require
verified data inputs.  
**R** epudiation| Low| No transactions, no obligations created.
`engine_version` plus timestamps give basic traceability.  
**I** nformation disclosure| **Highest**|  The primary risk in any production
version. Mitigated in the MVP by not holding real data at all.  
**D** enial of service| Low| Free-tier hosting limits are the practical
constraint. Not a demo concern; the LLM spend cap prevents cost-based DoS.  
**E** levation of privilege| Low| No roles, no admin surface in the MVP.  
  
20

### Privacy Architecture

The privacy principle

"We don't need to know who you are to understand your financial health."

This is architecturally true, not aspirational. The scoring engine takes seven
numbers and returns a score. It has no identity input, because identity is not
a factor in financial health. Everything below follows from that.

Principle| How it is realised  
---|---  
**Collect nothing you do not score**|  Seven numeric fields. No identifiers of
any kind. A profile is a vector, not a person.  
**Consent is explicit and revocable**|  Nothing is shared with any third party
in the MVP because there is no third party. The architecture reserves a
consent ledger for the point at which one exists.  
**User controls their data**|  View, edit and delete are all first-class
actions. Deletion is a hard delete with cascade, not a soft flag.  
**Anonymisation by default**|  Any future aggregate reporting is cohort-level
with a documented minimum cohort size. Never individual records, never re-
identifiable slices.  
**Purpose limitation**|  Data entered for a score is used for that score. Not
for marketing, not for lead generation, not for model training without
separate explicit consent.  
**No trackers**|  No analytics, no advertising pixels, no third-party scripts.
Verifiable by reading the source.  
  
Exact wording -- do not vary this on stage

"**The prototype follows privacy-by-design principles and would require formal
PDPA and legal review before production deployment.** "

Never say "PDPA compliant", "fully compliant" or "we comply with PDPA". We
have had no legal review. Claiming compliance we do not have, in a room that
may contain someone who works in financial regulation, is the single most
damaging thing anyone on this team could say.

21

### Authentication

**The MVP has no authentication, and that is the correct decision.**

Why none

Authentication implies accounts. Accounts imply stored credentials and
persistent personal financial data on a free-tier public host. Building that
properly costs a day we do not have; building it badly creates a genuine
liability. Not collecting the data is both faster and safer.

What replaces it

Session-scoped state plus explicitly labelled demo profiles. Each visitor gets
a clean session. Nothing personal persists. The landing screen states this in
one line: _" Demo mode -- synthetic profiles only. Do not enter your real
financial information."_

Phase| Approach| Trigger  
---|---|---  
MVP| None. Session state only.| --  
Pilot| Passwordless email link, or an institution's existing SSO.| First real
user data.  
Production| OAuth 2.0 / OIDC, MFA, session management, RBAC for institutional
dashboards.| First institutional customer.  
  
If a judge asks "why no login?", the answer is short and it is a good one:
"Because we chose not to store personal financial data on a public free-tier
host in a three-day prototype. The absence of authentication is the
consequence of the absence of stored personal data, and that ordering is
deliberate."

22

### Error Handling

Failure| Behaviour| What the user sees  
---|---|---  
Invalid numeric input| Reject at the form; do not recompute.| "Income must be
greater than 0." Field-level, specific.  
Income = 0| Skip ratio computation; return a defined no-score state.| "Enter
your monthly income to see your score."  
Zero debt| Repayment capacity returns 100 by rule, not by division.| Normal
score. No division by zero, ever.  
Model artefact missing| Catch at load; disable the stress probability only.|
All six core features work; the probability card is simply absent.  
LLM timeout or error| Fall back to template at 4 s.| An explanation, marked as
generated locally. No spinner that never resolves.  
LLM numeral guard fails| Discard the response; template instead; log the
event.| An explanation. The user never sees an invented figure.  
Database locked or missing| Recreate schema; fall back to in-memory session
state.| "Working in temporary mode -- your profile will not be saved."  
Unhandled exception| Catch at the page boundary; log with a correlation ID.|
"Something went wrong on this page. Your data is safe. Reference: `a7f3`."  
  
Demo-day rule

A raw Python traceback rendered on a projector costs more credibility than any
feature earns. Every page gets a try/except at its boundary before the app is
demonstrated to anyone. This is task `D3-09` and it is not optional.

23

### Testing Strategy

Twelve tests. Not comprehensive coverage -- the twelve that stop the demo
breaking and stop the numbers being wrong. Written in the same day as the code
they test, not afterwards.

ID| Test| Asserts| Owner  
---|---|---|---  
T-01| Persona fixtures| The four personas return exactly 68, 94, 41, 17. **If
this fails, everything in the deck is wrong.**|  Dev 2  
T-02| Score bounds| Over 10,000 random valid profiles, score is always an
integer in [0,100].| Dev 2  
T-03| Monotone in income| Increasing income, all else equal, never decreases
the score.| Dev 2  
T-04| Monotone in debt| Increasing BNPL repayments, all else equal, never
increases the score.| Dev 2  
T-05| Monotone in savings| Increasing savings, all else equal, never decreases
the score.| Dev 2  
T-06| Contribution identity| Sum of contributions equals the weighted total
before penalty, to 1e-9.| Dev 2  
T-07| Python / JS parity| The browser implementation and the Python engine
agree on 500 random profiles.| Dev 2  
T-08| Simulator correctness| Aisyah + RM2,400/12mo returns 68 -> 54 and buffer
950 -> 750.| Dev 1  
T-09| Warning triggers| Daniel 0, Aisyah 1, Wei Jian 2, Farah 4 -- read from
`data/mock-data.json`.| Dev 2  
T-10| LLM guard| A response containing a figure absent from the payload is
rejected and the template renders.| Dev 2  
T-11| Offline mode| With no API key and no network, every page renders and
every core feature works.| Dev 1  
T-12| Edge cases| Zero debt, zero savings, income equal to outflow, 12
commitments -- none raise, all return a valid score.| Dev 2  
  
`pytest tests/ -q` must pass before every push. It runs in under ten seconds
because the domain layer imports nothing.

#### Manual demo rehearsal checklist

  * Full demo path completed three times end to end without touching the keyboard outside the script
  * Run once with wifi disabled -- must still work
  * Run at 1280×720, the projector resolution
  * Run in a private browsing window -- no cached state
  * Every ringgit figure on screen checked against the fixtures in this document
  * The synthetic-data notice is visible on every page
  * Browser zoom at 100% and at 125% -- the room may not be yours to configure

24

### Deployment

Aspect| Decision  
---|---  
Platform| Streamlit Community Cloud, deployed from the GitHub `main` branch.  
Trigger| Push to `main`. No pipeline to configure.  
Secrets| LLM API key set in the Streamlit Cloud secrets UI. Never committed.  
Database| SQLite created on first run. Ephemeral on the free tier --
acceptable, because demo profiles regenerate deterministically.  
Model artefact| Committed to the repository (roughly 2-5 MB). No training step
at deploy time.  
**Fallback**| **A local run on a laptop, rehearsed, plus a recorded screen
capture of the full demo.**  
  
Task `D3-12` -- record the demo video

Record a two-minute screen capture of the complete demo on day 3 and put it in
the repository. If the venue wifi fails, or Streamlit Cloud has a bad
afternoon, or the laptop decides to update, the video is the difference
between presenting a product and apologising for one. Teams lose competitions
to network problems every year. Twenty minutes of work removes the risk
entirely.

25

### GitHub Structure

kira-plus/ ├── main.py # Streamlit entry point ├── pages/ │ ├── 1_Profile.py │
├── 2_Commitments.py │ ├── 3_Dashboard.py │ ├── 4_Simulator.py │ └──
5_About.py ├── utils/ # DOMAIN -- pure Python, zero third-party imports │ ├──
features.py # 11 derived features │ ├── scoring.py # KIRA Score engine
(Appendix C) │ ├── simulate.py # what-if arithmetic │ ├── warnings.py # 6
early-warning rules │ ├── explain.py # deterministic templates │ └── format.py
# fmt_rm(), fmt_pct() -- used everywhere ├── services/ # orchestration -- no
streamlit imports │ ├── profile_service.py │ ├── scoring_service.py │ ├──
simulation_service.py │ └── llm_service.py ├── models/ │ ├──
generate_synthetic.py # 12,000 profiles + behavioural latent │ ├──
monte_carlo.py # 12-month cash-path simulation -> label │ ├── train.py #
RandomForest + evaluation report │ ├── stress_model.pkl # committed artefact │
└── MODEL_CARD.md # metrics, limitations, intended use ├── data/ │ ├──
synthetic_profiles.csv │ ├── personas.json # the 4 demo fixtures │ └──
knowledge_base.json # 20-40 curated literacy entries ├── database/ │ ├──
schema.sql │ ├── init_db.py │ └── kira.db # gitignored ├── tests/ │ ├──
test_scoring.py # T-01 … T-06, T-12 │ ├── test_simulate.py # T-08 │ ├──
test_warnings.py # T-09 │ ├── test_llm_guard.py # T-10 │ └── test_parity.py #
T-07 ├── assets/ # logo, palette, screenshots ├── docs/ │ ├──
KIRA_MASTER_PACKAGE.html │ └── DEMO_SCRIPT.md ├── .env.example ├── .gitignore
├── requirements.txt └── README.md

#### Repository conventions

  * **Branches:** `main` is always deployable. Work on `dev1/<feature>` and `dev2/<feature>`. Merge to `main` only with tests passing.
  * **Commits:** `[C3] scoring engine: add penalty and band` -- component tag, then what changed.
  * **Merge frequency:** at least twice a day. A three-day project cannot absorb a two-day merge conflict.
  * **The README is a deliverable.** Judges read it. It needs: what KIRA+ is, the synthetic-data disclosure, how to run it in two commands, the architecture diagram, and the team.
  * **Never commit:** `.env`, `kira.db`, API keys, `__pycache__`, or a screenshot containing a real financial figure.

26

### Environment Variables

    
    
    # .env.example  --  commit THIS file, never .env
    
    LLM_API_KEY=              # required only for generated explanations; app works without it
    LLM_MODEL=                # model identifier
    LLM_TIMEOUT_SECONDS=4     # hard timeout before template fallback
    LLM_MONTHLY_CAP_USD=10    # spend guard; set on day 1
    
    KIRA_DB_PATH=database/kira.db
    KIRA_MODEL_PATH=models/stress_model.pkl
    KIRA_ENGINE_VERSION=1.0.0 # written into every stored assessment
    KIRA_DEMO_MODE=true       # shows the synthetic-data banner; keep true for the competition
    KIRA_LANGUAGE=en          # en | ms

Every variable has a working default except `LLM_API_KEY`. Cloning the
repository and running `streamlit run main.py` must produce a fully functional
application with no configuration at all -- a judge who clones it should never
hit a setup wall.

27

### 3-Day Technical Backlog

All Developer 1 Developer 2 P0 only

ID| Task| Description & expected output| Dev| Pri| Est| Deps| Acceptance  
---|---|---|---|---|---|---|---  
D1-01| Repo + skeleton| Create repository, folder tree, `requirements.txt`,
`.env.example`, README stub. Both devs clone and run.| Dev 2| P0| 1h| --| Both
developers can run the empty app locally.  
D1-02| Scoring engine| `utils/features.py` \+ `utils/scoring.py`. Six factors,
weights, anchors, penalty, bands. Pure Python.| Dev 2| P0| 3h| D1-01| T-01 to
T-06 pass. Personas return 68/94/41/17.  
D1-03| Persona fixtures| `data/personas.json` with the four profiles from Part
I §7.| Dev 2| P0| 0.5h| D1-02| Loadable by both app and tests.  
D1-04| Synthetic generator| `models/generate_synthetic.py` -- 12,000 profiles
with income-dependent expense shares and an unobserved behavioural latent.|
Dev 2| P1| 2h| D1-02| Band distribution roughly 40/26/33. CSV written.  
D1-05| Monte-Carlo labels| `models/monte_carlo.py` -- 12-month cash paths with
income shocks, expense volatility, lumpy costs, expiry and new take-up.| Dev
2| P1| 2.5h| D1-04| Positive rate 10-20%. Label is not a deterministic
function of the features.  
D1-06| Train + evaluate| `models/train.py` -- RandomForest, stratified split,
5-fold CV, both baselines, feature importances, `MODEL_CARD.md`.| Dev 2| P1|
2h| D1-05| Held-out ROC-AUC ≥ 0.90. Model card written. `.pkl` committed.  
D1-07| Streamlit shell| `main.py`, five pages, sidebar navigation, brand
theme, persistent synthetic-data notice.| Dev 1| P0| 2.5h| D1-01| All five
pages reachable; theme applied; notice on every page.  
D1-08| Database| `schema.sql`, `init_db.py`, four tables, indices, CHECK
constraints.| Dev 1| P0| 1.5h| D1-01| DB created on first run; constraints
reject invalid rows.  
D1-09| Profile page| Seven-field form, validation, save, four one-click demo
persona buttons.| Dev 1| P0| 2.5h| D1-08| Profile persists across reload.
Invalid input gives a specific message.  
D2-01| Commitments page| Editable table, aggregate card, upcoming repayments,
obligations donut.| Dev 1| P0| 3h| D1-09| Totals match the table exactly.
Empty state renders.  
D2-02| Dashboard page| Score gauge, band, six-factor breakdown chart, warning
cards.| Dev 1| P0| 3.5h| D1-02, D2-05| Aisyah renders 68 with all six factors
and their own figures.  
D2-03| Simulator page| Purchase input, before/after gauges, delta table,
verdict banner, tenure alternatives.| Dev 1| P0| 4h| D2-04| T-08 passes. 68 ->
54 visible on screen. Alternatives shown.  
D2-04| Simulation engine| `utils/simulate.py` \+ `simulation_service.py`.
Before, after, deltas, alternatives.| Dev 2| P0| 2h| D1-02| Deterministic;
tenure 0 rejected; alternatives computed for 6/12/18/24.  
D2-05| Warning engine| `utils/warnings.py` -- six rules, levels, messages with
the triggering figure interpolated.| Dev 2| P0| 1.5h| D1-02| T-09 passes.
Every message names its number.  
D2-06| Template explainer| `utils/explain.py` -- deterministic sentences per
factor. The fallback that must always work.| Dev 2| P0| 2h| D1-02| Every
factor and every band produces sensible copy with no LLM present.  
D2-07| Knowledge base| `data/knowledge_base.json` -- 20-40 curated entries,
each with a source field.| Dev 2| P1| 1.5h| --| Keyword retrieval returns
relevant entries for DSR, buffer, BNPL and AKPK.  
D3-01| LLM service| `llm_service.py` -- payload build, call, 4s timeout,
numeral guard, template fallback, cache.| Dev 2| P1| 3h| D2-06| T-10 and T-11
pass. Works with the key removed.  
D3-02| Wire model into UI| Load `stress_model.pkl` with `@st.cache_resource`;
show probability; degrade silently if absent.| Dev 1| P0| 1.5h| D1-06| App
runs correctly with the artefact deleted.  
D3-03| About page| Methodology, weights table, synthetic-data disclosure,
limitations, team.| Dev 1| P0| 1.5h| D1-07| A judge can read it and understand
the scoring without asking.  
D3-04| Test suite| All twelve tests written and green.| Dev 2| P0| 2.5h| all|
`pytest -q` passes in under 10 seconds.  
D3-05| Visual polish| Brand colours, consistent currency formatting, spacing,
empty states, projector check at 1280×720.| Dev 1| P0| 2.5h| D3-03| Nothing on
screen looks unfinished at projector resolution.  
D3-06| LLM guard hardening| Numeral extraction regex, logging of rejections,
deliberately-bad fixture test.| Dev 2| P1| 1h| D3-01| A response with an
invented figure is rejected in the test.  
D3-07| Deploy| Push to `main`, connect Streamlit Cloud, set secrets, verify
the public URL.| Dev 1| P0| 1h| D3-05| Public URL loads and the full demo path
works on it.  
D3-08| README + model card| Complete README with run instructions,
architecture, disclosure and team. Finalise `MODEL_CARD.md`.| Dev 2| P0| 1.5h|
D3-04| A stranger can clone and run in two commands.  
D3-09| Error boundaries| try/except at every page boundary with a friendly
message and a correlation ID.| Dev 1| P0| 1h| D3-05| No traceback can reach
the screen.  
D3-10| Demo rehearsal| Run the full path three times, once offline, once at
projector resolution, once in a private window.| Dev 1 \+ Dev 2| P0| 1h|
D3-07| Three clean runs, no improvisation required.  
D3-11| Parity test| Port the engine to JS for the document simulator; assert
agreement on 500 random profiles.| Dev 2| P1| 1h| D3-04| T-07 passes.  
D3-12| **Record demo video**|  Two-minute screen capture of the full demo,
committed to the repository.| Dev 1| P0| 0.5h| D3-10| Video plays without
network access. This is the insurance policy.  
X-01| Bahasa Malaysia toggle| Language switch on explanations and key labels.|
Dev 2| P2| 2h| D3-01| Only if every P0 and P1 is complete.  
X-02| 6-month projection chart| Deterministic savings trajectory under each
scenario.| Dev 1| P2| 2h| D2-03| Only if every P0 and P1 is complete.  
X-03| Repayment optimiser| Snowball vs avalanche ordering across commitments.|
Dev 2| P2| 2.5h| D2-01| Only if every P0 and P1 is complete.  
Developer 1 ≈ 26h * Developer 2 ≈ 26h across three days, excluding P2 items.
That is deliberately under a 3×12h budget -- the slack absorbs the things that
always go wrong.

The rule that protects the demo

**No P2 task starts until every P0 and P1 task is closed.** The three optional
features are genuinely nice and they will genuinely cost you the simulator if
you start them on day 2. If a P0 task is running late on day 3, cut a P1 --
starting with the LLM layer, since the templates already work.

28

### Developer Acceptance Criteria

The MVP is done when all of the following are true. Not "mostly". All.

Functional

  * A user enters a profile and gets a score in under 90 seconds
  * All six core features work end to end
  * The four personas return 68, 94, 41, 17
  * The simulator returns 68 -> 54 for RM2,400 over 12 months
  * Every score shows all six factor contributions
  * Every warning names the figure that triggered it

Technical

  * `pytest -q` is green
  * The app runs with no API key and no network
  * The app runs with the model artefact deleted
  * No traceback can reach the screen
  * No secret appears anywhere in git history
  * `utils/scoring.py` contains no third-party import

Presentation

  * Deployed and reachable at a public URL
  * Renders correctly at 1280×720
  * Currency formatting is identical everywhere
  * The synthetic-data notice is on every page
  * The demo video is committed

Documentation

  * README lets a stranger run it in two commands
  * `MODEL_CARD.md` states metrics, baselines and limitations
  * The About page explains the scoring methodology
  * This document is in `docs/`

29

### Future Technical Architecture

Layer| MVP (3 days)| Production| Trigger to move  
---|---|---|---  
Frontend| Streamlit| React or Next.js web app + native mobile| First
institutional customer  
API| Direct function calls| FastAPI, versioned, OpenAPI documented, rate
limited| First external consumer  
Database| SQLite file| PostgreSQL, managed, encrypted at rest, read replicas|
First real user data  
Model serving| Pickle loaded in-process| Model registry, versioned artefacts,
shadow deployment, drift monitoring| Model retrained on real data  
Training data| Synthetic + Monte-Carlo labels| Consented anonymised real data
with observed outcome labels| **Phase 4 -- the hinge**  
LLM| Direct API, cached| Gateway with prompt versioning, output validation,
cost controls, evaluation suite| Volume  
Retrieval| Keyword over local JSON| Vector store, only if the corpus exceeds a
few hundred documents| Corpus size, not fashion  
Auth| None| OAuth 2.0 / OIDC, MFA, RBAC| First real user data  
Deployment| Streamlit Cloud| Containers, IaC, staging, blue-green| Uptime
commitment  
Observability| Print statements| Structured logging, metrics, tracing,
alerting, audit trail| First customer SLA  
  
How to present this table

"Here is everything we deliberately did not build, why, and exactly what would
trigger building it." A team that can name the trigger for each architectural
change is demonstrating engineering judgement. A team that built microservices
for a three-day prototype is demonstrating the opposite.

Part III

## The 12-Slide Pitch Deck

Exactly twelve slides. Person 3 can build the deck directly from this section
without writing a word of new copy; Person 2 can build the visuals from the
same brief.

◆

### Deck structure

One change from the suggested storyline

The brief invited a stronger flow if one existed. We made exactly one change:
**competitive advantage is folded into slide 4 ( "The Gap")**, where it
belongs -- you establish the gap and the incumbents in one beat -- and the
freed slot becomes **slide 9, "Why Now"**, on the Consumer Credit Act 2025.
That is our single strongest commercial argument and it previously had no
home. Placing it immediately before the business model means the commercial
case lands on top of a regulatory fact rather than on an assertion.

ACCESS -> BLIND SPOT -> RISK -> KIRA+ -> DEMONSTRATION -> AI -> TIMING ->
BUSINESS -> IMPACT -> FUTURE

01 The Hook 20s

Objective

    Make the room feel the asymmetry between how fast you can commit and how slowly you understand.
Headline

    **" RM100 a month."**
Exact content

    Nothing but the headline, and beneath it in small type: _" How long did it take you to decide? How long would it take you to know what it costs?"_
Data

    None. Do not open with a statistic.
Visual

    Near-empty slide. Deep navy ground, headline in large gold type, one line of white text. Silence for two seconds after the headline appears.
Diagram

    None.
Speaker notes

    "Every one of you has seen this at a checkout. RM100 a month. It takes about eleven seconds to accept. Working out what it actually does to your month takes considerably longer -- and almost nothing helps you do it." Pause. Then advance.
Not on this slide

    Logo. Team names. Statistics. Bullet points. Anything at all besides the two lines.

02 The Problem 30s

Objective

    State the problem in one sentence a judge could repeat back an hour later.
Headline

    **Access has outpaced understanding.**
Exact content

    "Malaysians can access digital credit far more easily than they can understand the cumulative impact of the commitments they are accumulating." Below, three short labels: _Fragmented * Invisible * Reactive_.
Data

    None yet. The statistics belong on slide 3.
Visual

    The problem sentence set large. Three small icons beneath: scattered cards, a closed eye, a backward arrow.
Diagram

    Optional: five small BNPL tiles with no total beneath them, and a question mark where the total should be.
Speaker notes

    "Commitments sit in five different apps. No single screen shows the total. And every tool we have describes the month you already had, not the month a new commitment would create."
Not on this slide

    "BNPL is dangerous." Any moralising. Any suggestion that consumers are irresponsible.

03 Malaysia in Numbers 35s

Objective

    Establish scale and credibility with verified figures from named institutions.
Headline

    **The market grew 23% in nine months. Household buffers did not.**
Exact content

    Four large figures with sources beneath each.
Data

    **8.0m** active BNPL accounts, Q1 2026 * **RM5.3bn** outstanding * **RM21.3bn** across **243m** transactions in 2025 * **+36.7%** transaction growth half-on-half * **61%** have difficulty raising RM1,000. Sources: Ministry of Finance (Q1 2026); BNM Financial Stability Review 2H 2025; BNM Financial Capability & Inclusion Survey 2024.
Visual

    Four number cards. Source attribution in small mono type under each -- the attribution is part of the design, not a disclaimer.
Diagram

    Optional: two bars showing 102.6m -> 140.3m transactions, with the value line rising more slowly alongside.
Speaker notes

    "Volume grew faster than value. Malaysians are not taking bigger BNPL commitments -- they are taking _more_ of them. That is the pattern no single provider can see."
Not on this slide

    Any unsourced figure. Any projection. The words "crisis" or "debt trap". BNM has said exposure is 0.3% of household debt -- overstating contradicts our own source.

04 The Gap 30s

Objective

    Show that the tools exist and still leave the gap open -- and pre-empt "doesn't X already do this?"
Headline

    **Everything tells you what you spent. Nothing tells you what 's next.**
Exact content

    A compressed matrix: six tool classes as rows, three capabilities as columns -- consolidated view, forward simulation, transparent health score. KIRA+ as the last row.
Data

    None. This is a capability comparison, not a statistics slide.
Visual

    Grid with muted ticks and crosses. KIRA+ row in teal. Keep it small enough to scan in eight seconds.
Diagram

    The matrix is the diagram.
Speaker notes

    "Every one of these is a good product doing its job. Banking apps see banked debt. BNPL apps see their own plan. CTOS reports history. None of them is built to answer the question you have at the checkout, which is: what does _one more_ do to me?"
Not on this slide

    Named competitor logos. Any claim that a named company "cannot" do something. Compare capabilities, never disparage companies.

05 KIRA+ 25s

Objective

    Introduce the product and the name so both stick.
Headline

    **KIRA+ -- "Kira Dulu. Baru Commit."**
Exact content

    Logo, tagline, and one line: _An AI-powered financial health and BNPL early-warning platform. See the consequences before you commit._
Data

    None.
Visual

    The brand slide. Logo large, generous space, three colours only.
Diagram

    None.
Speaker notes

    "_Kira_ means to calculate. Kira dulu, baru commit -- calculate first, then commit. That is the entire product in four words, and it is the same sentence in Malay and in engineering."
Not on this slide

    Feature lists. Screenshots. Anything that competes with the name.

06 How It Works 35s

Objective

    Show that six real features exist and that the flow is short.
Headline

    **Six features. Ninety seconds to a score.**
Exact content

    The six core features as a numbered row, with the four-step user journey beneath: enter -> consolidate -> score -> simulate.
Data

    None.
Visual

    Six small feature tiles; the simulator tile highlighted in gold as the destination.
Diagram

    Yes -- the journey arrow from Part I §8, simplified to four steps.
Speaker notes

    "Everything in the first three steps exists to make the fourth one possible."
Not on this slide

    Architecture. Technology names. Anything a non-technical judge would skip.

07 Live Demo -- the moment 60s ◆ CENTREPIECE

Objective

    Make the value visible rather than described. This slide is why the other eleven exist.
Headline

    **Aisyah, 26. RM4,500 a month. Considering a RM2,400 phone.**
Exact content

    Live application. Load Aisyah -> show 68 and the six factors -> open the simulator -> enter RM2,400 over 12 months -> hold on the before/after -> show that 24 months costs 6 points instead of 14.
Data

    68 -> 54 * buffer RM950 -> RM750 * repayment capacity 2.71× -> 1.36× * alternative: 24 months = −6 points.
Visual

    The live app, full screen. If live is impossible, the recorded video. If both fail, a static before/after slide held in the deck as slide 7b.
Diagram

    Two gauges side by side is the whole visual. Do not add anything.
Speaker notes

    "RM200 a month. Sounds fine. Here is what it actually does -- her buffer drops from RM950 to RM750, and her repayment capacity halves. She can still buy the phone. But now she knows." Then: "And here is the part that makes this a planning tool rather than a warning: over 24 months -- RM100 a month instead of RM200 -- the same phone costs her six points instead of fourteen."
Timing

    60 seconds, rehearsed to the click. No exploration, no improvisation, no "let me just show you one more thing".
Not on this slide

    Any unrehearsed navigation. Any page not in the script. Live typing of long numbers -- use the demo persona buttons.

08 The AI 40s

Objective

    Prove the AI is real and honestly scoped, in a way that survives a technical follow-up.
Headline

    **Rules decide. The model predicts. The language model explains.**
Exact content

    Three columns for the three layers. Beneath: ROC-AUC 0.923 held-out, 0.921 ± 0.005 across 5-fold CV, against 0.844 for the score alone. And the disclosure line, on the slide, in full.
Data

    0.923 / 0.844 / +0.079. Recall 0.790 on the stress class. Trained on 12,000 synthetic profiles with Monte-Carlo labels.
Visual

    Three-column layer diagram, gold on the middle column. Metrics as a small table, not as a hero number.
Diagram

    Yes -- the three-layer stack.
Speaker notes

    "We separated these three deliberately. The score is deterministic because nobody should accept a black box telling them their financial health. The model predicts something the score cannot -- twelve-month stress under simulated shocks -- and it beats the score alone by 0.079 AUC. And the language model only ever explains numbers it was handed." Then, unprompted: "Our accuracy is 85.3% and the majority-class baseline is 85.7%. We tuned for recall, because missing an at-risk household is worse than a false alarm. That is why we report AUC."
Not on this slide

    "97% accurate". Any metric without its baseline. The word "proprietary". Any claim of real-world predictive accuracy.

09 Why Now 30s

Objective

    Convert "nice idea" into "the market just created the buyer". This is the highest-leverage slide in the deck after the demo.
Headline

    **Regulation just made this a requirement.**
Exact content

    Consumer Credit Act 2025 * Consumer Credit Commission under the Ministry of Finance * BNPL providers must conduct creditworthiness and affordability assessments that account for a consumer's _existing financial commitments_ and debt service ratio * licensing and disclosure obligations. Do _not_ assert a credit-reporting duty -- sources conflict and BNPL does not currently appear in CCRIS or CTOS.
Data

    Cite the Act and the Commission. Only state a commencement date if Person 1 has verified it against the gazette.
Visual

    A single timeline: market growth on one axis, the Act as a vertical marker, KIRA+ positioned immediately after it.
Diagram

    Yes -- the timeline.
Speaker notes

    "Before this Act, an affordability layer was a good idea someone might buy. After it, every BNPL provider in Malaysia has a duty to assess affordability against a consumer's total commitments -- and no single provider can see the others'. That is the exact computation we perform. We are not asking anyone to adopt a philosophy. We are offering to help with an obligation they already have."
Not on this slide

    Any claim of contact, discussion or endorsement with BNM, MoF or the Commission. Any unverified date.

10 Business Model 35s

Objective

    Show a coherent revenue model and a realistic first customer.
Headline

    **Free for consumers. Institutions pay for the assessment layer.**
Exact content

    The B2B2C diagram from Part I §13, plus four revenue lines: SaaS licensing, API per assessment, institutional seats, programme partnerships. Then one line: _First revenue: a university or employer pilot, not a bank._
Data

    No revenue projections. If you show unit economics, label the price as an assumption on the slide itself.
Visual

    Three-node flow: consumers -> platform -> institutions, with the consent boundary drawn explicitly.
Diagram

    Yes -- Figure 2.
Speaker notes

    "Charging financially stressed people to find out they are financially stressed is a bad business and a worse product. Institutions pay, because they now have a reason to. And our first customer is not a bank -- a bank's procurement cycle is longer than our runway. It is a university with five thousand students and an existing financial literacy obligation."
Not on this slide

    A hockey-stick chart. A five-year revenue forecast. Any TAM pyramid. Any number you cannot source.

11 Impact & Scale 35s

Objective

    Land the national case on published targets, not on adjectives.
Headline

    **Malaysia already set the target. We are an instrument for it.**
Exact content

    Two rows from the National Strategy for Financial Literacy 2026-2030: unable to raise RM1,000, **61% -> ≤45%** by 2030; feel over-indebted, **26% -> ≤15%**. Beneath: SDG 1, 8, 10, 12. Beside: the six-phase roadmap compressed to one line.
Data

    NSFL 2026-2030, Financial Education Network. Both KPIs are published.
Visual

    Two progress bars showing baseline and target, with the gap marked. Roadmap as a thin six-step rail beneath.
Diagram

    Yes -- the KPI bars.
Speaker notes

    "We have not measured any impact and we will not claim any. What we can show is that the country has published a target, that our mechanism addresses it directly, and that we know which indicator we would measure."
Not on this slide

    "We will help X million Malaysians." Any impact number we have not measured. Any SDG we cannot justify in one sentence.

12 Closing & Ask 25s

Objective

    Land the memorable line and state a specific, credible ask.
Headline

    **Kira dulu. Baru commit.**
Exact content

    Tagline large. Beneath, three short lines: _Working prototype, live today. Six features, three days, two developers. Built for a duty that already exists._ Then the ask.
Data

    None. Do not end on a statistic.
Visual

    Return to the slide 5 brand composition. Symmetry with the opening.
Diagram

    None.
Speaker notes

    "Eight million BNPL accounts in Malaysia. 61% of us cannot raise a thousand ringgit in an emergency. Between those two facts is a moment -- the moment before you commit -- and right now nothing occupies it. Kira dulu. Baru commit."
The ask

    Be specific: an introduction to one BNPL provider or e-wallet product team, and an institutional pilot partner for a defined cohort. Not "support", not "funding" -- a named next step a judge can actually provide.
Not on this slide

    "Thank you" as the headline. A questions slide. Contact details in 8pt. A new fact introduced at the end.

Deck-wide rules

Maximum twelve slides -- a thirteenth is a cut, not an addition. Every
statistic carries its source on the slide. No slide has more than twenty words
of body text. One idea per slide. Total speaking time approximately **6
minutes 40 seconds** at the times above -- rehearse to your actual slot and
cut slides 4 and 11 first if you need to reach five minutes.

◆

### Pitch Scripts

Four lengths, all consistent with the deck and with each other. Learn the
30-second version properly -- it is the one you will use most, and usually
without warning.

#### 30 seconds -- the elevator

"Malaysians hold eight million active buy-now-pay-later accounts carrying
RM5.3 billion, and 61% of us can't raise a thousand ringgit for an emergency.
The problem isn't BNPL -- it's that nothing shows you what one more commitment
does to you _before_ you take it. KIRA+ is an AI financial health platform
that consolidates every commitment you have, scores your financial health out
of 100, and lets you simulate a purchase before you make it. Kira dulu, baru
commit -- calculate first, then commit."

#### 1 minute

"Across 2025, Malaysians made 243 million BNPL transactions worth RM21.3
billion, and by the first quarter of 2026 held eight million active accounts
carrying RM5.3 billion. In the same country, 61% of people report difficulty
raising a thousand ringgit for an emergency.  
  
Those two facts aren't a scandal. They're a visibility problem. Commitments
live in five different apps, and every tool we have is retrospective -- it
describes the month you already had.  
  
KIRA+ sits at the moment before the decision. Enter your income, expenses and
commitments once. You get a transparent 0-to-100 score with all six factors
shown, every BNPL plan in one view, and a simulator: enter a purchase you
haven't made yet and see exactly what it does. For our demo user, a RM2,400
phone over twelve months takes her from 68 to 54 and halves her repayment
capacity. She can still buy it -- but now she knows.  
  
And the timing matters: the Consumer Credit Act 2025 now requires BNPL
providers to assess affordability against a customer's existing commitments.
That's the exact computation we perform."

#### 3 minutes -- the preliminary-round pitch

0:00-0:20

    **Hook.** "RM100 a month. Eleven seconds to accept. How long to understand?" Establish the asymmetry.
0:20-0:50

    **Problem + numbers.** 8.0m accounts and RM5.3bn outstanding at Q1 2026; 243m transactions worth RM21.3bn across 2025; +36.7% volume growth half-on-half. 61% cannot raise RM1,000. Cite the Ministry of Finance and BNM. Land the key line: _volume grew faster than value -- more commitments, not bigger ones_.
0:50-1:10

    **The gap.** Banking apps see banked debt. BNPL apps see their own plan. CTOS reports history. Nothing answers "what does one more do to me?"
1:10-2:15

    **KIRA+ and the demo.** Name, tagline, then straight into the simulator. Aisyah, 68 -> 54, buffer RM950 -> RM750. Then the alternative: 24 months costs 6 points, not 14. _This is the majority of your time. Protect it._
2:15-2:40

    **The AI, honestly.** Three layers. ROC-AUC 0.923 versus 0.844 for the score alone. Say the synthetic-data sentence in full.
2:40-3:00

    **Why now + close.** Consumer Credit Act 2025 created the obligation. "Kira dulu. Baru commit."

Cut, in this order, if you overrun: the gap, then the AI metrics detail, then
the business model. Never cut the demo.

#### 5 minutes -- the full deck

0:00-0:50

    Slides 1-3\. Hook, problem, numbers.
0:50-1:45

    Slides 4-6\. The gap, KIRA+, how it works.
1:45-2:45

    **Slide 7. The live demo.** A full minute. Do not rush it and do not narrate the interface -- narrate the consequence.
2:45-3:25

    Slide 8. The AI, three layers, honest metrics, the accuracy-versus-baseline admission.
3:25-3:55

    Slide 9. Why now -- the Consumer Credit Act.
3:55-4:30

    Slide 10. Business model, and the university-not-a-bank line.
4:30-5:00

    Slides 11-12\. National KPIs, roadmap in one line, close on the tagline and the specific ask.

Whoever presents: rehearse the transition _into_ the demo until it is
automatic. That handover is where most pitches lose their rhythm.

Part IV

## 3-Day Execution Playbook

Five people, five workstreams, three days. Two developers build; three do not
code. Everything anyone needs to do is on one board.

◆

### The three days

WORKSTREAM DAY 1 -- DATA + AI DAY 2 -- APPLICATION DAY 3 -- INTEGRATE + SHIP
Documentation Verify every source * validation survey Competitor matrix
verified cell by cell Panel pack * source register final Branding / UX Logo *
palette * type * UI kit Screen designs -> Dev 1 * slide visuals Deck built *
visual QA on the app Pitch / Business Deck copy from Part III * business model
Scripts learned * Q&A drilled Full rehearsals * mock judging Developer 1 Shell
* database * profile page Commitments * dashboard * SIMULATOR Polish * deploy
* video * rehearse Developer 2 SCORING ENGINE * synthetic * model Simulation *
warnings * templates LLM * tests * README * model card GATE: engine passes
T-01 GATE: simulator shows 68->54 GATE: 3 clean rehearsals

Figure 7 -- Three days, five lanes, three gates. If a gate is missed, the
response is to cut scope, never to extend the day.

Day 1 -- Data + AI

#### The engine must be right

**Gate:** the scoring engine passes T-01 (personas return 68/94/41/17) by end
of day. Nothing downstream can be trusted until this holds. Dev 1 builds the
shell and database in parallel; Persons 1-3 verify sources, build the brand,
and write deck copy.

Risk: Dev 2 over-engineers the model. The model is P1. The engine is P0.

Day 2 -- Application

#### The simulator must exist

**Gate:** the simulator visibly returns 68 -> 54 on screen by end of day. This
is the demo. Every other page can be rough at this point; this one cannot.

Risk: dashboard polish eats simulator time. Build the simulator before you
make the dashboard pretty.

Day 3 -- Integrate + ship

#### Nothing new gets built

**Gate:** three clean end-to-end rehearsals, one of them offline. Day 3 is for
tests, polish, deployment, the video and rehearsal. **No new feature starts on
day 3.**

Risk: someone starts a P2 feature. This is how good prototypes arrive broken.

#### Daily rhythm

Time| Event| Content  
---|---|---  
Start of day| **Stand-up, 10 minutes**|  Each person: what I finished, what I
am doing, what is blocking me. Ten minutes, standing, no laptops. Blockers get
an owner immediately.  
Midday| **Merge checkpoint**|  Both developers merge to `main` with tests
green. A three-day project cannot absorb a two-day merge conflict.  
End of day| **Gate review, 15 minutes**|  Is today's gate met? If not, what
gets cut -- not what gets extended. Decide in the room, write it down.  
Day 3 evening| **Mock judging, 30 minutes**|  Persons 1 and 2 play hostile
judges using Part V. Full pitch, then ten questions at random. Do this even if
you feel ready.  
  
◆

### Master Execution Board

One table. Five workstreams. Everything that happens over three days. If it is
not here, it does not happen this week.

All Documentation Branding / UX Pitch / Business Development 1 Development 2
Clear ticks

✓| Workstream| Owner| Day| Task| Pri| Dependency| Deliverable  
---|---|---|---|---|---|---|---  
| Documentation| Person 1| 1| Verify every statistic against its primary
source| P0| --| Appendix A completed with live URLs and access dates  
| Documentation| Person 1| 1| Confirm Consumer Credit Act commencement dates
against the gazette| P0| --| Verified dates, or an instruction not to state
one on stage  
| Documentation| Person 1| 1| Launch the validation survey (100-150
respondents)| P1| --| Live form: commitment count, can you name your total,
ever surprised  
| Documentation| Person 1| 2| Verify the competitor matrix cell by cell
against live product docs| P0| --| §16 re-issued with per-cell citations  
| Documentation| Person 1| 2| Pull the Consumer Credit Commission public
register for provider counts| P1| --| Institutional market size, sourced  
| Documentation| Person 1| 3| Assemble the panel documentation pack| P0| b1,
b4| Submission-ready concept document  
| Documentation| Person 1| 3| Close the survey and write up findings| P1| b3|
One slide of our own primary data -- worth more than any secondary statistic  
| Branding / UX| Person 2| 1| Finalise logo, palette, typography, iconography|
P0| --| Brand sheet + exported logo assets in the repository  
| Branding / UX| Person 2| 1| Build the UI kit: cards, gauge, chips, tables,
empty states| P0| b8| Component reference Dev 1 can implement directly  
| Branding / UX| Person 2| 2| Design all five screens, simulator first| P0|
b9| Screen designs handed to Dev 1 by midday  
| Branding / UX| Person 2| 2| Produce all 12 slide visuals and diagrams| P0|
b8| Visual assets for Part III  
| Branding / UX| Person 2| 3| Visual QA on the live app at 1280×720| P0|
D3-05| Defect list to Dev 1 by midday day 3  
| Branding / UX| Person 2| 3| Design the AKPK referral surface| P2| b10| A
responsible destination for users in genuine distress  
| Pitch / Business| Person 3| 1| Write all 12 slides from Part III| P0| --|
Deck copy complete, awaiting visuals  
| Pitch / Business| Person 3| 1| Finalise business model and commercialisation
narrative| P0| --| Slides 10-11 content locked  
| Pitch / Business| Person 3| 2| Assemble the deck with Person 2's visuals|
P0| b11, b14| Complete 12-slide deck  
| Pitch / Business| Person 3| 2| Learn the 30s, 1min, 3min and 5min scripts|
P0| b14| Delivered without notes  
| Pitch / Business| Person 3| 2| Drill all 34 judge questions in Part V| P0|
--| Answers to the ten hardest delivered in under 30 seconds each  
| Pitch / Business| Person 3| 3| Three full rehearsals with the live app| P0|
b16, D3-07| Timed, clean, no improvisation  
| Pitch / Business| Person 3| 3| Mock judging with hostile questioning| P0|
b19| Weak answers identified and rewritten  
| Development 1| Dev 1| 1| Streamlit shell, five pages, theme, disclosure
notice D1-07| P0| D1-01| Navigable app skeleton  
| Development 1| Dev 1| 1| Database schema and initialisation D1-08| P0|
D1-01| Four tables, constraints, indices  
| Development 1| Dev 1| 1| Profile page with demo personas D1-09| P0| b22|
Profile persists; four one-click personas  
| Development 1| Dev 1| 2| Commitments page and aggregator D2-01| P0| b23|
Aggregate card and per-commitment table  
| Development 1| Dev 1| 2| Dashboard: gauge, factors, warnings D2-02| P0|
D2-05| Aisyah renders 68 with six factors  
| Development 1| Dev 1| 2| **Simulator page** D2-03| P0| D2-04| **68 -> 54
visible on screen. The day-2 gate.**  
| Development 1| Dev 1| 3| Model wiring, About page, polish, error boundaries
D3-02/03/05/09| P0| b26| No traceback reachable; projector-ready  
| Development 1| Dev 1| 3| Deploy and record the demo video D3-07/12| P0| b27|
Public URL + committed video  
| Development 2| Dev 2| 1| Repository skeleton D1-01| P0| --| Both devs
running locally within the first hour  
| Development 2| Dev 2| 1| **Scoring engine + persona fixtures** D1-02/03| P0|
b29| **T-01 passes: 68/94/41/17. The day-1 gate.**  
| Development 2| Dev 2| 1| Synthetic generator, Monte-Carlo labels, model
D1-04/05/06| P1| b30| ROC-AUC ≥ 0.90; model card written  
| Development 2| Dev 2| 2| Simulation engine D2-04| P0| b30| Before / after /
deltas / alternatives  
| Development 2| Dev 2| 2| Warning engine and template explainer D2-05/06| P0|
b30| Six rules; templates that work with no LLM  
| Development 2| Dev 2| 2| Knowledge base D2-07| P1| --| 20-40 sourced
literacy entries  
| Development 2| Dev 2| 3| LLM service with guard and fallback D3-01/06| P1|
b33| Works with the key removed; guard proven by test  
| Development 2| Dev 2| 3| Full test suite, README, model card D3-04/08/11|
P0| b35| Twelve tests green; a stranger can clone and run  
| Development 2| Dev 2| 3| Joint demo rehearsal D3-10| P0| b28| Three clean
runs, one offline  
Ticks are stored in your own browser only -- they are not shared with the rest
of the team and are not sent anywhere.

Three ways this project fails, and how to avoid each

**1\. The developers build features instead of the demo.** Six working
features nobody can show beat nothing. One polished simulator beats six rough
features. Build in priority order and stop.  
**2\. The three non-developers wait for the app.** Nothing in the
Documentation, Branding or Pitch lanes depends on working code. Person 3 can
write all twelve slides on day 1 from Part III. Waiting is a choice, and it is
the wrong one.  
**3\. Somebody starts a P2 feature on day 3.** The repayment optimiser is
genuinely a good idea. It is also how a working demo becomes a broken one at
11pm the night before.

Part V

## Judge Q&A

Thirty-four questions across every category a panel will probe. Each carries
the concern behind the question, the answer, the evidence you need at hand,
and the thing that loses the room.

◆

### Questions & answers

How to use this

Person 3 owns all 34. Both developers must own Q1-Q12 cold. Every answer
should land in under thirty seconds -- a long answer to a hard question reads
as evasion. Where an answer begins by conceding something, **keep the
concession** : it is doing the work.

#### Technical

Q1 You built this in three days. What is actually working versus mocked?

Concern

    Is this a real artifact or a clickable prototype?
Answer

    "All six core features are live. The scoring engine is deterministic Python you can read; the model is a Random Forest trained in the repository; the simulator recomputes the whole picture in real time. Nothing on that screen is a mock. What is _not_ real is the data -- every profile is synthetic, and that is a deliberate choice, not a shortcut."
Evidence

    The public URL, the repository, the passing test suite.
Never say

    "Mostly working." "The backend is nearly done."

Q2 Streamlit and SQLite -- this isn't production architecture.

Concern

    Do they understand the difference between a prototype and a system?
Answer

    "Correct, and deliberately so. Part II §29 lists every layer and what triggers replacing it: FastAPI when we have an external consumer, PostgreSQL when we have real user data, a model registry when we retrain on real outcomes. The domain layer has no framework dependency at all, so it lifts into a service unchanged. Building microservices for a three-day prototype would have been the actual mistake."
Evidence

    Part II §29, and the fact that `utils/scoring.py` imports nothing.
Never say

    "Streamlit scales fine."

Q3 How long does a score take, and what happens at 10,000 concurrent users?

Concern

    Have they thought about load at all?
Answer

    "A score is a pure function -- under five milliseconds, no I/O. Model inference is under fifty. Neither is the bottleneck. At 10,000 concurrent users the constraints are the Streamlit process and the LLM API, which is why the production path is a stateless FastAPI service behind a load balancer, with LLM explanations cached by band and factor pattern. The expensive part is the only part that is optional."
Evidence

    Part II §1 non-functional targets.
Never say

    "We haven't load tested." without immediately giving the reasoning above.

Q4 What is your biggest technical risk?

Concern

    Self-awareness. They want to see whether you know.
Answer

    "Data quality at input. Everything downstream is arithmetic on numbers the user typed. If someone under-reports their expenses, their score is wrong and we have no way to know. That is the real argument for Phase 4 consented data integration -- not convenience, correctness."
Evidence

    Risk R7 and the Phase 4 gate.
Never say

    "Nothing really." Or a trivial risk chosen to look safe.

#### AI & model

Q5 If your rules generate the labels, what is the model actually learning?
HARDEST

Concern

    Circular ML. This is the question that separates teams who ran a notebook from teams who designed a pipeline.
Answer

    "They don't. The rules produce the KIRA Score, which is deterministic and never involves the model. The model's target is different: the outcome of a Monte-Carlo simulation of twelve months of household cash flow -- income shocks, expense volatility, lumpy costs, commitments expiring, new ones taken on, all driven partly by a behavioural factor the model never sees. That target is not a function of the input features, so there is real signal and real irreducible noise. Held-out ROC-AUC is 0.923 against 0.844 for the deterministic score alone. That 0.079 gap is what the model adds."
Evidence

    Part II §9, both baselines, `models/monte_carlo.py`.
Never say

    "The model learns the rules very accurately." That is the answer that loses the round.

Q6 Why not deep learning?

Concern

    Are they choosing tools or following fashion?
Answer

    "Nine tabular features and twelve thousand rows. A Random Forest is the correct model for that shape -- it trains in seconds, gives feature importances for free, and cannot silently diverge. A neural network would be slower, less interpretable and no more accurate. In a domain where explainability is a commercial asset, opacity has to earn its place, and here it cannot."
Evidence

    Part II §11.
Never say

    "We didn't have time."

Q7 Your accuracy is 85.3%. What is the baseline?

Concern

    Do they understand class imbalance, or are they quoting a flattering number?
Answer

    "85.7% -- higher than ours. Predicting 'no stress' for everyone beats our model on accuracy and is completely useless. That is exactly why we tuned for recall: we catch 79% of the at-risk cases, and we report ROC-AUC of 0.923 as the headline. For an early-warning system, a false alarm costs a moment of attention and a miss costs a household. We would rather over-warn."
Evidence

    Part II §9 baseline table.
Never say

    Anything that avoids the admission. Volunteer it on slide 8 before anyone asks.

Q8 How do you stop the LLM giving financial advice or inventing numbers?

Concern

    LLM safety in a financial context.
Answer

    "Three layers. It receives a fixed JSON payload of already-computed values and nothing else -- it never sees a raw profile. Its system prompt forbids computing, recommending or using the words 'you should'. And every numeral in its output is checked against the payload; anything not present voids the response and we render a template instead. The app is fully functional with no API key at all."
Evidence

    Part II §4 payload and prompt, test T-10.
Never say

    "We prompt it carefully." Prompting is not a control.

Q9 Why weight debt burden at 25%? Where did these numbers come from?

Concern

    Are the weights principled or arbitrary?
Answer

    "They are our judgement, informed by publicly discussed debt-service practice and the standard six-month emergency-fund guideline -- and we label them as assumptions everywhere they appear. They are not empirically fitted, because we have no outcome data to fit them to. What we _can_ tell you is that our own model disagrees with us: DSR carries 25% of the score weight but only 5.8% model importance, while commitment ratio carries 22.5% importance and no score weight. On real data, that mismatch is the first thing we would investigate."
Evidence

    Part II §11 importances, §12 anchor table.
Never say

    "They're industry standard." They are not, and someone will know.

Q10 How do you know the model is not biased?

Concern

    Fairness in a financial model.
Answer

    "Structurally: it uses no demographic features at all. No age, gender, ethnicity, postcode, occupation or education. Every input is cash-flow arithmetic, so there is no protected attribute to discriminate on. The honest caveat is that we keep income as a feature, because affordability is genuinely income-relative -- and income correlates with socioeconomic status. Subgroup performance testing on real data is a Phase 4 requirement and we would not deploy without it."
Evidence

    Part II §10 feature list, risk R2.
Never say

    "Our model is unbiased."

#### Data

Q11 Everything is synthetic. Why should we believe any of it?

Concern

    Does synthetic data invalidate the whole demonstration?
Answer

    "It validates the pipeline, not the predictions -- and we say so on the slide, in the app and in the README. What synthetic data _does_ prove is that the engine is correct, the architecture works, the explanations generate and the simulator computes. What it cannot prove is real-world accuracy, and we make no such claim. Phase 4 is consented real data with observed outcomes; that is when the model becomes predictive rather than demonstrative."
Evidence

    The disclosure sentence, verbatim, in three places.
Never say

    "Our synthetic data is realistic enough."

Q12 How did you generate the synthetic profiles?

Concern

    Is the generator principled, or noise dressed as data?
Answer

    "Log-normal income, expense share falling with income the way Engel's law predicts, BNPL commitment counts drawn from a plausible distribution over realistic instalment sizes, and an unobserved behavioural factor that drives take-up and expense volatility. Twelve thousand profiles, roughly 40/26/33 across our three bands. The generator is in the repository and every seed is fixed -- you can reproduce every number in our deck."
Evidence

    `models/generate_synthetic.py`.
Never say

    "We used random numbers."

Q13 Where do you get real data from, and who consents?

Concern

    Is there a credible path off synthetic data?
Answer

    "Three routes, in order. First, users entering their own data in a pilot -- that is consent by definition and it is available to us immediately. Second, an institutional pilot where an employer or university cohort opts in. Third, and only much later, consented provider-supplied data under a data-sharing agreement. The consumer consents in every case; we never receive data about someone who has not asked us to look at it."
Evidence

    Roadmap phases 1-4.
Never say

    "We'll partner with banks to get data." without the consent mechanism attached.

#### Privacy & cybersecurity

Q14 Are you PDPA compliant?

Concern

    Will they overclaim on regulation? This question is often a trap.
Answer

    "No, and we will not claim to be. The prototype follows privacy-by-design principles and would require formal PDPA and legal review before production deployment. Concretely: we collect seven numeric fields and no identifiers, we store no real user data in the demo, and the architecture is built so that identity is never an input."
Evidence

    Part II §20.
Never say

    "Yes." "Fully compliant." "We follow PDPA."

Q15 You are holding people's complete financial picture. What happens when you
are breached?

Concern

    Breach consequences in a high-sensitivity domain.
Answer

    "In the prototype, nothing -- because there is nothing to take. No names, no emails, no IC numbers, no account numbers, no real profiles. The strongest security control we have is architectural: we don't collect it. In production the requirements are encryption at rest and in transit, field-level encryption on financial values, audit logging, penetration testing and an incident response plan. Cybersecurity is our team's strongest area and Part II §19 has the full threat model."
Evidence

    Part II §19 STRIDE table.
Never say

    "We use HTTPS." as a complete answer.

Q16 Why is there no login?

Concern

    Is this an oversight or a decision?
Answer

    "A decision. Authentication implies accounts, accounts imply stored credentials and persistent personal financial data on a free public host. We chose not to hold that in a three-day prototype. The absence of a login is a consequence of the absence of stored personal data, and that ordering is deliberate."
Evidence

    Part II §21.
Never say

    "We ran out of time."

Q17 If institutions license this, do they see individual user data?

Concern

    Whose side is the product really on?
Answer

    "Never without that individual's explicit, revocable consent. Employer and university deployments get cohort-level anonymised reporting with a minimum cohort size -- distributions, not people. We do not sell user data and we do not run a lead-generation model that steers users toward credit products. Both would make our entire proposition a lie, and the trust is the product."
Evidence

    Part I §13 commercial boundary, Figure 2.
Never say

    Anything that leaves room for "anonymised data sales" as a revenue line.

#### Business & commercialisation

Q18 Who pays, and why would they?

Concern

    Is there a real buyer?
Answer

    "Institutions, not consumers. BNPL providers now have a statutory duty to assess affordability against a customer's existing commitments -- and no provider can see the others'. That is the capability we sell. Employers and universities pay per seat for a wellness benefit with cohort reporting. Consumers pay nothing, because charging financially stressed people to discover they are financially stressed is both a bad business and a worse product."
Evidence

    Part I §13, §15.
Never say

    "Freemium, then a premium tier." without explaining what a stressed user would pay for.

Q19 What is your first paying customer, realistically?

Concern

    Commercial realism.
Answer

    "A university or a mid-sized employer -- not a bank. A defined cohort, an existing financial literacy obligation, no core-banking integration, and a procurement cycle measured in weeks rather than quarters. One pilot there gives us the behavioural evidence that makes the BNPL-provider conversation possible at all."
Evidence

    Part I §15, §17.
Never say

    "Maybank." Naming a large bank as your first customer signals you have never sold to one.

Q20 What is your pricing?

Concern

    Will they invent a number?
Answer

    "We have not set one, and we would rather say that than invent it. The _structure_ is validated: seats per year for programmes, per-assessment for providers, unit price falling with volume. Part I §15 has an illustrative table with every price point labelled as an assumption. Price discovery happens in the first pilot."
Evidence

    Part I §15 unit economics, explicitly labelled.
Never say

    A confident ringgit figure. A judge who works in the sector will know it is fabricated.

Q21 What is your market size?

Concern

    Do they understand their own market, or have they produced a TAM pyramid?
Answer

    "8.0 million active BNPL accounts as of Q1 2026, per the Ministry of Finance -- up 23% in nine months, with transaction volume growing 37% half-on-half. We deliberately do not present a ringgit TAM, because we would have to invent pricing to compute one. The number we actually need -- how many users hold two or more concurrent commitments -- is not published, and we can get it ourselves with a survey. That is our first validation task."
Evidence

    Part I §15 funnel.
Never say

    "It's a multi-billion ringgit market."

Q22 Why would a BNPL provider help users borrow less?

Concern

    Is the incentive alignment real or wishful?
Answer

    "Two reasons, and the first is not goodwill. They now have a statutory obligation to assess affordability against existing commitments, and they cannot see those commitments. Second, delinquency is a direct cost -- a customer who defaults is worse for them than a customer who buys a smaller item. We are not asking them to sell less; we are helping them lend to people who can repay."
Evidence

    Consumer Credit Act obligations; BNM overdue figures.
Never say

    "It's good for their brand." as the primary argument.

Q23 How do you acquire consumers if you have no marketing budget?

Concern

    Distribution.
Answer

    "We don't acquire them one at a time -- that is why the model is B2B2C. Distribution comes through the institutions: a university deploys to five thousand students, an employer to its workforce, an e-wallet embeds the check at checkout. Direct consumer acquisition is the most expensive route to the same user and we are not attempting it."
Evidence

    Figure 2, §15.
Never say

    "Social media and word of mouth."

#### Competition

Q24 What stops a bank building this in a month?

Concern

    Defensibility.
Answer

    "Nothing technical -- and we should be honest that the engine is not the moat. What a bank cannot do is see non-bank BNPL commitments across providers. Their view stops at their own products. A consumer-consented consolidated view is a different structural position, not a harder algorithm. Our defensibility is consented multi-provider coverage and neutrality -- we are the only party in the picture not selling credit."
Evidence

    §16 "where each competitor would beat us".
Never say

    "Our algorithm is proprietary." We publish it. That is the point.

Q25 How is this different from CTOS?

Concern

    Are they duplicating national credit infrastructure?
Answer

    "Completely different construct. CTOS is a credit bureau: authoritative, backward-looking, built so lenders can assess you. KIRA+ is forward-looking, built so _you_ can assess a decision you have not made yet. We do not predict a CTOS score, we do not replace one, and we say so explicitly in the product. If anything, we are complementary -- and a future integration, not a competitor."
Evidence

    Part I §2 "is not" list.
Never say

    "We're like CTOS but better."

Q26 Doesn't my banking app already show me all this?

Concern

    Is the gap real for someone who has never held a BNPL plan?
Answer

    "It shows you your bank's products, and it shows you what already happened. Ask it what a RM2,400 phone over twelve months would do to your position and it has no answer -- and it cannot see the three BNPL plans you hold with non-bank providers. Both of those are structural, not feature gaps."
Evidence

    §16 matrix.
Never say

    "Banking apps are bad."

#### Government, regulation & ESG

Q27 Have you spoken to BNM, MoF or the Consumer Credit Commission?

Concern

    Verifying a claim of institutional traction.
Answer

    "No. We have no contact, no discussion and no endorsement, and we would not imply otherwise. What we have is alignment with published material: the National Strategy for Financial Literacy 2026-2030 sets a target of cutting the share of Malaysians unable to raise RM1,000 from 61% to 45%, and we are an instrument for a target that already exists."
Evidence

    NSFL 2026-2030 KPI table.
Never say

    "We're in early conversations." if you are not. It is checkable and it is fatal.

Q28 Does the Consumer Credit Commission's regime cover you?

Concern

    Regulatory awareness.
Answer

    "We do not provide credit, make lending decisions or report to credit bureaus, so on the face of it the registration regime targets a different activity. But we will not assert that we fall outside a regime we have had no legal advice on. The position requires determination by counsel, and we have designed so that if registration were required it would be an adjustment rather than an existential problem."
Evidence

    Risk R13.
Never say

    "We're not regulated." as a flat statement.

Q29 Is this financial advice?

Concern

    The liability question.
Answer

    "No, and the product is written so that it cannot drift into it. We state consequence, never recommendation. The simulator says 'this would leave you RM750 a month instead of RM950' -- it never says 'you cannot afford this' or 'you should not buy this'. Those phrases are banned in the codebase. The user keeps the decision; we are accountable only for the arithmetic and the clarity."
Evidence

    Part II §14 banned wording.
Never say

    "We just have a disclaimer."

Q30 What is your actual measurable social impact?

Concern

    Impact-washing. ESG is 15% of the score and judges are practised at spotting adjectives.
Answer

    "None yet, and we will not claim any. What we have is a mechanism and a measurement plan: median emergency runway across a cohort over six months, average concurrent commitments per active user, and pre/post understanding of debt-service ratio. All three map to published NSFL indicators. Ask us again after the pilot and we will have numbers instead of a plan."
Evidence

    Part I §19 indicator table.
Never say

    "We will help millions of Malaysians."

Q31 Are you not just discouraging consumption and hurting merchants?

Concern

    A contrarian challenge, often from a commercially minded judge.
Answer

    "We are not an abstinence tool. Look at the model: stretching the same RM2,400 purchase from twelve months to twenty-four costs six points instead of fourteen. It rewards better structure, not less spending. And a customer who defaults is worse for a merchant and a provider than one who buys sensibly and comes back. Informed consumption is more durable than fast consumption."
Evidence

    §10 scenario table -- the furniture row.
Never say

    "People buy too much stuff."

#### Scalability & team

Q32 Does this work outside Malaysia?

Concern

    Regional ambition versus over-reach.
Answer

    "Architecturally yes, immediately -- nothing in the engine is Malaysia-specific. The _anchors_ are: what counts as a healthy debt-service ratio, typical income and expense structures, which commitment types exist. Moving to Indonesia or the Philippines is a recalibration and localisation exercise, not a rebuild. But we would not attempt it before we have proved the model works in one market."
Evidence

    Part I §20.
Never say

    "We're going regional in year one."

Q33 Five students. Why should we believe you can execute?

Concern

    Team credibility.
Answer

    "Because you are looking at three days of evidence. Working application, deployed, tested, with a documented engine you can reproduce and a repository you can clone. We also scoped honestly -- we cut CTOS prediction, bank integrations and a mobile app because they were not buildable in the time, and we wrote down why. Knowing what to cut is the part most teams get wrong."
Evidence

    The live app, the repository, Part I §24.
Never say

    "We're very passionate."

Q34 What would you do with three months instead of three days?

Concern

    Do they have a roadmap or a wish list?
Answer

    "Three things, in order. Run one institutional pilot with real users to test whether manual entry actually completes -- that is our largest unproven assumption. Collect real outcome data so the model trains on observed delinquency instead of simulation. And obtain legal review on PDPA and our position relative to the Commission. Notice that none of those are features. The features are the easy part."
Evidence

    Roadmap phases 1-4.
Never say

    A list of new features.

The universal fallback

If a question arrives that nobody has prepared for: _" We haven't established
that. Here is what we would need to find out, and here is how we would test
it."_ That answer scores. Guessing does not, and a judge can always tell the
difference.

Part VI

## Appendices

Sources, glossary, reference implementation, and the self-review this document
was checked against.

A

### Source Register

Person 1 owns this appendix

Every figure in this document traces to a row below. Before the preliminary
submission, open each source, confirm the figure, and record the access date.
If a figure cannot be confirmed, remove it from the deck -- do not soften it,
remove it.

Ref| Figure used| Source| Type  
---|---|---|---  
S1| **8.0m active BNPL accounts (Q1  2026)**; 7.5m (Dec 2025); 6.5m (Jun
2025)| Ministry of Finance (Q1 2026); BNM Financial Stability Review 2H 2025|
Verified  
S2| **RM5.3bn outstanding BNPL (Q1  2026)**; RM4.9bn (Dec 2025); RM3.8bn (Jun
2025)| Ministry of Finance; BNM FSR 2H 2025| Verified  
S3| **243m transactions / RM21.3bn across 2025, averaging RM91** ; 140.3m /
RM11.9bn (2H 2025); 102.6m / RM9.3bn (1H 2025)| Ministry of Finance; BNM
Financial Stability Review 2H 2025| Verified  
S4| Overdue RM181m at Q1 2026 (3.4% of balances); RM160.2m at end-2025 (3.3%)|
Ministry of Finance| Verified  
S5| BNPL = 0.3% of total household debt| Bank Negara Malaysia / Ministry of
Finance| Verified  
S6| 61% have difficulty raising RM1,000 (2021: 47%); 26% feel over-indebted;
12% highly indebted; 26% run short of money; 58% try to save; 92% use digital
financial services; 37% can cover >3 months, 18% >6 months| BNM Financial
Capability & Inclusion Demand Side Survey 2024 (n = 3,587, aged 15+),
published in BNM Annual Report 2024| Verified  
S7| NSFL 2026-2030 five priorities; KPI targets: RM1,000 emergency 61% ->
≤45%; over-indebtedness 26% -> ≤15%; digital financial literacy 42.2 -> ≥55;
MYFLIC 59.1 -> ≥65| Financial Education Network, Malaysia National Strategy
for Financial Literacy 2026-2030| Verified  
S8| Consumer Credit Act 2025: Consumer Credit Commission under MoF; licensing
and registration; mandatory creditworthiness and affordability assessment
accounting for existing commitments and DSR; disclosure of terms and fees.
Licensing effective 1 June 2026; existing operators must apply by 30 November
2026| Consumer Credit Act 2025; Ministry of Finance| Verified -- conduct
standards not yet published  
S9| 47% living paycheck to paycheck; 39% of middle-income save RM500 or less;
26% unaware of credit scores| RinggitPlus Malaysian Financial Literacy Survey
2025 (n = 3,113)| Verified  
S10| Average BNPL transaction RM91 (2025); average outstanding per account
~RM663 (Q1 2026); ~3 transactions per account per month| Ministry of Finance;
our arithmetic on S1 and S3| Verified / derived  
S11| Model metrics: ROC-AUC 0.923 held-out, 0.921 ± 0.005 CV, recall 0.790,
Brier 0.097; baselines 0.500 and 0.844; accuracy 0.853 vs majority 0.857|
KIRA+ reference pipeline, 12,000 synthetic profiles, seed 42| Prototype  
S12| Scoring weights, anchors and the multi-commitment penalty| Team
judgement, informed by publicly discussed debt-service practice and standard
emergency-fund guidance| Assumption  
S13| Persona income, expense and savings levels| Constructed to exercise every
branch of the engine| Prototype  
S14| All pricing and unit economics| Illustrative only. No vendor quotes
obtained.| Assumption  
S15| Competitor capability matrix| Publicly observable product behaviour, not
verified per cell| Assumption -- verify before semi-final  
S16| MAIC evaluation weights (25/25/20/15/15)| As briefed to the team|
Assumption -- confirm against the official rubric  
S17| More than 70% of BNPL users are in the B40 income group| Ministry of
Finance via Bernama, 2026. **B40 is a household income classification -- do
not restate it as an individual salary threshold.**| Verified  
S18| BNPL commitments do not currently appear in CCRIS or CTOS credit reports|
Secondary sources; the Act's credit-reporting position is **contested**
between sources and the Commission's conduct standards were unpublished as of
March 2026| Settle before the semi-final  
  
B

### Glossary

Term| Meaning as used in this document  
---|---  
**AKPK**|  Agensi Kaunseling dan Pengurusan Kredit -- Malaysia's credit
counselling and debt management agency.  
**Anchor**|  The two values at which a scoring factor scores 0 and 100.
Published in Part II §12.  
**BNPL**|  Buy Now, Pay Later -- short-tenure instalment credit, typically at
the point of purchase.  
**BNM**|  Bank Negara Malaysia, the central bank.  
**Buffer**|  Monthly disposable income after fixed expenses, variable expenses
and all debt repayments.  
**CCC**|  Consumer Credit Commission -- the body established under the
Consumer Credit Act 2025 to oversee non-bank credit providers.  
**CCRIS**|  Central Credit Reference Information System, operated by BNM.  
**Commitment ratio**|  Total monthly outflow (expenses plus all debt service)
divided by income.  
**Coverage**|  Monthly buffer divided by monthly debt service. How many times
over the slack covers the obligations.  
**CTOS**|  A licensed Malaysian credit reporting agency.  
**DSR**|  Debt Service Ratio -- total monthly debt repayments divided by
income.  
**FEN**|  Financial Education Network -- the inter-agency body behind the
National Strategy for Financial Literacy.  
**KIRA Score**|  Our deterministic 0-100 financial health score. Never
produced by a model.  
**Monte-Carlo label**|  The binary target our model learns: whether a
simulated 12-month cash path went negative.  
**NSFL**|  National Strategy for Financial Literacy 2026-2030.  
**PDPA**|  Personal Data Protection Act (Malaysia).  
**PTPTN**|  Malaysia's national higher education student loan fund.  
**Runway**|  Savings divided by total monthly outflow, expressed in months.  
**ROC-AUC**|  Area under the receiver operating characteristic curve. 0.5 is
random; 1.0 is perfect. Robust to class imbalance, which is why we use it as
the headline.  
**Brier score**|  Mean squared error of predicted probabilities. Lower is
better; it measures calibration, not just ranking.  
  
C

### Reference Scoring Implementation

Copy this into `utils/scoring.py`. It is the complete engine, it imports
nothing, and it produces every score quoted in this document.

    
    
    """KIRA+ deterministic financial health scoring engine.
    
    Pure Python. No third-party imports. No I/O. No randomness.
    Every score in the KIRA+ master package is produced by this file.
    """
    
    ENGINE_VERSION = "1.0.0"
    
    WEIGHTS = {
        "debt_burden":        25,
        "bnpl_exposure":      20,
        "disposable_income":  20,
        "emergency_buffer":   15,
        "repayment_capacity": 12,
        "savings_resilience":  8,
    }
    
    # (value scoring 0, value scoring 100)
    ANCHORS = {
        "dsr":            (0.45, 0.05),
        "bnpl_ratio":     (0.20, 0.02),
        "buffer_ratio":   (0.00, 0.30),
        "runway_months":  (0.0,  6.0),
        "coverage":       (0.0,  2.0),
        "savings_months": (0.0,  3.0),
    }
    
    PENALTY_THRESHOLD  = 3     # commitments above this are penalised
    PENALTY_PER_EXTRA  = 3.0   # points per extra commitment
    PENALTY_CAP        = 10.0
    
    
    def _clamp(x, lo=0.0, hi=100.0):
        return max(lo, min(hi, x))
    
    
    def _lin(value, zero_at, full_at):
        """Piecewise-linear map to 0-100. Handles both directions."""
        if full_at == zero_at:
            return 100.0
        return _clamp(100.0 * (value - zero_at) / (full_at - zero_at))
    
    
    def derive_features(income, fixed, variable, bnpl_monthly,
                        loan_monthly, savings, n_bnpl):
        if income <= 0:
            raise ValueError("income must be greater than 0")
        debt    = bnpl_monthly + loan_monthly
        outflow = fixed + variable + debt
        buf     = income - outflow
        return {
            "debt":             debt,
            "outflow":          outflow,
            "buffer_rm":        buf,
            "dsr":              debt / income,
            "bnpl_ratio":       bnpl_monthly / income,
            "buffer_ratio":     buf / income,
            "runway_months":    savings / outflow if outflow else 12.0,
            "coverage":         (buf / debt) if debt > 0 else 99.0,
            "savings_months":   savings / income,
            "commitment_ratio": outflow / income,
            "n_bnpl":           n_bnpl,
        }
    
    
    def subscores(f):
        return {
            "debt_burden":        _lin(f["dsr"],            *ANCHORS["dsr"]),
            "bnpl_exposure":      _lin(f["bnpl_ratio"],     *ANCHORS["bnpl_ratio"]),
            "disposable_income":  _lin(f["buffer_ratio"],   *ANCHORS["buffer_ratio"]),
            "emergency_buffer":   _lin(f["runway_months"],  *ANCHORS["runway_months"]),
            "repayment_capacity": 100.0 if f["debt"] == 0
                                  else _lin(f["coverage"],  *ANCHORS["coverage"]),
            "savings_resilience": _lin(f["savings_months"], *ANCHORS["savings_months"]),
        }
    
    
    def penalty(f):
        extra = max(0, f["n_bnpl"] - PENALTY_THRESHOLD)
        return min(PENALTY_CAP, PENALTY_PER_EXTRA * extra)
    
    
    def band(score):
        if score >= 70: return "LOW RISK"
        if score >= 45: return "MODERATE RISK"
        return "HIGH RISK"
    
    
    def kira_score(income, fixed, variable, bnpl_monthly,
                   loan_monthly, savings, n_bnpl):
        f = derive_features(income, fixed, variable, bnpl_monthly,
                            loan_monthly, savings, n_bnpl)
        s = subscores(f)
        contributions = {k: WEIGHTS[k] * s[k] / 100.0 for k in WEIGHTS}
        weighted = sum(contributions.values())
        p        = penalty(f)
        total    = int(round(_clamp(weighted - p)))
        return {
            "score":          total,
            "band":           band(total),
            "features":       f,
            "subscores":      s,
            "contributions":  contributions,
            "penalty":        p,
            "engine_version": ENGINE_VERSION,
        }
    
    
    def simulate(profile, price, tenure_months):
        if price <= 0 or tenure_months < 1:
            raise ValueError("price must be positive and tenure at least 1 month")
        monthly = round(price / tenure_months)
        before  = kira_score(**profile)
        after   = kira_score(**{**profile,
                                "bnpl_monthly": profile["bnpl_monthly"] + monthly,
                                "n_bnpl":       profile["n_bnpl"] + 1})
        return {
            "monthly":       monthly,
            "before":        before,
            "after":         after,
            "delta_score":   after["score"] - before["score"],
            "delta_buffer":  after["features"]["buffer_rm"]
                             - before["features"]["buffer_rm"],
            "band_changed":  after["band"] != before["band"],
        }
    
    
    # ---- fixtures: these MUST return 68 / 94 / 41 / 17 (test T-01) ----
    PERSONAS = {
        "aisyah":  dict(income=4500, fixed=1984, variable=1216,
                        bnpl_monthly=250, loan_monthly=100, savings=2250,  n_bnpl=2),
        "daniel":  dict(income=7200, fixed=2600, variable=1300,
                        bnpl_monthly=0,   loan_monthly=850, savings=26000, n_bnpl=0),
        "weijian": dict(income=3400, fixed=1500, variable=900,
                        bnpl_monthly=310, loan_monthly=260, savings=900,   n_bnpl=4),
        "farah":   dict(income=2900, fixed=1450, variable=780,
                        bnpl_monthly=430, loan_monthly=180, savings=350,   n_bnpl=5),
    }
    
    if __name__ == "__main__":
        for name, p in PERSONAS.items():
            r = kira_score(**p)
            print(f"{name:9s} {r['score']:3d}  {r['band']}")
        sim = simulate(PERSONAS["aisyah"], 2400, 12)
        print(f"\naisyah + RM2,400/12mo: "
              f"{sim['before']['score']} -> {sim['after']['score']} "
              f"(buffer {sim['before']['features']['buffer_rm']:.0f} -> "
              f"{sim['after']['features']['buffer_rm']:.0f})")

Expected output: `aisyah 68 MODERATE RISK / daniel 94 LOW RISK / weijian 41
HIGH RISK / farah 17 HIGH RISK`, then `aisyah + RM2,400/12mo: 68 -> 54 (buffer
950 -> 750)`.

D

### Self-Review Against the Brief

The seventeen checks this document was required to pass before publication,
answered honestly.

#| Check| Verdict  
---|---|---  
1| Can this MVP actually be built in 3 days?| **Yes.** ~26 hours per developer
across three days, excluding P2 items, against a 3×12h budget. The slack is
deliberate.  
2| Are we trying to build too much?| **No -- and we cut to get here.** CTOS
prediction, all API integrations, mobile, microservices and authentication are
explicitly out. Three optional features are gated behind every P0 and P1
closing.  
3| Is AI genuinely being used?| **Yes, in one place, honestly.** A Random
Forest predicting a Monte-Carlo target that is not a rule output, beating the
deterministic score by 0.079 AUC. The score itself is deliberately not ML, and
we say why.  
4| Is the AI technically defensible?| **Yes.** Both baselines reported, class
imbalance addressed openly, the accuracy-below-baseline result volunteered
rather than hidden, feature importances published including where they
disagree with our weights.  
5| Are we overclaiming?| **We have actively removed overclaims.** No TAM
figure, no revenue forecast, no PDPA compliance claim, no government contact
claim, no "first" or "only", no real-world accuracy claim, no invented vendor
pricing.  
6| Is the business model realistic?| **Yes, with the weak point named.** B2B2C
with a university or employer as first customer, not a bank. Willingness to
pay is unproven and is listed as risk R12.  
7| Is the government adoption story credible?| **Yes.** It rests entirely on
two published NSFL 2026-2030 KPIs and the Consumer Credit Act. No claimed
contact with any agency.  
8| Is privacy addressed?| **Yes.** Architecturally -- seven numeric fields, no
identifiers, no real data in the demo -- with the exact non-compliance wording
fixed in Part II §20.  
9| Is cybersecurity addressed?| **Yes.** Control table plus an abbreviated
STRIDE model, with information disclosure named as the primary risk and
mitigated by not collecting data.  
10| Does the product solve one core problem?| **Yes.** Pre-decision visibility
of cumulative commitment impact. Every feature serves the simulator; nothing
in the MVP is unrelated to it.  
11| Does the demo clearly show the value?| **Yes.** 68 -> 54, buffer RM950 ->
RM750, in sixty rehearsed seconds -- plus the alternative that costs six
points instead of fourteen.  
12| Does the pitch align with the judging criteria?| **Yes** -- mapped
criterion by criterion in the front matter, with the evidence location and the
mark-mover named for each.  
13| Can the developers start coding immediately?| **Yes.** Dev 1 starts at
`D1-07`, Dev 2 at `D1-01`. Complete engine in Appendix C, schema in §18, API
contracts in §17, twelve tests in §23.  
14| Can a panelist understand the concept from Part I alone?| **Yes** -- 27
sections from executive summary to conclusion, with verified sources, personas
carrying real computed numbers, and limitations stated up front.  
15| Can a developer build the MVP from Part II alone?| **Yes** -- 29 sections,
every component with purpose, input, process, output, technology, owner,
dependencies and acceptance criteria.  
16| Can the pitch team build the deck from Part III?| **Yes** -- twelve slides
with objective, exact content, headline, data, visual, diagram, speaker notes,
timing and an explicit "not on this slide" list, plus four scripts.  
17| Can all five members use the execution board without confusion?| **Yes**
-- 37 rows across five workstreams, each with owner, day, priority, dependency
and deliverable, filterable by lane.  
  
Priority order, if anything has to give

Working MVP  >  clear problem  >  strong AI  >  strong demo  >  commercial
story  >  polished documentation.

This document is last on that list. If reading it is ever competing with
building the simulator, close it and go build the simulator.

**KIRA+ Master Package v1.0** -- concept & strategy, technical architecture,
MVP specification, pitch deck, execution playbook and judge Q&A.

Prepared for the MAIC Nexus Challenge 2026, Track T3 -- AI for Financial
Services & Fintech. All statistics are attributed in Appendix A. All prototype
figures are computed by the reference implementation in Appendix C.

Kira dulu. Baru commit.

