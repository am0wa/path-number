import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';

import { KeyboardKey } from '../core/keyboard';
import { dateAsDigits, pathNumberOf, sanitize } from '../core/path-number';
import { HeartIcon } from './heart-icon';

export const PathNumberComponent = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [cheered, setCheered] = useState(false);
  /** The number just let go; `seq` remounts the badge so the release animation replays on every "Let Go" */
  const [released, setReleased] = useState<{ value: number; seq: number }>();

  const pathNumber = pathNumberOf(input);

  const check = (value: string) => {
    setCheered(false);
    setReleased(undefined);
    setInput(sanitize(value));
  };

  const letGo = () => {
    // Nothing to let go: invite the next name or date instead
    if (!input) {
      inputRef.current?.focus();
    }
    if (pathNumber !== undefined) {
      setReleased({ value: pathNumber, seq: (released?.seq ?? 0) + 1 });
    }
    setCheered(true);
    setInput('');
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => check(event.target.value);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === KeyboardKey.Enter) {
      event.preventDefault();
      letGo();
    }
  };

  return (
    <main className="gl-content">
      <h1 className="gl-heading App-heading">Good Luck<span
          // Remounts per keystroke (the badge beats) and per "Let Go" (the release replays); input is empty while released
          key={released ? `released-${released.seq}` : input}
          className="gl-badge gl-badge--lg gl-badge--sage App-badge"
          data-beat={pathNumber !== undefined || undefined}
          data-released={released?.value}
        >
          {pathNumber ?? (cheered ? <HeartIcon /> : '#')}
        </span></h1>
      <div className="gl-field App-field" data-cheered={cheered || undefined}>
        <input
          ref={inputRef}
          className="gl-input App-input"
          placeholder="name or number"
          aria-label="name or number"
          name="numToCheckInput"
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoComplete="off"
        />
        <button type="button" className="gl-btn gl-btn--primary" onClick={letGo}>Let Go</button>
      </div>
      <div className="gl-row">
        <button type="button" className="gl-btn gl-btn--quiet App-quiet" onClick={() => check(dateAsDigits(new Date()))}>
          Today's Date
        </button>
      </div>
    </main>
  );
};
