import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/painel');
  }

  return (
    <div className="lf-card">
      <h2 className="lf-titulo">
        Bem-vindo de <span>volta!</span>
      </h2>
      <p className="lf-subtitulo">Acesse sua conta para continuar</p>

      <form onSubmit={handleSubmit} className="lf-form">
        <div className="lf-campo">
          <label>E-MAIL</label>
          <div className="lf-input-wrap">
            <span className="lf-icone">✉</span>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="lf-campo">
          <label>SENHA</label>
          <div className="lf-input-wrap">
            <span className="lf-icone">🔒</span>
            <input
              type={verSenha ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button
              type="button"
              className="lf-ver-senha"
              onClick={() => setVerSenha((v) => !v)}
            >
              {verSenha ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        <div className="lf-linha-opcoes">
          <label className="lf-lembrar">
            <input
              type="checkbox"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
            />
            Lembrar de mim
          </label>
          <button
            type="button"
            className="lf-esqueceu"
            onClick={() => alert('Em breve!')}
          >
            Esqueci minha senha
          </button>
        </div>

        <button type="submit" className="lf-btn-entrar">
          → Entrar
        </button>

        <div className="lf-divisor">
          <span>ou continue com</span>
        </div>

        <div className="lf-social">
          <button
            type="button"
            className="lf-btn-google"
            onClick={() => alert('Em breve!')}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="lf-btn-criar"
            onClick={() => alert('Em breve!')}
          >
            Criar conta
          </button>
        </div>

        <p className="lf-seguranca">
          🔒 Seus dados estão protegidos com segurança
        </p>
      </form>
    </div>
  );
}

export default LoginForm;