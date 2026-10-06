# Coffee & Society — Ca làm việc của Barista

A local, frontend-only Vietnamese political-economy simulation. Built with React, TypeScript, Vite and hand-built SVG pixel art. The original static demo is preserved in `legacy/`.

## Run locally

Requires Node.js 22.13+ (or Node 24+) and npm.

```sh
npm install
npm run dev
```

Open the URL printed by Vite, normally http://127.0.0.1:5173.

```sh
npm run build
npm run preview
npm test
```

## Explore

Start a shift: eight simulated hours take 48 seconds at 1×, excluding pauses. Speed cycles 1× → 2× → 4×. At 01:36 the simulation pauses with a question; continue to reveal the labor timeline. Complete the shift to unlock the formula explanation and six What If sliders. Replay resets the shift and locks the lesson again.

Before starting, open **Thiết lập ca làm** to configure cups per shift (1–1,000), workers (1–6), hours (4–12), daily wages, price, materials, and operating costs. Click **Áp dụng thiết lập** to apply. Productivity is derived from the cup target divided by workers and hours. All shifts run in approximately 48 seconds at 1×. The HUD, café workers/menu, recovery point, timeline, formula, and What If baseline follow the selected configuration. Settings are locked during a shift; **Chơi lại** unlocks them and keeps the last applied values. Unsaved edits are discarded when starting or closing the panel. Settings are session-only and reset on page reload.

For custom settings, the wage question pauses at the first whole-cup sale that covers wages; the labor timeline uses the theoretical continuous rate. Shifts that never recover wages complete without that question and explain the shortfall.

The owner operates the register; three paid baristas operate the espresso station, prepare drinks, and serve customers. Every produced cup is assumed sold immediately. Full-shift wages are reserved from the start, so the initial remainder is negative.

## Important files

- `src/App.tsx`: main screen, economic HUD and progressive lesson
- `src/components/CoffeeShopScene.tsx`: reusable SVG characters, equipment and café
- `src/components/Education.tsx`: question modal, formula, tooltips and What If
- `src/components/ShiftSettings.tsx`: validated pre-shift configuration and preview
- `src/hooks/useSimulation.ts`: shift clock, speed and state transitions
- `src/lib/economics.ts`: independent calculations and default parameters
- `src/lib/economics.test.ts`: model and boundary tests
- `src/styles.css`: responsive pixel-game UI and animations

This is an intentionally simplified educational model, not a complete accounting model. It assumes fixed daily pay, fixed prices, all cups sold, and per-cup allocated operating costs. The lesson distinguishes Marxist value categories from accounting revenue/profit and qualifies the productivity analogy. No backend, database, authentication or paid APIs. Google Fonts is optional; system fonts work offline. Nothing is deployed.
