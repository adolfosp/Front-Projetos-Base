import Link from "next/link";
import { labs } from "@/lib/labs";

export default function Home() {
  return (
    <div className="page-wrap home-page">
      <header className="topbar">
        <div className="breadcrumb">
          <strong>Cache Lab</strong>
          <span>/</span>
          <span>Visão geral</span>
        </div>
        <a
          className="docs-link"
          href="https://nextjs.org/docs/app/getting-started/cache-components"
          target="_blank"
          rel="noreferrer"
        >
          Next.js 16 <span>↗</span>
        </a>
      </header>

      <article className="home-content">
        <section className="home-hero">
          <div className="home-copy">
            <span className="eyebrow">Laboratório interativo · 12 módulos</span>
            <h1>
              Cache deixa de ser <em>mágica</em> quando você vê cada passo.
            </h1>
            <p>
              Faça requisições, avance o tempo e altere a origem. Cada
              laboratório revela quando o Next.js responde com HIT, MISS, stale
              ou aguarda dados novos.
            </p>
            <div className="hero-actions">
              <Link className="primary-btn large" href="/laboratorios/cache-components">
                Começar pelo modelo atual <span>→</span>
              </Link>
              <Link className="text-link" href="/laboratorios/camadas-de-cache">
                Ver o mapa das camadas
              </Link>
            </div>
          </div>

          <div className="hero-visual" aria-label="Fluxo visual de uma requisição">
            <div className="visual-grid" />
            <div className="mini-request">
              <span className="mini-label">REQUEST #042</span>
              <div className="mini-flow">
                <div>
                  <span>01</span>
                  <strong>Client</strong>
                </div>
                <i />
                <div className="mini-cache">
                  <span>02</span>
                  <strong>Cache</strong>
                  <b>HIT</b>
                </div>
                <i />
                <div className="muted">
                  <span>03</span>
                  <strong>Origin</strong>
                </div>
              </div>
              <div className="mini-response">
                <span>24ms</span>
                <div>
                  <i />
                  resposta v3 reutilizada
                </div>
              </div>
            </div>
            <div className="floating-status hit">HIT</div>
            <div className="floating-status miss">MISS</div>
            <div className="floating-status swr">SWR</div>
          </div>
        </section>

        <section className="golden-rule">
          <span>REGRA DE OURO</span>
          <blockquote>
            “O tempo de revalidação deve ser <strong>menor ou igual</strong> ao
            tempo máximo que o negócio aceita exibir dados desatualizados.”
          </blockquote>
          <div className="rule-equation">
            <div>
              <small>
                t<sub>revalidate</sub>
              </small>
              <strong>≤</strong>
              <small>
                t<sub>tolerância do negócio</sub>
              </small>
            </div>
          </div>
        </section>

        <section className="models-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Escolha o trilho</span>
              <h2>Dois modelos, a mesma pergunta</h2>
            </div>
            <p>
              Onde a política deve viver — na função cacheada ou na requisição?
            </p>
          </div>

          <div className="model-cards">
            <Link className="model-card current" href="/laboratorios/cache-components">
              <div className="model-card-head">
                <span className="model-icon">16</span>
                <span className="recommended">RECOMENDADO</span>
              </div>
              <small>Cache Components ativado</small>
              <h3>Política perto do dado</h3>
              <code>
                <span>&quot;use cache&quot;</span>
                <span>cacheLife(&quot;hours&quot;)</span>
                <span>cacheTag(&quot;produtos&quot;)</span>
              </code>
              <p>
                Opt-in explícito em funções, componentes e páginas. Ideal para
                projetos novos em Next.js 16.
              </p>
              <strong className="card-link">Explorar Cache Components →</strong>
            </Link>

            <Link className="model-card legacy" href="/laboratorios/fetch-no-store">
              <div className="model-card-head">
                <span className="model-icon">≤15</span>
                <span className="compatible">COMPATÍVEL</span>
              </div>
              <small>Cache Components desativado</small>
              <h3>Política na requisição</h3>
              <code>
                <span>fetch(url, {"{"}</span>
                <span>&nbsp; next: {"{"} revalidate: 300 {"}"}</span>
                <span>{"}"})</span>
              </code>
              <p>
                fetch, unstable_cache e configurações de rota. Continua válido
                para aplicações existentes.
              </p>
              <strong className="card-link">Explorar modelo anterior →</strong>
            </Link>
          </div>
        </section>

        <section className="lab-catalog">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Roteiro completo</span>
              <h2>Do primeiro MISS à invalidação</h2>
            </div>
            <p>
              Cada cartão abre uma página independente com controles, fluxo e
              código.
            </p>
          </div>
          <div className="catalog-grid">
            {labs.map((lab) => (
              <Link href={`/laboratorios/${lab.slug}`} key={lab.slug}>
                <div className="catalog-topline">
                  <span>{lab.number}</span>
                  <small>{lab.status}</small>
                </div>
                <strong>{lab.shortTitle}</strong>
                <p>{lab.summary}</p>
                <i>→</i>
              </Link>
            ))}
          </div>
        </section>

        <section className="quick-decision">
          <span className="section-kicker">Atalho de decisão</span>
          <h2>Comece pelo risco do dado, não pela velocidade.</h2>
          <div className="decision-track">
            <div>
              <span className="risk high">CRÍTICO</span>
              <strong>Sessão · pagamento · reserva</strong>
              <p>Sem cache compartilhado</p>
            </div>
            <i>→</i>
            <div>
              <span className="risk medium">FREQUENTE</span>
              <strong>Feed · placar · indicadores</strong>
              <p>seconds ou minutes</p>
            </div>
            <i>→</i>
            <div>
              <span className="risk low">ESTÁVEL</span>
              <strong>Catálogo · blog · documentação</strong>
              <p>hours, days ou weeks + tag</p>
            </div>
            <i>→</i>
            <div>
              <span className="risk minimal">ARQUIVADO</span>
              <strong>Termos · conteúdo histórico</strong>
              <p>max</p>
            </div>
          </div>
        </section>

        <footer className="home-footer">
          <span>Cache Lab</span>
          <p>Conteúdo visual baseado na documentação oficial do Next.js 16.</p>
          <Link href="/laboratorios/cache-components">Iniciar laboratório →</Link>
        </footer>
      </article>
    </div>
  );
}

