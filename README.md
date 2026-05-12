# Pomodoro Timer — React Hooks

Ejercicio práctico de **useState** y **useEffect** desarrollado para el curso de Software de Tecnologías Web (STW 2026) en la Universidad del Valle de Guatemala.

---

## Descripción

Implementación de un temporizador Pomodoro en tres niveles de dificultad progresiva, con el objetivo de entender el flujo de estado y efectos secundarios en React.

## Hooks utilizados

| Hook | Uso |
|------|-----|
| `useState` | Manejo de estado local (tiempo, modo, sesiones, configuración) |
| `useEffect` | Intervalo del timer, cambio de modo automático, sonido |
| `useRef` | Almacenar el ID del intervalo sin disparar re-renders |

---

## Niveles

### Nivel 1 — Guiado
Timer básico con inicio, pausa y reinicio. Se proporciona la estructura del componente con secciones `TODO` a completar.

- `useState` para `timeLeft` e `isRunning`
- `useRef` para el ID del intervalo
- `useEffect` con cleanup (`clearInterval`) obligatorio
- Formato `MM:SS` con `Math.floor` y `padStart`

### Nivel 2 — Semi-guiado
Extiende el Nivel 1 con alternancia automática entre sesiones de trabajo y descanso, más historial de sesiones completadas.

- Estado `mode` (`"work"` / `"break"`) y array `sessions`
- Segundo `useEffect` separado para detectar fin de sesión
- Actualización de arrays sin mutación: `[...prev, nueva]`

### Nivel 3 — Reto
Timer completo sin código base. El estudiante diseña la estructura.

- Inputs configurables para minutos de trabajo y descanso
- Barra de progreso visual
- Sonido al completar cada sesión
- Estadísticas derivadas con `.filter()` y `.reduce()`
- Guardado de sesión parcial sin detener el timer

---

## Estructura del proyecto

```
├── ejercicio_useEffect_useState.html   # Guía del ejercicio (abre en el navegador)
├── solucion_pomodoro.html              # Solución de referencia con React CDN
└── pomodoro-timer/                     # Proyecto Vite + React
    └── src/
        ├── App.jsx
        └── components/
            ├── PomodoroN1.jsx
            ├── PomodoroN2.jsx
            └── PomodoroN3.jsx
```

## Cómo correr el proyecto

```bash
cd pomodoro-timer
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

---

## Conceptos clave

**¿Por qué `setTimeLeft(prev => prev - 1)` y no `setTimeLeft(timeLeft - 1)`?**
Dentro del callback de `setInterval`, la variable `timeLeft` queda atrapada en un closure con su valor inicial. La forma funcional (`prev =>`) siempre accede al valor más reciente.

**¿Por qué `useRef` para el intervalo?**
Guardar el ID del intervalo en un `ref` evita que cada actualización dispare re-renders innecesarios. Los refs persisten entre renders sin causar uno nuevo.

**¿Por qué dos `useEffect` separados en el Nivel 2?**
Cada efecto debe tener una sola responsabilidad. Uno maneja la cuenta regresiva, otro detecta el fin de sesión y cambia el modo. Mezclarlos en uno solo dificulta el mantenimiento y genera bugs.

---

*STW 2026 — Universidad del Valle de Guatemala*
