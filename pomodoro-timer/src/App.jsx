import { useState } from 'react';
import PomodoroN1 from './components/PomodoroN1';
import PomodoroN2 from './components/PomodoroN2';
import PomodoroN3 from './components/PomodoroN3';
import './index.css';

const TABS = [
  { n: 1, label: 'Nivel 1', sub: 'Guiado' },
  { n: 2, label: 'Nivel 2', sub: 'Semi-guiado' },
  { n: 3, label: 'Nivel 3', sub: 'Reto' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="app">
      <header className="app-header">
        <p className="app-course">Software de Tecnologías Web — STW 2026</p>
        <h1 className="app-title">Pomodoro Timer</h1>
        <div className="app-hooks">
          <code>useState</code>
          <code>useEffect</code>
          <code>useRef</code>
        </div>
      </header>

      <nav className="tabs">
        {TABS.map(({ n, label, sub }) => (
          <button
            key={n}
            className={`tab ${activeTab === n ? 'tab--active' : ''}`}
            onClick={() => setActiveTab(n)}
          >
            {label}
            <span className="tab__sub">{sub}</span>
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === 1 && <PomodoroN1 />}
        {activeTab === 2 && <PomodoroN2 />}
        {activeTab === 3 && <PomodoroN3 />}
      </main>
    </div>
  );
}
