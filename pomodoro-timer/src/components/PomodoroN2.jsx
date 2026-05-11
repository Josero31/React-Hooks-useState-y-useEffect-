import { useState, useEffect, useRef } from 'react';

const WORK_TIME  = 1500; // 25 minutos
const BREAK_TIME = 300;  // 5 minutos

export default function PomodoroN2() {
  const [timeLeft, setTimeLeft]   = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode]           = useState('work');       // "work" | "break"
  const [sessions, setSessions]   = useState([]);           // historial

  const intervalRef = useRef(null);

  // Efecto 1: cuenta regresiva (misma responsabilidad que Nivel 1)
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  // Efecto 2: detecta fin de sesión y cambia el modo automáticamente
  // (responsabilidad separada del efecto anterior)
  useEffect(() => {
    if (timeLeft !== 0) return;

    if (mode === 'work') {
      // spread [...prev, nueva] crea un nuevo array sin mutar el original
      setSessions(prev => [...prev, {
        id: Date.now(),
        type: 'work',
        duration: WORK_TIME,
        completedAt: new Date(),
      }]);
    }

    const nextMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setTimeLeft(nextMode === 'work' ? WORK_TIME : BREAK_TIME);
    setIsRunning(true); // arranca el siguiente ciclo automáticamente
  }, [timeLeft, mode]);

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function toggleTimer() { setIsRunning(prev => !prev); }

  function resetTimer() {
    setIsRunning(false);
    setTimeLeft(WORK_TIME);
    setMode('work');
    setSessions([]); // importante: el reinicio debe limpiar todo
  }

  return (
    <div className="card">
      <p className="level-title">Solución de Referencia — Nivel 2</p>

      <div className="mode-badge-wrap">
        <span className={`mode-badge ${mode === 'break' ? 'mode-badge--break' : ''}`}>
          {mode === 'work' ? '🔥 Trabajo' : '🌿 Descanso'}
        </span>
      </div>

      <div className="clock-wrap">
        <div className="clock-circle">
          <span className="clock-time">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="btn-row">
        <button className="btn-primary" onClick={toggleTimer}>
          {isRunning ? '⏸ Pausar' : '▶ Iniciar'}
        </button>
        <button className="btn-secondary" onClick={resetTimer}>
          ↺ Reiniciar
        </button>
      </div>

      {sessions.length > 0 && (
        <div className="session-list">
          <p className="session-list__title">
            Sesiones completadas — {sessions.filter(s => s.type === 'work').length} de trabajo
          </p>
          <ul>
            {sessions.map((s, i) => (
              <li key={s.id} className="session-item">
                <span>#{i + 1} {s.type === 'work' ? '🔥 Trabajo' : '🌿 Descanso'}</span>
                <span>{formatTime(s.duration)} · {s.completedAt.toLocaleTimeString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
