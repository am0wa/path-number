import { useState, type ChangeEvent, type KeyboardEvent } from 'react';

import { KeyboardKey } from '../core/keyboard';
import { dateAsDigits, pathNumberOf, sanitize } from '../core/path-number';
import { HeartIcon } from './heart-icon';

export const PathNumberComponent = () => {
  const [input, setInput] = useState('');
  const [cheered, setCheered] = useState(false);

  const pathNumber = pathNumberOf(input);

  const check = (value: string) => {
    setCheered(false);
    setInput(sanitize(value));
  };

  const letGo = () => {
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
      <h1 className="gl-heading App-heading">Good Luck<span className="gl-badge gl-badge--lg gl-badge--sage App-badge">{pathNumber ?? (cheered ? <HeartIcon /> : '#')}</span></h1>
      <div className="gl-field App-field" data-cheered={cheered || undefined}>
        <input
          className="gl-input App-input"
          placeholder="check number"
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
