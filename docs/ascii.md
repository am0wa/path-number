# ASCII lotus

The lotus spinner is made in two stages. A one-off script turns the image into brightness data, and the page animates that data as text.

```
lotus_inverted.jpg ──npm run lotus──▶ lotus.ascii.ts ──every ~33ms──▶ <pre> text
   (image)          generate-lotus.ts    (brightness grid)   core/lotus.ts      lotus-spinner.tsx
```

## 1. Converting the image (`scripts/generate-lotus.ts`)

This runs once with `npm run lotus` and uses `jimp` to read `public/lotus_inverted.jpg`.

1. **Crop:** it finds the box around everything brighter than the background (`BACKGROUND = 40`) and drops the black margins.
2. **Shrink:** it resizes the image to `COLS = 216` columns. The height is halved (`CELL_ASPECT = 0.5`) because a text character is about twice as tall as it is wide, so the flower isn't stretched. That gives 74 rows.
3. **Measure brightness:** each cell gets a value from 0 to 1. It's scaled against the brightest cell, then lifted with `GAMMA = 0.6` so thin petal lines don't fade out when shrunk.
4. **Encode:** each value is stored as one symbol from ` 123…xyz`, which gives 36 levels. A space means background, and anything too dark to show a character is set to background for good.

The output, `src/components/lotus.ascii.ts`, stores **brightness levels, not characters**. That's what lets the page animate it smoothly. Don't edit it by hand: change the script and re-run `npm run lotus`.

## 2. The animation (`src/core/lotus.ts`)

This is the same model the [devault-ascii](https://devault-ascii.pages.dev/ascii-generator/app/) generator uses for its Animate and Twinkle settings. For each lit cell at time `t` (in seconds):

```
brightness = level + 0.27 × ( 0.22·sin(2.2t + phase)          ← twinkle
                            + 0.14·sin(1.3t + 0.17x + 0.11y) ) ← breathing
character  = RAMP[brightness × 10]     RAMP = " .:-=+*#%@"
```

- **Twinkle:** every cell gets its own random `phase` when the page loads, so cells pulse out of step with each other. That's the sparkle.
- **Breathing:** the second wave depends on the cell's position (`x`, `y`). It forms a slow brightness swell that drifts diagonally across the flower.
- **`TWINKLE = 27`** scales both waves. The largest swing is just under one step on the ramp, so the flower shimmers without losing its shape.
- **Background cells** are never animated, so the dark around the flower stays clean.

`lotusFrame(seconds)` builds the full 216 × 74 text for one moment in time. Passing `null` gives the still flower.

## 3. On the page (`src/components/lotus-spinner.tsx` and `src/App.css`)

- **Frame loop:** the component runs a `requestAnimationFrame` loop but only updates about 30 times a second (`FRAME_MS = 33`). Each update re-renders the `<pre>` with `lotusFrame(now)`.
- **Reduced motion:** if the user's system asks for reduced motion, it shows the still frame and never starts the loop.
- **Size:** `.App-lotus` fits the 216 columns into `min(content width × φ, screen width minus gutters)`, about 680px. Each character is 0.6em wide and 1.2em tall, the same 2:1 shape the script assumed.
- **Bloom 15:** the glow is two soft `text-shadow` layers in the accent colour at 15% strength (`--bloom`).

## Where to tune

| Setting | Where | Re-run `npm run lotus`? |
|---|---|---|
| Detail, crop, line strength, characters | `COLS`, `BACKGROUND`, `GAMMA`, `RAMP` in `scripts/generate-lotus.ts` | yes |
| Twinkle | `TWINKLE` in `src/core/lotus.ts` | no |
| Frame rate | `FRAME_MS` in `src/components/lotus-spinner.tsx` | no |
| Glow, size | `--bloom`, `--width` in `.App-lotus` in `src/App.css` | no |

## Tests

- `tests/core/lotus.test.ts` covers the ramp mapping, frame size, the still frame, that the flower actually breathes, and that the background stays dark with no cell moving more than one ramp step.
- `tests/components/lotus-spinner.test.tsx` covers that the spinner animates over time and holds still under reduced motion.
