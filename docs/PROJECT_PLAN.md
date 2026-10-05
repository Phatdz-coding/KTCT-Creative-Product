# Capital Café — Detailed Project Plan

**Project:** Capital Café  
**Goal:** Build an educational café simulation for a Political Economy presentation  
**Deployment:** Vercel  
**Primary stack:** React + TypeScript + Vite  
**Planning style:** Milestone-based implementation plan  
**Version:** 1.0

---

## 1. Project Outcome

At completion, the repository must contain a working web application that allows a presenter to:

1. open Capital Café;
2. choose a scenario;
3. change economic inputs;
4. run one simulated working day;
5. observe café activity;
6. inspect business results;
7. inspect Marxian surplus-value interpretation;
8. compare two runs;
9. explain necessary and surplus labour visually;
10. deploy the latest `main` branch to Vercel.

---

## 2. Repository Deliverables

```text
capital-cafe/
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   └── PROJECT_PLAN.md
├── src/
├── public/
├── tests/
├── README.md
├── package.json
├── vite.config.ts
└── ...
```

Required documents:

- `docs/PRD.md`
- `docs/TRD.md`
- `docs/PROJECT_PLAN.md`

Required application:

- Presentation Mode
- Sandbox controls
- Analysis dashboard
- Scenario presets
- Compare Mode
- Vercel deployment

---

## 3. Development Strategy

Build the project in this order:

```text
Documentation
    ↓
Project Foundation
    ↓
Economic Domain Engine
    ↓
Automated Formula Tests
    ↓
Application State
    ↓
Core UI
    ↓
Presentation Simulation
    ↓
Analysis Visualizations
    ↓
Scenarios
    ↓
Comparison
    ↓
UX / Accessibility
    ↓
E2E / QA
    ↓
Vercel Deployment
    ↓
Presentation Rehearsal
```

Do **not** begin with animations.

The economic engine must be correct before visual polish.

---

# PHASE 0 — Documentation and Scope Lock

## Goal

Prevent scope creep.

## Tasks

### P0.1 Add documentation

Create:

```text
docs/PRD.md
docs/TRD.md
docs/PROJECT_PLAN.md
```

### P0.2 Confirm MVP scope

MVP includes:

- economic controls;
- deterministic simulation;
- result dashboard;
- labour-time bar;
- surplus-value calculation;
- presentation scenarios;
- comparison;
- simple café animation;
- Vercel deployment.

MVP excludes:

- authentication;
- database;
- multiplayer;
- inventory system;
- recipes;
- staff schedules;
- decoration;
- payments;
- complex business accounting.

### P0.3 Create README

README should contain:

- project purpose;
- install;
- run;
- test;
- build;
- deployment;
- documentation links.

## Exit criteria

- [ ] Scope documented.
- [ ] All three project documents exist.
- [ ] Team agrees not to add unrelated café-management features.

---

# PHASE 1 — Project Foundation

## Goal

Create a clean, buildable frontend project.

## Tasks

### P1.1 Initialize project

Recommended:

```bash
npm create vite@latest capital-cafe -- --template react-ts
cd capital-cafe
npm install
```

### P1.2 Install project libraries

Example categories:

```text
state management
schema validation
charts
animation
testing
routing if needed
```

Keep dependencies minimal.

### P1.3 Configure TypeScript

Enable strict type checking.

### P1.4 Configure lint + format

Required commands:

```bash
npm run lint
npm run build
```

Add test script:

```bash
npm run test
```

### P1.5 Establish folders

Create architecture defined in `TRD.md`.

### P1.6 Add base theme

Define:

- spacing;
- typography;
- panels;
- cards;
- controls;
- chart tokens.

Do not polish heavily yet.

## Exit criteria

- [ ] Dev server works.
- [ ] TypeScript strict mode works.
- [ ] Lint works.
- [ ] Empty production build works.
- [ ] Repository structure follows TRD.

---

# PHASE 2 — Economic Domain Layer

