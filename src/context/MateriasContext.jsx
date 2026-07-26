import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const MateriasContext = createContext(null);

export const CORES_MATERIAS = [
  '#e94560', '#533483', '#2dd4a0',
  '#f4a261', '#4285F4', '#e67e22',
];

export function MateriasProvider({ children }) {
  const { usuario, token } = useAuth();
  const [materias, setMaterias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarMaterias = useCallback(async () => {
    if (!usuario?.id) return;
    try {
      setCarregando(true);
      const resp = await fetch(`/api/materias/usuario/${usuario.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error('Erro ao buscar matérias');
      const dados = await resp.json();
      setMaterias(dados);
      setErro(null);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [usuario, token]);

  useEffect(() => {
    if (usuario?.id) buscarMaterias();
  }, [usuario, buscarMaterias]);

  async function adicionarMateria(nome) {
    if (!nome.trim()) return;
    const resp = await fetch('/api/materias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome: nome.trim(),
        metaHora: 2,
        usuarioId: usuario.id,
      }),
    });
    if (!resp.ok) throw new Error('Erro ao adicionar');
    await buscarMaterias();
  }

  async function deletarMateria(id) {
    const resp = await fetch(`/api/materias/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resp.ok) throw new Error('Erro ao remover');
    await buscarMaterias();
  }

  function corDaMateria(id) {
    const idx = materias.findIndex((m) => m.id === id);
    return CORES_MATERIAS[idx >= 0 ? idx % CORES_MATERIAS.length : 0];
  }

  return (
    <MateriasContext.Provider value={{ materias, carregando, erro, buscarMaterias, adicionarMateria, deletarMateria, corDaMateria }}>
      {children}
    </MateriasContext.Provider>
  );
}

export function useMaterias() {
  const ctx = useContext(MateriasContext);
  if (!ctx) throw new Error('useMaterias precisa estar dentro de <MateriasProvider>');
  return ctx;
}