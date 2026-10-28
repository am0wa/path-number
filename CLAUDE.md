# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Path Number: a single-screen React 19 + Vite app (deployed at soulway.io) that reduces a name or date to a single-digit "path number".
## Commands

- `npm start` — Vite dev server
- `npm test` — Vitest (watch mode); `npx vitest run` for a single pass
- Single test: `npx vitest run tests/core/path-number.test.ts` or `npx vitest run -t "pathNumberOf"`
- `npm run typecheck` — `tsc --noEmit` (also runs as part of `npm run build`; there is no linter)
- `npm run build` — output to `build/`
- `npm run deploy` — builds and publishes `build/` to the `gh-pages` branch (the live site; `public/CNAME` sets the domain). `master` is the source branch.
- `npm run lotus` — regenerates `src/components/lotus.ascii.ts` from `public/lotus_inverted.jpg`

## Architecture

- **`src/core/`** — pure, framework-free logic, unit-tested in `tests/core/`.
  - `path-number.ts`: `sanitize` → `lettersToDigits` (A=1…Z=26, separators/zeros dropped) → `digitsSum` (recursive digit sum) → `pathNumberOf`. Input is sanitized on every keystroke, not just on compute.
  - `lotus.ts`: animates the ASCII lotus — `lotusFrame(seconds | null)` maps per-cell brightness + twinkle/breathing waves onto a character ramp.
  - `keyboard.ts`: `KeyboardKey` / `KeyboardKeyCode` enums (incl. mobile `Unidentified` / 229 handling).
- **`src/components/`** — React UI. `path-number.tsx` holds the main interaction state: input, "Let Go" release animation, heart taps that float hearts and every 3rd tap raise a "whisper".
- **ASCII lotus pipeline** (fully documented in `docs/ascii.md`): `scripts/generate-lotus.ts` (jimp) → generated `lotus.ascii.ts` storing *brightness levels, not glyphs* → `core/lotus.ts` → `lotus-spinner.tsx` (rAF loop throttled to ~30fps, still frame under `prefers-reduced-motion`). Never hand-edit `lotus.ascii.ts`; change the script and re-run `npm run lotus`.
- **Styling** — plain CSS, no CSS-in-JS. `src/styles/tokens.css` holds design tokens (dark default) generated from the "Good Luck" design system in `design/good-luck-design/` (gitignored, local only — its `README.md` states the principles: one column, flat, calm palette, sentence case). `gl-*` component classes and `App-*` layout classes live in `src/App.css`.
## Conventions

- TypeScript strict with `verbatimModuleSyntax` — use `import type` / inline `type` imports for types.
- Tests live in `tests/` mirroring `src/`, use Vitest globals + jsdom + Testing Library (`tests/setup-tests.ts`).
- Code comments are short JSDoc one-liners explaining intent; match that density.
- Commit style: `feat(scope): message` (conventional commits, lowercase scope).
