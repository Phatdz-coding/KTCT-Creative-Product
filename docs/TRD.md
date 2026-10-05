# Capital Café — Technical Requirements Document (TRD)

**Project:** Capital Café  
**Architecture:** Client-side Single Page Application  
**Deployment:** Vercel  
**Recommended stack:** React + TypeScript + Vite  
**Version:** 1.0

---

## 1. Technical Objective

Build a deterministic, presentation-first educational simulation where all core economic calculations run locally in the browser.

The MVP should:

- require no backend;
- require no authentication;
- require no database;
- build as static assets;
- deploy to Vercel from Git;
- isolate economic logic from UI;
- support deterministic unit testing.

---

## 2. Recommended Technology Stack

### Core

| Layer | Technology |
|---|---|
| Language | TypeScript |
| UI | React |
| Build tool | Vite |
| Styling | Tailwind CSS or CSS Modules |
| State | Zustand or React Context + reducer |
| Validation | Zod |
| Charts | Recharts |
| Animation | Framer Motion |
| Testing | Vitest + React Testing Library |
| E2E | Playwright |
| Formatting | Prettier |
| Linting | ESLint |
| Deployment | Vercel |

### Recommendation

For a small educational project:

- use **Zustand** if multiple screens share simulator state;
- use **Zod** for validated scenario import/export;
- use **Recharts** only for simple charts;
- use **Framer Motion** only where animation improves explanation.

Do not add a backend framework to the MVP unless a real persistence requirement appears.

---

## 3. High-Level Architecture

```text
┌────────────────────────────────────────────────────────┐
│                       Browser                          │
│                                                        │
│  ┌───────────────┐     ┌───────────────────────────┐   │
│  │ React UI      │────▶│ Application State         │   │
│  │ Components    │◀────│ / Simulator Store         │   │
│  └──────┬────────┘     └──────────────┬────────────┘   │
│         │                              │                │
│         ▼                              ▼                │
│  ┌────────────────┐          ┌──────────────────────┐   │
│  │ Presentation   │          │ Simulation Engine    │   │
│  │ Animation      │          │ Pure TypeScript      │   │
│  └────────────────┘          └──────────┬───────────┘   │
│                                        │               │
│                                        ▼               │
│                               ┌───────────────────┐    │
│                               │ Result / Metrics  │    │
│                               └───────────────────┘    │
└────────────────────────────────────────────────────────┘

                    Static production build
                             │
                             ▼
                         Vercel CDN
```

---

## 4. Architectural Principles

### 4.1 Pure domain logic

Economic formulas must be implemented as pure functions.

Bad:

```ts
function ResultsPanel() {
  const surplus = revenue - wage - material;
}
```

Good:

```ts
const result = runSimulation(input);
```

UI renders the result and does not own the formula.

### 4.2 Deterministic simulation

Same input must produce same output.

Do not introduce randomness into economic outcomes for MVP.

Animation may visually vary, but calculated values must remain deterministic.

### 4.3 Explicit assumptions

Every derived metric must have:

- a formula;
- a unit;
- an assumption;
- a test.

### 4.4 Configuration-driven scenarios

Scenario presets belong in data files rather than duplicated component code.

---

## 5. Suggested Repository Structure

