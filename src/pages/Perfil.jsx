import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMaterias } from '../context/MateriasContext';

const CORES = ['#e94560','#533483','#2dd4a0','#f4a261','#4285F4','#e67e22'];

function Perfil() {
  const { usuario, token, login, logout } = useAuth();
  const { materias, deletarMateria } = useMaterias();
  const navigate = useNavigate();

  const [nome, setNome] = useState(usuario?.nome || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');
  const [confirmarRemover, setConfirmarRemover] = useState(null);
  const [confirmarConta, setConfirmarConta] = useState(false);
  const [deletandoConta, setDeletandoConta] = useState(false);

  const pomodoroState = JSON.parse(localStorage.getItem('focusflow_pomodoro_state') || '{}');
  const pomodorosFeitos = pomodoroState.pomodorosFeitos ?? 0;

  async function salvarPerfil() {
    setErro('');
    setSalvando(true);
    try {
      const resp = await fetch(`/api/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nome, email, senha: usuario.senha || '' }),
      });
      if (!resp.ok) throw new Error('Erro ao salvar');
      const dados = await resp.json();
      login(dados, token);
      setSucesso('Perfil atualizado com sucesso!');
      setEditando(false);
      setTimeout(() => setSucesso(''), 3000);
    } catch {
      setErro('Erro ao salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletarMateria() {
    try {
      await deletarMateria(confirmarRemover.id);
    } catch {
      setErro('Erro ao remover matéria.');
    } finally {
      setConfirmarRemover(null);
    }
  }

  async function handleDeletarConta() {
    setDeletandoConta(true);
    try {
      const resp = await fetch(`/api/usuarios/${usuario.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error('Erro ao excluir');
      logout();
      navigate('/');
    } catch {
      setErro('Erro ao excluir conta. Tente novamente.');
      setConfirmarConta(false);
    } finally {
      setDeletandoConta(false);
    }
  }

  const card = {
    background: 'var(--ff-surface)',
    border: '1px solid var(--ff-border)',
    borderRadius: 14,
    padding: '1.5rem',
  };

  const label = {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--ff-purple)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 8,
  };

  return (
    <>
      {/* Modal remover matéria */}
      {confirmarRemover && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
          <div style={{ background:'var(--ff-surface)', border:'1px solid var(--ff-border)', borderRadius:16, padding:'2rem', maxWidth:360, width:'100%', textAlign:'center', display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div style={{ fontSize:'2rem' }}>🗑️</div>
            <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.1rem', color:'var(--ff-text)', margin:0 }}>Remover matéria</h3>
            <p style={{ color:'var(--ff-muted)', fontSize:'0.875rem', margin:0, lineHeight:1.6 }}>
              Remover <strong style={{ color:'var(--ff-text)' }}>{confirmarRemover.nome}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              <button onClick={() => setConfirmarRemover(null)} style={{ padding:'0.75rem', borderRadius:10, border:'1px solid var(--ff-border)', background:'var(--ff-card)', color:'var(--ff-text)', fontSize:'0.9rem', cursor:'pointer' }}>Cancelar</button>
              <button onClick={handleDeletarMateria} style={{ padding:'0.75rem', borderRadius:10, border:'none', background:'var(--ff-accent)', color:'white', fontSize:'0.9rem', fontWeight:600, cursor:'pointer' }}>Sim, remover</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal excluir conta */}
      {confirmarConta && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
          <div style={{ background:'var(--ff-surface)', border:'1px solid rgba(233,69,96,0.4)', borderRadius:16, padding:'2rem', maxWidth:380, width:'100%', textAlign:'center', display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div style={{ fontSize:'2rem' }}>⚠️</div>
            <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.1rem', color:'var(--ff-accent)', margin:0 }}>
              Excluir conta permanentemente
            </h3>
            <p style={{ color:'var(--ff-muted)', fontSize:'0.875rem', margin:0, lineHeight:1.6 }}>
              Todos os seus dados, matérias e sessões serão removidos.<br />
              <strong style={{ color:'var(--ff-text)' }}>Esta ação não pode ser desfeita.</strong>
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginTop:'0.5rem' }}>
              <button
                onClick={() => setConfirmarConta(false)}
                disabled={deletandoConta}
                style={{ padding:'0.75rem', borderRadius:10, border:'1px solid var(--ff-border)', background:'var(--ff-card)', color:'var(--ff-text)', fontSize:'0.9rem', cursor:'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletarConta}
                disabled={deletandoConta}
                style={{ padding:'0.75rem', borderRadius:10, border:'none', background:'var(--ff-accent)', color:'white', fontSize:'0.9rem', fontWeight:600, cursor:'pointer' }}
              >
                {deletandoConta ? 'Excluindo...' : 'Sim, excluir tudo'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.6rem', marginBottom:4 }}>Meu Perfil</h1>
          <p style={{ fontSize:13, color:'var(--ff-muted)' }}>Gerencie suas informações e preferências.</p>
        </div>

        {sucesso && (
          <div style={{ background:'rgba(45,212,160,0.12)', border:'1px solid var(--ff-green)', borderRadius:10, padding:'0.75rem 1rem', color:'var(--ff-green)', fontSize:'0.875rem' }}>
            ✓ {sucesso}
          </div>
        )}
        {erro && (
          <div style={{ background:'rgba(233,69,96,0.12)', border:'1px solid var(--ff-accent)', borderRadius:10, padding:'0.75rem 1rem', color:'var(--ff-accent)', fontSize:'0.875rem' }}>
            ⚠ {erro}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Dados pessoais */}
          <div style={{ ...card, display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.95rem', fontWeight:700, color:'var(--ff-text)' }}>Dados pessoais</div>
              {!editando && (
                <button onClick={() => setEditando(true)} style={{ background:'rgba(83,52,131,0.2)', border:'1px solid var(--ff-purple)', color:'var(--ff-purple)', borderRadius:8, padding:'5px 14px', fontSize:12, cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>
                  ✏ Editar
                </button>
              )}
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg, var(--ff-accent), var(--ff-purple))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', fontWeight:700, color:'white', fontFamily:'Syne,sans-serif', flexShrink:0 }}>
                {nome?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{ fontWeight:600, color:'var(--ff-text)', fontSize:'0.95rem' }}>{nome}</div>
                <div style={{ fontSize:12, color:'var(--ff-muted)' }}>{email}</div>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div>
                <div style={label}>Nome</div>
                <input value={nome} onChange={(e) => setNome(e.target.value)} disabled={!editando}
                  style={{ width:'100%', background: editando ? 'var(--ff-card)' : 'rgba(255,255,255,0.03)', border:'1px solid var(--ff-border)', borderRadius:8, padding:'0.7rem 0.9rem', color:'var(--ff-text)', fontFamily:'DM Sans,sans-serif', fontSize:'0.9rem', outline:'none', opacity: editando ? 1 : 0.7, boxSizing:'border-box' }}
                />
              </div>
              <div>
                <div style={label}>E-mail</div>
                <input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editando}
                  style={{ width:'100%', background: editando ? 'var(--ff-card)' : 'rgba(255,255,255,0.03)', border:'1px solid var(--ff-border)', borderRadius:8, padding:'0.7rem 0.9rem', color:'var(--ff-text)', fontFamily:'DM Sans,sans-serif', fontSize:'0.9rem', outline:'none', opacity: editando ? 1 : 0.7, boxSizing:'border-box' }}
                />
              </div>
            </div>

            {editando && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <button onClick={() => { setEditando(false); setNome(usuario?.nome||''); setEmail(usuario?.email||''); setErro(''); }}
                  style={{ padding:'0.7rem', borderRadius:8, border:'1px solid var(--ff-border)', background:'var(--ff-card)', color:'var(--ff-text)', fontSize:'0.875rem', cursor:'pointer' }}>
                  Cancelar
                </button>
                <button onClick={salvarPerfil} disabled={salvando}
                  style={{ padding:'0.7rem', borderRadius:8, border:'none', background:'var(--ff-accent)', color:'white', fontSize:'0.875rem', fontWeight:600, cursor:'pointer' }}>
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            )}
          </div>

          {/* Estatísticas + Zona de perigo */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ ...card }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.95rem', fontWeight:700, color:'var(--ff-text)', marginBottom:16 }}>Estatísticas</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[
                  { label:'Matérias', valor: materias.length, icon:'📚' },
                  { label:'Pomodoros', valor: pomodorosFeitos, icon:'⏱' },
                ].map((s) => (
                  <div key={s.label} style={{ background:'var(--ff-card)', border:'1px solid var(--ff-border)', borderRadius:10, padding:'1rem', textAlign:'center' }}>
                    <div style={{ fontSize:'1.4rem', marginBottom:4 }}>{s.icon}</div>
                    <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.3rem', fontWeight:700, color:'var(--ff-text)' }}>{s.valor}</div>
                    <div style={{ fontSize:11, color:'var(--ff-muted)', marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...card, background:'rgba(233,69,96,0.06)', border:'1px solid rgba(233,69,96,0.2)' }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', fontWeight:700, color:'var(--ff-accent)', marginBottom:6 }}>Zona de perigo</div>
              <p style={{ fontSize:12, color:'var(--ff-muted)', marginBottom:12, lineHeight:1.6 }}>
                Ao excluir sua conta todos os dados serão removidos permanentemente.
              </p>
              <button onClick={() => setConfirmarConta(true)}
                style={{ width:'100%', padding:'0.65rem', borderRadius:8, border:'1px solid var(--ff-accent)', background:'transparent', color:'var(--ff-accent)', fontSize:'0.875rem', fontWeight:600, cursor:'pointer' }}>
                🗑 Excluir minha conta
              </button>
            </div>
          </div>
        </div>

        {/* Matérias */}
        <div style={card}>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.95rem', fontWeight:700, color:'var(--ff-text)', marginBottom:16 }}>Matérias cadastradas</div>
          {materias.length === 0 ? (
            <p style={{ color:'var(--ff-muted)', fontSize:13 }}>Nenhuma matéria cadastrada ainda.</p>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:10 }}>
              {materias.map((m, i) => (
                <div key={m.id} style={{ background:'var(--ff-card)', border:'1px solid var(--ff-border)', borderRadius:10, padding:'0.75rem 1rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background: CORES[i % CORES.length], flexShrink:0, display:'block' }} />
                    <span style={{ fontSize:13, color:'var(--ff-text)', fontWeight:500 }}>{m.nome}</span>
                  </div>
                  <button onClick={() => setConfirmarRemover({ id: m.id, nome: m.nome })}
                    style={{ background:'none', border:'none', color:'var(--ff-muted)', cursor:'pointer', fontSize:14, lineHeight:1, padding:0 }} title="Remover">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Perfil;