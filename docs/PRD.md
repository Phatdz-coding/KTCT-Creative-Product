# Capital Café — Product Requirements Document (PRD)

**Project type:** Interactive educational web game  
**Primary subject:** Political Economy — capital, wage labour, surplus value, profit, and the question of exploitation  
**Deployment target:** Vercel  
**Recommended MVP stack:** React + TypeScript + Vite  
**Document status:** Implementation-ready draft  
**Version:** 1.0

---

## 1. Product Summary

Capital Café is an interactive web-based simulation designed for a Political Economy presentation.

The player controls a simplified café business by changing variables such as:

- number of workers;
- hourly wage;
- working hours;
- worker productivity;
- product price;
- material cost;
- customer demand;
- equipment/depreciation cost.

After the player changes the parameters, the simulation runs one working day and displays:

- production output;
- completed and sold orders;
- revenue;
- wage cost;
- material cost;
- equipment/depreciation cost;
- remaining value / simplified profit;
- necessary labour time;
- surplus labour time;
- surplus value;
- rate of surplus value.

The product is not intended to be a realistic café-management simulator. Its main purpose is to visualize a Political Economy argument: a wage contract can appear as a voluntary exchange while the production process can still generate surplus value.

The application must clearly state that the simulation is a **simplified educational model based mainly on Marxian political economy**, not a complete model of real-world accounting or all schools of economics.

---

## 2. Problem Statement

The presentation topic is:

> The capitalist advances capital and receives profit. The worker supplies labour power and receives wages. If both sides cooperate and exchange voluntarily, does exploitation still exist?

This question is difficult to present only through slides because concepts such as:

- labour power;
- necessary labour;
- surplus labour;
- constant capital;
- variable capital;
- surplus value;
- surplus-value rate;

are abstract.

Capital Café turns the topic into a controllable simulation.

Instead of only listening to definitions, the audience can see what changes when:

- wages decrease;
- working hours increase;
- productivity increases;
- product price changes;
- demand changes;
- more workers are hired.

---

## 3. Product Goals

### 3.1 Primary goals

The product must:

1. make the relationship between wage labour, production, and surplus value visually understandable;
2. allow the presenter to modify economic parameters in real time;
3. immediately recalculate results after a simulation;
4. make cause-and-effect relationships easy to compare;
5. support a classroom presentation without requiring the presenter to explain complicated controls;
6. be deployable as a fast static web application on Vercel;
7. work reliably without requiring login or a backend for the MVP.

### 3.2 Secondary goals

The product should:

- encourage audience discussion;
- support scenario-based demonstrations;
- make formulas transparent rather than hiding calculations;
- visually distinguish business results from Political Economy interpretation;
- allow the presenter to reset to known scenarios quickly.

### 3.3 Non-goals

The MVP will not attempt to:

- reproduce a complete real-world café economy;
- implement full accounting;
- model taxes, bank loans, inflation, rent markets, or labour law in detail;
- determine whether a real business or employer is morally good or bad;
- present Marxian theory as the only economic interpretation;
- include multiplayer networking;
- require user accounts;
- include complex inventory management;
- include restaurant decoration, recipes, or unrelated management mechanics.

---

## 4. Target Users

### 4.1 Primary user

**Student presenter**

Needs:

- simple controls;
- predictable results;
- readable charts;
- quick reset;
- presentation-friendly layout;
- clear explanatory text.

### 4.2 Secondary user

**Class audience / student**

Needs:

- intuitive visual feedback;
- understandable values;
- visible relationship between changed parameters and economic outcomes;
- short explanations of Political Economy terms.

### 4.3 Instructor

Needs:

- conceptually transparent calculations;
- no hidden random result generation;
- visible assumptions;
- clear distinction between simplified model and real economy.

---

## 5. Core Learning Question

The application revolves around one central question:

> If the worker receives the agreed wage and the capitalist receives profit after advancing capital, where does the remaining value come from?