```text
capital-cafe/
├── public/
│   ├── icons/
│   └── images/
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   └── providers.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Currency.tsx
│   │   │   ├── InfoTooltip.tsx
│   │   │   └── Modal.tsx
│   │   │
│   │   ├── controls/
│   │   │   ├── ParameterSlider.tsx
│   │   │   ├── NumericField.tsx
│   │   │   └── ScenarioSelector.tsx
│   │   │
│   │   ├── cafe/
│   │   │   ├── CafeScene.tsx
│   │   │   ├── WorkerSprite.tsx
│   │   │   ├── CustomerSprite.tsx
│   │   │   └── OrderAnimation.tsx
│   │   │
│   │   ├── analysis/
│   │   │   ├── MetricsGrid.tsx
│   │   │   ├── ValueDistributionBar.tsx
│   │   │   ├── LabourTimeBar.tsx
│   │   │   ├── SurplusRateCard.tsx
│   │   │   ├── FormulaBreakdown.tsx
│   │   │   └── ComparisonChart.tsx
│   │   │
│   │   └── theory/
│   │       ├── TheoryDrawer.tsx
│   │       └── DefinitionCard.tsx
│   │
│   ├── features/
│   │   ├── simulator/
│   │   │   ├── simulator.types.ts
│   │   │   ├── simulator.schema.ts
│   │   │   ├── simulator.engine.ts
│   │   │   ├── simulator.selectors.ts
│   │   │   ├── simulator.store.ts
│   │   │   └── simulator.engine.test.ts
│   │   │
│   │   ├── scenarios/
│   │   │   ├── scenarios.data.ts
│   │   │   ├── scenario.schema.ts
│   │   │   └── scenario.utils.ts
│   │   │
│   │   └── comparison/
│   │       ├── comparison.types.ts
│   │       └── comparison.utils.ts
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── PresentationPage.tsx
│   │   ├── SandboxPage.tsx
│   │   └── ComparePage.tsx
│   │
│   ├── lib/
│   │   ├── currency.ts
│   │   ├── number.ts
│   │   └── accessibility.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── tests/
│   └── e2e/
│       └── presentation.spec.ts
│
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   └── PROJECT_PLAN.md
│
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 6. Domain Models

### 6.1 Simulation input

```ts
export interface SimulationInput {
  employeeCount: number;
  hourlyWage: number;
  workingHours: number;
  productivityPerWorkerHour: number;
  optimalWorkingHours: number;
  productPrice: number;
  materialCostPerUnit: number;
  dailyEquipmentCost: number;
  customerDemand: number;
}
```

### 6.2 Simulation result

```ts
export interface SimulationResult {
  loadPerWorker: number;
  sustainableLoad: number;
  overloadFactor: number;
  effectiveProductivity: number;

  productionCapacity: number;
  unitsSold: number;

  revenue: number;

  totalWages: number;
  materialCost: number;
  dailyEquipmentCost: number;

  constantCapital: number;
  variableCapital: number;

  remainingValue: number;
  surplusValue: number;
  simplifiedProfit: number;

  surplusValueRate: number | null;

  necessaryLabourHours: number | null;
  surplusLabourHours: number | null;

  workerDailyIncome: number;
}
```

### 6.3 Scenario

```ts
export interface Scenario {
  id: string;
  name: string;
  description: string;
  teachingGoal: string;
  input: SimulationInput;
  explanation?: string;
}
```

### 6.4 Comparison snapshot

```ts
export interface SimulationSnapshot {
  id: string;
  label: string;
  input: SimulationInput;
  result: SimulationResult;
}
```

---

## 7. Input Validation

Use a schema.

Example:

```ts
import { z } from "zod";

export const simulationInputSchema = z.object({
  employeeCount: z.number().int().min(1).max(20),
  hourlyWage: z.number().min(0).max(500_000),
  workingHours: z.number().min(1).max(16),
  productivityPerWorkerHour: z.number().min(0).max(50),
  optimalWorkingHours: z.number().min(1).max(16),
  productPrice: z.number().min(0).max(1_000_000),
  materialCostPerUnit: z.number().min(0).max(1_000_000),
  dailyEquipmentCost: z.number().min(0).max(100_000_000),
  customerDemand: z.number().int().min(0).max(10_000),
});
```

UI ranges may be narrower than technical validation limits.

---

## 8. Simulation Engine

### 8.1 Core function

```ts
export function runSimulation(
  input: SimulationInput
): SimulationResult {
  // validate
  // calculate capacity
  // calculate units sold
  // calculate revenue
  // calculate costs
  // calculate surplus
  // calculate labour-time metrics
  // return immutable result
}
```

### 8.2 Formula specification

#### Worker overload

A worker sustains `productivityPerWorkerHour × optimalWorkingHours` units a day. Asking for more lowers productivity linearly, down to a floor.

```ts
const OVERLOAD_PENALTY = 0.3;
const MIN_OVERLOAD_FACTOR = 0.6;

loadPerWorker =
  customerDemand / employeeCount;

sustainableLoad =
  productivityPerWorkerHour *
  optimalWorkingHours;

const overloadRatio =
  sustainableLoad > 0
    ? loadPerWorker / sustainableLoad
    : 0;

overloadFactor =
  overloadRatio > 1
    ? Math.max(
        MIN_OVERLOAD_FACTOR,
        1 - OVERLOAD_PENALTY * (overloadRatio - 1)
      )
    : 1;

effectiveProductivity =
  productivityPerWorkerHour *
  overloadFactor;
```

Both sides of the ratio use the base productivity, so the result never depends on itself.

#### Production capacity

```ts
productionCapacity =
  employeeCount *
  workingHours *
  effectiveProductivity;
