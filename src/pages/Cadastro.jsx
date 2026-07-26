import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import '../components/LoginForm.css';

const FEATURES = [
  { icon: '⏱', titulo: 'Pomodoro', sub: 'Foco máximo' },
  { icon: '🤖', titulo: 'IA Adaptativa', sub: 'Aprende com você' },
  { icon: '📈', titulo: 'Progresso', sub: 'Metas e streak' },
  { icon: '✦', titulo: 'Resumos', sub: 'Gerados por IA' },
];

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const resp = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });
      if (!resp.ok) {
        setErro('Erro ao cadastrar. Verifique os dados e tente novamente.');
        return;
      }
      setSucesso(true);
      setTimeout(() => navigate('/'), 2500);
    } catch {
      setErro('Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-lado-esquerdo">
        <div style={{ padding: '2rem', maxWidth: 420, width: '100%' }}>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '1.8rem',
            fontWeight: 800,
            color: 'var(--ff-text)',
            marginBottom: '2rem',
          }}>
            Focus<span style={{ color: 'var(--ff-accent)' }}>Flow</span>
          </div>

          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ff-green)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            Sua plataforma
          </p>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '2.4rem',
            fontWeight: 800,
            color: 'var(--ff-text)',
            lineHeight: 1.15,
            marginBottom: '1rem',
          }}>
            inteligente de{' '}
            <span style={{ color: 'var(--ff-accent)' }}>estudos com IA.</span>
          </h2>
          <p style={{ color: 'var(--ff-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Combine o método Pomodoro com inteligência artificial e transforme sua rotina de estudos.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {FEATURES.map((f) => (
              <div key={f.titulo} style={{
                background: 'var(--ff-card)',
                border: '1px solid var(--ff-border)',
                borderRadius: 12,
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <span style={{ fontSize: '1.4rem' }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ff-text)' }}>{f.titulo}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ff-muted)' }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="login-lado-direito">
        <div className="lf-card">
          {sucesso ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h2 className="lf-titulo">Conta criada <span>com sucesso!</span></h2>
              <p className="lf-subtitulo" style={{ marginTop: '0.5rem' }}>
                Redirecionando para o login...
              </p>
              <div style={{
                marginTop: '1.5rem',
                height: 4,
                borderRadius: 99,
                background: 'var(--ff-border)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  background: 'var(--ff-green)',
                  borderRadius: 99,
                  animation: 'crescer 2.5s linear forwards',
                }} />
              </div>
              <style>{`@keyframes crescer { from { width: 0% } to { width: 100% } }`}</style>
            </div>
          ) : (
            <>
              <h2 className="lf-titulo">Criar <span>conta</span></h2>
              <p className="lf-subtitulo">Preencha os dados abaixo para começar</p>

              {erro && (
                <div style={{
                  background: 'rgba(233,69,96,0.12)',
                  border: '1px solid var(--ff-accent)',
                  borderRadius: 10,
                  padding: '0.75rem 1rem',
                  color: 'var(--ff-accent)',
                  fontSize: '0.85rem',
                  marginBottom: '0.5rem',
                }}>
                  ⚠ {erro}
                </div>
              )}

              <form onSubmit={handleSubmit} className="lf-form">
                <div className="lf-campo">
                  <label>NOME</label>
                  <div className="lf-input-wrap">
                    <span className="lf-icone">👤</span>
                    <input
                      type="text"
                      placeholder="Seu nome completo"
                      value={nome}
                      onChange={(e) => { setErro(''); setNome(e.target.value); }}
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
                      onChange={(e) => { setErro(''); setEmail(e.target.value); }}
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
                      onChange={(e) => { setErro(''); setSenha(e.target.value); }}
                      required
                      minLength={8}
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

                <button type="submit" className="lf-btn-entrar" disabled={carregando}>
                  {carregando ? 'Criando conta...' : '→ Criar conta'}
                </button>

                <p className="lf-seguranca">
                  Já tem conta?{' '}
                  <Link to="/" style={{ color: 'var(--ff-accent)', fontWeight: 500, textDecoration: 'none' }}>
                    Fazer login
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cadastro;