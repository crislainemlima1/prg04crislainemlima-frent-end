import { useTimer } from '../context/TimerContext';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const RAIO = 78;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

function PomodoroTimer() {
  const { token, usuario } = useAuth();
  const { modo, segundos, rodando, setRodando, pomodorosFeitos, totalSegundos, materiaId, setMateriaId, materias, alternarModo, resetar } = useTimer();
  const [sessoes, setSessoes] = useState([]);

  useEffect(() => {
    if (!token || !usuario?.id) return;
    api('/api/sessoes', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then(setSessoes).catch(() => {});
  }, [token, usuario, pomodorosFeitos]);

  const minutos = String(Math.floor(segundos / 60)).padStart(2, '0');
  const segs = String(segundos % 60).padStart(2, '0');
  const pct = segundos / totalSegundos;
  const offset = CIRCUNFERENCIA * (1 - pct);
  const corAnel = modo === 'foco' ? 'var(--ff-accent)' : 'var(--ff-green)';
  const materiaSelecionada = materias.find((m) => m.id === materiaId);
  const sessoesHoje = sessoes.filter((s) => s.data === new Date().toISOString().split('T')[0]);
  const minutosFocoHoje = sessoesHoje.reduce((acc, s) => acc + (s.duracaoMinutos || 0), 0);
  const horasFocoHoje = Math.floor(minutosFocoHoje / 60);
  const minRestantes = minutosFocoHoje % 60;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', marginBottom: 4 }}>Timer Pomodoro</h1>
        <p style={{ fontSize: 13, color: 'var(--ff-muted)' }}>Foco total. 25 minutos por sessão, 5 minutos de pausa.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }}>
        <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 4, width: '100%', maxWidth: 320 }}>
            {['foco', 'pausa'].map((m) => (
              <button key={m} onClick={() => alternarModo(m)} style={{ flex: 1, padding: 7, fontSize: 12.5, borderRadius: 6, cursor: 'pointer', border: 'none', fontFamily: 'DM Sans, sans-serif', background: modo === m ? 'var(--ff-surface)' : 'transparent', color: modo === m ? 'var(--ff-text)' : 'var(--ff-muted)', fontWeight: modo === m ? 500 : 400 }}>
                {m === 'foco' ? 'Foco · 25 min' : 'Pausa · 5 min'}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', width: 180, height: 180 }}>
            <svg viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)', width: 180, height: 180 }}>
              <circle cx="90" cy="90" r={RAIO} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="90" cy="90" r={RAIO} fill="none" stroke={corAnel} strokeWidth="8" strokeLinecap="round" strokeDasharray={CIRCUNFERENCIA} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 38, fontWeight: 800 }}>{minutos}:{segs}</span>
              <span style={{ fontSize: 11, color: 'var(--ff-muted)', marginTop: 4 }}>{modo === 'foco' ? 'Foco' : 'Pausa'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={resetar} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ff-border)', color: 'var(--ff-muted)', borderRadius: 8, padding: '10px 14px', fontSize: 16, cursor: 'pointer' }}>↺</button>
            <button onClick={() => setRodando((r) => !r)} style={{ background: 'var(--ff-accent)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 28px', fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              {rodando ? 'Pausar' : segundos === totalSegundos ? 'Iniciar' : 'Continuar'}
            </button>
            <button onClick={() => alternarModo(modo)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ff-border)', color: 'var(--ff-muted)', borderRadius: 8, padding: '10px 14px', fontSize: 16, cursor: 'pointer' }}>⏭</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < pomodorosFeitos % 4 ? 'var(--ff-accent)' : 'var(--ff-border)' }} />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--ff-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>Matéria atual</div>
            <select value={materiaId || ''} onChange={(e) => setMateriaId(Number(e.target.value))} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ff-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--ff-text)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, outline: 'none', marginBottom: 16 }}>
              {materias.length === 0 && <option>Nenhuma matéria cadastrada</option>}
              {materias.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
            <div style={{ fontSize: 11, color: 'var(--ff-muted)', marginBottom: 4 }}>Foco hoje</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--ff-green)' }}>{horasFocoHoje}h {minRestantes}min</div>
            <div style={{ height: 6, background: 'var(--ff-border)', borderRadius: 3, overflow: 'hidden', margin: '8px 0' }}>
              <div style={{ height: '100%', width: `${Math.min((minutosFocoHoje / 150) * 100, 100)}%`, background: 'var(--ff-green)', borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--ff-muted)' }}>Meta: 2h 30min</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(83,52,131,0.2), rgba(233,69,96,0.1))', border: '1px solid rgba(83,52,131,0.4)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 10, color: 'var(--ff-purple)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>IA · Dica de sessão</div>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: 'var(--ff-text)', margin: 0 }}>
              {materiaSelecionada ? `Você está estudando ${materiaSelecionada.nome}. Mantenha o foco e revise os pontos mais difíceis!` : 'Selecione uma matéria para começar sua sessão de estudos.'}
            </p>
          </div>
          <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--ff-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>Sessões de hoje</div>
            {sessoesHoje.length === 0 && <p style={{ fontSize: 13, color: 'var(--ff-muted)' }}>Nenhuma sessão hoje ainda.</p>}
            {sessoesHoje.slice(0, 5).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--ff-border)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ff-accent)', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12.5 }}>{s.materiaNome || 'Matéria'}</span>
                <span style={{ fontSize: 12, color: 'var(--ff-muted)' }}>{s.duracaoMinutos} min ✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PomodoroTimer;