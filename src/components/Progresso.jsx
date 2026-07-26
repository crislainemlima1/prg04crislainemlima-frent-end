import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Progresso() {
  const { usuario, token } = useAuth();
  const [sessoes, setSessoes] = useState([]);
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/sessoes', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then(setSessoes).catch(() => {});
    fetch(`/api/materias/usuario/${usuario?.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then(setMaterias).catch(() => {});
  }, [token]);

  const totalHoras = sessoes.reduce((acc, s) => acc + (s.duracaoMinutos || 0), 0) / 60;

  const CORES = ['#e94560', '#533483', '#2dd4a0', '#f4a261', '#4285F4', '#e67e22'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', marginBottom: 4 }}>Progresso</h1>
        <p style={{ fontSize: 13, color: 'var(--ff-muted)' }}>Visualize sua evolução e mantenha a consistência.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Total de horas', valor: totalHoras.toFixed(1), cor: 'var(--ff-green)' },
          { label: 'Sessões realizadas', valor: sessoes.length, cor: 'var(--ff-accent)' },
          { label: 'Matérias cadastradas', valor: materias.length, cor: 'var(--ff-purple)' },
        ].map((m, i) => (
          <div key={i} style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--ff-muted)', marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 700, color: m.cor }}>{m.valor}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--ff-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
          Progresso por matéria
        </div>
        {materias.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--ff-muted)' }}>Nenhuma matéria cadastrada ainda.</p>
        )}
        {materias.map((m, i) => {
          const horasMateria = sessoes
            .filter((s) => s.materiaId === m.id)
            .reduce((acc, s) => acc + (s.duracaoMinutos || 0), 0) / 60;
          const pct = m.metaHora > 0 ? Math.min((horasMateria / m.metaHora) * 100, 100) : 0;
          const cor = CORES[i % CORES.length];
          return (
            <div key={m.id} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
                <span>{m.nome}</span>
                <span style={{ color: cor }}>{horasMateria.toFixed(1)}h / {m.metaHora}h</span>
              </div>
              <div style={{ height: 8, background: 'var(--ff-border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: cor, borderRadius: 4, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--ff-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
          Últimas sessões
        </div>
        {sessoes.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--ff-muted)' }}>Nenhuma sessão registrada ainda.</p>
        )}
        {sessoes.slice(0, 5).map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--ff-border)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ff-accent)', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13 }}>{s.materiaNome || 'Matéria'}</span>
            <span style={{ fontSize: 12, color: 'var(--ff-muted)' }}>{s.duracaoMinutos} min</span>
            <span style={{ fontSize: 11, color: 'var(--ff-muted)' }}>{s.data}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Progresso;