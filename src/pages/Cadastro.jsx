import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    try {
      const resp = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });
      if (!resp.ok) {
        alert('Erro ao cadastrar. Verifique os dados.');
        return;
      }
      alert('Conta criada com sucesso! Faça login.');
      navigate('/');
    } catch {
      alert('Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-lado-esquerdo">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'var(--ff-text)', marginBottom: '1rem' }}>
            Focus<span style={{ color: 'var(--ff-accent)' }}>Flow</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--ff-text)', marginBottom: '1rem' }}>
            Comece sua jornada <span style={{ color: 'var(--ff-accent)' }}>hoje!</span>
          </h2>
          <p style={{ color: 'var(--ff-muted)', fontSize: '0.95rem', maxWidth: 320, margin: '0 auto' }}>
            Crie sua conta e comece a estudar com mais foco, inteligência e consistência.
          </p>
        </div>
      </div>

      <div className="login-lado-direito">
        <div className="lf-card">
          <h2 className="lf-titulo">Criar <span>conta</span></h2>
          <p className="lf-subtitulo">Preencha os dados abaixo para começar</p>

          <form onSubmit={handleSubmit} className="lf-form">
            <div className="lf-campo">
              <label>NOME</label>
              <div className="lf-input-wrap">
                <span className="lf-icone">👤</span>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
            </div>

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
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button type="submit" className="lf-btn-entrar" disabled={carregando}>
              {carregando ? 'Criando conta...' : '→ Criar conta'}
            </button>

            <p className="lf-cadastro">
              Já tem conta?{' '}
              <Link to="/" style={{ color: 'var(--ff-accent)', fontWeight: 500, textDecoration: 'none' }}>
                Fazer login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;