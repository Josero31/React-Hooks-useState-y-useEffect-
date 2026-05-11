import { useState, useEffect, useRef } from 'react';

const DEMO_TIME = 10; // 10 segundos para probar rápido

export default function PomodoroN1() {
  // TODO 1: estados del timer
  const [timeLeft, setTimeLeft]   = useState(DEMO_TIME);
  const [isRunning, setIsRunning] = useState(false);

  // TODO 2: ref para guardar el ID del intervalo (no dispara re-renders)
  const intervalRef = useRef(null);

  // TODO 3: efecto que maneja la cuenta regresiva
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1); // forma funcional: evita el problema del closure
      }, 1000);
    }

    if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(intervalRef.current); // cleanup obligatorio
  }, [isRunning, timeLeft]);

  // TODO 4: formatear segundos a "MM:SS"
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // TODO 5: funciones de control
  function toggleTimer() {
    setIsRunning(prev => !prev);
  }

  function resetTimer() {
    setIsRunning(false);
    setTimeLeft(DEMO_TIME);
  }

  // TODO 6: render
  return (
    <div className="card">
      <p className="level-title">Solución de Referencia — Nivel 1</p>

      <div className="clock-wrap">
        <div className="clock-circle">
          <span className="clock-time">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <p className="demo-note">Demo con 10 segundos para prueba rápida</p>

      <div className="btn-row">
        <button className="btn-primary" onClick={toggleTimer}>
          {isRunning ? '⏸ Pausar' : '▶ Iniciar'}
        </button>
        <button className="btn-secondary" onClick={resetTimer}>
          ↺ Reiniciar
        </button>
      </div>
    </div>
  );
}
