import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// ID do usuário logado — futuramente vai vir do contexto de autenticação
const USUARIO_ID = 1;

const CORES_MATERIAS = [
  '#e94560', '#533483', '#2dd4a0',
  '#f4a261', '#4285F4', '#e67e22',
];

function Sidebar() {
  const [materias, setMaterias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [novaMateria, setNovaMateria] = useState('');
  const [adicionando, setAdicionando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    buscarMaterias();
  }, []);

  async function buscarMaterias() {
    try {
      setCarregando(true);
      const resp = await fetch(`/api/materias/usuario/${USUARIO_ID}`);
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
      const resp = await fetch('/api/materias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: novaMateria.trim(),
          metaHora: 2,
          usuarioId: USUARIO_ID,
        }),
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

  async function deletarMateria(id) {
    if (!confirm('Remover esta matéria?')) return;
    try {
      await fetch(`/api/materias/${id}`, { method: 'DELETE' });
      buscarMaterias();
    } catch {
      alert('Erro ao remover matéria.');
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Focus<span>Flow</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/painel"
          end
          className={({ isActive }) =>
            'sidebar-item' + (isActive ? ' active' : '')
          }
        >
          <span>◈</span> Dashboard
        </NavLink>
        <NavLink
          to="/painel/timer"
          className={({ isActive }) =>
            'sidebar-item' + (isActive ? ' active' : '')
          }
        >
          <span>◷</span> Timer Pomodoro
        </NavLink>
        <NavLink
          to="/painel/resumo"
          className={({ isActive }) =>
            'sidebar-item' + (isActive ? ' active' : '')
          }
        >
          <span>✦</span> Resumo com IA
        </NavLink>
        <NavLink
          to="/painel/progresso"
          className={({ isActive }) =>
            'sidebar-item' + (isActive ? ' active' : '')
          }
        >
          <span>◉</span> Progresso
        </NavLink>
      </nav>

      <div className="sidebar-secao-header">
        <span className="sidebar-label">Matérias</span>
        <button
          className="sidebar-btn-add"
          onClick={() => setMostrarForm((v) => !v)}
          title="Adicionar matéria"
        >
          +
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={adicionarMateria} className="sidebar-form">
          <input
            type="text"
            placeholder="Nome da matéria"
            value={novaMateria}
            onChange={(e) => setNovaMateria(e.target.value)}
            className="sidebar-input"
            autoFocus
          />
          <button
            type="submit"
            className="sidebar-btn-salvar"
            disabled={adicionando}
          >
            {adicionando ? '...' : 'Salvar'}
          </button>
        </form>
      )}

      <div className="sidebar-materias">
        {carregando && (
          <div className="sidebar-estado">Carregando...</div>
        )}
        {erro && (
          <div className="sidebar-estado sidebar-erro">{erro}</div>
        )}
        {!carregando && !erro && materias.length === 0 && (
          <div className="sidebar-estado">Nenhuma matéria ainda.</div>
        )}
        {materias.map((m, i) => (
          <div key={m.id} className="sidebar-materia">
            <span
              className="sidebar-materia-dot"
              style={{ background: CORES_MATERIAS[i % CORES_MATERIAS.length] }}
            />
            <span className="sidebar-materia-nome">{m.nome}</span>
            <button
              className="sidebar-btn-del"
              onClick={() => deletarMateria(m.id)}
              title="Remover"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-avatar-row">
          <div className="sidebar-avatar">JS</div>
          <div>
            <p className="sidebar-avatar-nome">João Silva</p>
            <span className="sidebar-avatar-streak">7 dias de streak 🔥</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;