## Goal

Implement the complete simulation independently of React UI.

This is the highest-priority technical phase.

## Tasks

### P2.1 Define `SimulationInput`

Implement:

```ts
employeeCount
hourlyWage
workingHours
productivityPerWorkerHour
productPrice
materialCostPerUnit
dailyEquipmentCost
customerDemand
```

### P2.2 Define `SimulationResult`

Implement all outputs documented in TRD.

### P2.3 Add input schema

Validate ranges and number validity.

### P2.4 Implement production capacity

```text
employees × working hours × productivity
```

### P2.5 Implement demand limit

```text
units sold = min(capacity, demand)
```

### P2.6 Implement revenue

```text
units sold × price
```

### P2.7 Implement wage cost

```text
workers × hours × hourly wage
```

### P2.8 Implement material cost

```text
sold units × material cost
```

### P2.9 Implement constant capital approximation

```text
material + equipment
```

### P2.10 Implement variable capital approximation

```text
total wages
```

### P2.11 Implement remaining value

```text
revenue - C - V
```

### P2.12 Implement educational surplus

```text
max(0, remaining value)
```

### P2.13 Implement surplus-value rate

```text
m / v × 100%
```

### P2.14 Implement labour-time split

Calculate:

```text
necessary labour
surplus labour
```

### P2.15 Implement currency/number utilities

Do this outside components.

## Exit criteria

- [ ] Domain engine contains no React code.
- [ ] Same input always returns same output.
- [ ] No `NaN`.
- [ ] No `Infinity`.
- [ ] All formulas are implemented once.

---

# PHASE 3 — Formula Testing

## Goal

Make the educational model trustworthy.

## Tasks

### P3.1 Baseline test

Use:

```text
employees = 5
wage = 30,000/hour
hours = 8
productivity = 3
price = 50,000
material = 15,000
equipment = 500,000
demand = 100
```

Verify:

```text
capacity = 120
units sold = 100
revenue = 5,000,000
wages = 1,200,000
materials = 1,500,000
constant capital = 2,000,000
remaining value = 1,800,000
surplus value = 1,800,000
surplus-value rate = 150%
```

### P3.2 Demand-bound test

Capacity greater than demand.

### P3.3 Capacity-bound test

Demand greater than capacity.

### P3.4 Loss test

Costs greater than revenue.

### P3.5 Boundary tests

Test:

- one worker;
- minimum hours;
- zero demand;
- zero productivity if allowed;
- large but valid price;
- invalid negative input.

### P3.6 Labour split invariant

When available:

```text
necessaryLabourHours + surplusLabourHours
≈ workingHours
```

## Exit criteria

- [ ] Domain tests pass.
- [ ] Baseline produces documented numbers.
- [ ] Edge cases do not crash.

---

# PHASE 4 — Simulator State Management

## Goal

Create one predictable state source.

## Tasks

### P4.1 Implement draft input

Controls update draft values only.

### P4.2 Implement `run()`

When run:

```text
draft input
→ validation
→ simulation engine
→ saved last input
→ saved last result
```

### P4.3 Implement reset

Reset to selected scenario.

### P4.4 Implement status

```text
idle
running
complete
```

### P4.5 Implement A/B snapshots

Needed for Compare Mode.

## Exit criteria

- [ ] UI can use a stable state API.
- [ ] No duplicated result calculation in store.
- [ ] Reset deterministic.
- [ ] Snapshot A/B works in state tests or manual verification.

---

# PHASE 5 — Presentation Screen Skeleton

## Goal

Build the complete functional screen before animations.

## Layout

```text
Header
├── project title
├── scenario selector
└── mode controls

Main
├── Control Panel
├── Café Stage
└── Analysis Panel
```

## Tasks

### P5.1 Header

Include:

- Capital Café;
- scenario selector;
- reset;
- optional fullscreen.

### P5.2 Controls

Implement:

- employee count;
- hourly wage;
- working hours;
- productivity;
- price;
- material cost;
- equipment cost;
- demand.

