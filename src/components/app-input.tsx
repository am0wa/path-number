import { useId, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { Alert, Form } from 'react-bootstrap';

import { type AlertInfo, AlertType } from '../ui';
import { KeyboardKey } from '../core/keyboard';

interface AppInputProps {
  name: string;
  placeholder: string;
  type?: string;
  label?: string;
  value: string | undefined;
  /** ms; leading-edge throttle of `onChange` */
  throttleTime?: number;
  description?: string;
  alertMessage?: string;
  datalist?: string[];
  autoComplete?: 'on' | 'off';
  onChange?: (input: string) => void;
  onEnterKey?: () => void;
  id?: string;
  log?: boolean;
}

export const AlertElement = ({ alert }: { alert: AlertInfo | undefined }) =>
  alert ? <Alert variant={alert.type} dismissible>{alert.message}</Alert> : null;

export const AppInputComponent = ({
  name,
  placeholder,
  type = 'text',
  label,
  value,
  throttleTime = 0,
  description,
  alertMessage,
  datalist,
  autoComplete,
  onChange,
  onEnterKey,
  id = name,
  log,
}: AppInputProps) => {
  const datalistId = useId();
  const lastEmitAt = useRef(-Infinity);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (log) {
      console.log(`Input changed: '${name}' value: ${value}`);
    }
    const now = Date.now();
    if (now - lastEmitAt.current >= throttleTime) {
      lastEmitAt.current = now;
      onChange?.(value);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === KeyboardKey.Enter && onEnterKey) {
      event.preventDefault();
      onEnterKey();
    }
  };

  return (
    <Form.Group className="mb-3" controlId={id}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        list={datalist ? datalistId : undefined}
      />
      {datalist && (
        <datalist id={datalistId}>
          {datalist.map((item) => <option key={item} value={item} />)}
        </datalist>
      )}
      {description && <Form.Text>{description}</Form.Text>}
      <AlertElement alert={alertMessage ? { type: AlertType.Warning, message: `${alertMessage} ${name}` } : undefined} />
    </Form.Group>
  );
};

export default AppInputComponent;