```

Choose one rounding policy and use it everywhere.

Recommended MVP policy:

```ts
productionCapacity = Math.floor(rawCapacity);
```

#### Units sold

```ts
unitsSold = Math.min(
  productionCapacity,
  customerDemand
);
```

#### Revenue

```ts
revenue = unitsSold * productPrice;
```

#### Total wages

```ts
totalWages =
  employeeCount *
  workingHours *
  hourlyWage;
```

#### Material cost

```ts
materialCost =
  unitsSold *
  materialCostPerUnit;
```

#### Constant capital

```ts
constantCapital =
  materialCost +
  dailyEquipmentCost;
```

#### Variable capital

```ts
variableCapital = totalWages;
```

#### Remaining value

```ts
remainingValue =
  revenue -
  constantCapital -
  variableCapital;
```

#### Educational surplus value

```ts
surplusValue =
  Math.max(0, remainingValue);
```

#### Simplified profit

```ts
simplifiedProfit = remainingValue;
```

#### Surplus-value rate

```ts
surplusValueRate =
  variableCapital > 0
    ? (surplusValue / variableCapital) * 100
    : null;
```

#### Labour-time split

```ts
const newValue =
  variableCapital + surplusValue;

necessaryLabourHours =
  newValue > 0
    ? workingHours *
      (variableCapital / newValue)
    : null;

surplusLabourHours =
  necessaryLabourHours !== null
    ? workingHours -
      necessaryLabourHours
    : null;
```

#### Worker daily income

Income of one worker for the day, under the hourly-wage rule.

```ts
workerDailyIncome =
  workingHours *
  hourlyWage;
```

---

## 9. Important Economic Modeling Constraint

Do **not** silently treat every accounting remainder as a universal theoretical proof.

The UI must communicate:

```text
Simulation metric
        ≠
complete real-world accounting model
```

The application uses simplified mappings for teaching.

Therefore:

- calculations should be mathematically consistent;
- labels must say `simplified`;
- theory drawer should state the assumptions;
- result UI should distinguish `Business Result` and `Marxian Interpretation`.

---

## 10. Simulator State

Suggested store shape:

```ts
interface SimulatorStore {
  mode: "presentation" | "sandbox";

  selectedScenarioId: string;

  draftInput: SimulationInput;

  lastInput: SimulationInput | null;
  lastResult: SimulationResult | null;

  snapshotA: SimulationSnapshot | null;
  snapshotB: SimulationSnapshot | null;

  simulationStatus:
    | "idle"
    | "running"
    | "complete";

  setInput<K extends keyof SimulationInput>(
    key: K,
    value: SimulationInput[K]
  ): void;

  run(): void;
  reset(): void;

  saveAsA(): void;
  saveAsB(): void;
}
```

Do not store duplicated derived values in multiple places if they can be produced from `SimulationResult`.

---

## 11. Simulation Animation State Machine

Animation must not control calculations.

Use:

```text
IDLE
 ↓
OPENING
 ↓
WORKING
 ↓
SERVING
 ↓
ACCOUNTING
 ↓
RESULT
```

Suggested duration:

```text
OPENING     300 ms
WORKING    1200 ms
SERVING     800 ms
ACCOUNTING  700 ms
RESULT       —
```

For `prefers-reduced-motion`, skip or heavily shorten animation.

The full demonstration should remain quick.

---

## 12. Component Responsibilities

### `ParameterSlider`

Responsible for:

- label;
- slider;
- numeric field;
- unit;
- allowed range.

Not responsible for formulas.

### `CafeScene`

Responsible for:

- visual stage;
- simulation phase;
- worker/customer visual representation.

Not responsible for determining economic results.

### `MetricsGrid`

Receives `SimulationResult`.

Displays primary metrics.

### `ValueDistributionBar`

Visualizes:

```text
constant capital | variable capital | surplus
```

### `LabourTimeBar`

Visualizes:

```text
necessary labour | surplus labour
```

### `FormulaBreakdown`

Shows:

```text
Revenue
- Constant capital
- Variable capital
= Remaining value
```

and theoretical notation where appropriate.

### `ScenarioSelector`

Loads scenario configuration.

### `ComparisonChart`

Compares A/B snapshots.

---

## 13. Routing

MVP routes:

```text
/
  Landing

/presentation
  Presentation Mode

/sandbox
  Sandbox Mode

/compare
  Compare Mode
```

If React Router is used with SPA history routing, configure Vercel rewrites appropriately or use a routing approach compatible with static deployment.

For the smallest MVP, a single-route application with internal mode switching is also acceptable and reduces deployment complexity.

---

## 14. URL Scenario Serialization — Optional P1

Example:

```text
/presentation?w=5&wage=30000&hours=8&productivity=3&price=50000&material=15000&equipment=500000&demand=100
```

Requirements:

- parse using schema validation;
- invalid values fall back safely;
- never trust query parameters directly.

This avoids a database while supporting shareable configurations.

---

## 15. Currency Utilities

Centralize currency display.

```ts
export const formatVND = (
  value: number
): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
```

Do not manually format currency in components.

---

## 16. Number Precision

Recommended rules:

- units sold: integer;
- money: integer VND;
- labour hours: max 2 decimals;
- percentages: max 1 decimal;
- internal calculations: JavaScript number is sufficient for this MVP;
- avoid cumulative simulation across thousands of days.

If future accounting requires financial precision across many transactions, migrate money values to integer minor units / deterministic decimal handling.

---

## 17. Chart Data Contracts

Charts should consume transformed view models, not raw store internals.

Example:

```ts
interface ValueDistributionItem {
  key: "constant" | "variable" | "surplus";
  label: string;
  value: number;
}
```

Selectors:

```ts
selectValueDistribution(result)
selectPrimaryMetrics(result)
selectLabourSegments(result)
selectComparison(snapshotA, snapshotB)
```

---

## 18. Accessibility Requirements

Minimum:

- controls have programmatic labels;
- keyboard interaction works;
- no information communicated by color only;
- charts include text equivalents;
- motion can be reduced;
- modal/drawer focus is managed;
- focus remains visible;
- buttons have meaningful names.

---

## 19. Responsive Layout

### Desktop ≥ 1200px

```text
Controls | Simulation | Analysis
```

### Tablet 768–1199px

```text
Controls
Simulation + Analysis
```

or

```text
Controls | Simulation
Analysis full-width below
```

### Mobile < 768px

```text
Controls
Simulation
Analysis
```

Desktop presentation quality has priority over advanced mobile optimization.

---

## 20. Testing Strategy

### 20.1 Unit tests — Highest priority

Test `runSimulation`.

Test cases:

#### Baseline

```text
employees = 5
hours = 8
wage = 30,000
productivity = 3
price = 50,000
material = 15,000
equipment = 500,000
demand = 100
```

Expected:

```text
capacity = 120
sold = 100
revenue = 5,000,000
wages = 1,200,000
materials = 1,500,000
constant capital = 2,000,000
remaining value = 1,800,000
surplus = 1,800,000
m' = 150%
```

#### Demand limited

Capacity > demand.

Expected:

```text
unitsSold === demand
```

#### Production limited

Demand > capacity.

Expected:

```text
unitsSold === capacity
```

#### Overload

```text
employees = 3, other inputs as baseline
```

Expected:

```text
loadPerWorker ≈ 33.33
sustainableLoad = 24
overloadFactor ≈ 0.883
effectiveProductivity ≈ 2.65
capacity = 63
```

Also test that the baseline is not overloaded (`overloadFactor === 1`), that the factor never rises as demand rises, that it never goes below 0.6, and that zero demand or zero productivity is not an overload.

#### Negative remaining value

Expected:

```text
surplusValue === 0
simplifiedProfit < 0
```

#### Zero variable capital safety

If supported by schema:

```text
surplusValueRate === null
```

### 20.2 Component tests

Test:

- controls update draft values;
- reset restores scenario;
- run displays results;
- formula drawer renders calculations;
- comparison renders two snapshots.

### 20.3 E2E

Critical classroom flow:

```text
open presentation
→ select baseline
→ modify wage
→ run
→ see result
→ save A
→ modify wage again
→ run
→ save B
→ compare
```

---

## 21. Code Quality Rules

- TypeScript strict mode enabled.
- No `any` unless justified.
- Pure formula functions.
- No economic formulas inside JSX.
- No magic numbers in UI.
- Scenario values live in config.
- Use named domain terms.
- Every formula has unit tests.
- Avoid giant components > ~250 lines when reasonable.
- Prefer composition over deeply nested conditionals.

---

## 22. Git Workflow

Recommended:

```text
main
  production-ready

develop
  optional integration branch

