import { PathNumberComponent } from './components/path-number';

import logo from './logo.svg';
import './App.css';

export const App = () => (
  <div className="gl-screen App">
    <div className="App-spacer" />
    <img src={logo} className="App-logo" alt="logo" />
    <PathNumberComponent />
    <div className="App-spacer App-spacer--below" />
    <footer className="gl-footer App-footer">
      <span>© {new Date().getFullYear()}</span>
      <span className="gl-dot">·</span>
      <a href="https://bit.ly/andriim" rel="noopener" target="_blank">am0wa</a>
      <span className="gl-dot">·</span>
      <a href="https://bit.ly/am0wa-donate" rel="noopener" target="_blank">Donate</a>
    </footer>
  </div>
);

export default App;
