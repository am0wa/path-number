import React, { Component, SyntheticEvent } from 'react';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import InputGroup from 'reactstrap/lib/InputGroup';
import Input from 'reactstrap/lib/Input';
import Button from 'reactstrap/lib/Button';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import Badge from 'reactstrap/lib/Badge';
import { KeyboardKey } from '../core/keyboard';

interface PathNumberState {
  greeting?: string,
  numToCheckInput: string,
  pathNumber: number | undefined
}

const alphabet = [
  'A','B','C','D','E','F','G','H','I',
  'J','K','L','M','N','O','P','Q','R',
  'S','T','U','V','W','X','Y','Z'
]
const letterOrNumberRegExp = /^[0-9a-zA-Z]+$/

export class PathNumberComponent extends Component<{},PathNumberState> {

  state: PathNumberState = {
    numToCheckInput: '',
    pathNumber: undefined
  };

  readonly numInputEmitter = new Subject<string>();
  readonly numInput$: Observable<string> = this.numInputEmitter.asObservable();

  componentDidMount(): void {
    this.numInput$.pipe(
      debounceTime(100)
    ).subscribe(
      (input) => this.calculatePathNumberFromInput(input)
    )
  }

  render() {
    return (
      <div>{this.renderCustomNumInputForm()}</div>
    )
  }

  renderCustomNumInputForm(){
    return (
      <div className={'path-number-form'}>
        <h2>Good Luck: <Badge color="success">
          {this.state.pathNumber || this.state.greeting || '#'}
        </Badge></h2>
        <InputGroup>
          <Input
            placeholder="check number"
            name="numToCheckInput"
            value={this.state.numToCheckInput}
            onChange={this.onNumInputChange}
            autoComplete={'off'}
            onKeyDown={this.onNumInputKeyDown}
            onKeyUp={this.onNumInputKeyUp}
            /* no keypress on mobile */
          />
          <InputGroupAddon addonType="append">
            <Button outline color="success" onClick={this.cleanUp}>
              {'Let Go'}
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Button outline color="info" onClick={this.calculateDatePathNumber}>
          {'Today\'s Date'}
        </Button>
      </div>
    )
  };

  onNumInputKeyUp = (event: React.KeyboardEvent) => {
    console.log(`keyup: ${event.key} code: ${event.keyCode} which: ${event.which} charCode: ${event.charCode}`);
  };

  onNumInputKeyDown = (event: React.KeyboardEvent) => {
    // commented for less output
    // console.log(`keydown: ${event.key} code: ${event.keyCode} which: ${event.which} charCode: ${event.charCode}`);
    if (event.key === KeyboardKey.Enter) {
      event.preventDefault();
      this.onNumInputEnter();
    }
    if (event.key === KeyboardKey.Backspace) {
      event.preventDefault();
      const { length } = this.state.numToCheckInput;
      const lastCharIdx = length > 0 ? length - 1 : 0;
      const withoutLastChar = this.state.numToCheckInput.substr(0, lastCharIdx);
      this.numInputEmitter.next(withoutLastChar);
    }
  };

  onNumInputEnter = () => {
    this.cleanUp();
  };

  onNumInputChange = (event: SyntheticEvent) => {
    event.preventDefault();
    const { value } = event.target as HTMLInputElement;
    this.numInputEmitter.next(value);
  };

  calculatePathNumberFromInput = (value: string) => {
    if (+value >= Number.MAX_VALUE) {
      return;
    }

    const newValue: string = this.sanitizeLetters(value)

    this.setState((prevState) => (
      {
        ...prevState,
        greeting: undefined,
        numToCheckInput: newValue
      })
    );

    this.calculatePathNumber(this.replaceLettersWithDigits(newValue));
  };

  cleanUp = () => {
    this.setState({
      greeting: '♥️',
      numToCheckInput: '',
      pathNumber: undefined
    });
  };

  calculateDatePathNumber = () => {
     const today = new Date();
     const dateNum = ''
       + today.getFullYear()
       + (today.getMonth() + 1)
       + today.getDate();
     this.calculatePathNumberFromInput(dateNum);
  };

  calculatePathNumber = (strNum: string | number): void => {
     const pathNumber = this.calculateDigitsSum(strNum);

     const message = `Path number is: ${pathNumber}`;
     console.info(message);

    this.setState((prevState) => ({ ...prevState, pathNumber }));
  };

  sanitizeLetters = (input: string): string => {
    return ('' + input).split('')
      .map((char) => { // sanitize value
        if (char.match(letterOrNumberRegExp)) {
          return char;
        } else {
          console.warn(`Value was sanitized: ${char}`);
          return '';
        }
      })
      .join('');
  }

  replaceLettersWithDigits = (letters: string): string => {
    return ('' + letters).split('')
      .map(letterOrDigit => { // replace letter with digit
        const idx = alphabet.indexOf(letterOrDigit.toUpperCase());
        if (idx !== -1) {
          console.warn(`Letter ${letterOrDigit} was converted to: ${idx + 1}`);
          return idx + 1;
        }
        const digit = parseInt(letterOrDigit, 10);
        return digit ?? -1;
      })
      .filter(num => num > 0)
      .join('');
  }

  calculateDigitsSum = (strNum: string | number): number | undefined => {
    const sum: number = ('' + strNum).split('')
      .map((str) => parseInt(str, 10))
      .reduce((acc, digit) => acc + digit, 0);

    if (isNaN(sum)) {
      return undefined;
    }

    return sum < 10
      ? sum
      : this.calculateDigitsSum(sum);
  }
}

