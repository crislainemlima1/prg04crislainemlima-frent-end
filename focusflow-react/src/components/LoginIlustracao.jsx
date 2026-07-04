import './LoginIlustracao.css';

function LoginIlustracao() {
  return (
    <div className="il-wrapper">

      {/* Elementos decorativos de fundo */}
      <div className="il-circulo il-circulo-1" />
      <div className="il-circulo il-circulo-2" />
      <div className="il-circulo il-circulo-3" />
      <div className="il-linha il-linha-1" />
      <div className="il-linha il-linha-2" />

      <div className="il-conteudo">
        <div className="il-logo">
          Focus<span>Flow</span>
        </div>
        <div className="il-slogan">Sua plataforma</div>
        <h1 className="il-titulo">
          inteligente de <span>estudos com IA.</span>
        </h1>
        <p className="il-desc">
          Combine o método Pomodoro com inteligência artificial
          e transforme sua rotina de estudos.
        </p>

        <div className="il-cards">
          <div className="il-card">
            <span className="il-card-icone">⏱️</span>
            <div>
              <strong>Pomodoro</strong>
              <p>Foco máximo</p>
            </div>
          </div>
          <div className="il-card">
            <span className="il-card-icone">🤖</span>
            <div>
              <strong>IA Adaptativa</strong>
              <p>Aprende com você</p>
            </div>
          </div>
          <div className="il-card">
            <span className="il-card-icone">📈</span>
            <div>
              <strong>Progresso</strong>
              <p>Metas e streak</p>
            </div>
          </div>
          <div className="il-card">
            <span className="il-card-icone">✦</span>
            <div>
              <strong>Resumos</strong>
              <p>Gerados por IA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginIlustracao;