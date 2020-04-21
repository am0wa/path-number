import React, { Component } from 'react';

import { PathNumberComponent } from './components/path-number.component';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    const today = new Date();
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <PathNumberComponent/>
        </header>
        <footer className="App-footer">
          {today.getFullYear()} | © <a href="https://bit.ly/andriim" rel="noopener" target="_blank">am0wa</a> | <a href="https://bit.ly/am0wa-donate" rel="noopener" target="_blank">Donate</a>
        </footer>
      </div>
    );
  }
}

export default App;
