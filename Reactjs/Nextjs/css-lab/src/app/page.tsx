import Link from "next/link";
import { topics } from "@/lib/topics";

export default function Home() {
  return (
    <div className="page-wrap">
      <header className="topbar">
        <div className="breadcrumb">
          <strong>CSS Lab</strong>
          <span>/</span>
          <span>Visão geral</span>
        </div>
        <span className="topbar-note">aprenda mexendo, não decorando</span>
      </header>

      <article className="home-content">
        <section className="home-hero">
          <div className="home-copy">
            <span className="eyebrow">Laboratório visual de CSS</span>
            <h1>
              O layout responde.<br />
              <em>Você vê o porquê.</em>
            </h1>
            <p>
              Altere valores reais, role a viewport e observe o fluxo se
              reorganizar. Cada laboratório transforma uma regra abstrata em um
              comportamento que você pode testar.
            </p>
            <div className="hero-actions">
              <Link className="primary-btn" href="/laboratorios/position">
                Abrir position lab <span>↗</span>
              </Link>
              <a className="text-link" href="#roteiro">
                Ver roteiro
              </a>
            </div>
          </div>

          <div className="hero-specimen" aria-label="Amostra visual da propriedade position">
            <div className="specimen-rulers">
              <span>0</span>
              <span>120</span>
              <span>240</span>
            </div>
            <div className="specimen-code">
              <span>.elemento {"{"}</span>
              <strong>position: <b>absolute</b>;</strong>
              <span>top: 24px;</span>
              <span>left: 32px;</span>
              <span>{"}"}</span>
            </div>
            <div className="specimen-parent">
              <small>containing block</small>
              <div className="specimen-target">
                <i />
                target
              </div>
              <span className="measure measure-x">32px</span>
              <span className="measure measure-y">24px</span>
            </div>
            <div className="coordinate-label">x:32 · y:24</div>
          </div>
        </section>

        <section className="manifesto-strip">
          <span>Observe</span>
          <i>→</i>
          <span>Altere</span>
          <i>→</i>
          <span>Preveja</span>
          <i>→</i>
          <strong>Entenda</strong>
        </section>

        <section className="catalog-section" id="roteiro">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Roteiro evolutivo</span>
              <h2>Uma propriedade por vez.</h2>
            </div>
            <p>
              O mesmo formato de experimento será reaproveitado para fluxo,
              composição e responsividade.
            </p>
          </div>

          <div className="topic-grid">
            {topics.map((topic) =>
              topic.status === "available" ? (
                <Link
                  className="topic-card topic-active"
                  href={`/laboratorios/${topic.slug}`}
                  key={topic.slug}
                >
                  <TopicCard topic={topic} />
                  <span className="topic-arrow">↗</span>
                </Link>
              ) : (
                <article className="topic-card" key={topic.slug}>
                  <TopicCard topic={topic} />
                </article>
              ),
            )}
          </div>
        </section>

        <section className="method-section">
          <div className="method-title">
            <span className="section-kicker">Método do lab</span>
            <h2>Quatro perguntas para qualquer propriedade.</h2>
          </div>
          <ol>
            <li>
              <span>01</span>
              <strong>O que muda?</strong>
              <p>Compare o antes e o depois dentro do mesmo layout.</p>
            </li>
            <li>
              <span>02</span>
              <strong>Quem é a referência?</strong>
              <p>Identifique a caixa, trilha ou contexto que governa o valor.</p>
            </li>
            <li>
              <span>03</span>
              <strong>O fluxo reage?</strong>
              <p>Veja se os irmãos preservam espaço ou ocupam a lacuna.</p>
            </li>
            <li>
              <span>04</span>
              <strong>Quando usar?</strong>
              <p>Leve a regra para cenários comuns de interface.</p>
            </li>
          </ol>
        </section>

        <footer className="home-footer">
          <span>CSS Lab / 2026</span>
          <p>Feito para experimentar no navegador.</p>
          <Link href="/laboratorios/position">Iniciar laboratório →</Link>
        </footer>
      </article>
    </div>
  );
}

function TopicCard({ topic }: { topic: (typeof topics)[number] }) {
  return (
    <>
      <div className="topic-meta">
        <span>{topic.number}</span>
        <small className={topic.status}>{topic.statusLabel}</small>
      </div>
      <span className="topic-group">{topic.eyebrow}</span>
      <h3>{topic.title}</h3>
      <p>{topic.description}</p>
    </>
  );
}
