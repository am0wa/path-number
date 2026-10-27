import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Badge, Button, Form, InputGroup } from 'react-bootstrap';

import { KeyboardKey } from '../core/keyboard';
import { dateAsDigits, pathNumberOf, sanitize } from '../core/path-number';

export const PathNumberComponent = () => {
  const [input, setInput] = useState('');
  const [greeting, setGreeting] = useState<string>();

  const pathNumber = pathNumberOf(input);

  const check = (value: string) => {
    setGreeting(undefined);
    setInput(sanitize(value));
  };

  const letGo = () => {
    setGreeting('♥️');
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
    <div className="path-number-form">
      <h2>Good Luck: <Badge bg="success">{pathNumber ?? greeting ?? '#'}</Badge></h2>
      <InputGroup>
        <Form.Control
          placeholder="check number"
          name="numToCheckInput"
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoComplete="off"
        />
        <Button variant="outline-success" onClick={letGo}>Let Go</Button>
      </InputGroup>
      <Button variant="outline-info" onClick={() => check(dateAsDigits(new Date()))}>
        Today's Date
      </Button>
    </div>
  );
};