The simulation should guide the audience through:

1. exchange;
2. production;
3. value creation;
4. wage payment;
5. surplus;
6. interpretation.

---

## 6. Product Principles

### 6.1 Simulation before explanation

The audience should first observe a result, then receive an explanation.

### 6.2 Cause and effect must be visible

Every important parameter change should visibly affect one or more outputs.

### 6.3 No hidden economics

The user must be able to inspect the formulas behind the simulation.

### 6.4 Educational clarity over realism

When realism conflicts with clarity, choose a simpler model and label the assumption.

### 6.5 Avoid moral caricatures

Do not portray the owner as automatically evil or workers as passive victims.

The application should explain the theoretical relationship rather than relying on emotional framing.

---

## 7. Main User Flow

```text
Landing / Presentation Introduction
        ↓
Open Simulation
        ↓
Review Default Café Parameters
        ↓
Adjust Economic Controls
        ↓
Run One-Day Simulation
        ↓
Watch Café Activity Animation
        ↓
View Business Result
        ↓
View Labour-Time Analysis
        ↓
View Surplus-Value Analysis
        ↓
Compare Before / After
        ↓
Discussion Question
```

---

## 8. Main Application Modes

### 8.1 Presentation Mode — MVP Priority P0

Designed for classroom presentation.

Characteristics:

- large typography;
- minimal controls;
- one-click simulation;
- one-click reset;
- predefined scenarios;
- charts visible without scrolling on common laptop screens;
- explanation cards after simulation.

### 8.2 Sandbox Mode — P1

Allows free experimentation.

Users can modify all supported simulation variables.

### 8.3 Compare Mode — P1

Allows comparison of Scenario A and Scenario B.

Example:

| Variable | Café A | Café B |
|---|---:|---:|
| Workers | 5 | 5 |
| Wage/hour | 25,000 | 40,000 |
| Work hours | 10 | 8 |
| Productivity | 3.0 | 3.0 |
| Price/cup | 50,000 | 50,000 |

Results should be compared using:

- revenue;
- wages;
- simplified surplus;
- worker daily income;
- necessary labour time;
- surplus labour time;
- surplus-value rate.

### 8.4 Scenario Mode — P1

Predefined teaching scenarios.

Recommended scenarios:

1. Baseline café;
2. Wage reduction;
3. Longer working day;
4. Productivity improvement;
5. Low customer demand;
6. Higher selling price;
7. More workers with insufficient demand;
8. Too few workers, overloaded.

---

## 9. Core Adjustable Variables

The MVP should support these inputs.

| Variable | Type | Suggested range | Default |
|---|---|---:|---:|
| `employeeCount` | integer | 1–20 | 5 |
| `hourlyWage` | currency | 15,000–100,000 | 30,000 |
| `workingHours` | decimal | 4–12 | 8 |
| `productivityPerWorkerHour` | decimal | 0.5–10 | 3 |
| `optimalWorkingHours` | decimal | 4–12 | 8 |
| `productPrice` | currency | 20,000–150,000 | 50,000 |
| `materialCostPerUnit` | currency | 5,000–80,000 | 15,000 |
| `dailyEquipmentCost` | currency | 0–5,000,000 | 500,000 |
| `customerDemand` | integer units/day | 0–500 | 100 |

Optional P1 variable:

| Variable | Description |
|---|---|
| `productivityMultiplier` | Equipment upgrade multiplier |
| `fixedOperatingCost` | Additional simplified fixed cost |
| `wageMode` | Hourly vs fixed daily wage |
| `demandMultiplier` | Scenario modifier |

---

## 10. Simulation Rules

### 10.1 Production capacity

```text
productionCapacity
= employeeCount
× workingHours
× effectiveProductivity
```

`effectiveProductivity` equals `productivityPerWorkerHour` unless workers are overloaded (see 10.10).

### 10.2 Units sold