### P5.3 Run button

Primary CTA:

```text
RUN SIMULATION
```

### P5.4 Result placeholders

Result cards should already receive real domain data.

### P5.5 Responsive layout

Optimize first for a 16:9 laptop presentation.

## Exit criteria

- [ ] User can change every MVP parameter.
- [ ] User can run simulation.
- [ ] Correct numbers appear.
- [ ] User can reset.

---

# PHASE 6 — Analysis Dashboard

## Goal

Translate formulas into understandable visuals.

## Tasks

### P6.1 Primary metrics

Display:

```text
Revenue
Total wages
Surplus value
Surplus-value rate
Units sold
Worker daily income
```

### P6.2 Cost breakdown

Display:

```text
materials
equipment
wages
```

### P6.3 Value distribution bar

Segments:

```text
C | V | M
```

Labels:

```text
Constant capital
Variable capital
Surplus value
```

### P6.4 Labour-time bar

Segments:

```text
Necessary labour
Surplus labour
```

Display actual hours.

### P6.5 Formula breakdown

Expandable section:

```text
How is this calculated?
```

### P6.6 Business vs theory grouping

Create two sub-sections:

```text
Business Result
Political Economy Analysis
```

This prevents conceptual confusion.

## Exit criteria

- [ ] Every major result is visible.
- [ ] Labour-time chart uses engine outputs.
- [ ] Theory metrics have tooltips.
- [ ] Formula explanation matches source code.

---

# PHASE 7 — Café Simulation Animation

## Goal

Make the presentation engaging without allowing animation logic to corrupt formulas.

## Sequence

```text
Open Café
   ↓
Workers Active
   ↓
Orders Produced
   ↓
Customers Served
   ↓
Accounting
   ↓
Analysis Reveal
```

## Tasks

### P7.1 Café stage

Build using normal React/HTML/CSS/SVG.

Avoid a game engine for MVP.

### P7.2 Worker representation

Show worker count conceptually.

Do not render 20 fully animated agents if it hurts performance.

For large counts:

```text
5 worker icons + "×4"
```

is acceptable.

### P7.3 Customer/order activity

Animation should reflect:

- low/medium/high order volume.

It does not need one animation per exact coffee sold.

### P7.4 Timeline animation

Progress from opening to result.

### P7.5 Reduced motion

Implement reduced animation mode.

## Exit criteria

- [ ] Animation completes quickly.
- [ ] Result values do not depend on animation.
- [ ] Reduced-motion works.
- [ ] Animation remains smooth on normal laptop hardware.

---

# PHASE 8 — Scenario System

## Goal

Support the presentation without repetitive manual input.

## Required scenarios

### S1 Baseline

Demonstrate the initial relationship.

### S2 Wage Reduction

Question:

> What changes if the wage is reduced while other conditions remain similar?

### S3 Extended Working Day

Question:

> What changes if workers remain in production longer?

### S4 Productivity Increase

Question:

> What changes when technology increases productive capacity?

### S5 Demand Constraint

Question:

> Can increased productivity always be converted into revenue?

### S6 Higher Product Price

Question:

> How does a market-side change differ from a labour-side change?

## Tasks

### P8.1 Scenario data file

All presets should be defined as objects.

### P8.2 Scenario selector

Loading a scenario replaces the draft input.

### P8.3 Scenario explanation

Show:

- purpose;
- changed variable;
- expected observation;
- discussion question.

### P8.4 Presenter-friendly preset switching

One click only.

## Exit criteria

- [ ] All required scenarios exist.
- [ ] Scenario switch is reliable.
- [ ] Explanations are concise.
- [ ] Reset returns to selected scenario.

---

# PHASE 9 — Compare Mode

## Goal

Make parameter effects visually obvious.

## Flow

```text
Run Scenario
→ Save as A
→ Change input
→ Run
→ Save as B
→ Open Compare
```

## Compare data

