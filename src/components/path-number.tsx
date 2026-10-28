import { useRef, useState, type ChangeEvent, type CSSProperties, type KeyboardEvent } from 'react';

import { KeyboardKey } from '../core/keyboard';
import { dateAsDigits, pathNumberOf, sanitize } from '../core/path-number';
import { HeartIcon } from './heart-icon';
import { SparkIcon } from './spark-icon';

/** Every this many taps on the heart, the next whisper rises over the heading; never over one still being read */
const WHISPER_EVERY = 3;
const WHISPERS = ['be present •', 'be aware ⊙', 'breathe ༄', "U're here ⊹", 'good things are coming ↟', 'do what U love ∞', 'listen Ur ♡', 'shine ✧', 'enjoy ^_^'];

/** One heart (a spark when a whisper rises) floating up from the badge; `drift` sways it sideways a little */
type LuckFloat = { id: number; drift: number; spark: boolean };

export const PathNumberComponent = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [cheered, setCheered] = useState(false);
  /** The number just let go; `seq` remounts the badge so the release animation replays on every "Let Go" */
  const [released, setReleased] = useState<{ value: number; seq: number }>();
  /** Taps on the heart since the last "Let Go"; keys the heart so its pulse replays on every tap */
  const [sent, setSent] = useState(0);
  const [floats, setFloats] = useState<LuckFloat[]>([]);
  /** Whispers said so far, and the tap that said the last one */
  const [said, setSaid] = useState({ lines: 0, at: 0 });
  /** A whisper is rising over the heading, until its fade ends */
  const [whispering, setWhispering] = useState(false);

  const pathNumber = pathNumberOf(input);

  const resetLuck = () => {
    setSent(0);
    setFloats([]);
    setSaid({ lines: 0, at: 0 });
    setWhispering(false);
  };

  const check = (value: string) => {
    setCheered(false);
    setReleased(undefined);
    resetLuck();
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
    resetLuck();
  };

  // A tap on the heart sends luck: the heart pulses and a small one floats up; every 3rd tap a spark flies instead and the next whisper rises
  const sendLuck = () => {
    const count = sent + 1;
    setSent(count);
    // Fast taps don't cut a whisper short: the next one waits until it has faded
    const whispers = !whispering && count - said.at >= WHISPER_EVERY;
    setFloats((current) => [...current, { id: count, drift: Math.round(Math.random() * 24 - 12), spark: whispers }]);
    if (whispers) {
      setSaid({ lines: said.lines + 1, at: count });
      setWhispering(true);
    }
    navigator.vibrate?.(10);
  };

  const hearted = pathNumber === undefined && cheered;
  const Badge = hearted ? 'button' : 'span';

  const onChange = (event: ChangeEvent<HTMLInputElement>) => check(event.target.value);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === KeyboardKey.Enter) {
      event.preventDefault();
      letGo();
    }
  };

  return (
    <main className="gl-content">
      <h1 className="gl-heading App-heading">Good Luck<Badge
          // Remounts per keystroke (the badge beats) and per "Let Go" (the release replays); input is empty while released
          key={released ? `released-${released.seq}` : input}
          className="gl-badge gl-badge--lg gl-badge--sage App-badge"
          data-beat={pathNumber !== undefined || undefined}
          data-released={released?.value}
          data-sent={sent || undefined}
          {...(hearted && { type: 'button', 'aria-label': 'Send good luck', onClick: sendLuck })}
        >
          {pathNumber ?? (cheered ? <HeartIcon key={sent} /> : '#')}
          {floats.map(({ id, drift, spark }) => (
            <span
              key={id}
              className="App-float"
              aria-hidden="true"
              style={{ '--drift': `${drift}px` } as CSSProperties}
              onAnimationEnd={() => setFloats((current) => current.filter((float) => float.id !== id))}
            >
              {spark ? <SparkIcon /> : <HeartIcon />}
            </span>
          ))}
        </Badge>{whispering && (
          // Over the whole heading, centred, so the longest whisper fits a narrow phone
          <span key={said.lines} className="App-whisper" aria-hidden="true" onAnimationEnd={() => setWhispering(false)}>
            {WHISPERS[(said.lines - 1) % WHISPERS.length]}
          </span>
        )}</h1>
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