```text
unitsSold
= min(productionCapacity, customerDemand)
```

For MVP, unsold production does not generate revenue.

### 10.3 Revenue

```text
revenue
= unitsSold × productPrice
```

### 10.4 Wage cost

```text
totalWages
= employeeCount × workingHours × hourlyWage
```

### 10.5 Material cost

```text
materialCost
= unitsSold × materialCostPerUnit
```

For presentation simplicity, materials are counted only for sold units in MVP.

A later version may distinguish produced units and sold units.

### 10.6 Constant capital approximation

The game uses a simplified constant-capital value:

```text
constantCapital
= materialCost + dailyEquipmentCost
```

### 10.7 Variable capital approximation

```text
variableCapital
= totalWages
```

### 10.8 Simplified remaining value

```text
remainingValue
= revenue
- constantCapital
- variableCapital
```

For the educational display:

```text
surplusValue = max(0, remainingValue)
```

The UI must label this as a **simplified educational approximation**.

### 10.9 Simplified profit

For MVP:

```text
simplifiedProfit = remainingValue
```

Do not claim that this equals real-world accounting profit in every situation.

### 10.10 Worker overload

One person works at full productivity for a limited number of hours a day (`optimalWorkingHours`, default 8). When there are too few workers for the demand, each one has to do more than that, and productivity falls.

```text
loadPerWorker
= customerDemand / employeeCount

sustainableLoad
= productivityPerWorkerHour × optimalWorkingHours

overloadRatio
= loadPerWorker / sustainableLoad
```

If `overloadRatio <= 1`, workers are not overloaded and `overloadFactor = 1`.

Otherwise:

```text
overloadFactor
= max(0.6, 1 - 0.3 × (overloadRatio - 1))

effectiveProductivity
= productivityPerWorkerHour × overloadFactor
```

Example:

```text
3 workers, demand 100, productivity 3, optimal hours 8

loadPerWorker   = 100 / 3  = 33.3
sustainableLoad = 3 × 8    = 24
overloadRatio   = 33.3 / 24 = 1.39
overloadFactor  = 1 - 0.3 × 0.39 = 0.88
effectiveProductivity = 3 × 0.88 = 2.65

productionCapacity = floor(3 × 8 × 2.65) = 63
```

The penalty rate (0.3) and the floor (0.6) are fixed model constants. The rule is an illustrative simplification, not an empirical law, and the UI must say when it is in effect.

The baseline café (5 workers, demand 100) asks 20 units of each worker against a sustainable 24, so it is not overloaded and its documented numbers are unchanged.

---

## 11. Labour-Time Model

A major visual feature is the division of the working day.

The game should derive an educational estimate of necessary labour time from the ratio:

```text
necessaryLabourShare
= variableCapital / (variableCapital + surplusValue)
```

If `variableCapital + surplusValue <= 0`, the labour-time analysis is unavailable.

Then:

```text
necessaryLabourHours
= workingHours × necessaryLabourShare

surplusLabourHours
= workingHours - necessaryLabourHours
```

Example:

```text
Working day = 8h
V = 1,200,000
M = 1,800,000

Necessary share
= 1,200,000 / 3,000,000
= 0.40

Necessary labour
= 8 × 0.40
= 3.2h

Surplus labour
= 8 - 3.2
= 4.8h
```

UI:

```text
08:00              11:12                         16:00
|==================|==============================|
 Necessary labour          Surplus labour
```

This visualization must include a tooltip explaining that it is an educational abstraction.

---

## 12. Surplus-Value Rate

The game displays:

```text
surplusValueRate
= surplusValue / variableCapital × 100
```

Notation:

```text
m' = m / v × 100%
```

Where:

- `m` = surplus value;
- `v` = variable capital / wage expenditure.

If `variableCapital = 0`, do not divide by zero. Display `N/A`.

---

## 13. Required Screens

### 13.1 Landing Screen

Content:

