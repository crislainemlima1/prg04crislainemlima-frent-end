import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('ff_usuario');
    return salvo ? JSON.parse(salvo) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('ff_token') || null;
  });

  function login(dadosUsuario, dadosToken) {
    setUsuario(dadosUsuario);
    setToken(dadosToken);
    localStorage.setItem('ff_usuario', JSON.stringify(dadosUsuario));
    localStorage.setItem('ff_token', dadosToken);
  }

  function logout() {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('ff_usuario');
    localStorage.removeItem('ff_token');
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}