import React, { Component, SyntheticEvent } from 'react';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import InputGroup from 'reactstrap/lib/InputGroup';
import Input from 'reactstrap/lib/Input';
import Button from 'reactstrap/lib/Button';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import Badge from 'reactstrap/lib/Badge';

interface PathNumberState {
  greeting?: string,
  numToCheckInput: string,
  pathNumber: number | undefined
}

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

  onNumInputChange = (event: SyntheticEvent) => {
    const { value } = event.target as HTMLInputElement;
    this.numInputEmitter.next(value);
  };

  calculatePathNumberFromInput = (value: string) => {
    const newValue = parseInt(value, 10) || '';
    this.setState((prevState) => (
      {
        ...prevState,
        greeting: undefined,
        numToCheckInput: '' + newValue
      })
    );

    this.calculatePathNumber(newValue);
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

  calculateDigitsSum = (strNum: string | number): number => {
    const sum: number = ('' + strNum).split('')
      .map((str) => parseInt(str, 10))
      .reduce((acc, digit) => acc + digit, 0);

    return sum < 10 ? sum : this.calculateDigitsSum(sum);
  }
}

