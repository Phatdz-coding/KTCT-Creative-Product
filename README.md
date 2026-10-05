# Capital Café

An interactive educational café simulation for a Political Economy presentation. The presenter adjusts workers, wages, working hours, productivity, price, costs and demand, runs one working day, and sees how revenue, wages and surplus value change.

It is a simplified educational model based mainly on Marxian political economy, not a complete model of real-world accounting.

> Status: the simulation engine, Presentation Mode, eight scenarios, Compare Mode and the theory drawer are implemented, with a Vietnamese interface. Not yet built: a separate Sandbox mode, shareable URL parameters and the fixed-daily-wage variant.

## Documentation

- [Product requirements](docs/PRD.md)
- [Technical requirements](docs/TRD.md)
- [Project plan](docs/PROJECT_PLAN.md)

## Stack

React, TypeScript, Vite, Zustand, Zod, Recharts, Framer Motion, Vitest with React Testing Library, Playwright, ESLint, Prettier. Styling uses CSS Modules.

## Install

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
```

## Run

```bash
npm run dev
```

## Presenting

Use the three-column layout on a window at least 1144px wide; it scales its type to the window and fits without scrolling, including in a laptop browser with tabs showing. Narrower windows (for example a 1024×768 projector) fall back to a stacked layout that scrolls.

| Key     | Action             |
| ------- | ------------------ |
| `1`–`8` | Load a scenario    |
| `R`     | Run the simulation |
| `F`     | Toggle fullscreen  |

## Test

```bash
npm run test        # unit and component tests (Vitest)
npm run test:e2e    # end-to-end tests (Playwright)
```

The Playwright browsers are not installed by `npm install`. Run `npx playwright install chromium` once before the first end-to-end run.

## Lint and format

```bash
npm run lint
npm run format
```

## Build

```bash
npm run build
```

The production output is written to `dist/`.

## Deployment

The app deploys to Vercel as a static Vite build. Import the Git repository into Vercel; it detects Vite and runs `npm run build` with `dist` as the output directory. Pushes to `main` deploy to production, and other branches get preview deployments.

## Project layout

```text
docs/         PRD, TRD and project plan
public/       static assets
src/app/      application shell
src/components/  UI components (common, controls, cafe, analysis, theory)
src/features/ simulator, scenarios and comparison logic
src/content/  Vietnamese interface text and theory definitions
src/pages/    top-level screens
src/lib/      shared utilities
src/styles/   global styles
tests/e2e/    Playwright tests
```
