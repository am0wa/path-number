const HINT_ID = 'root-number-hint';

/** "?" in the corner that opens a short card on what the root number is; the browser's popover gives light dismiss and Escape. */
export const RootNumberHint = () => (
  <>
    <button
      type="button"
      className="gl-btn gl-btn--quiet App-quiet App-help"
      aria-label="What is the root number?"
      popoverTarget={HINT_ID}
    >
      ?
    </button>
    <div className="App-hint" id={HINT_ID} popover="auto">
      <p>Adds all digits again &amp; again until <b>one</b> is left</p>
      <p className="App-hint-example">108 → 1 + 0 + 8 → 9</p>
    </div>
  </>
);
