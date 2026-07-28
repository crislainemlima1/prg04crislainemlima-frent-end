import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import './Sidebar.css';

const CORES_MATERIAS = ['#e94560', '#533483', '#2dd4a0', '#f4a261', '#4285F4', '#e67e22'];

function ModalConfirmar({ nomeMateria, onConfirmar, onCancelar }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '2rem', textAlign: 'center' }}>🗑️</div>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ff-text)', textAlign: 'center', margin: 0 }}>Remover matéria</h3>
        <p style={{ color: 'var(--ff-muted)', fontSize: '0.875rem', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
          Tem certeza que deseja remover <strong style={{ color: 'var(--ff-text)' }}>{nomeMateria}</strong>?<br />Esta ação não pode ser desfeita.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button onClick={onCancelar} style={{ padding: '0.75rem', borderRadius: 10, border: '1px solid var(--ff-border)', background: 'var(--ff-card)', color: 'var(--ff-text)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={onConfirmar} style={{ padding: '0.75rem', borderRadius: 10, border: 'none', background: 'var(--ff-accent)', color: 'white', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Sim, remover</button>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const { usuario, token, logout } = useAuth();
  const navigate = useNavigate();
  const [materias, setMaterias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [novaMateria, setNovaMateria] = useState('');
  const [adicionando, setAdicionando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [confirmarRemover, setConfirmarRemover] = useState(null);

  useEffect(() => {
    if (usuario?.id) buscarMaterias();
  }, [usuario]);

  async function buscarMaterias() {
    try {
      setCarregando(true);
      const resp = await api(`/api/materias/usuario/${usuario.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error('Erro ao buscar matérias');
      const dados = await resp.json();
      setMaterias(dados);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  async function adicionarMateria(e) {
    e.preventDefault();
    if (!novaMateria.trim()) return;
    try {
      setAdicionando(true);
      const resp = await api('/api/materias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nome: novaMateria.trim(), metaHora: 2, usuarioId: usuario.id }),
      });
      if (!resp.ok) throw new Error('Erro ao adicionar');
      setNovaMateria('');
      setMostrarForm(false);
      buscarMaterias();
    } catch (err) {
      alert('Erro ao adicionar matéria: ' + err.message);
    } finally {
      setAdicionando(false);
    }
  }

  async function confirmarDeletar() {
    try {
      await api(`/api/materias/${confirmarRemover.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      buscarMaterias();
    } catch {
      alert('Erro ao remover matéria.');
    } finally {
      setConfirmarRemover(null);
    }
  }

  function handleLogout() { logout(); navigate('/'); }

  return (
    <>
      {confirmarRemover && <ModalConfirmar nomeMateria={confirmarRemover.nome} onConfirmar={confirmarDeletar} onCancelar={() => setConfirmarRemover(null)} />}
      <aside className="sidebar">
        <div className="sidebar-logo">Focus<span>Flow</span></div>
        <nav className="sidebar-nav">
          <NavLink to="/painel" end className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}><span>◈</span> Dashboard</NavLink>
          <NavLink to="/painel/timer" className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}><span>◷</span> Timer Pomodoro</NavLink>
          <NavLink to="/painel/resumo" className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}><span>✦</span> Resumo com IA</NavLink>
          <NavLink to="/painel/progresso" className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}><span>◉</span> Progresso</NavLink>
        </nav>
        <div className="sidebar-secao-header">
          <span className="sidebar-label">Matérias</span>
          <button className="sidebar-btn-add" onClick={() => setMostrarForm((v) => !v)} title="Adicionar matéria">+</button>
        </div>
        {mostrarForm && (
          <form onSubmit={adicionarMateria} className="sidebar-form">
            <input type="text" placeholder="Nome da matéria" value={novaMateria} onChange={(e) => setNovaMateria(e.target.value)} className="sidebar-input" autoFocus />
            <button type="submit" className="sidebar-btn-salvar" disabled={adicionando}>{adicionando ? '...' : 'Salvar'}</button>
          </form>
        )}
        <div className="sidebar-materias">
          {carregando && <div className="sidebar-estado">Carregando...</div>}
          {erro && <div className="sidebar-estado sidebar-erro">{erro}</div>}
          {!carregando && !erro && materias.length === 0 && <div className="sidebar-estado">Nenhuma matéria ainda.</div>}
          {materias.map((m, i) => (
            <div key={m.id} className="sidebar-materia">
              <span className="sidebar-materia-dot" style={{ background: CORES_MATERIAS[i % CORES_MATERIAS.length] }} />
              <span className="sidebar-materia-nome">{m.nome}</span>
              <button className="sidebar-btn-del" onClick={() => setConfirmarRemover({ id: m.id, nome: m.nome })} title="Remover">×</button>
            </div>
          ))}
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-avatar-row" onClick={() => setMenuAberto((v) => !v)} style={{ cursor: 'pointer' }}>
            <div className="sidebar-avatar">{usuario?.nome?.charAt(0).toUpperCase() || 'U'}</div>
            <div style={{ flex: 1 }}>
              <p className="sidebar-avatar-nome">{usuario?.nome || 'Usuário'}</p>
              <span className="sidebar-avatar-streak">Bem-vindo! 🚀</span>
            </div>
            <span style={{ color: 'var(--ff-muted)', fontSize: 12 }}>{menuAberto ? '▲' : '▼'}</span>
          </div>
          {menuAberto && (
            <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 10, overflow: 'hidden', marginTop: 6 }}>
              <button onClick={() => { setMenuAberto(false); navigate('/painel/perfil'); }} style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: 'var(--ff-text)', fontSize: 13, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>👤 Ver perfil</button>
              <button onClick={handleLogout} style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', borderTop: '1px solid var(--ff-border)', color: 'var(--ff-accent)', fontSize: 13, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>🚪 Sair</button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;