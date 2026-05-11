import { useState, useEffect, useRef } from 'react';

export default function PomodoroN3() {
  const [workMins, setWorkMins]   = useState(1);   // configurable, 1 min por defecto (demo)
  const [breakMins, setBreakMins] = useState(1);
  const [mode, setMode]           = useState('work');
  const [timeLeft, setTimeLeft]   = useState(1 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions]   = useState([]);

  const intervalRef = useRef(null);

  // Valores derivados — no necesitan su propio useState
  const totalTime    = mode === 'work' ? workMins * 60 : breakMins * 60;
  const progress     = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const workSessions = sessions.filter(s => s.type === 'work');
  const totalWorkSec = workSessions.reduce((acc, s) => acc + s.duration, 0);

  // Efecto 1: intervalo del temporizador
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  // Efecto 2: fin de sesión → sonido + cambio de modo automático
  useEffect(() => {
    if (timeLeft !== 0) return;

    // Sonido al completar
    try {
      new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
    } catch (_) {}

    if (mode === 'work') {
      setSessions(prev => [...prev, {
        id: Date.now(),
        type: 'work',
        duration: workMins * 60,
        completedAt: new Date(),
      }]);
    }

    const nextMode = mode === 'work' ? 'break' : 'work';
    const nextTime = nextMode === 'work' ? workMins * 60 : breakMins * 60;
    setMode(nextMode);
    setTimeLeft(nextTime);
    setIsRunning(true);
  }, [timeLeft, mode, workMins, breakMins]);

  // Sincroniza timeLeft al cambiar la configuración (solo si no está corriendo)
  function handleWorkMins(val) {
    const mins = Math.max(1, Math.min(60, Number(val) || 1));
    setWorkMins(mins);
    if (!isRunning && mode === 'work') setTimeLeft(mins * 60);
  }

  function handleBreakMins(val) {
    const mins = Math.max(1, Math.min(60, Number(val) || 1));
    setBreakMins(mins);
    if (!isRunning && mode === 'break') setTimeLeft(mins * 60);
  }

  function toggleTimer() { setIsRunning(prev => !prev); }

  function resetTimer() {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(workMins * 60);
    setSessions([]);
  }

  // Guarda la sesión actual aunque no haya terminado
  function savePartial() {
    const elapsed = totalTime - timeLeft;
    if (elapsed <= 0) return;
    setSessions(prev => [...prev, {
      id: Date.now(),
      type: `${mode} (parcial)`,
      duration: elapsed,
      completedAt: new Date(),
    }]);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  return (
    <div className="card">
      <p className="level-title">Solución de Referencia — Nivel 3</p>

      {/* Configuración — deshabilitada mientras corre */}
      <div className="config-row">
        <div className="config-field">
          <label className="config-label">Trabajo (min)</label>
          <input
            type="number" min="1" max="60"
            value={workMins}
            disabled={isRunning}
            onChange={e => handleWorkMins(e.target.value)}
            className="config-input"
          />
        </div>
        <div className="config-field">
          <label className="config-label">Descanso (min)</label>
          <input
            type="number" min="1" max="60"
            value={breakMins}
            disabled={isRunning}
            onChange={e => handleBreakMins(e.target.value)}
            className="config-input"
          />
        </div>
      </div>

      {/* Badge de modo */}
      <div className="mode-badge-wrap">
        <span className={`mode-badge ${mode === 'break' ? 'mode-badge--break' : ''}`}>
          {mode === 'work' ? '🔥 Trabajo' : '🌿 Descanso'}
        </span>
      </div>

      {/* Reloj */}
      <div className="clock-wrap">
        <div className="clock-circle">
          <span className="clock-time">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Barra de progreso: (tiempoTotal - timeLeft) / tiempoTotal * 100 */}
      <div className="progress-track">
        <div
          className={`progress-fill ${mode === 'break' ? 'progress-fill--break' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Botones */}
      <div className="btn-row">
        <button className="btn-primary" onClick={toggleTimer}>
          {isRunning ? '⏸ Pausar' : '▶ Iniciar'}
        </button>
        <button className="btn-secondary" onClick={resetTimer}>
          ↺ Reiniciar
        </button>
        <button className="btn-blue" onClick={savePartial}>
          💾 Guardar parcial
        </button>
      </div>

      {/* Estadísticas derivadas */}
      <div className="stats-row">
        <div className="stat-box">
          <span className="stat-value stat-value--red">{workSessions.length}</span>
          <span className="stat-label">Sesiones</span>
        </div>
        <div className="stat-box">
          <span className="stat-value stat-value--green">{formatTime(totalWorkSec)}</span>
          <span className="stat-label">Tiempo total</span>
        </div>
      </div>

      {/* Historial */}
      {sessions.length > 0 && (
        <div className="session-list">
          <p className="session-list__title">Historial</p>
          <ul>
            {sessions.map((s, i) => (
              <li key={s.id} className="session-item">
                <span>#{i + 1} {s.type}</span>
                <span>{formatTime(s.duration)} · {s.completedAt.toLocaleTimeString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
