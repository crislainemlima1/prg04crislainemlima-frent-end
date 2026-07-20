import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dash">
      <div className="dash-header">
        <h1>Bom dia, João 👋</h1>
        <p>Sua sessão de hoje aguarda. Continue sua sequência de 7 dias!</p>
      </div>

      {/* Métricas */}
      <div className="dash-metricas">
        <div className="dash-metric-card">
          <div className="dash-metric-label">Horas hoje</div>
          <div className="dash-metric-valor" style={{ color: 'var(--ff-green)' }}>3.2</div>
          <div className="dash-badge dash-badge-green">↑ +0.8h vs ontem</div>
        </div>
        <div className="dash-metric-card">
          <div className="dash-metric-label">Streak atual</div>
          <div className="dash-metric-valor" style={{ color: 'var(--ff-amber)' }}>7 🔥</div>
          <div className="dash-badge dash-badge-amber">Meta: 30 dias</div>
        </div>
        <div className="dash-metric-card">
          <div className="dash-metric-label">Pomodoros</div>
          <div className="dash-metric-valor">12</div>
          <div className="dash-badge dash-badge-green">4 hoje</div>
        </div>
        <div className="dash-metric-card">
          <div className="dash-metric-label">Metas cumpridas</div>
          <div className="dash-metric-valor" style={{ color: 'var(--ff-accent)' }}>3/5</div>
          <div className="dash-badge dash-badge-red">2 pendentes</div>
        </div>
      </div>

      {/* Sugestão da IA */}
      <div className="dash-ai-box">
        <div className="dash-ai-tag">IA · Sugestão de estudo</div>
        <p className="dash-ai-texto">
          Com base no seu desempenho, você tem evitado{' '}
          <strong>Cálculo Diferencial</strong> nos últimos 3 dias. Recomendo
          uma sessão de 25 min focada em limites — é onde seu índice de erros
          é maior (64%). Quer começar agora?
        </p>
        <div className="dash-ai-chips">
          <button className="dash-chip">Iniciar sessão ↗</button>
          <button className="dash-chip">Ver detalhes</button>
          <button className="dash-chip">Adiar</button>
        </div>
      </div>

      {/* Gráfico + Metas */}
      <div className="dash-grid-2">
        <div className="dash-card">
          <div className="dash-card-titulo">Horas por matéria — semana</div>
          <div className="dash-barras">
            <div className="dash-barra-col">
              <div className="dash-barra" style={{ height: '80%', background: 'var(--ff-accent)' }} />
              <span>Mat</span>
            </div>
            <div className="dash-barra-col">
              <div className="dash-barra" style={{ height: '55%', background: 'var(--ff-purple)' }} />
              <span>Fís</span>
            </div>
            <div className="dash-barra-col">
              <div className="dash-barra" style={{ height: '95%', background: 'var(--ff-green)' }} />
              <span>Prog</span>
            </div>
            <div className="dash-barra-col">
              <div className="dash-barra" style={{ height: '35%', background: 'var(--ff-amber)' }} />
              <span>His</span>
            </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-titulo">Metas do dia</div>
          {[
            { texto: 'Estudar derivadas — 1h', feita: true },
            { texto: 'Resolver 10 questões de física', feita: true },
            { texto: 'Ler capítulo 4 de programação', feita: true },
            { texto: 'Revisar história — 30 min', feita: false },
            { texto: 'Flashcards de vocabulário', feita: false },
          ].map((meta, i) => (
            <div key={i} className="dash-meta-item">
              <div className={`dash-meta-check ${meta.feita ? 'feita' : ''}`}>
                {meta.feita ? '✓' : ''}
              </div>
              <span
                style={{
                  fontSize: 13,
                  textDecoration: meta.feita ? 'line-through' : 'none',
                  color: meta.feita ? 'var(--ff-muted)' : 'var(--ff-text)',
                }}
              >
                {meta.texto}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Distribuição de matérias */}
      <div className="dash-card">
        <div className="dash-card-titulo">Distribuição de matérias</div>
        {[
          { nome: 'Matemática', cor: 'var(--ff-accent)', horas: 8.4, pct: 80 },
          { nome: 'Programação', cor: 'var(--ff-green)', horas: 9.2, pct: 90 },
          { nome: 'Física', cor: 'var(--ff-purple)', horas: 5.5, pct: 53 },
          { nome: 'História', cor: 'var(--ff-amber)', horas: 3.1, pct: 30 },
        ].map((m, i) => (
          <div key={i} className="dash-materia-row">
            <div className="dash-dot" style={{ background: m.cor }} />
            <span className="dash-materia-nome">{m.nome}</span>
            <span className="dash-materia-horas">{m.horas}h</span>
            <div className="dash-barra-mini">
              <div
                className="dash-barra-mini-fill"
                style={{ width: `${m.pct}%`, background: m.cor }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;