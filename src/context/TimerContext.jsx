import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../api';

const TimerContext = createContext(null);
const FOCO = 25 * 60;
const PAUSA = 5 * 60;

export function TimerProvider({ children }) {
  const { usuario, token } = useAuth();
  const [modo, setModo] = useState('foco');
  const [segundos, setSegundos] = useState(FOCO);
  const [rodando, setRodando] = useState(false);
  const [pomodorosFeitos, setPomodorosFeitos] = useState(0);
  const [materiaId, setMateriaId] = useState(null);
  const [materias, setMaterias] = useState([]);
  const intervalRef = useRef(null);
  const sessaoSalvaRef = useRef(false); // ← impede duplo save

  const totalSegundos = modo === 'foco' ? FOCO : PAUSA;

  useEffect(() => {
    if (usuario?.id && token) {
      api(`/api/materias/usuario/${usuario.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((dados) => {
          setMaterias(dados);
          if (dados.length > 0 && !materiaId) setMateriaId(dados[0].id);
        })
        .catch(() => {});
    }
  }, [usuario, token]);

  useEffect(() => {
    if (rodando) {
      sessaoSalvaRef.current = false; // reseta ao iniciar
      intervalRef.current = setInterval(() => {
        setSegundos((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRodando(false);
            if (modo === 'foco' && !sessaoSalvaRef.current) {
              sessaoSalvaRef.current = true; // marca como salvo
              setPomodorosFeitos((p) => p + 1);
              salvarSessao();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [rodando]);

  async function salvarSessao() {
    if (!materiaId || !token) return;
    try {
      await api('/api/sessoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          materiaId,
          duracaoMinutos: 25,
          data: new Date().toISOString().split('T')[0],
        }),
      });
    } catch {}
  }

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

  return (
    <TimerContext.Provider value={{
      modo, segundos, rodando, setRodando,
      pomodorosFeitos, totalSegundos,
      materiaId, setMateriaId, materias,
      alternarModo, resetar,
    }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() { return useContext(TimerContext); }