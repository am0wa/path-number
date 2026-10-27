import { LotusSpinner } from './components/lotus-spinner';
import { PathNumberComponent } from './components/path-number';
import { RootNumberHint } from './components/root-number-hint';

import './App.css';

export const App = () => (
  <div className="gl-screen App">
    <div className="App-spacer" />
    <LotusSpinner />
    <PathNumberComponent />
    <div className="App-spacer App-spacer--below" />
    <footer className="gl-footer App-footer">
      <span>© {new Date().getFullYear()}</span>
      <span className="gl-dot">·</span>
      <a href="https://www.andriimur.com/" rel="author noopener" target="_blank">andriimur</a>
      <span className="gl-dot">·</span>
      <a href="https://ko-fi.com/am0wa" rel="noopener" target="_blank">Donate</a>
      <RootNumberHint />
    </footer>
  </div>
);

export default App;