- Capital Café logo/title;
- topic statement;
- short educational disclaimer;
- `Start Presentation` button;
- optional `Sandbox` button.

### 13.2 Simulation Screen

Three-column desktop layout:

```text
┌────────────────┬────────────────────────┬──────────────────┐
│ Control Panel  │ Café Simulation        │ Analysis Panel   │
│                │                        │                  │
│ Workers        │ workers + customers    │ Revenue          │
│ Wage           │ animated orders        │ Wages            │
│ Work hours     │ time progression       │ Costs            │
│ Productivity   │                        │ Surplus          │
│ Price          │                        │ m'               │
│ Demand         │                        │                  │
│                │                        │                  │
│ Run / Reset    │                        │                  │
└────────────────┴────────────────────────┴──────────────────┘
```

### 13.3 Results / Analysis State

After a run, display:

- production;
- demand;
- sales;
- revenue;
- material cost;
- equipment cost;
- wages;
- remaining value;
- worker compensation;
- owner/surplus result;
- labour timeline;
- surplus-value rate.

### 13.4 Compare Screen

Side-by-side comparison of two parameter sets.

### 13.5 Theory / Explanation Drawer

Short definitions:

- capitalist;
- worker;
- labour power;
- wage;
- constant capital;
- variable capital;
- necessary labour;
- surplus labour;
- surplus value;
- rate of surplus value.

---

## 14. Presentation Scenarios

### Scenario A — Baseline

Purpose: establish the normal café.

### Scenario B — Lower Wage

Change only wage.

Show:

- worker income falls;
- wage cost falls;
- remaining value may rise;
- surplus-value rate may rise.

### Scenario C — Longer Working Day

Change work hours.

Show:

- production capacity changes;
- wages may change when hourly wage is used;
- labour-time proportions and absolute hours change.

For an **absolute surplus value** presentation, a special scenario may freeze daily wage while extending working time. This scenario must be labeled as an educational case rather than the default hourly-wage rule.

### Scenario D — Productivity Increase

Increase productivity while leaving work hours and wage rate unchanged.

Show:

- capacity rises;
- actual sales rise only if sufficient demand exists;
- demand limits prevent the false idea that higher capacity always creates more realized revenue.

### Scenario E — Demand Constraint

Increase productivity while demand stays low.

Show:

- not all production capacity becomes sales;
- surplus cannot simply increase without market realization.

This prevents the model from becoming mechanically misleading.

---

## 15. Functional Requirements

### FR-001 Parameter controls

The user can edit all P0 simulation parameters.

### FR-002 Input validation

The system prevents impossible input such as:

- negative employees;
- negative working hours;
- negative wages;
- negative prices;
- non-finite numbers.

### FR-003 Run simulation

A single action calculates the complete daily result.

### FR-004 Reset

Reset returns the simulator to the selected scenario defaults.

### FR-005 Simulation animation

Running a simulation triggers a short visual sequence.

Animation should communicate:

1. café opens;
2. workers work;
3. orders are produced;
4. sales occur;
5. wages/costs are deducted;
6. results appear.

### FR-006 Result transparency

Users can expand a `How is this calculated?` section.

### FR-007 Scenario presets

Presenter can select a scenario without manually entering every parameter.

### FR-008 Comparison

Store a snapshot as A and compare it with another run B.

### FR-009 Currency formatting

Use Vietnamese đồng formatting by default.

Example:

```text
1.200.000 ₫
```

### FR-010 Educational labels

Every theoretical metric has a short explanation.

### FR-011 Responsive behavior

Desktop is presentation priority.

Tablet/mobile should remain usable, but no complex redesign is required for MVP.

### FR-012 URL persistence — P1

Optional:

Encode scenario parameters into URL query parameters so a presenter can share a configured simulation without a database.

---

## 16. Non-Functional Requirements

### Performance

- first meaningful screen should load quickly on classroom Wi-Fi;
- no large video files;
- animation should remain smooth on ordinary laptops;
- simulation calculations should execute locally and immediately.

