# Path Number

A calm, single-screen app at [soulway.io](https://soulway.io) that reduces a name or date to its path number: a single digit from 1 to 9.

## How it works

1. Only latin letters, digits and single separators (space or dot) are kept.
2. Each letter becomes its alphabet position (A=1 … Z=26). Zeros and separators are dropped.
3. The digits are summed, and the sum is summed again until one digit is left.

For example, `abc` → `123` → **6**, and `1988.01.01` → `19880101` → 28 → **1**.

The logic lives in `src/core/path-number.ts`. The animated ASCII lotus is explained in [docs/ascii.md](docs/ascii.md).

## Development

Built with React 19, Vite and Vitest.

| Command | What it does |
|---|---|
| `npm start` | Starts the dev server |
| `npm test` | Runs the tests in watch mode (`npx vitest run` runs them once) |
| `npm run typecheck` | Type-checks the project |
| `npm run build` | Type-checks and builds into `build/` |
| `npm run preview` | Serves the production build locally |
| `npm run lotus` | Regenerates the ASCII lotus from `public/lotus_inverted.jpg` |
| `npm run deploy` | Builds and publishes to the `gh-pages` branch (the live site) |