feature/*
  feature work

fix/*
  bug fixes
```

For a small student team, simpler is acceptable:

```text
main
feature/*
```

Pull request checks:

```text
npm run lint
npm run test
npm run build
```

---

## 23. Environment Variables

MVP does not require secrets.

`.env.example` can contain only optional configuration:

```env
VITE_APP_NAME=Capital Cafe
VITE_DEFAULT_LOCALE=vi-VN
```

Never place real secrets in `VITE_*` variables because client-side Vite values are shipped to the browser.

If server-side APIs are later added, keep their secrets in Vercel environment variables and access them only from server-side functions.

---

## 24. Vercel Deployment Architecture

The MVP is a Vite static application.

Production workflow:

```text
Developer
   ↓ git push
Git repository
   ↓
Vercel project
   ↓
Install dependencies
   ↓
npm run build
   ↓
dist/
   ↓
Vercel deployment
```

Vite's default production output is `dist`.

Vercel can detect Vite projects automatically when imported from a Git repository.

### Build expectations

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "lint": "eslint ."
  }
}
```

Before production:

```bash
npm run lint
npm run test
npm run build
```

Do not use `vite preview` as the production server.

---

## 25. SPA Rewrite Configuration

Only required if client-side routes are refreshed directly and the deployment does not already resolve them as expected.

Possible `vercel.json`:

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

If the app is implemented as one static route, this may not be needed.

Verify routing in a Vercel Preview Deployment before merging.

---

## 26. Vercel Preview Workflow

Recommended branch workflow:

```text
feature branch
    ↓ push / pull request
Vercel Preview Deployment
    ↓
review UI + simulation
    ↓
merge to main
    ↓
Production Deployment
```

Preview deployments are especially useful for:

- instructor review;
- UI review;
- checking presentation on another laptop;
- validating routing.

---

## 27. Performance Budget

Targets:

- no unnecessarily large raster images;
- lazy-load secondary explanation content if needed;
- keep animation assets lightweight;
- avoid large game engines such as Phaser unless the café scene becomes genuinely game-like;
- avoid Three.js for MVP;
- minimize bundle dependencies.

A DOM/CSS/React animation is enough for the initial café scene.

---

## 28. Security

MVP attack surface is low because there is:

- no authentication;
- no database;
- no file upload;
- no user-generated HTML;
- no payment;
- no private data.

Still:

- validate URL parameters;
- avoid `dangerouslySetInnerHTML`;
- keep dependencies updated;
- avoid committing secrets;
- enable automated dependency alerts in the Git host.

---

## 29. Error Handling

### Invalid input

Show inline validation.

### Impossible result

Never produce:

- `NaN`;
- `Infinity`;
- negative units sold.

### Chart safety

If all chart segments are zero, display an empty-state explanation rather than a broken chart.

### Labour analysis unavailable

Display:

```text
Labour-time analysis is unavailable for this configuration.
```

instead of invalid values.

---

## 30. Observability

MVP does not require server logging.

Recommended development diagnostics:

- console errors must be zero in final demo;
- optional Vercel Web Analytics can be considered later;
- analytics must not be required for the simulation.

---

## 31. Definition of Done

A feature is done when:

- implementation matches PRD;
- TypeScript passes;
- lint passes;
- related unit tests pass;
- no console error;
- keyboard interaction checked where relevant;
- UI reviewed at laptop presentation size;
- production build succeeds;
- Preview Deployment succeeds for user-facing changes.

---

## 32. Future Backend Path

Do not build this in MVP, but preserve an upgrade path.

Possible later architecture:

```text
React/Vite Client
       ↓
Vercel Function / API
       ↓
Database
```

Potential backend features:

- shared instructor scenarios;
- anonymous classroom sessions;
- results collection;
- voting;
- teacher dashboard.

The current domain engine should remain framework-independent so it can be reused server-side if needed.

---

## 33. AI Coding Agent Instructions

When an IDE agent implements this project, it should follow these priorities:

1. read `docs/PRD.md`;
2. read `docs/TRD.md`;
3. implement domain types;
4. implement and test simulation engine;
5. implement state management;
6. implement Presentation Mode;
7. implement analysis visualization;
8. implement scenarios;
9. implement Compare Mode;
10. polish animation;
11. validate accessibility;
12. run tests and production build.

The agent must **not**:

- invent new formulas without documenting them;
- add a backend to MVP without a requirement;
- duplicate formulas inside React components;
- turn the project into a general café-management game;
- hide theoretical assumptions.
