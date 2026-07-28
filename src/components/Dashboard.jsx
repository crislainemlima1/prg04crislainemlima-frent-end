import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTimer } from '../context/TimerContext';
import { api } from '../api';

function Dashboard() {
  const { usuario, token } = useAuth();
  const { pomodorosFeitos } = useTimer();
  const [materias, setMaterias] = useState([]);
  const [sessoes, setSessoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const horaAtual = new Date().getHours();
  const saudacao = horaAtual < 12 ? 'Bom dia' : horaAtual < 18 ? 'Boa tarde' : 'Boa noite';

  useEffect(() => {
    if (!token || !usuario?.id) return;
    Promise.all([
      api(`/api/materias/usuario/${usuario.id}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      api('/api/sessoes', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ]).then(([m, s]) => { setMaterias(m); setSessoes(s); }).catch(() => {}).finally(() => setCarregando(false));
  }, [token, usuario, pomodorosFeitos]);

  const hoje = new Date().toISOString().split('T')[0];
  const sessoesHoje = sessoes.filter((s) => s.data === hoje);
  const minHoje = sessoesHoje.reduce((acc, s) => acc + (s.duracaoMinutos || 0), 0);
  const horasHoje = (minHoje / 60).toFixed(1);
  const totalMin = sessoes.reduce((acc, s) => acc + (s.duracaoMinutos || 0), 0);
  const totalHoras = (totalMin / 60).toFixed(1);
  const CORES = ['#e94560', '#533483', '#2dd4a0', '#f4a261', '#4285F4', '#e67e22'];
  const maxHoras = Math.max(...materias.map((m) => sessoes.filter((s) => s.materiaId === m.id).reduce((acc, s) => acc + (s.duracaoMinutos || 0), 0) / 60), 1);

  if (carregando) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--ff-muted)' }}>Carregando...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', marginBottom: 4 }}>{saudacao}, {usuario?.nome?.split(' ')[0]} 👋</h1>
        <p style={{ fontSize: 13, color: 'var(--ff-muted)' }}>Sua sessão de hoje aguarda. Vamos estudar!</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Horas hoje', valor: horasHoje, cor: 'var(--ff-green)', badge: `${sessoesHoje.length} sessões` },
          { label: 'Total de horas', valor: totalHoras, cor: 'var(--ff-amber)', badge: 'acumulado' },
          { label: 'Pomodoros hoje', valor: pomodorosFeitos, cor: 'var(--ff-text)', badge: '25 min cada' },
          { label: 'Matérias', valor: materias.length, cor: 'var(--ff-accent)', badge: 'cadastradas' },
        ].map((m, i) => (
          <div key={i} style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--ff-muted)', marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 700, color: m.cor, lineHeight: 1 }}>{m.valor}</div>
            <div style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, marginTop: 8, display: 'inline-block', background: 'rgba(255,255,255,0.06)', color: 'var(--ff-muted)' }}>{m.badge}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'linear-gradient(135deg, rgba(83,52,131,0.2), rgba(233,69,96,0.1))', border: '1px solid rgba(83,52,131,0.4)', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 10, color: 'var(--ff-purple)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ff-purple)', display: 'inline-block' }} />
          IA · Sugestão de estudo
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--ff-text)', marginBottom: 12 }}>
          {materias.length === 0 ? 'Cadastre suas matérias na sidebar para receber sugestões personalizadas de estudo!' : sessoesHoje.length === 0 ? `Você ainda não estudou hoje. Que tal começar com ${materias[0]?.nome}? Uma sessão de 25 minutos já faz diferença!` : `Você já estudou ${horasHoje}h hoje. Continue assim! Que tal revisar ${materias[materias.length - 1]?.nome}?`}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button style={{ fontSize: 11.5, padding: '4px 12px', borderRadius: 20, border: '1px solid var(--ff-border)', color: 'var(--ff-muted)', background: 'transparent', cursor: 'pointer' }}>Iniciar sessão ↗</button>
          <button style={{ fontSize: 11.5, padding: '4px 12px', borderRadius: 20, border: '1px solid var(--ff-border)', color: 'var(--ff-muted)', background: 'transparent', cursor: 'pointer' }}>Ver detalhes</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--ff-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Horas por matéria</div>
          {materias.length === 0 ? <p style={{ fontSize: 13, color: 'var(--ff-muted)' }}>Cadastre matérias para ver o gráfico.</p> : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 100 }}>
              {materias.map((m, i) => {
                const min = sessoes.filter((s) => s.materiaId === m.id).reduce((acc, s) => acc + (s.duracaoMinutos || 0), 0);
                const pct = maxHoras > 0 ? (min / 60 / maxHoras) * 100 : 5;
                return (
                  <div key={m.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ width: '100%', height: `${Math.max(pct, 5)}%`, background: CORES[i % CORES.length], borderRadius: '4px 4px 0 0', opacity: 0.85 }} />
                    <span style={{ fontSize: 10, color: 'var(--ff-muted)' }}>{m.nome.slice(0, 4)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--ff-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Últimas sessões</div>
          {sessoes.length === 0 ? <p style={{ fontSize: 13, color: 'var(--ff-muted)' }}>Nenhuma sessão registrada ainda.</p> : sessoes.slice(0, 5).map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--ff-border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: CORES[i % CORES.length], flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13 }}>{s.materiaNome || 'Matéria'}</span>
              <span style={{ fontSize: 12, color: 'var(--ff-muted)' }}>{s.duracaoMinutos}min</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--ff-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Distribuição de matérias</div>
        {materias.length === 0 ? <p style={{ fontSize: 13, color: 'var(--ff-muted)' }}>Nenhuma matéria cadastrada ainda.</p> : materias.map((m, i) => {
          const min = sessoes.filter((s) => s.materiaId === m.id).reduce((acc, s) => acc + (s.duracaoMinutos || 0), 0);
          const horas = (min / 60).toFixed(1);
          const pct = maxHoras > 0 ? Math.min((min / 60 / maxHoras) * 100, 100) : 0;
          return (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--ff-border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: CORES[i % CORES.length], flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13.5 }}>{m.nome}</span>
              <span style={{ fontSize: 12, color: 'var(--ff-muted)' }}>{horas}h</span>
              <div style={{ width: 80, height: 4, background: 'var(--ff-border)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: CORES[i % CORES.length], borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;