### Reliability

- no external API should be required for core simulation;
- a classroom demo must continue working after the page is already loaded even if the network becomes unstable.

### Accessibility

- keyboard-operable controls;
- visible focus states;
- sufficient contrast;
- text labels in addition to color;
- respect `prefers-reduced-motion`.

### Maintainability

- formulas live in a dedicated domain module;
- UI components must not duplicate economic formulas;
- scenario data should be configuration-driven.

### Security

MVP stores no sensitive personal data.

If analytics are later added:

- collect only anonymous, minimal usage events;
- do not store student personal information by default.

---

## 17. UX Requirements

### Presentation-first visual hierarchy

Most visually important:

1. changed parameter;
2. simulation activity;
3. economic result;
4. labour-time division;
5. discussion question.

### Controls

Prefer:

- sliders for intuitive ranges;
- numeric input next to each slider for precision;
- preset buttons for scenarios.

### Result cards

Recommended primary cards:

```text
Revenue
Total Wages
Surplus Value
Surplus-Value Rate
Worker Daily Income
Units Sold
```

### Charts

Use simple charts only:

- stacked value bar;
- labour-time bar;
- before/after bar chart;
- optional revenue/cost waterfall.

Avoid dashboards overloaded with small charts.

---

## 18. Educational Disclaimer

The application must display a concise notice similar to:

> Capital Café is a simplified educational simulation. The surplus-value section illustrates concepts from Marxian political economy. Real business profit is influenced by many additional factors, and other economic theories explain profit through factors such as capital, risk, entrepreneurship, innovation, market structure, and coordination.

---

## 19. Success Criteria

The MVP is successful if:

1. presenter can configure and run a scenario within 10 seconds;
2. audience can identify which number represents worker wages;
3. audience can identify which number represents surplus value in the model;
4. changing one parameter updates the result consistently;
5. labour-time visualization matches the calculation;
6. comparison mode clearly shows before/after effects;
7. production build deploys successfully to Vercel;
8. the app requires no backend for normal presentation use;
9. no calculation is duplicated across unrelated UI components.

---

## 20. MVP Acceptance Checklist

- [ ] React + TypeScript + Vite project runs locally.
- [ ] All P0 controls implemented.
- [ ] Pure simulation engine implemented.
- [ ] Input validation implemented.
- [ ] Revenue calculation correct.
- [ ] Wage calculation correct.
- [ ] Cost calculation correct.
- [ ] Surplus calculation correct.
- [ ] Surplus-value rate correct.
- [ ] Necessary/surplus labour calculation correct.
- [ ] Presentation Mode implemented.
- [ ] Run animation implemented.
- [ ] Results panel implemented.
- [ ] Theory explanations implemented.
- [ ] Scenario presets implemented.
- [ ] Reset works.
- [ ] Responsive desktop/tablet layout works.
- [ ] Reduced-motion fallback works.
- [ ] Unit tests cover formulas.
- [ ] `npm run build` passes.
- [ ] Production deployed on Vercel.

---

## 21. Future Enhancements

Possible post-MVP additions:

- teacher-created scenarios;
- saved scenario links;
- CSV export;
- presentation fullscreen mode;
- classroom voting;
- bilingual Vietnamese/English UI;
- PWA/offline support;
- advanced market simulation;
- distinction between produced and sold inventory;
- rent, tax, interest, maintenance, and depreciation;
- optional backend for shared scenarios;
- Vercel Functions for server-side scenario storage;
- database integration if persistent collaborative features become necessary.

---

## 22. Final Product Positioning

Capital Café should feel like:

> **an interactive economic argument expressed as a café simulation**

not:

> a café tycoon game with economics added afterward.

Every feature must be evaluated against one question:

> Does this feature make the relationship among labour, wages, capital, production, and surplus value easier to understand?

If the answer is no, it should not be part of the MVP.