Show:

| Metric | A | B | Change |
|---|---:|---:|---:|
| Revenue | | | |
| Wages | | | |
| Surplus | | | |
| m' | | | |
| Worker income | | | |
| Necessary labour | | | |
| Surplus labour | | | |

## Tasks

### P9.1 Snapshot storage

Local in-memory state is sufficient.

Optional:

```text
sessionStorage
```

for refresh survival.

### P9.2 Delta utility

Implement absolute and percentage change safely.

### P9.3 Comparison chart

Use a small number of high-value metrics.

### P9.4 Parameter diff

Highlight which inputs changed.

## Exit criteria

- [ ] A/B snapshots retain both input and result.
- [ ] Comparison calculations correct.
- [ ] Input differences visible.
- [ ] No misleading percentage calculation when denominator is zero.

---

# PHASE 10 — Theory Content

## Goal

Allow presenter and audience to inspect definitions without crowding the main screen.

## Required terms

```text
Labour power
Wage
Constant capital
Variable capital
Necessary labour
Surplus labour
Surplus value
Rate of surplus value
Profit
```

## Content rule

Each definition should be:

- short;
- suitable for presentation;
- connected to a simulator metric where possible.

## Disclaimer

Include:

> This simulation is a simplified educational model based mainly on Marxian political economy. Real-world business profit involves additional costs, institutions, market conditions, risk, entrepreneurship, innovation, and other factors discussed by different economic theories.

## Exit criteria

- [ ] Theory drawer complete.
- [ ] Disclaimer visible.
- [ ] No metric is presented without explanation.

---

# PHASE 11 — UX Polish and Accessibility

## Goal

Make the app presentation-ready.

## Tasks

### P11.1 Visual hierarchy

Ensure:

```text
changed input
→ simulation
→ major result
→ theoretical interpretation
```

is visually obvious.

### P11.2 Keyboard

Test all controls.

### P11.3 Focus

Visible focus states.

### P11.4 Contrast

Check text and chart labels.

### P11.5 Reduced motion

Respect OS setting.

### P11.6 Empty/error states

Create graceful states for:

- no result;
- invalid input;
- zero demand;
- negative business result;
- unavailable labour analysis.

### P11.7 Presentation resolution

Manually test:

```text
1366×768
1440×900
1920×1080
```

## Exit criteria

- [ ] Main screen usable without scrolling excessively at common laptop size.
- [ ] All controls keyboard accessible.
- [ ] No important meaning depends only on color.
- [ ] No layout overflow.

---

# PHASE 12 — Quality Assurance

## Automated checks

```bash
npm run lint
npm run test
npm run build
```

## E2E flow

Automate at least:

```text
open presentation
select baseline
run
verify revenue
change wage
run
verify changed wage total
save A/B
open comparison
```

## Manual QA matrix

### Input

- [ ] sliders;
- [ ] number inputs;
- [ ] scenario presets;
- [ ] reset.

### Simulation

- [ ] run once;
- [ ] repeated run;
- [ ] change parameters after a run;
- [ ] zero demand;
- [ ] loss case.

### Visualization

- [ ] correct currency;
- [ ] correct percentages;
- [ ] labour bar totals;
- [ ] no chart crash.

### Browser

At minimum test current desktop versions of:

- Chromium-based browser;
- Firefox;
- Safari if available.

## Exit criteria

- [ ] No blocking bug.
- [ ] No console errors in core flow.
- [ ] Production build passes.

---

# PHASE 13 — Vercel Deployment

## Goal

Deploy through Git-based continuous deployment.

## Step 1 — Push repository

```bash
git init
git add .
git commit -m "feat: initial Capital Cafe MVP"
git branch -M main
git remote add origin <repository>
git push -u origin main
```

## Step 2 — Import project into Vercel

Connect the Git repository.

Vercel should detect the Vite project.

Expected production build:

```text
npm install
npm run build
```

Expected output:

```text
dist
```

