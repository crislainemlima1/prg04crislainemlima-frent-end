import { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css';

const FOCO = 25 * 60;
const PAUSA = 5 * 60;
const RAIO = 78;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

function PomodoroTimer() {
  const [modo, setModo] = useState('foco');
  const [segundos, setSegundos] = useState(FOCO);
  const [rodando, setRodando] = useState(false);
  const [pomodorosFeitos, setPomodorosFeitos] = useState(3);
  const intervalRef = useRef(null);

  const totalSegundos = modo === 'foco' ? FOCO : PAUSA;

  useEffect(() => {
    if (rodando) {
      intervalRef.current = setInterval(() => {
        setSegundos((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRodando(false);
            if (modo === 'foco') setPomodorosFeitos((p) => Math.min(p + 1, 4));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [rodando]);

  function alternarModo(novoModo) {
    clearInterval(intervalRef.current);
    setRodando(false);
    setModo(novoModo);
    setSegundos(novoModo === 'foco' ? FOCO : PAUSA);
  }

  function resetar() {
    clearInterval(intervalRef.current);
    setRodando(false);
    setSegundos(totalSegundos);
  }

  const minutos = String(Math.floor(segundos / 60)).padStart(2, '0');
  const segs = String(segundos % 60).padStart(2, '0');
  const pct = segundos / totalSegundos;
  const offset = CIRCUNFERENCIA * (1 - pct);
  const corAnel = modo === 'foco' ? 'var(--ff-accent)' : 'var(--ff-green)';

  return (
    <div className="pomodoro">
      <div className="pomodoro-header">
        <h1>Timer Pomodoro</h1>
        <p>Foco total. 25 minutos por sessão, 5 minutos de pausa.</p>
      </div>

      <div className="pomodoro-grid">
        <div className="pomodoro-card pomodoro-centro">
          <div className="pomodoro-tabs">
            <button
              className={`pomodoro-tab ${modo === 'foco' ? 'active' : ''}`}
              onClick={() => alternarModo('foco')}
            >
              Foco · 25 min
            </button>
            <button
              className={`pomodoro-tab ${modo === 'pausa' ? 'active' : ''}`}
              onClick={() => alternarModo('pausa')}
            >
              Pausa · 5 min
            </button>
          </div>

          <div className="pomodoro-relogio">
            <svg viewBox="0 0 180 180" className="pomodoro-svg">
              <circle
                cx="90" cy="90" r={RAIO}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
              />
              <circle
                cx="90" cy="90" r={RAIO}
                fill="none"
                stroke={corAnel}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUNFERENCIA}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="pomodoro-tempo">
              <span className="pomodoro-digitos">{minutos}:{segs}</span>
              <span className="pomodoro-fase">
                {modo === 'foco' ? 'Foco' : 'Pausa'}
              </span>
            </div>
          </div>

          <div className="pomodoro-controles">
            <button className="pomodoro-btn-ghost" onClick={resetar}>↺</button>
            <button
              className="pomodoro-btn-primary"
              onClick={() => setRodando((r) => !r)}
            >
              {rodando ? 'Pausar' : segundos === totalSegundos ? 'Iniciar' : 'Continuar'}
            </button>
            <button className="pomodoro-btn-ghost" onClick={() => alternarModo(modo)}>⏭</button>
          </div>

          <div className="pomodoro-dots">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`pomodoro-dot ${i < pomodorosFeitos ? 'feito' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="pomodoro-lateral">
          <div className="pomodoro-card">
            <div className="pomodoro-card-titulo">Matéria atual</div>
            <select className="pomodoro-select">
              <option>Matemática — Cálculo</option>
              <option>Física — Mecânica</option>
              <option>Programação — React</option>
              <option>História — Brasil Colônia</option>
            </select>
            <div className="pomodoro-meta">
              <div className="pomodoro-meta-label">Foco hoje</div>
              <div className="pomodoro-meta-valor">1h 40min</div>
              <div className="pomodoro-barra">
                <div
                  className="pomodoro-barra-fill"
                  style={{ width: '67%', background: 'var(--ff-green)' }}
                />
              </div>
              <div className="pomodoro-meta-sub">Meta: 2h 30min</div>
            </div>
          </div>

          <div className="pomodoro-ai-box">
            <div className="pomodoro-ai-tag">IA · Dica de sessão</div>
            <p>
              Durante esta sessão, foque em <strong>limites laterais</strong>.
              Você errou 3 questões desse tipo ontem. Vou gerar um quiz ao final!
            </p>
          </div>

          <div className="pomodoro-card">
            <div className="pomodoro-card-titulo">Sessões de hoje</div>
            {[
              { materia: 'Programação', tempo: '50 min ✓', cor: 'var(--ff-green)', done: true },
              { materia: 'Matemática', tempo: '50 min ✓', cor: 'var(--ff-accent)', done: true },
              { materia: 'Matemática', tempo: 'em andamento', cor: 'var(--ff-accent)', done: false },
            ].map((s, i) => (
              <div key={i} className="pomodoro-sessao-row">
                <div className="pomodoro-dot-cor" style={{ background: s.cor }} />
                <span className="pomodoro-sessao-nome">{s.materia}</span>
                <span style={{ fontSize: 12, color: s.done ? 'var(--ff-muted)' : 'var(--ff-accent)' }}>
                  {s.tempo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PomodoroTimer;