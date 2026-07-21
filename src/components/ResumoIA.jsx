import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function ResumoIA() {
  const { token } = useAuth();
  const [texto, setTexto] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [resumo, setResumo] = useState(null);
  const [flashcardRevelado, setFlashcardRevelado] = useState(false);

  async function gerarResumo() {
    if (!texto.trim()) return;
    setCarregando(true);
    setFlashcardRevelado(false);
    try {
      const resp = await fetch('/api/ia/resumo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ texto: texto }),
      });
      if (!resp.ok) throw new Error('Erro ao gerar resumo');
      const dados = await resp.json();
      setResumo(dados);
    } catch {
      alert('Erro ao gerar resumo. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', marginBottom: 4 }}>
          Resumo com IA
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ff-muted)' }}>
          Cole qualquer conteúdo e a IA gera um resumo inteligente com flashcards.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--ff-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>
              Conteúdo para resumir
            </div>
            <textarea
              style={{ width: '100%', minHeight: 140, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ff-border)', borderRadius: 10, padding: 14, color: 'var(--ff-text)', fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, lineHeight: 1.6, resize: 'none', outline: 'none' }}
              placeholder="Cole aqui o texto do livro, anotações, artigo ou transcrição de aula..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button
                onClick={gerarResumo}
                disabled={carregando || !texto.trim()}
                style={{ flex: 1, background: carregando || !texto.trim() ? 'rgba(233,69,96,0.4)' : 'var(--ff-accent)', color: 'white', border: 'none', borderRadius: 8, padding: 9, fontFamily: 'Syne, sans-serif', fontSize: 13.5, fontWeight: 600, cursor: carregando || !texto.trim() ? 'not-allowed' : 'pointer' }}
              >
                {carregando ? 'Gerando...' : '✦ Gerar resumo'}
              </button>
            </div>
          </div>

          {resumo?.flashcard && (
            <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: 20 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--ff-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>
                Flashcard gerado
              </div>
              <div style={{ background: 'linear-gradient(135deg, rgba(15,52,96,0.5), rgba(83,52,131,0.3))', border: '1px solid rgba(83,52,131,0.3)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                <p style={{ fontSize: 13.5, color: 'var(--ff-muted)', marginBottom: 12 }}>
                  {resumo.flashcard.pergunta}
                </p>
                {flashcardRevelado && (
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ff-text)', background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 10, marginBottom: 12 }}>
                    {resumo.flashcard.resposta}
                  </p>
                )}
                <button
                  onClick={() => setFlashcardRevelado((v) => !v)}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ff-border)', color: 'var(--ff-muted)', borderRadius: 8, padding: '7px 16px', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {flashcardRevelado ? 'Esconder resposta' : 'Revelar resposta'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          {!resumo && !carregando && (
            <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: 20, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--ff-muted)', gap: 12 }}>
              <div style={{ fontSize: '2rem', color: 'var(--ff-purple)', opacity: 0.5 }}>✦</div>
              <p style={{ fontSize: 13.5 }}>Cole um conteúdo e clique em <strong>Gerar resumo</strong> para ver o resultado aqui.</p>
            </div>
          )}

          {carregando && (
            <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: 20, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: 'var(--ff-muted)' }}>
              <div style={{ width: 32, height: 32, border: '3px solid var(--ff-border)', borderTopColor: 'var(--ff-accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ fontSize: 13.5 }}>A IA está analisando seu conteúdo...</p>
            </div>
          )}

          {resumo && !carregando && (
            <div style={{ background: 'var(--ff-surface)', border: '1px solid var(--ff-border)', borderRadius: 12, padding: 20 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--ff-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
                Resumo gerado
              </div>

              {resumo.ideiaCentral && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 10, color: 'var(--ff-purple)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Ideia central</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ff-text)', margin: 0 }}>{resumo.ideiaCentral}</p>
                </div>
              )}

              {resumo.conceitos?.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 10, color: 'var(--ff-purple)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Conceitos-chave</div>
                  {resumo.conceitos.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.7, marginBottom: 4 }}>
                      <span style={{ color: 'var(--ff-accent)', flexShrink: 0 }}>→</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              )}

              {resumo.dificuldade && (
                <div>
                  <div style={{ fontSize: 10, color: 'var(--ff-purple)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Dificuldade estimada</div>
                  <span style={{ fontSize: 12, padding: '3px 12px', borderRadius: 20, background: 'rgba(244,162,97,0.15)', color: 'var(--ff-amber)' }}>{resumo.dificuldade}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default ResumoIA;