## Step 3 — Verify Preview Deployment

Before production sign-off verify:

- landing loads;
- presentation loads;
- routes refresh correctly;
- simulation runs;
- charts display;
- no asset path errors.

## Step 4 — Routing fallback

If using client-side routing and direct route refresh fails, add the required SPA rewrite configuration.

Example:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Then redeploy and retest every route.

## Step 5 — Production

Use `main` as production branch.

Workflow:

```text
feature branch
→ Preview Deployment
→ review
→ merge main
→ Production Deployment
```

## Exit criteria

- [ ] Production URL works.
- [ ] Direct navigation works.
- [ ] Refresh works.
- [ ] Static assets load.
- [ ] Simulation works on deployed site.

---

# PHASE 14 — Presentation Preparation

## Goal

Make the software usable as part of the actual class presentation.

## Recommended presentation sequence

### Scene 1 — Ask the question

Display:

> Capital is advanced and profit returns to the capitalist. Labour power is supplied and wages return to the worker. If this is cooperation, is exploitation still present?

### Scene 2 — Baseline

Run default café.

Explain:

```text
capital
labour
production
revenue
wage
remaining value
```

### Scene 3 — Labour-time split

Show:

```text
necessary labour
surplus labour
```

### Scene 4 — Wage experiment

Lower wage and compare.

### Scene 5 — Working-time experiment

Change working time.

### Scene 6 — Productivity experiment

Increase productivity.

### Scene 7 — Demand limitation

Show why productive capacity is not the same as realized sales.

### Scene 8 — Final discussion

Return to the opening question.

## Rehearsal checklist

- [ ] scenarios reset correctly;
- [ ] default values known;
- [ ] browser zoom correct;
- [ ] presentation display readable;
- [ ] Vercel URL bookmarked;
- [ ] local backup build available if possible;
- [ ] no unnecessary tabs;
- [ ] fullscreen tested.

---

# 4-PERSON TEAM OPTION

If the project is developed by four people:

## Member 1 — Tech Lead / Domain

Owns:

- architecture;
- simulation engine;
- domain types;
- formula tests;
- code review.

## Member 2 — UI / Controls

Owns:

- control panel;
- layout;
- responsive UI;
- common components.

## Member 3 — Visualization / Animation

Owns:

- café scene;
- labour-time visualization;
- value charts;
- animation.

## Member 4 — Scenarios / QA / Deployment

Owns:

- scenario data;
- Compare Mode;
- E2E tests;
- Vercel deployment;
- presentation QA.

All members must understand the domain model.

---

# PRIORITY BACKLOG

## P0 — Required

- [ ] project setup;
- [ ] simulation engine;
- [ ] formula tests;
- [ ] controls;
- [ ] run/reset;
- [ ] results;
- [ ] labour-time visualization;
- [ ] surplus-value rate;
- [ ] baseline scenarios;
- [ ] presentation mode;
- [ ] Vercel deploy.

## P1 — Strongly recommended

- [ ] Compare Mode;
- [ ] scenario explanations;
- [ ] polished café animation;
- [ ] theory drawer;
- [ ] URL-shareable scenario;
- [ ] Playwright E2E.

## P2 — Future

- [ ] bilingual UI;
- [ ] saved scenarios;
- [ ] teacher mode;
- [ ] database;
- [ ] classroom voting;
- [ ] PWA;
- [ ] advanced market model.

---

# ISSUE TEMPLATE FOR IDE / GITHUB

Every implementation task should contain:

```md
## Goal

What needs to exist?

## Context

Which PRD/TRD requirement does this implement?

## Requirements

- ...
- ...

## Acceptance Criteria

- [ ] ...
- [ ] ...

## Tests

- Unit:
- Component:
- E2E:

## Out of Scope

- ...
```

---

# AI IDE EXECUTION ORDER

An AI coding agent should execute the project

<!-- TODO: the source prompt was cut off here mid-sentence. Paste the remainder of this section to complete the plan. -->
