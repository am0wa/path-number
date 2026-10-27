import { PathNumberComponent } from './components/path-number.component';

import logo from './logo.svg';
import './App.css';

export const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <PathNumberComponent />
    </header>
    <footer className="App-footer">
      {new Date().getFullYear()} | © <a href="https://bit.ly/andriim" rel="noopener" target="_blank">am0wa</a> | <a href="https://bit.ly/am0wa-donate" rel="noopener" target="_blank">Donate</a>
    </footer>
  </div>
);

export default App;
