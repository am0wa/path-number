import React, { Component, SyntheticEvent } from 'react';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

import {
  FormGroup,
  FormText,
  Input,
  Label,
  UncontrolledAlert
} from 'reactstrap';
import { InputType } from 'reactstrap/lib/Input';
import { AlertInfo, AlertType } from '../ui';
import { KeyboardKey } from '../core/keyboard';

interface AInputProps {
  name: string;
  placeholder: string;
  type?: InputType;
  label?: string;
  value: string | undefined;
  /** ms */
  throttleTime?: number;
  description?: string;
  alertMessage?: string;
  datalist?: string[];
  autoComplete?: 'on' | 'off'
  onChange?: (input: string) => void;
  onEnterKey?: () => void;
  id?: string;
  log?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAlertMessageEmptyForm = (name: string) => `It's an Empty field. Please input the ${name}`;

export const alertElement = (alert: AlertInfo | undefined) => {
  return alert
    ? <UncontrolledAlert color={alert.type}>{alert.message}</UncontrolledAlert>
    : null
};

export class AppInputComponent extends Component<AInputProps> {

  static alertElement(type: AlertType, message: string | undefined) {
    return message
      ? <UncontrolledAlert color={type}> {message}</UncontrolledAlert>
      : ''
  }

  static descriptionElement = (description: string | undefined) => {
    return description
      ? <FormText>{description}</FormText>
      : "";
  };

  static datalistElement = (datalist: string[] | undefined, listId: string) => {
    return datalist
      ? <datalist id={listId}>
          {AppInputComponent.datalistOptions(datalist)}
        </datalist>
      : "";
  };

  private static datalistOptions = (datalist: string[]) => {
    return datalist.map((item, index) => <option key={index} value={item}/>)
  };

  readonly input$: Observable<string>;
  private readonly _inputEmitter = new Subject<string>();
  private _inputSubscription?: Subscription;

  constructor(props: Readonly<AInputProps>) {
    super(props);
    this.input$ = this._inputEmitter.asObservable();
  }

  componentDidMount(): void {
    this._inputSubscription = this.input$.pipe(
      throttleTime(this.props.throttleTime || 0)
    ).subscribe(
      (input) => {
        if (this.props.onChange) {
          /* handled by parent*/
          this.props.onChange(input);
        }
      }
    )
  }

  componentWillUnmount(): void {
    this._inputSubscription?.unsubscribe();
  }

  render() {
    return (
      <FormGroup>
        {this.props.label && <Label for={this.props.id || this.props.name}>{this.props.label}</Label>}
        <Input
          type={this.props.type || "text"}
          name={this.props.name}
          id={this.props.id || this.props.name}
          placeholder={this.props.placeholder}
          autoComplete={this.props.autoComplete}
          value={this.props.value}
          onChange={this.onInputChange}
          onKeyDown={this.onKeyDown}
          list={this.props.datalist ? this.props.name +'s' : ''}
        />
        {AppInputComponent.datalistElement(this.props.datalist, this.props.name +'s')}
        {AppInputComponent.descriptionElement(this.props.description)}
        {
          alertElement({
            type: AlertType.Warning,
            message: this.props.alertMessage + ' ' + this.props.name
          })
        }
      </FormGroup>
    );
  };

  onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === KeyboardKey.Enter && this.props.onEnterKey) {
      event.preventDefault();
      this.props.onEnterKey();
    }
  };

  onInputChange = (event: SyntheticEvent) => {
    const { name, value } = event.target as HTMLInputElement;
    if (this.props.log){
      console.log(`Input changed: '${name}' value: ${value}`);
    }
    this._inputEmitter.next(value);
  };
}

export default AppInputComponent;
